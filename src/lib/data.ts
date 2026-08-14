/**
 * Data layer for Lakhe Mushroom Farm.
 *
 * If `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` are set the real
 * Supabase backend is used. Otherwise every function reads/writes to
 * `localStorage` seeded with sample data, so the entire app is fully
 * usable end-to-end in a browser tab for demos, screenshots and QA.
 */

import { supabase, isSupabaseConfigured } from './supabase';
import { readStore, writeStore } from './storage';
import { config } from './config';
import { isAdminPortalActive, getAdminPortalSecret } from './adminPortal';
import { newId, generateOrderRef, generateBookingRef } from '../utils/ids';

import type { Product } from '../types/product';
import type {
  TrainingCourse,
  TrainingModule,
  TrainingProgress,
} from '../types/training';
import type {
  Order,
  OrderItem,
  OrderItemStatus,
  OrderStatus,
} from '../types/order';
import type {
  BookingStatus,
  CustomerQuery,
  OfflineBooking,
  QueryStatus,
} from '../types/booking';
import type { GalleryItem, Profile, Testimonial } from '../types/profile';

import { SAMPLE_PRODUCTS } from '../data/products';
import { SAMPLE_TRAINING } from '../data/training';
import {
  mergeSampleProducts,
  mergeSampleTraining,
  withProductImages,
  withTrainingImage,
} from './mediaResolve';
import { SAMPLE_GALLERY, SAMPLE_TESTIMONIALS } from '../data/gallery';

// ---------------------------------------------------------------------------
// Demo-mode local stores
// ---------------------------------------------------------------------------

const K = {
  products: 'lakhe.products',
  training: 'lakhe.training',
  gallery: 'lakhe.gallery',
  testimonials: 'lakhe.testimonials',
  orders: 'lakhe.orders',
  bookings: 'lakhe.bookings',
  queries: 'lakhe.queries',
  progress: 'lakhe.progress',
  profiles: 'lakhe.profiles',
  seq: 'lakhe.seq',
};

function nextSeq(kind: 'order' | 'booking'): number {
  const seq = readStore<{ order: number; booking: number }>(K.seq, {
    order: 100,
    booking: 100,
  });
  seq[kind] += 1;
  writeStore(K.seq, seq);
  return seq[kind];
}

function localGet<T>(key: string, fallback: T): T {
  return readStore<T>(key, fallback);
}
function localSet<T>(key: string, value: T): void {
  writeStore(key, value);
}

function seedIfEmpty(): void {
  if (!localStorage.getItem(K.products))
    localSet(K.products, SAMPLE_PRODUCTS);
  else
    localSet(
      K.products,
      mergeSampleProducts(localGet<Product[]>(K.products, []))
    );
  if (!localStorage.getItem(K.training))
    localSet(K.training, SAMPLE_TRAINING);
  else
    localSet(
      K.training,
      mergeSampleTraining(localGet<TrainingCourse[]>(K.training, []))
    );
  if (!localStorage.getItem(K.gallery)) localSet(K.gallery, SAMPLE_GALLERY);
  if (!localStorage.getItem(K.testimonials))
    localSet(K.testimonials, SAMPLE_TESTIMONIALS);
  if (!localStorage.getItem(K.orders)) localSet<Order[]>(K.orders, []);
  if (!localStorage.getItem(K.bookings))
    localSet<OfflineBooking[]>(K.bookings, []);
  if (!localStorage.getItem(K.queries))
    localSet<CustomerQuery[]>(K.queries, []);
  if (!localStorage.getItem(K.progress))
    localSet<TrainingProgress[]>(K.progress, []);
}

if (typeof window !== 'undefined' && !isSupabaseConfigured()) {
  seedIfEmpty();
}

function adminRpcActive(): boolean {
  return isSupabaseConfigured() && isAdminPortalActive();
}

async function adminRpc<T>(
  fn: string,
  params: Record<string, unknown> = {}
): Promise<T> {
  const portal_secret = getAdminPortalSecret();
  if (!portal_secret) {
    throw new Error('Admin session expired. Sign in again at /admin.');
  }
  const { data, error } = await supabase.rpc(fn, {
    portal_secret,
    ...params,
  });
  if (error) {
    const msg = error.message ?? 'Admin RPC failed';
    if (
      msg.includes('Could not find the function') ||
      msg.includes('schema cache')
    ) {
      throw new Error(
        'Admin database functions missing. Run supabase/setup_all.sql in Supabase SQL Editor.'
      );
    }
    if (msg.includes('forbidden') || error.code === '42501') {
      throw new Error(
        'Admin password mismatch in database. Sign out of /admin and sign in again, or run 20260815_fix_admin_approve.sql in Supabase.'
      );
    }
    throw error;
  }
  return data as T;
}

function parseRpcArray<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[];
  if (data == null) return [];
  return JSON.parse(String(data)) as T[];
}

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

export async function listProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured())
    return mergeSampleProducts(localGet<Product[]>(K.products, []));
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    const rows = mergeSampleProducts((data ?? []) as Product[]);
    return rows.length > 0 ? rows : mergeSampleProducts(SAMPLE_PRODUCTS);
  } catch (err) {
    console.warn('listProducts failed — using sample catalog', err);
    return mergeSampleProducts(SAMPLE_PRODUCTS);
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!isSupabaseConfigured()) {
    const product =
      localGet<Product[]>(K.products, []).find((p) => p.slug === slug) ?? null;
    return product ? withProductImages(product) : null;
  }
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw error;
  return data ? withProductImages(data as Product) : null;
}

export async function upsertProduct(p: Product): Promise<Product> {
  if (!isSupabaseConfigured()) {
    const items = localGet<Product[]>(K.products, []);
    const i = items.findIndex((x) => x.id === p.id);
    if (i >= 0) items[i] = p;
    else items.unshift({ ...p, id: p.id || newId() });
    localSet(K.products, items);
    return p;
  }
  const { data, error } = await supabase
    .from('products')
    .upsert(p)
    .select()
    .single();
  if (error) throw error;
  return data as Product;
}

export async function deleteProduct(id: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    const items = localGet<Product[]>(K.products, []).filter(
      (x) => x.id !== id
    );
    localSet(K.products, items);
    return;
  }
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
}

// ---------------------------------------------------------------------------
// Training
// ---------------------------------------------------------------------------

export async function listTraining(): Promise<TrainingCourse[]> {
  if (!isSupabaseConfigured())
    return mergeSampleTraining(localGet<TrainingCourse[]>(K.training, []));
  try {
    const { data: courses, error } = await supabase
      .from('training_courses')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    const rows = mergeSampleTraining((courses ?? []) as TrainingCourse[]);
    return rows.length > 0 ? rows : mergeSampleTraining(SAMPLE_TRAINING);
  } catch (err) {
    console.warn('listTraining failed — using sample programs', err);
    return mergeSampleTraining(SAMPLE_TRAINING);
  }
}

export async function getTrainingBySlug(
  slug: string
): Promise<TrainingCourse | null> {
  if (!isSupabaseConfigured()) {
    const course =
      localGet<TrainingCourse[]>(K.training, []).find((t) => t.slug === slug) ??
      null;
    return course ? withTrainingImage(course) : null;
  }
  const { data, error } = await supabase
    .from('training_courses')
    .select('*, modules:training_modules(*)')
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const modules = (data.modules ?? []) as TrainingModule[];
  modules.sort((a, b) => a.order - b.order);
  return withTrainingImage({ ...(data as TrainingCourse), modules });
}

export async function getTrainingModulesForCourse(
  courseId: string
): Promise<TrainingModule[]> {
  if (!isSupabaseConfigured()) {
    return (
      localGet<TrainingCourse[]>(K.training, []).find((t) => t.id === courseId)
        ?.modules ?? []
    );
  }
  const { data, error } = await supabase
    .from('training_modules')
    .select('*')
    .eq('course_id', courseId)
    .order('order', { ascending: true });
  if (error) throw error;
  return (data ?? []) as TrainingModule[];
}

export async function upsertTraining(t: TrainingCourse): Promise<TrainingCourse> {
  if (!isSupabaseConfigured()) {
    const items = localGet<TrainingCourse[]>(K.training, []);
    const i = items.findIndex((x) => x.id === t.id);
    if (i >= 0) items[i] = t;
    else items.unshift({ ...t, id: t.id || newId() });
    localSet(K.training, items);
    return t;
  }
  const { modules: _modules, ...rest } = t;
  const { data, error } = await supabase
    .from('training_courses')
    .upsert(rest)
    .select()
    .single();
  if (error) throw error;
  return data as TrainingCourse;
}

// ---------------------------------------------------------------------------
// Training progress
// ---------------------------------------------------------------------------

export async function listProgress(userId: string): Promise<TrainingProgress[]> {
  if (!isSupabaseConfigured()) {
    return localGet<TrainingProgress[]>(K.progress, []).filter(
      (p) => p.user_id === userId
    );
  }
  const { data, error } = await supabase
    .from('training_progress')
    .select('*')
    .eq('user_id', userId);
  if (error) throw error;
  return (data ?? []) as TrainingProgress[];
}

export async function markModuleComplete(
  userId: string,
  courseId: string,
  moduleId: string
): Promise<void> {
  const record: TrainingProgress = {
    user_id: userId,
    course_id: courseId,
    module_id: moduleId,
    completed_at: new Date().toISOString(),
  };
  if (!isSupabaseConfigured()) {
    const all = localGet<TrainingProgress[]>(K.progress, []);
    if (!all.some((p) => p.user_id === userId && p.module_id === moduleId))
      all.push(record);
    localSet(K.progress, all);
    return;
  }
  const { error } = await supabase.from('training_progress').upsert(record);
  if (error) throw error;
}

// ---------------------------------------------------------------------------
// Orders
// ---------------------------------------------------------------------------

export interface CreateOrderInput {
  user_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  delivery_address?: string;
  subtotal: number;
  shipping: number;
  total: number;
  items: Array<Omit<OrderItem, 'id' | 'order_id' | 'status'>>;
  upi_txn_id?: string;
  payment_screenshot_url?: string;
}

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  if (!isSupabaseConfigured()) {
    const orderId = newId();
    const order_ref = generateOrderRef(nextSeq('order'));
    const now = new Date().toISOString();
    const order: Order = {
      id: orderId,
      order_ref,
      user_id: input.user_id,
      customer_name: input.customer_name,
      customer_email: input.customer_email,
      customer_phone: input.customer_phone,
      delivery_address: input.delivery_address,
      subtotal: input.subtotal,
      shipping: input.shipping,
      total: input.total,
      status: 'pending_verification',
      payment_method: 'upi',
      upi_txn_id: input.upi_txn_id,
      payment_screenshot_url: input.payment_screenshot_url,
      created_at: now,
      updated_at: now,
      approved_at: null,
      items: input.items.map((it) => ({
        ...it,
        id: newId(),
        order_id: orderId,
        status:
          it.item_type === 'training' ? 'access_pending' : 'pending',
      })),
    };
    const all = localGet<Order[]>(K.orders, []);
    all.unshift(order);
    localSet(K.orders, all);
    return order;
  }

  const { data: orderRow, error } = await supabase
    .from('orders')
    .insert({
      user_id: input.user_id,
      customer_name: input.customer_name,
      customer_email: input.customer_email,
      customer_phone: input.customer_phone,
      delivery_address: input.delivery_address,
      subtotal: input.subtotal,
      shipping: input.shipping,
      total: input.total,
      upi_txn_id: input.upi_txn_id,
      payment_screenshot_url: input.payment_screenshot_url,
    })
    .select()
    .single();
  if (error) throw error;
  const orderId = orderRow.id as string;

  const itemRows = input.items.map((it) => ({
    order_id: orderId,
    item_type: it.item_type,
    product_id: it.product_id ?? null,
    course_id: it.course_id ?? null,
    name: it.name,
    unit_price: it.unit_price,
    qty: it.qty,
    image: it.image ?? null,
    status: it.item_type === 'training' ? 'access_pending' : 'pending',
  }));

  const { data: items, error: itemsErr } = await supabase
    .from('order_items')
    .insert(itemRows)
    .select();
  if (itemsErr) throw itemsErr;

  return { ...(orderRow as Order), items: (items ?? []) as OrderItem[] };
}

export async function listOrdersForUser(userId: string): Promise<Order[]> {
  if (!isSupabaseConfigured()) {
    return localGet<Order[]>(K.orders, []).filter((o) => o.user_id === userId);
  }
  const { data, error } = await supabase
    .from('orders')
    .select('*, items:order_items(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as Order[];
}

export async function listAllOrders(): Promise<Order[]> {
  if (!isSupabaseConfigured()) {
    return localGet<Order[]>(K.orders, []);
  }
  if (!isAdminPortalActive()) {
    throw new Error('Admin session expired. Sign in again at /admin.');
  }
  const data = await adminRpc<unknown>('admin_list_orders');
  return parseRpcArray<Order>(data);
}

export async function getOrderByRef(ref: string): Promise<Order | null> {
  if (!isSupabaseConfigured()) {
    return (
      localGet<Order[]>(K.orders, []).find((o) => o.order_ref === ref) ?? null
    );
  }
  if (isAdminPortalActive()) {
    const rpcData = await adminRpc<unknown>('admin_get_order', {
      order_ref: ref,
    });
    if (rpcData) return rpcData as Order;
  }
  const { data, error } = await supabase
    .from('orders')
    .select('*, items:order_items(*)')
    .eq('order_ref', ref)
    .maybeSingle();
  if (error) throw error;
  return (data as Order) ?? null;
}

export async function updateOrderStatus(
  orderRef: string,
  status: OrderStatus,
  admin_notes?: string
): Promise<void> {
  if (!isSupabaseConfigured()) {
    const all = localGet<Order[]>(K.orders, []);
    const i = all.findIndex((o) => o.order_ref === orderRef);
    if (i >= 0) {
      all[i].status = status;
      all[i].admin_notes = admin_notes;
      all[i].updated_at = new Date().toISOString();
      if (status === 'approved') {
        all[i].approved_at = new Date().toISOString();
        all[i].items = all[i].items.map((it) => ({
          ...it,
          status:
            it.item_type === 'training'
              ? 'access_granted'
              : 'processing',
        }));
      } else if (status === 'rejected') {
        all[i].items = all[i].items.map((it) => ({
          ...it,
          status: 'rejected',
        }));
      }
      localSet(K.orders, all);
    }
    return;
  }
  if (!isAdminPortalActive()) {
    throw new Error('Admin session expired. Sign in again at /admin.');
  }
  if (!orderRef?.trim()) {
    throw new Error('Missing order reference. Refresh and try again.');
  }
  await adminRpc('admin_update_order_status', {
    order_ref: orderRef,
    new_status: status,
    admin_notes: admin_notes ?? null,
  });
}

export async function updateOrderItemStatus(
  itemId: string,
  status: OrderItemStatus
): Promise<void> {
  if (!isSupabaseConfigured()) {
    const all = localGet<Order[]>(K.orders, []);
    for (const o of all) {
      const i = o.items.findIndex((x) => x.id === itemId);
      if (i >= 0) {
        o.items[i].status = status;
        break;
      }
    }
    localSet(K.orders, all);
    return;
  }
  if (!isAdminPortalActive()) {
    throw new Error('Admin session expired. Sign in again at /admin.');
  }
  await adminRpc('admin_update_order_item_status', {
    item_id: itemId,
    new_status: status,
  });
}

// ---------------------------------------------------------------------------
// Offline bookings
// ---------------------------------------------------------------------------

export interface CreateBookingInput {
  user_id?: string | null;
  course_id: string;
  course_title: string;
  name: string;
  phone: string;
  email?: string;
  preferred_date: string;
  notes?: string;
}

export async function createBooking(
  input: CreateBookingInput
): Promise<OfflineBooking> {
  if (!isSupabaseConfigured()) {
    const b: OfflineBooking = {
      id: newId(),
      booking_ref: generateBookingRef(nextSeq('booking')),
      user_id: input.user_id ?? null,
      course_id: input.course_id,
      course_title: input.course_title,
      name: input.name,
      phone: input.phone,
      email: input.email,
      preferred_date: input.preferred_date,
      notes: input.notes,
      status: 'pending',
      created_at: new Date().toISOString(),
    };
    const all = localGet<OfflineBooking[]>(K.bookings, []);
    all.unshift(b);
    localSet(K.bookings, all);
    return b;
  }
  const { data, error } = await supabase
    .from('offline_bookings')
    .insert(input)
    .select()
    .single();
  if (error) throw error;
  return data as OfflineBooking;
}

export async function listBookingsForUser(
  userId: string
): Promise<OfflineBooking[]> {
  if (!isSupabaseConfigured()) {
    return localGet<OfflineBooking[]>(K.bookings, []).filter(
      (b) => b.user_id === userId
    );
  }
  const { data, error } = await supabase
    .from('offline_bookings')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as OfflineBooking[];
}

export async function listAllBookings(): Promise<OfflineBooking[]> {
  if (!isSupabaseConfigured()) {
    return localGet<OfflineBooking[]>(K.bookings, []);
  }
  if (adminRpcActive()) {
    const data = await adminRpc<unknown>('admin_list_bookings');
    return parseRpcArray<OfflineBooking>(data);
  }
  const { data, error } = await supabase
    .from('offline_bookings')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as OfflineBooking[];
}

export async function updateBookingStatus(
  id: string,
  status: BookingStatus,
  admin_notes?: string
): Promise<void> {
  if (!isSupabaseConfigured()) {
    const all = localGet<OfflineBooking[]>(K.bookings, []);
    const i = all.findIndex((b) => b.id === id);
    if (i >= 0) {
      all[i].status = status;
      all[i].admin_notes = admin_notes;
      localSet(K.bookings, all);
    }
    return;
  }
  if (adminRpcActive()) {
    await adminRpc('admin_update_booking_status', {
      booking_id: id,
      new_status: status,
      admin_notes,
    });
    return;
  }
  const { error } = await supabase
    .from('offline_bookings')
    .update({ status, admin_notes })
    .eq('id', id);
  if (error) throw error;
}

// ---------------------------------------------------------------------------
// Queries (contact form)
// ---------------------------------------------------------------------------

export interface CreateQueryInput {
  user_id?: string | null;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

export async function createQuery(
  input: CreateQueryInput
): Promise<CustomerQuery> {
  if (!isSupabaseConfigured()) {
    const q: CustomerQuery = {
      ...input,
      id: newId(),
      status: 'new',
      created_at: new Date().toISOString(),
    };
    const all = localGet<CustomerQuery[]>(K.queries, []);
    all.unshift(q);
    localSet(K.queries, all);
    return q;
  }
  const { data, error } = await supabase
    .from('queries')
    .insert(input)
    .select()
    .single();
  if (error) throw error;
  return data as CustomerQuery;
}

export async function listQueries(): Promise<CustomerQuery[]> {
  if (!isSupabaseConfigured()) return localGet<CustomerQuery[]>(K.queries, []);
  if (adminRpcActive()) {
    const data = await adminRpc<unknown>('admin_list_queries');
    return parseRpcArray<CustomerQuery>(data);
  }
  const { data, error } = await supabase
    .from('queries')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as CustomerQuery[];
}

export async function updateQueryStatus(
  id: string,
  status: QueryStatus,
  admin_notes?: string
): Promise<void> {
  if (!isSupabaseConfigured()) {
    const all = localGet<CustomerQuery[]>(K.queries, []);
    const i = all.findIndex((q) => q.id === id);
    if (i >= 0) {
      all[i].status = status;
      all[i].admin_notes = admin_notes;
      localSet(K.queries, all);
    }
    return;
  }
  if (adminRpcActive()) {
    await adminRpc('admin_update_query_status', {
      query_id: id,
      new_status: status,
      admin_notes,
    });
    return;
  }
  const { error } = await supabase
    .from('queries')
    .update({ status, admin_notes })
    .eq('id', id);
  if (error) throw error;
}

// ---------------------------------------------------------------------------
// Gallery + Testimonials
// ---------------------------------------------------------------------------

export async function listGallery(): Promise<GalleryItem[]> {
  if (!isSupabaseConfigured()) return localGet<GalleryItem[]>(K.gallery, []);
  const { data, error } = await supabase
    .from('gallery_items')
    .select('*')
    .order('order', { ascending: true });
  if (error) throw error;
  return (data ?? []) as GalleryItem[];
}

export async function upsertGalleryItem(item: GalleryItem): Promise<GalleryItem> {
  if (!isSupabaseConfigured()) {
    const all = localGet<GalleryItem[]>(K.gallery, []);
    const i = all.findIndex((x) => x.id === item.id);
    if (i >= 0) all[i] = item;
    else all.push({ ...item, id: item.id || newId() });
    localSet(K.gallery, all);
    return item;
  }
  const { data, error } = await supabase
    .from('gallery_items')
    .upsert(item)
    .select()
    .single();
  if (error) throw error;
  return data as GalleryItem;
}

export async function deleteGalleryItem(id: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    localSet(
      K.gallery,
      localGet<GalleryItem[]>(K.gallery, []).filter((x) => x.id !== id)
    );
    return;
  }
  const { error } = await supabase.from('gallery_items').delete().eq('id', id);
  if (error) throw error;
}

export async function listTestimonials(): Promise<Testimonial[]> {
  if (!isSupabaseConfigured())
    return localGet<Testimonial[]>(K.testimonials, []);
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as Testimonial[];
}

// ---------------------------------------------------------------------------
// Profiles + Customers
// ---------------------------------------------------------------------------

export async function getProfile(userId: string): Promise<Profile | null> {
  if (!isSupabaseConfigured()) {
    return (
      localGet<Profile[]>(K.profiles, []).find((p) => p.id === userId) ?? null
    );
  }
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  if (error) throw error;
  return (data as Profile) ?? null;
}

export async function upsertProfile(profile: Profile): Promise<Profile> {
  if (!isSupabaseConfigured()) {
    const all = localGet<Profile[]>(K.profiles, []);
    const i = all.findIndex((p) => p.id === profile.id);
    if (i >= 0) all[i] = profile;
    else all.push(profile);
    localSet(K.profiles, all);
    return profile;
  }
  const { data, error } = await supabase
    .from('profiles')
    .upsert(profile)
    .select()
    .single();
  if (error) throw error;
  return data as Profile;
}

export async function listCustomers(): Promise<Profile[]> {
  if (!isSupabaseConfigured()) return localGet<Profile[]>(K.profiles, []);
  if (adminRpcActive()) {
    const data = await adminRpc<unknown>('admin_list_profiles');
    return parseRpcArray<Profile>(data);
  }
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as Profile[];
}

// ---------------------------------------------------------------------------
// Payment screenshot upload
// ---------------------------------------------------------------------------

export async function uploadPaymentScreenshot(
  userId: string,
  file: File
): Promise<string> {
  if (!isSupabaseConfigured()) {
    // Convert to a data URL so we can display it in demo mode.
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }
  const path = `${userId}/${Date.now()}-${file.name.replace(/[^\w.-]+/g, '_')}`;
  const { error } = await supabase.storage
    .from('payment-screenshots')
    .upload(path, file, { upsert: false });
  if (error) throw error;
  const { data } = supabase.storage
    .from('payment-screenshots')
    .getPublicUrl(path);
  return data.publicUrl;
}

// ---------------------------------------------------------------------------
// Admin check
// ---------------------------------------------------------------------------

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return config.admin.emails.includes(email.toLowerCase());
}

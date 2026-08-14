export type BookingStatus = 'pending' | 'confirmed' | 'rejected' | 'cancelled';

export interface OfflineBooking {
  id: string;
  booking_ref: string;
  user_id?: string | null;
  course_id: string;
  course_title: string;
  name: string;
  phone: string;
  email?: string;
  preferred_date: string;
  notes?: string;
  status: BookingStatus;
  admin_notes?: string;
  created_at: string;
}

export type QueryStatus = 'new' | 'in_progress' | 'closed';

export interface CustomerQuery {
  id: string;
  user_id?: string | null;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  status: QueryStatus;
  admin_notes?: string;
  created_at: string;
}

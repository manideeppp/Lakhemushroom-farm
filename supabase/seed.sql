-- Seed data for Lakhe Mushroom Farm
-- Run after schema.sql. Safe to re-run (uses on conflict do nothing on slug).

insert into public.products (slug, name, category, short_description, description, price, unit, images, badges, stock, rating, highlights)
values
  ('oyster-mushroom-spawn','Oyster Mushroom Spawn','spawn',
   'Vigorous, contamination-free spawn grown from mother cultures on our farm.',
   'Our oyster spawn is produced in sterile conditions using high-quality mother cultures selected for yield and flavour. Each 500g bag is freshly prepared, packed in food-grade material and shipped with care instructions.',
   150,'500g bag',
   array['https://images.unsplash.com/photo-1568900122085-3c05f8bd57e5?auto=format&fit=crop&w=1200&q=70'],
   array['fresh','best-seller'],120,4.8,
   array['Sterile lab-grade spawn','80–90% biological efficiency','Beginner-friendly']),

  ('fresh-oyster-mushroom','Fresh Oyster Mushroom','fresh',
   'Hand-harvested fresh oyster mushrooms delivered within 24 hours.',
   'Grown on pasteurised straw substrate and hand-picked at the peak of freshness.',
   180,'500g pack',
   array['https://images.unsplash.com/photo-1611574474461-46f3f36fbb90?auto=format&fit=crop&w=1200&q=70'],
   array['fresh','natural'],40,4.9,
   array['Harvested-to-door in 24 hrs','No pesticides','Rich in protein']),

  ('dry-oyster-mushroom','Dry Oyster Mushroom','dry',
   'Sun-dried oyster mushrooms with intense umami — long shelf life.',
   'Slowly dried to preserve aroma and nutrition.',
   400,'100g pouch',
   array['https://images.unsplash.com/photo-1611746872915-64559a1a7488?auto=format&fit=crop&w=1200&q=70'],
   array['natural','premium'],80,4.7,
   array['12 month shelf life','No preservatives','Concentrated flavour']),

  ('mushroom-powder','Mushroom Powder','powder',
   'Nutrient-dense oyster mushroom powder for daily wellness.',
   'Cold-milled from our dried mushrooms.',
   300,'150g jar',
   array['https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=1200&q=70'],
   array['premium','natural'],60,4.8,
   array['Single-ingredient','Vegan & gluten-free','Immunity support']),

  ('ready-to-eat-oyster','Ready-to-Eat Oyster Mushroom','ready-to-eat',
   'Chef-crafted, mildly spiced oyster mushroom pack. Just heat & serve.',
   'Cooked in small batches with cold-pressed oils and mild Indian spices.',
   280,'250g pack',
   array['https://images.unsplash.com/photo-1607301406259-dfb186e15de8?auto=format&fit=crop&w=1200&q=70'],
   array['ready-to-eat','best-seller'],30,4.9,
   array['No preservatives','High protein','Ready in 3 minutes'])
on conflict (slug) do nothing;

insert into public.training_courses (slug, title, format, price, duration, image, short_description, description, features, outcomes)
values
  ('a-z-mushroom-farming-online','A–Z Mushroom Farming Online Training','online',1500,'12 hours · Self-paced',
   'https://images.unsplash.com/photo-1602867741746-6df80f40b3f6?auto=format&fit=crop&w=1600&q=70',
   'Everything you need to start growing mushrooms — from spawn to sale.',
   'A complete online program covering biology, substrate prep, spawn making, cultivation, harvesting, packaging, marketing and business planning.',
   array['10+ recorded video modules','Downloadable PDFs & checklists','Lifetime access','Certificate of completion'],
   array['Set up a small mushroom unit at home','Prepare your own spawn','Sell fresh, dry & value-added products']),

  ('weekend-farm-immersion','Weekend Farm Immersion','offline',3000,'2 days',
   'https://images.unsplash.com/photo-1615398265937-71bc7a9c8dfe?auto=format&fit=crop&w=1600&q=70',
   'A hands-on two-day session at our farm — see, touch and try every step.',
   'Small batch of 10. Includes farm meals, printed workbook and starter spawn kit.',
   array['Hands-on farm sessions','Meals included','Starter spawn kit','Small batch of 10'],
   array['Practice substrate & spawn prep','See real fruiting rooms','Take home a working setup']),

  ('advanced-cultivation-bootcamp','Advanced Cultivation Bootcamp','hybrid',4500,'4 weeks',
   'https://images.unsplash.com/photo-1601300961833-e6f635e6f4f6?auto=format&fit=crop&w=1600&q=70',
   'Deep-dive program combining online modules with an on-farm assessment.',
   'Includes weekly live Q&A, business toolkit, and a one-day on-farm evaluation.',
   array['Live weekly Q&A','On-farm assessment day','Business toolkit','Priority support'],
   array['Plan a commercial unit','Optimise yield and margins','Access to founder mentoring'])
on conflict (slug) do nothing;

-- Modules for online course
with c as (select id from public.training_courses where slug = 'a-z-mushroom-farming-online')
insert into public.training_modules (course_id, title, description, duration_minutes, "order")
select c.id, m.title, m.description, m.duration, m.ord from c,
(values
  ('Welcome & Introduction','Overview of the course, mushroom varieties, and the business potential.',25,1),
  ('Biology of Oyster Mushrooms','Life cycle, growth conditions, and common terms.',40,2),
  ('Substrate Preparation','Straw, sawdust and paper substrates. Pasteurisation methods.',55,3),
  ('Spawn Production','Sterile technique, grain spawn, and quality checks.',60,4),
  ('Inoculation & Incubation','Bag prep, spawning ratios, and incubation environment.',50,5),
  ('Fruiting & Harvesting','Fruiting room setup, humidity, harvesting cycles.',45,6),
  ('Post-harvest & Value Addition','Packaging, drying, powders and ready-to-eat products.',50,7),
  ('Marketing & Business Setup','Positioning, retail, wholesale, licenses and subsidies.',60,8)
) as m(title, description, duration, ord)
on conflict do nothing;

insert into public.testimonials (name, location, role, rating, quote) values
  ('Priya Sharma','Pune','Home cultivator',5,'The A–Z online training was incredibly thorough. I set up my first cultivation shelf in three weekends and had my first harvest a month later.'),
  ('Ravi Menon','Kochi','Small farmer',5,'The team walked us through everything — from substrate to selling. My mushroom unit is now paying for itself every month.'),
  ('Anaïs Petit','Lyon, France','International client',5,'A rare combination of premium products and genuine expertise. The powder is now part of my daily wellness routine.'),
  ('Mahesh Yadav','Nashik','Weekend workshop attendee',5,'The offline workshop felt personal and honest. No shortcuts, no upsells — just real practice.')
on conflict do nothing;

insert into public.gallery_items (type, category, media_url, caption, "order") values
  ('image','farm','https://images.unsplash.com/photo-1602867741746-6df80f40b3f6?auto=format&fit=crop&w=1600&q=70','Our main growing shed',1),
  ('image','cultivation','https://images.unsplash.com/photo-1568900122085-3c05f8bd57e5?auto=format&fit=crop&w=1600&q=70','Oyster mushrooms at peak fruiting',2),
  ('image','cultivation','https://images.unsplash.com/photo-1611574474461-46f3f36fbb90?auto=format&fit=crop&w=1600&q=70','Freshly harvested clusters',3),
  ('image','training','https://images.unsplash.com/photo-1524178232363-1ba1f8b83d0b?auto=format&fit=crop&w=1600&q=70','Weekend immersion in session',4),
  ('image','team','https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=70','Our farm team',5),
  ('image','clients','https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=70','International cohort visit',6)
on conflict do nothing;

-- NOTE: create your admin manually
--   1) Sign up in the app with your admin email (magic-link)
--   2) Then run: update public.profiles set is_admin = true where email = 'admin@lakhemushroomfarm.com';

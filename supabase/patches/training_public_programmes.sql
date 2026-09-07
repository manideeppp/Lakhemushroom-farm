-- Keep only online-training & offline-training visible on the public site.
-- Run once in Supabase SQL editor (safe to re-run).

update public.training_courses
set is_published = false
where slug not in ('online-training', 'offline-training');

insert into public.training_courses (slug, title, format, price, duration, image, short_description, description, features, outcomes, is_published)
values
  ('online-training','Online Mushroom Training','online',3000,'Self-paced · video modules',
   'https://images.unsplash.com/photo-1602867741746-6df80f40b3f6?auto=format&fit=crop&w=1600&q=70',
   'Full mushroom farming programme with recorded videos — learn spawn to sale from Lakhe farm.',
   'Complete online mushroom cultivation programme. After payment verification, Tatya Lakhe shares recorded video lessons covering information planning, raw materials, cultivation, crop management, packing and marketing.',
   array['Importance of information & farm planning','Raw material samples & substrate preparation','Practical cultivation training','Crop management & fruiting room care','Packing & post-harvest handling','Marketing & sales guidance','Recorded video modules provided'],
   array['Plan and set up a small mushroom unit','Prepare substrates and manage spawn','Harvest, pack and market your produce'],
   true),

  ('offline-training','Offline Mushroom Training','offline',10000,'2 days · at Lakhe farm',
   'https://images.unsplash.com/photo-1615398265937-71bc7a9c8dfe?auto=format&fit=crop&w=1600&q=70',
   'Two-day hands-on training at our farm — see, practice and learn every step on site.',
   'Intensive two-day programme at Lakhe Mushroom Farm. Hands-on practice through spawn handling, substrate prep, crop management, harvesting, packing and marketing with Tatya Lakhe.',
   array['Importance of information & farm planning','Raw material samples & substrate preparation','Hands-on cultivation training','Crop management & fruiting room care','Packing & post-harvest handling','Marketing & sales guidance','Farm meals & printed workbook'],
   array['Experience every step on a working farm','Build confidence for your own unit','Network with fellow growers'],
   true)
on conflict (slug) do update set
  title = excluded.title,
  format = excluded.format,
  price = excluded.price,
  duration = excluded.duration,
  image = excluded.image,
  short_description = excluded.short_description,
  description = excluded.description,
  features = excluded.features,
  outcomes = excluded.outcomes,
  is_published = true;

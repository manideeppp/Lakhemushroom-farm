-- Replace duplicate / outdated testimonials with the canonical set of 10.
-- Run once in Supabase SQL editor.

delete from public.testimonials;

insert into public.testimonials (name, location, role, rating, quote) values
  ('Priya Sharma','Pune','Online training student',5,'The online programme is clear and practical. I finished the modules in two weeks and harvested my first oyster batch at home within a month.'),
  ('Ravi Menon','Kochi','Offline training attendee',5,'Two days on the farm changed everything — hands-on spawn work, bagging, and harvesting. Tatya sir answers every doubt with patience.'),
  ('Suresh Patil','Ahmednagar','Regular customer',5,'Fresh oyster mushrooms from Lakhe are always firm, clean, and full of flavour. Our family orders every week without fail.'),
  ('Kavita Deshmukh','Nagpur','Spawn buyer',5,'Their spawn is vigorous and consistent. Our fruiting room yields improved noticeably after we switched to Lakhe spawn.'),
  ('Amit Singh','Delhi','Powder customer',5,'The mushroom powder is finely milled and pure — no fillers. I use it daily in smoothies and have recommended it to friends.'),
  ('Lakshmi Iyer','Chennai','Dried mushroom buyer',5,'Dried oysters from Lakhe rehydrate beautifully and keep their aroma. Perfect for our home kitchen and small catering orders.'),
  ('Vikram Joshi','Mumbai','Ready-to-eat buyer',5,'The ready-to-eat range tastes homemade and ships well. Great for busy weekdays when we want something healthy and quick.'),
  ('Meena Kaur','Chandigarh','Farm setup client',5,'Consultancy for our new unit was honest and detailed — layout, climate control, and marketing. We went live on schedule.'),
  ('Arjun Reddy','Hyderabad','Wholesale buyer',5,'Reliable supply and fair pricing for milky and button varieties. Lakhe is our go-to partner for metro restaurant orders.'),
  ('Fatima Khan','Aurangabad','Training & product customer',5,'I joined offline training and now buy spawn and fresh mushrooms from the same farm. Genuine quality from start to finish.');

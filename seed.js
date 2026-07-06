require('dotenv').config();
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const Admin = require('./models/Admin');
const Event = require('./models/Event');
const Media = require('./models/Media');
const Membership = require('./models/Membership');
const ContentBlock = require('./models/ContentBlock');
const SiteSetting = require('./models/SiteSetting');

async function seed() {
  await connectDB();
  const email = process.env.ADMIN_EMAIL || 'admin@pleasureclub.local';
  const password = process.env.ADMIN_PASSWORD || 'ChangeMeNow!123';
  await Admin.findOneAndUpdate({ email }, { email, name: 'Club Owner', role: 'owner', passwordHash: await bcrypt.hash(password, 12) }, { upsert: true });

  await ContentBlock.deleteMany({});
  await SiteSetting.deleteMany({});
  await Membership.deleteMany({});
  await Event.deleteMany({});
  await Media.deleteMany({});

  await ContentBlock.insertMany([
    { key:'hero_kicker', page:'home', label:'Hero Kicker', value:'Welcome To' },
    { key:'hero_title', page:'home', label:'Hero Title', value:'Pleasure' },
    { key:'hero_subtitle', page:'home', label:'Hero Subtitle', value:'Private Club' },
    { key:'hero_description', page:'home', label:'Hero Description', type:'textarea', value:'An exclusive world of luxury, passion, and extraordinary experiences. Not for everyone. Only for chosen ones.' },
    { key:'hero_image', page:'home', label:'Hero Image URL', type:'url', value:'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1800&q=90' },
    { key:'about_title', page:'about', label:'About Title', value:'A private world after dark' },
    { key:'about_story', page:'about', label:'About Story', type:'textarea', value:'PLEASURE is built for those who understand discretion, atmosphere, and the rare art of unforgettable evenings. Every room, ritual, and invitation is designed with cinematic restraint and obsessive attention to detail.' },
    { key:'footer_description', page:'global', label:'Footer Description', type:'textarea', value:'An exclusive world of luxury, passion, and extraordinary experiences.' },
    { key:'contact_email', page:'global', label:'Contact Email', value:'info@pleasureclub.com' },
    { key:'contact_phone', page:'global', label:'Contact Phone', value:'+971 50 123 4567' },
    { key:'contact_location', page:'global', label:'Contact Location', value:'Dubai, UAE' }
  ]);
  await SiteSetting.insertMany([
    { key:'glowIntensity', label:'Red Glow Intensity', value:35 },
    { key:'animationEnabled', label:'Scroll Animations Enabled', value:true },
    { key:'membershipLayout', label:'Membership Layout Order', value:'silver-gold-platinum' }
  ]);
  await Membership.insertMany([
    { name:'Silver', price:250, features:['Access to selected events','Priority entry','Member-only newsletter','10% discount on all events'], sortOrder:1 },
    { name:'Gold', price:500, badge:'Most Popular', isHighlighted:true, features:['All Silver benefits','VIP table reservations','Invitations to exclusive events','20% discount on all events'], sortOrder:2 },
    { name:'Platinum', price:1000, features:['All Gold benefits','Personal concierge','Private lounge access','30% discount on all events'], sortOrder:3 }
  ]);
  const gallery = [
    ['Luxury Lounge','https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=900&q=90'],
    ['Champagne Toast','https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&w=900&q=90'],
    ['Masked Guests','https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=90'],
    ['VIP Club','https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=900&q=90'],
    ['Red Carpet','https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=900&q=90']
  ];
  await Media.insertMany(gallery.map(([title,url]) => ({ title, url, type:'image', mimeType:'image/jpeg', usage:'gallery', alt:title })));
  await Event.create({
    title:'Masquerade Night', description:'Step into a world of elegance, mystery, and unforgettable moments. A night where masks hide faces and desires come alive.', startsAt:new Date('2026-05-25T22:00:00'), location:'Pleasure Club, Dubai', posterUrl:'https://images.unsplash.com/photo-1515168833906-d2a3b82b3029?auto=format&fit=crop&w=900&q=90', countdownEnabled:true, status:'upcoming', isFeatured:true
  });
  await Event.create({ title:'Ruby Salon', description:'A candlelit private gathering for members and invited guests.', startsAt:new Date('2025-02-14T22:00:00'), location:'Pleasure Club, Dubai', posterUrl:'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=900&q=90', status:'past' });
  console.log(`Seed complete. Admin: ${email} / ${password}`);
  process.exit(0);
}
seed().catch(e => { console.error(e); process.exit(1); });

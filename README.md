# PLEASURE Private Club Web App

Dynamic Express + MongoDB + EJS + Tailwind CDN web application with a secure admin dashboard.

## Setup

```bash
cp .env.example .env
npm install
npm run seed
npm run dev
```

Open `http://localhost:3000` and admin at `http://localhost:3000/admin`.

## Admin modules

- Event CRUD with featured countdown control and poster upload
- Media manager with image/video upload and deletion
- Membership package CRUD with highlighted Gold-style pulse effect
- Content and visual effects editor
- Newsletter subscriber dashboard, CSV export, and invitation send simulation
- Membership applications and contact inquiry viewer

## Production notes

Use a strong `SESSION_SECRET`, HTTPS, a managed MongoDB deployment, object storage such as Cloudinary/S3 for uploaded media, and a real email provider before enabling real campaign sending.

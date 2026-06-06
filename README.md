# 🍽️ CafeHubOS — Digital Restaurant Menu Platform

[![Next.js](https://img.shields.io/badge/Next.js-15+-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18+-61dafb?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0+-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ecf8e?style=for-the-badge&logo=supabase)](https://supabase.com/)

> A production-ready, full-stack restaurant menu platform featuring bilingual browsing, real-time ordering, interactive table reservations, and smart scheduling — built with Next.js 15, TypeScript, and Supabase.

**🔗 Live Demo:** https://cafehubos.vercel.app/
**📦 Repository:** https://github.com/mehdibehboudi2002/online-menu

---

## ✨ Key Features

### 🛒 Online Ordering System
- Complete cart management with real-time price calculations
- Dynamic quantity adjustments with instant feedback
- Estimated delivery time tracking per item

### 🪑 Interactive Table Selection
- Visual floor plan organized by zone (Balcony, Salon) with entrance marker for spatial orientation
- Tables differentiated by shape and size to reflect seating capacity
- Flexible "on arrival" option for walk-in customers

### ⏰ Smart Time Scheduling
- Intelligent time slot availability system
- Business hours validation
- Conflict prevention with existing reservations

### 🌐 Bilingual Support (EN / FA)
- Full English/Farsi (فارسی) localization with `react-i18next`
- Automatic RTL/LTR layout switching per language
- Culturally adapted number formatting (Persian numerals)
- Automatic language detection on first visit (browser language → cached preference)

### 🎨 Theme System
- System-aware dark/light mode with manual toggle
- Persistent theme preferences across sessions
- Smooth transitions with optimized contrast ratios

### ⭐ Customer Reviews
- Rate and comment on individual menu items
- Real-time review submission and display
- Average rating calculations per item

### 🚀 Performance & UX
- Server-side rendering (SSR) for fast initial page loads
- Image gallery slider per menu item with multiple photos
- Lazy loading with Intersection Observer animations

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript 5+
- **Styling:** Tailwind CSS + SCSS Modules
- **State Management:** Redux Toolkit
- **Server State & Caching:** React Query (TanStack Query)
- **Internationalization:** react-i18next
- **Animations & Sliders:** Swiper.js, Framer Motion

### Backend & Data
- **API Layer:** Custom Next.js API Routes (100% custom business logic)
- **Database:** Supabase (PostgreSQL) with Row Level Security (RLS)
- **Storage:** Supabase Storage for image hosting
- **Real-time:** Supabase Realtime subscriptions

### DevOps & Tooling
- **Deployment:** Vercel (CI/CD via GitHub integration)
- **Version Control:** Git & GitHub (conventional commits)
- **Code Quality:** ESLint, Prettier, TypeScript strict mode

---

## 🏗️ Architecture Highlights

- **Hybrid Rendering:** SSR for initial page loads, CSR for dynamic interactions
- **Custom API Layer:** All business logic handled through Next.js API Routes — Supabase is never called directly from the client for mutations
- **Layered State:** Redux Toolkit for UI/cart state, React Query for server state caching and invalidation
- **Type Safety:** End-to-end TypeScript coverage from database schema to UI components
- **Security:** Row Level Security policies enforced at the database layer — public read, controlled write

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- A Supabase account (free tier works)

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/mehdibehboudi2002/online-menu.git
cd online-menu
```

**2. Install dependencies**
```bash
npm install
```

**3. Configure environment variables**
```bash
cp .example.local .env.local
```

Your `.env.local` should contain:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**4. Set up the Supabase database**

Run the following in your Supabase SQL Editor:

```sql
-- Create MenuItems table
CREATE TABLE "MenuItems" (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_fa TEXT NOT NULL,
  description_en TEXT NOT NULL,
  description_fa TEXT NOT NULL,
  category TEXT NOT NULL,
  price_en DECIMAL(10,2) NOT NULL,
  price_fa TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  nutritional_info JSONB,
  allergens JSONB,
  is_popular BOOLEAN DEFAULT false,
  estimated_delivery_time_minutes INTEGER DEFAULT 30,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Reviews table
CREATE TABLE "Reviews" (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "itemId" UUID REFERENCES "MenuItems"(id) ON DELETE CASCADE,
  "userName" TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE "MenuItems" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Reviews" ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read MenuItems" ON "MenuItems" FOR SELECT TO public USING (true);
CREATE POLICY "Public read Reviews" ON "Reviews" FOR SELECT TO public USING (true);
CREATE POLICY "Public insert Reviews" ON "Reviews" FOR INSERT TO public WITH CHECK (true);
```

**5. Create Supabase Storage bucket**

In your Supabase Dashboard → Storage → create a public bucket named `public_images`. Upload menu images under the path `images/menu/`.

**6. Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 🎯 How It Works

1. **Browse Menu** → Explore items by category with bilingual descriptions and image galleries
2. **Add to Cart** → Select quantities with real-time price updates
3. **Choose Table** → Pick from an interactive floor plan or select "on arrival"
4. **Schedule Time** → Book your arrival time with smart availability checking
5. **Review Order** → Confirm details before checkout
6. **Leave a Review** → Rate and comment on items after your experience

---

## 🔮 Roadmap

### Phase 1 — Completed ✅
- [x] Menu browsing with search and category filters
- [x] Cart management with quantity controls
- [x] Table selection with floor plan UI
- [x] Time scheduling with conflict prevention
- [x] Customer reviews system
- [x] Bilingual support (EN/FA) with RTL/LTR switching
- [x] Dark/Light theme with persistence

### Phase 2 — Planned 🚧
- [ ] Admin Dashboard — menu management, order tracking, analytics
- [ ] User Authentication — sign up, login, order history
- [ ] Payment Integration — ready for Stripe or local gateway
- [ ] Real-time Order Tracking
- [ ] Docker support for self-hosted deployment

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 About the Developer

**Mehdi Behboudi** — Frontend Developer with 3 years of professional experience, specializing in React and Next.js ecosystems with hands-on full-stack exposure.

Previously built production systems at a big data company (Vue.js dashboard builder, shared React component library with Storybook), a Canadian car dealership platform (data migration scripts, legacy refactoring), and a food delivery platform (client-side, admin panel, form validation architecture).

### 📫 Connect
- 📧 [mehdi061280@gmail.com](mailto:mehdi061280@gmail.com)
- 🐱 [@mehdibehboudi2002](https://github.com/mehdibehboudi2002)

---

*Built with Next.js · Supabase · Redux Toolkit · Tailwind CSS · TypeScript*
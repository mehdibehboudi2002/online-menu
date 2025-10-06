# 🍽️ CafeOS

[![Next.js](https://img.shields.io/badge/Next.js-14+-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18+-61dafb?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0+-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ecf8e?style=for-the-badge&logo=supabase)](https://supabase.com/)

> A modern, full-stack restaurant management system featuring digital menu browsing, real-time ordering, interactive table reservations, and intelligent scheduling — built with Next.js, TypeScript, and Supabase.

**🔗 Live Demo:** (https://cafehubos.vercel.app/)
**📦 Repository:** (https://github.com/mehdibehboudi2002/online-menu)

---

## 📸 Screenshots

> Add 2-3 screenshots showing:
>
> - Menu browsing interface
> - Cart and checkout flow
> - Table selection interface

---

## ✨ Key Features

### 🛒 **Online Ordering System**

- Complete cart management with real-time price calculations
- Dynamic quantity adjustments with instant feedback
- Estimated delivery time tracking per item

### 🪑 **Interactive Table Selection**

- Visual floor plan with real-time availability indicators
- Drag-and-drop table positioning (admin feature)
- Flexible "on arrival" option for walk-in customers

### ⏰ **Smart Time Scheduling**

- Intelligent time slot availability system
- Business hours validation
- Conflict prevention with existing reservations

### 🌐 **Bilingual Support**

- Full English/Farsi (فارسی) localization
- Automatic RTL/LTR layout switching
- Culturally adapted number formatting (Persian numerals)

### 🎨 **Theme System**

- System-aware dark/light mode
- Manual theme toggle with persistent preferences
- Smooth transitions and optimized contrast ratios

### ⭐ **Customer Reviews**

- Rate and comment on menu items
- Real-time review submission and display
- Average rating calculations

### 🚀 **Performance & UX**

- Server-side rendering for instant page loads
- Optimistic UI updates
- Image lazy loading with blur placeholders
- Intersection Observer animations

---

## 🛠️ Tech Stack

### Frontend

- **Framework:** Next.js 14+ (Pages Router)
- **Language:** TypeScript 5+
- **UI Library:** React 18+
- **Styling:** Tailwind CSS + SCSS Modules
- **State Management:** Redux Toolkit
- **Server State:** React Query (TanStack Query)
- **Internationalization:** next-i18next
- **Animations:** Swiper.js, Framer Motion

### Backend & Data

- **Backend Logic**: 100% Custom implementation using Next.js API Routes
- **Database**: Supabase (PostgreSQL) for data persistence
- **Storage**: Supabase Storage (image hosting)
- **Authentication**: Row Level Security (RLS) policies enforced on the database layer
- **Real-time**: Supabase Realtime subscriptions for live data updates

### DevOps & Tools

- **Version Control:** Git & GitHub
- **Package Manager:** npm
- **Code Quality:** ESLint, Prettier
- **Type Checking:** TypeScript strict mode

---

---

## 🏗️ Architecture Highlights

- **Hybrid Rendering:** Server-Side Rendering (SSR) for initial page loads + Client-Side Rendering (CSR) for dynamic interactions
  API Routes: Custom-built Next.js API routes for handling all business logic, data fetching, and mutations against the Supabase database.- **State Management:** Redux Toolkit for client state, React Query for server state caching
- **Type Safety:** End-to-end TypeScript coverage from database to UI components

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- A Supabase account (free tier works)

### Installation

1️⃣ **Clone the repository**

```bash
git clone https://github.com/mehdibehboudi2002/online-menu.git
cd online-menu
```

2️⃣ **Install dependencies**

```bash
npm install
```

3️⃣ **Configure environment variables**

```bash
# Copy the example file
cp .env.local.example .env.local

# Edit .env.local and add your Supabase credentials
# Get them from: https://supabase.com/dashboard/project/_/settings/api
```

Your `.env.local` should look like:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4️⃣ **Set up Supabase database**

Go to your Supabase SQL Editor and run:

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
  allergens TEXT[],
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

-- Public read access for MenuItems
CREATE POLICY "Public read MenuItems"
  ON "MenuItems" FOR SELECT
  TO public
  USING (true);

-- Public read access for Reviews
CREATE POLICY "Public read Reviews"
  ON "Reviews" FOR SELECT
  TO public
  USING (true);

-- Public insert access for Reviews
CREATE POLICY "Public insert Reviews"
  ON "Reviews" FOR INSERT
  TO public
  WITH CHECK (true);
```

5️⃣ **Create storage bucket for images**

In Supabase Dashboard:

- Go to Storage
- Create a new bucket named `public_images`
- Make it **public**

6️⃣ **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 🎯 How It Works

1. **Browse Menu** → Explore items by category with bilingual descriptions
2. **Add to Cart** → Select quantities with real-time price updates
3. **Choose Table** → Pick from an interactive floor plan or select "on arrival"
4. **Schedule Time** → Book your arrival time with smart availability checking
5. **Review Order** → Confirm details and proceed to checkout
6. **Payment** → Complete order (demo flow - ready for payment gateway integration)

---

## 🔮 Roadmap

### Phase 1: Current Features ✅

- [x] Menu browsing with search and filters
- [x] Cart management
- [x] Table selection
- [x] Time scheduling
- [x] Reviews system
- [x] Bilingual support (EN/FA)
- [x] Dark/Light themes

### Phase 2: Upcoming Features 🚧

- [ ] **Admin Dashboard** - Menu management, order tracking, analytics
- [ ] **User Authentication** - Sign up, login, order history
- [ ] **Payment Integration** - Stripe/PayPal/local payment gateways
- [ ] **Order Tracking** - Real-time order status updates
- [ ] **Docker Containerization** - Easy deployment

---

## 🧪 Testing

```bash
# Run tests (coming soon)
npm test

# Run linting
npm run lint

# Type checking
npm run type-check
```

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

Please ensure your code:

- Follows the existing code style
- Includes TypeScript types
- Is properly formatted (Prettier)
- Passes linting (ESLint)

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 About the Developer

**Mehdi Behboudi**  
Frontend Developer specializing in React & Next.js with hands-on backend development experience

This project demonstrates expertise in:

- 🏗️ Scalable architecture design with custom API development
- 🔒 Type-safe development with TypeScript
- 🎨 Modern UI/UX implementation
- 🌍 Internationalization (i18n)
- 📊 State management patterns
- 🔄 Real-time data synchronization
- ♿ Accessibility best practices
- 📱 Responsive design principles

### 📫 Connect With Me

- 📧 Email: [mehdi061280@gmail.com](mailto:mehdi061280@gmail.com)
- 🐱 GitHub: [@mehdibehboudi2002](https://github.com/mehdibehboudi2002)

---

### Acknowledgments

Supabase - Provider for PostgreSQL Database and Storage

- [Next.js](https://nextjs.org/) - The React framework
- [Supabase](https://supabase.com/) - Backend as a service
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Redux Toolkit](https://redux-toolkit.js.org/) - State management
- [Lucide Icons](https://lucide.dev/) - Beautiful icon set

---

Made by Mehdi Behboudi

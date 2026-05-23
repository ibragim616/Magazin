# UzMarket - E-Commerce Platform

UzMarket is a full-featured, responsive e-commerce web application built with modern technologies. It includes an integrated AI assistant powered by Google Gemini, a seamless shopping cart, and a full admin dashboard for managing products, categories, and orders.

## 🚀 Features

- **Storefront**: Browse products by category, view details, and add items to the cart.
- **AI Shopping Assistant**: A smart AI chat built right into the store that understands what's in your cart and provides contextual product advice.
- **Cart & Checkout**: Local-storage based shopping cart and easy checkout process (Cash / Online payment options).
- **Admin Dashboard**: Secure admin panel to manage products, categories, view user orders, and handle inventory.
- **Authentication**: JWT-based login and registration system.
- **Database**: Local SQLite database using Prisma ORM.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Database**: [Prisma ORM](https://www.prisma.io/) + SQLite
- **AI Integration**: [Vercel AI SDK](https://sdk.vercel.ai/docs) + Google Gemini
- **Icons**: [Lucide React](https://lucide.dev/)

## ⚙️ Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd <your-project-folder>
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add the following keys:
   ```env
   # Database connection
   DATABASE_URL="file:./dev.db"

   # Secret for user sessions/tokens
   JWT_SECRET="your_super_secret_jwt_key"

   # Gemini AI API Key (Get from https://aistudio.google.com/)
   GEMINI_API_KEY="your_gemini_api_key_here"
   ```

4. **Initialize the Database:**
   Generate the Prisma client and push the schema to create `dev.db`:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

   *(Optional) To populate the database with sample categories and products, run the seeder:*
   ```bash
   node prisma/seed.js
   ```

5. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

- `/src/app` - Next.js App Router pages (Storefront, Admin, API routes)
- `/src/components` - Reusable React components (Navbar, Product Cards, AIChat)
- `/src/context` - React Context providers for Auth and Cart state
- `/src/lib` - Utility functions and Prisma Database singleton
- `/prisma` - Database schema, migrations, and seed scripts

## 🛡️ Admin Access
To access the admin dashboard (`/admin`), you can register a new user and then manually update their role to `ADMIN` in the database, or use the pre-seeded admin credentials if you ran the seed script.

---
*Built with ❤️ for a seamless shopping experience.*

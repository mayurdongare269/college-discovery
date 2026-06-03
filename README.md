# 🎓 CollegeIQ AI - AI-Powered College Discovery Platform

[![Next.js](https://img.shields.io/badge/Next.js-16.2.7-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.9.0-2D3748)](https://www.prisma.io/)
[![NextAuth](https://img.shields.io/badge/NextAuth-4.24.14-purple)](https://next-auth.js.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC)](https://tailwindcss.com/)

**CollegeIQ AI** is a modern, production-ready college discovery platform that helps students find their perfect college through intelligent search, comparison, and data-driven insights.

🌐 **[View Live Demo](#)** | 📖 **[Full Documentation](PROJECT_DOCUMENTATION.md)** | 🐛 **[Report Bug](#)**

---

## ✨ Features

### 🎯 Core Features
- **🔍 Smart College Search** - Search 85+ colleges with advanced filters
- **📊 Detailed College Information** - Comprehensive data including fees, placements, ratings, NIRF ranks
- **📈 Historical Cutoff Analysis** - 25,500+ cutoff records from 2023-2025
- **⚖️ College Comparison** - Compare colleges side-by-side
- **❤️ Save Colleges** - Bookmark colleges for later review
- **🔐 Secure Authentication** - JWT-based authentication with NextAuth
- **📱 Responsive Design** - Works seamlessly on mobile, tablet, and desktop

### 🎓 College Database
- **85+ Top Colleges** - IITs, NITs, IIITs, State & Private institutions
- **510+ Courses** - Engineering streams across all colleges
- **Multiple Exam Types** - MHT-CET, JEE Main cutoffs
- **All Categories** - OPEN, OBC, EWS, SC, ST cutoff data

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL database (or Neon account)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/mayurdongare269/college-discovery.git
cd college-discovery
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

4. **Set up database**
```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database with sample data
npm run seed
```

5. **Start development server**
```bash
npm run dev
```

6. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📦 Tech Stack

### Frontend
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4
- **UI Library:** React 19
- **Forms:** React Hook Form + Zod
- **Icons:** Lucide React

### Backend
- **API:** Next.js API Routes
- **Database:** PostgreSQL (Neon)
- **ORM:** Prisma 6
- **Authentication:** NextAuth 4
- **Password Hashing:** bcryptjs

### Development Tools
- **Package Manager:** npm
- **Code Quality:** ESLint
- **Type Safety:** TypeScript
- **Database GUI:** Prisma Studio

---

## 📁 Project Structure

```
college-discovery/
├── app/                      # Next.js App Router
│   ├── api/                  # API Routes
│   │   ├── auth/            # Authentication endpoints
│   │   └── colleges/        # College data endpoints
│   ├── colleges/            # College pages
│   ├── dashboard/           # User dashboard (protected)
│   ├── profile/             # User profile (protected)
│   ├── login/               # Login page
│   ├── signup/              # Signup page
│   └── page.tsx             # Landing page
├── components/               # Reusable components
├── lib/                     # Utility functions
├── prisma/                  # Database schema & migrations
├── types/                   # TypeScript type definitions
└── middleware.ts            # Route protection
```

---

## 🗄️ Database Schema

### Models

#### User
- Authentication and user management
- Fields: id, name, email, password (hashed), createdAt

#### College
- College information
- Fields: name, location, fees, rating, placementScore, nirfRank, etc.

#### Course
- Courses offered by colleges
- Fields: name, duration, seats, collegeId

#### Cutoff
- Historical cutoff data
- Fields: examType, category, branch, cutoffScore, year, courseId

[View Full Schema](prisma/schema.prisma)

---

## 🔐 Authentication

### Features
- ✅ Secure user registration with password hashing
- ✅ JWT-based session management (30-day expiry)
- ✅ Protected routes with middleware
- ✅ Persistent sessions across refreshes
- ✅ Secure logout functionality

### Usage

**Sign Up:**
```typescript
// POST /api/auth/signup
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Login:**
```typescript
import { signIn } from 'next-auth/react';

await signIn('credentials', {
  email: 'john@example.com',
  password: 'securePassword123',
  redirect: false,
});
```

**Check Session:**
```typescript
import { useSession } from 'next-auth/react';

const { data: session, status } = useSession();
```

---

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user
- `POST /api/auth/signin` - User login
- `GET /api/auth/session` - Get current session
- `POST /api/auth/signout` - Logout user

### Colleges
- `GET /api/colleges` - List colleges with filters
  - Query params: `search`, `state`, `examType`, `course`, `page`, `limit`

---

## 🎨 UI Components

### Reusable Components
- `Navbar` - Navigation with authentication state
- `Footer` - Site footer with links
- `Sidebar` - Dashboard navigation
- `CollegeCard` - College information card
- `StatsCard` - Statistics display
- `Loading` - Loading state
- `ErrorState` - Error handling
- `EmptyState` - Empty data placeholder

---

## 🔨 Available Scripts

```bash
# Development
npm run dev          # Start development server

# Building
npm run build        # Build for production
npm start            # Start production server

# Database
npm run seed         # Seed database with sample data
npm run studio       # Open Prisma Studio

# Code Quality
npm run lint         # Run ESLint
```

---

## 📊 Database Statistics

- **85+ Colleges** - Covering IITs, NITs, IIITs, and top private institutions
- **510+ Courses** - Various engineering and technology programs
- **25,500+ Cutoff Records** - Historical data for informed decisions

---

## 🛣️ Roadmap

### Phase 1: Foundation ✅ (Completed)
- [x] Database schema and migrations
- [x] College data seeding
- [x] API endpoints
- [x] Basic UI components

### Phase 2: Authentication ✅ (Completed)
- [x] User registration
- [x] Login/logout
- [x] Session management
- [x] Protected routes

### Phase 3: Features ✅ (Completed)
- [x] College search and filters
- [x] College details page
- [x] User dashboard
- [x] Profile management

### Phase 4: Advanced Features 🚧 (Planned)
- [ ] College comparison tool
- [ ] Save colleges functionality
- [ ] AI-based recommendations
- [ ] Cutoff predictor
- [ ] Application tracking

### Phase 5: Enhancements 📋 (Future)
- [ ] User reviews and ratings
- [ ] Real-time notifications
- [ ] Mobile app
- [ ] Admission counselor chat
- [ ] Document management

---

## 🔧 Configuration

### Environment Variables

Required variables in `.env`:

```env
# Database
DATABASE_URL="postgresql://..."

# Authentication (NextAuth)
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

### Generate Secret Key
```bash
openssl rand -base64 32
```

---

## 🧪 Testing

### Manual Testing Completed ✅
- User authentication flow
- College search and filters
- College details rendering
- Protected route access
- Session persistence
- Responsive design
- Form validation

### Recommended Tests (Future)
- Unit tests with Jest
- Integration tests
- E2E tests with Playwright
- Load testing

---

## 📈 Performance

### Optimizations Implemented
- ✅ Database query optimization with indexes
- ✅ Pagination for large datasets
- ✅ Code splitting (automatic via Next.js)
- ✅ Static page generation where possible

### Production Recommendations
- Implement Redis for caching
- Use CDN for static assets
- Enable ISR for college pages
- Add image optimization

---

## 🔒 Security

### Measures Implemented
- ✅ Password hashing with bcrypt (10 salt rounds)
- ✅ JWT tokens with secret key
- ✅ HTTP-only cookies
- ✅ CSRF protection
- ✅ SQL injection prevention (Prisma)
- ✅ Input validation with Zod
- ✅ Environment variable protection

---

## 🚀 Deployment

### Recommended Platforms
- **Vercel** (Recommended for Next.js)
- **Netlify**
- **Railway**
- **AWS / GCP / Azure**

### Deployment Steps (Vercel)

1. Connect GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main

```bash
# Build command
npm run build

# Output directory
.next
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 Documentation

- **[Full Project Documentation](PROJECT_DOCUMENTATION.md)** - Comprehensive guide
- **[API Documentation](#api-endpoints)** - API reference
- **[Database Schema](prisma/schema.prisma)** - Prisma schema

---

## 🐛 Known Issues

- Middleware deprecation warning (Next.js 16) - No functional impact

---

## 📜 License

This project is private and proprietary.

---

## 👨‍💻 Author

**Mayur Dongare**
- GitHub: [@mayurdongare269](https://github.com/mayurdongare269)
- Email: mayurdongare269@gmail.com

---

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Prisma for the excellent ORM
- NextAuth for authentication solution
- Vercel for hosting platform
- Neon for PostgreSQL database

---

## 📞 Support

For support and questions:
- 📧 Email: mayurdongare269@gmail.com
- 🐛 Issues: [GitHub Issues](https://github.com/mayurdongare269/college-discovery/issues)
- 📖 Docs: [PROJECT_DOCUMENTATION.md](PROJECT_DOCUMENTATION.md)

---

## ⭐ Star History

If you find this project useful, please consider giving it a star! ⭐

---

## 📊 Project Stats

![GitHub last commit](https://img.shields.io/github/last-commit/mayurdongare269/college-discovery)
![GitHub code size](https://img.shields.io/github/languages/code-size/mayurdongare269/college-discovery)
![GitHub issues](https://img.shields.io/github/issues/mayurdongare269/college-discovery)

---

<div align="center">
  <p>Made with ❤️ by Mayur Dongare</p>
  <p>© 2026 CollegeIQ AI. All rights reserved.</p>
</div>

# The Respite

A modern e-commerce platform for trading card game singles, designed to become a full-service local game store with integrated online and in-store experiences.

## Project Overview

The Respite is being built in phases:

- **Phase 1 (2026)**: Online store for Magic: The Gathering singles
- **Phase 2 (2027)**: Expanded product catalog, loyalty program, advanced features
- **Phase 3 (2029-2030)**: Brick-and-mortar store integration with unified inventory and events

This project serves as both a learning platform for retail operations and the technical foundation for a future community-focused game store in the Greater Boston area.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL (via Supabase)
- **ORM**: Prisma
- **Authentication**: NextAuth.js v5
- **Payments**: Stripe
- **Email**: Resend
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Hosting**: Vercel
- **Testing**: Jest, React Testing Library, Playwright

## Getting Started

### Prerequisites

- Node.js 20+ and npm
- PostgreSQL (via Docker or Supabase)
- Git

### Installation

1. **Clone the repository**

```bash
   git clone https://github.com/carsonclarke570/lgs-webstore.git
   cd lgs-webstore
```

2. **Install dependencies**

```bash
   npm install
```

3. **Set up environment variables**

```bash
   cp .env.example .env.local
```

   Edit `.env.local` with your configuration:

```env
   DATABASE_URL="postgresql://..."
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-here"
   STRIPE_PUBLISHABLE_KEY="pk_test_..."
   STRIPE_SECRET_KEY="sk_test_..."
```

4. **Set up the database**

```bash
   # Run migrations
   npx prisma migrate dev
   
   # (Optional) Seed with test data
   npx prisma db seed
```

5. **Start the development server**

```bash
   npm run dev
```

6. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure
```
lgs-webstore/
├── prisma/              # Database schema and migrations
├── public/              # Static assets
├── src/
│   ├── app/            # Next.js App Router pages and API routes
│   ├── components/     # React components
│   ├── lib/            # Utility functions and configurations
│   └── types/          # TypeScript type definitions
├── tests/              # Test files
│   ├── unit/          # Unit tests
│   ├── integration/   # Integration tests
│   └── e2e/           # End-to-end tests
└── scripts/            # Build and deployment scripts
```

## Testing

```bash
# Run all tests
npm test

# Run unit tests
npm run test:unit

# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e

# Run tests with coverage
npm run test:ci
```

## Database

### Prisma Commands

```bash
# Open Prisma Studio (database GUI)
npm run prisma:studio

# Create a new migration
npm run prisma:migrate

# Generate Prisma Client
npm run prisma:generate

# Seed database with test data
npm run prisma:seed
```

### Database Schema

The database includes tables for:

- **Users**: Customer accounts and authentication
- **Products**: General product catalog
- **MtgCards**: Magic: The Gathering specific data (extends Products)
- **Inventory**: Stock tracking by condition
- **Orders**: Customer orders and order items
- **OrderItems**: Line items for each order

## Environments

### Local Development

- **URL**: http://localhost:3000
- **Database**: Local PostgreSQL or Supabase dev project
- **Stripe**: Test mode
- **Purpose**: Active development and testing

### Staging

- **URL**: staging.lgs-webstore.com (or Vercel preview URL)
- **Database**: Supabase staging project
- **Stripe**: Test mode
- **Purpose**: Pre-production testing
- **Deployment**: Automatic on push to `develop` branch

### Production
- **URL**: lgs-webstore.com
- **Database**: Supabase production project
- **Stripe**: Live mode
- **Purpose**: Live customer-facing site
- **Deployment**: Automatic on push to `main` branch

## Development Workflow

1. Create a feature branch from `develop`

```bash
   git checkout develop
   git pull
   git checkout -b feature/your-feature-name
```

2. Make your changes and commit

```bash
   git add .
   git commit -m "feat: add your feature"
```

3. Push and create a Pull Request

```bash
   git push -u origin feature/your-feature-name
```

4. CI will automatically run tests

5. After review, merge to `develop` (deploys to staging)

6. When ready for production, create PR from `develop` to `main`

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript compiler check |
| `npm test` | Run tests in watch mode |
| `npm run test:ci` | Run tests with coverage |
| `npm run format` | Format code with Prettier |

## Code Style

This project uses:

- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** for type safety

Code style is enforced automatically via:

- Pre-commit hooks (Husky)
- CI/CD pipeline checks

## Environment Variables

Required environment variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/db` |
| `NEXTAUTH_URL` | Application URL | `http://localhost:3000` |
| `NEXTAUTH_SECRET` | NextAuth.js secret key | `generate-with-openssl` |
| `STRIPE_PUBLISHABLE_KEY` | Stripe public key | `pk_test_...` |
| `STRIPE_SECRET_KEY` | Stripe secret key | `sk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | `whsec_...` |
| `RESEND_API_KEY` | Resend API key for emails | `re_...` |
| `EMAIL_FROM` | From address for emails | `noreply@therespite.com` |

See `.env.example` for a complete list.

## 🚢 Deployment

### Automatic Deployments

- **Staging**: Pushes to `develop` automatically deploy to staging
- **Production**: Pushes to `main` automatically deploy to production

### Manual Deployment

```bash
# Deploy to Vercel manually
vercel --prod
```

### Database Migrations

Migrations run automatically in CI/CD, but can be run manually:

```bash
# Production
DATABASE_URL="your-production-url" npx prisma migrate deploy
```

## Troubleshooting

### Database Connection Issues

```bash
# Test database connection
npx prisma db push --skip-generate
```

### Prisma Client Out of Sync

```bash
# Regenerate Prisma Client
npx prisma generate
```

### Build Failures

```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

## 📚 Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [Scryfall API Documentation](https://scryfall.com/docs/api)

## 🗺️ Roadmap

### Phase 1: MVP (Q1-Q2 2026)

- [x] Project setup and infrastructure
- [ ] Product catalog and search
- [ ] Shopping cart and checkout
- [ ] Order management
- [ ] Admin dashboard
- [ ] Customer accounts

### Phase 2: Enhanced Features (Q3 2026 - 2027)

- [ ] Loyalty program
- [ ] Scryfall syntax search
- [ ] Advanced inventory management
- [ ] Email marketing integration
- [ ] Customer reviews
- [ ] Wishlist functionality

### Phase 3: Brick & Mortar Integration (2028-2029)

- [ ] Event calendar and registration
- [ ] In-store pickup
- [ ] Unified online/in-store inventory
- [ ] POS integration
- [ ] Location-based features

## 🤝 Contributing

This is currently a solo project, but contributions may be welcome in the future.

## 📄 License

This project is private and proprietary.

## 📧 Contact

For questions about this project, please contact [your-email@example.com]

---

**Built with ❤️ for the gaming community**
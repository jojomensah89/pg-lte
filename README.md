# PG-LTE Project

This project is a Next.js application integrated with Tailwind CSS, PGLite, and Drizzle ORM for database management and migrations.

## Prerequisites

- Node.js and npm or pnpm installed
- Basic understanding of Next.js and TypeScript

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/jojomensah89/pg-lte.git
cd pg-lte
```

## Getting Started

First, run the development server:

```bash
pnpm install
```

## Configure database

```bash
// drizzle.config.ts
export default defineConfig({
  dialect: "postgresql",
  schema: "./db/schema",
  out: "./db/migrations",
  driver: "pglite",
  dbCredentials: {
    url: "idb://nextjs-pglite",
  },
});
```

## Run migrations

```bash
pnpm run db:generate
```

## Run the development server

```bash
pnpm run dev    
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

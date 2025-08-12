# Next.js Turbo Repo with shadcn/ui

A modern monorepo template built with Turborepo, Next.js, and shadcn/ui components.

## Features

- 🏗️ **Turborepo** - High-performance build system for JavaScript/TypeScript monorepos
- ⚡ **Next.js 15** - React framework with App Router
- 🎨 **shadcn/ui** - Beautifully designed components built on Radix UI and Tailwind CSS
- 🎯 **TypeScript** - Type safety across the entire monorepo
- 🧹 **ESLint & Prettier** - Code linting and formatting
- 📦 **PNPM** - Fast, disk space efficient package manager with hoisted node_modules

## Getting Started

### Prerequisites

- Node.js 20 or higher
- PNPM 10.14.0 or higher

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd nextjs-turbo-repo-shadcn-seed
```

2. Install dependencies:

```bash
pnpm install
```

3. Start the development server:

```bash
pnpm dev
```

This will start the Next.js app at `http://localhost:3000`

## Available Scripts

- `pnpm dev` - Start development servers for all apps
- `pnpm build` - Build all apps and packages
- `pnpm lint` - Run ESLint across all packages
- `pnpm format` - Format code with Prettier
- `pnpm --filter web dev` - Start only the web app in development mode

## Project Structure

```
├── apps/
│   ├── api/          # API application
│   └── web/          # Next.js web application
├── packages/
│   ├── eslint-config/    # Shared ESLint configuration
│   ├── typescript-config/ # Shared TypeScript configuration
│   ├── ui/               # Shared UI components
│   └── utils/            # Shared utilities
├── package.json         # Root package.json
├── pnpm-workspace.yaml  # PNPM workspace configuration
└── turbo.json          # Turborepo configuration
```

## Adding shadcn/ui Components

To add new shadcn/ui components to your project:

```bash
pnpm dlx shadcn@latest add button -c apps/web
```

This will place the UI components in the `packages/ui/src/components` directory.

## Using Components

Import components from the `@workspace/ui` package in your applications:

```tsx
import { Button } from "@workspace/ui";

export default function HomePage() {
  return (
    <div>
      <Button>Click me</Button>
    </div>
  );
}
```

## Styling

- **Tailwind CSS** is configured across all packages
- Global styles are defined in `apps/web/styles/global.css`
- Component styles use Tailwind classes and CSS variables for theming

## SEO and Metadata

Pages in `apps/web` use the utilities provided in `@workspace/utils` to define SEO metadata. When creating a new page, export a `generateMetadata` function (or a `metadata` constant) and call `constructMetadata` with the page's title, description, canonical URL and optional image or keywords.

Structured data can be added using the JSON‑LD helpers:

```tsx
import {
  constructMetadata,
  generateBreadcrumbList,
  generateArticleJsonLd,
  siteSettings,
} from "@workspace/utils";

export const metadata = constructMetadata({
  title: "About",
  description: "Learn more about us",
  canonicalUrl: `${siteSettings.canonical}about`,
});

export default function AboutPage() {
  const breadcrumb = generateBreadcrumbList([
    { name: "Home", url: siteSettings.canonical },
    { name: "About", url: `${siteSettings.canonical}about` },
  ]);

  return (
    <>
      {/* page content */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
    </>
  );
}
```

The helpers use defaults from `siteSettings` when values are omitted.

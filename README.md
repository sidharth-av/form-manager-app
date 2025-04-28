# Shopify Form Manager App - Remix

A Shopify app built with Remix for managing form submissions through the Shopify storefront and admin.

---

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/en/download/)
- [Shopify Partner Account](https://partners.shopify.com/signup)
- [Shopify Development Store](https://help.shopify.com/en/partners/dashboard/development-stores#create-a-development-store)
- [Shopify CLI](https://shopify.dev/docs/apps/tools/cli/installation) installed globally
- [Ngrok](https://ngrok.com/) account for exposing localhost

---

## Clone Repository

```bash
git clone <repository-url>
cd <repository-folder>
```

---

## Setup

### Install Dependencies

```bash
npm install
```

---

## Shopify App Configuration

You can configure the app in two ways:

- **Manual Setup:**
  - Create an app manually from your [Shopify Partner Dashboard](https://partners.shopify.com/).
  - Update the `shopify.app.toml` file:
    - Replace the **App Name** and **API Client ID** accordingly.
  - Example: [`shopify.app.toml`](https://github.com/Shopify/example-app--payments-app-template--remix/blob/main-js/shopify.app.toml)

- **Using Shopify CLI (Recommended):**
  - Use Shopify CLI to reset and configure:

```bash
npm run dev -- --reset
```

This will prompt you to select your app, set environment variables, and update the config automatically.

---

## Environment Variables

### Development Environment

- During development, **you don't need to manually set** environment variables.
- Shopify CLI automatically manages them using values from `shopify.app.toml`.
- You can directly access them in your code through environment variables, as shown in the example routes.

> **Note:** Shopify CLI injects environment variables during `npm run dev`.

> **Tip:** If you want to generate a `.env` file manually during development (for inspection or customization), you can run:

```bash
shopify app env pull
```

This will pull the current environment variables and create a `.env` file locally.

---

### Production Environment

In production, you must manually create a `.env` file and set the necessary variables.

The main environment variables you need are:

| Variable              | Description |
|------------------------|-------------|
| `SHOPIFY_API_KEY`      | Your app’s API key |
| `SHOPIFY_API_SECRET`   | Your app’s API secret |
| `SHOPIFY_APP_URL`      | Your deployed app URL |
| `SCOPES`               | Comma-separated list of required access scopes |

Here is an example of how your `.env` file should look:

```env
SHOPIFY_API_KEY=your-shopify-api-key
SHOPIFY_API_SECRET=your-shopify-api-secret
SHOPIFY_APP_URL=https://your-production-app.com
SCOPES=read_products,write_products
```

---

## Local Development

Start the local development server:

```bash
npm run dev
```

- Connects your app to your Shopify Partner account.
- Exposes your local server using Ngrok.
- Injects environment variables automatically.

---

## Exposing Localhost (Ngrok Tunnel)

Since Shopify apps require an HTTPS URL, the app automatically creates a secure tunnel (using Ngrok) when running `npm run dev`.

**Important:**  
Each time you restart the server, the Ngrok URL will change.

**Update the App Extension `submission_url`:**

1. Open your app extension’s `form.liquid` file.
2. Replace the existing `submission_url` with the **current `application_url`** from `shopify.app.toml`.

---

### Ngrok Manual Setup (Optional)

If you want to start an Ngrok tunnel manually:

```bash
npm install -g ngrok
ngrok http <port>
```

After starting, Ngrok will provide a URL like `https://abcd1234.ngrok.io`.  
Update your `application_url` in `shopify.app.toml` accordingly.

---

## Prisma Setup (Database)

This project uses [Prisma ORM](https://www.prisma.io/) with SQLite for local development.

### Prisma Studio (Optional)

Open Prisma Studio to visualize your database:

```bash
npx prisma studio
```

---

## App Extension Setup

1. After installing the app in your Shopify store, go to **Online Store > Themes > Customize**.
2. Add the app block where you want the form to appear on the storefront.

---

## Screenshot Previews

| Customer-Facing View | Admin View 1 | Admin View 2 |
|:--------------------:|:------------:|:------------:|
| ![Frontend](https://drive.google.com/uc?id=1F4Z1U6aY0Dum7RFmYlQVlkqrWMRULO-o) | ![Admin 1](https://drive.google.com/uc?id=1ScFEIvp1-2HgSDBC703YHCNRD-ZqlUMV) | ![Admin 2](https://drive.google.com/uc?id=1CnY1otRWc0cXFvkIDw22pelx8ghedY9B) |

---

## Screen Recording

- [App Running (Video Link)](https://drive.google.com/file/d/1rQ8GGls0eCTCIngD4PHdhCwl1JfReEdh/view?usp=drive_link)

---

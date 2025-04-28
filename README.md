# Shopify Form Manager App - Remix

A Shopify app built with Remix for managing custom forms through the Shopify storefront and admin.

---
## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/en/download/) installed
- [Shopify Partner Account](https://partners.shopify.com/signup)
- A [Shopify Development Store](https://help.shopify.com/en/partners/dashboard/development-stores#create-a-development-store)
- [Ngrok](https://ngrok.com/) account for exposing localhost
- [Shopify CLI](https://shopify.dev/docs/apps/tools/cli/installation) installed globally

---

## Clone Repository

```bash
git clone <repository-url>
cd <repository-folder>
```

---

## Setup

### Install dependencies

```bash
npm install
```

---

## Shopify App Configuration

You can configure the app in two ways:

- **Manual Setup:**
  - Create an app manually from your [Shopify Partner Dashboard](https://partners.shopify.com/).
  - Update `shopify.app.toml` file:
    - Replace the **App Name** and **API Client ID** accordingly.
  - Example: [`shopify.app.toml`](https://github.com/Shopify/example-app--payments-app-template--remix/blob/main-js/shopify.app.toml)

- **Using Shopify CLI (Recommended):**
  - Use Shopify CLI to reset and configure:

```bash
npm run dev -- --reset
```

This will prompt you to select your app, set environment variables, and update config automatically.
---

## Environment Variables

### Development Environment

- During development, **you don't need to manually set** environment variables.
- Shopify CLI automatically manages them using the values provided in `shopify.app.toml`.
- You can directly access them in your code through environment variables, as shown in the example routes.

> **Note:** Shopify CLI injects the environment variables during `npm run dev`.

---

## Local Development

Start the local development server:

```bash
npm run dev
```

- Connects your app to Shopify Partners account.
- Exposes your local server using ngrok.
- Injects environment variables automatically.

---

## Exposing Localhost (Ngrok Tunnel)

Since Shopify apps require an HTTPS URL, the app automatically creates a secure tunnel (using Ngrok) when running `npm run dev`.

**Important:**  
Each time you restart the server, the Ngrok URL will change.

**Update the App Extension `submission_url`:**

1. Open your app extension’s `form.liquid` file.
2. Replace the existing `submission_url` with the **current `application_url`** from the [`shopify.app.toml`](https://github.com/Shopify/example-app--payments-app-template--remix/blob/main-js/shopify.app.toml).

---

## App Extension Setup

1. After installing the app in your Shopify store, go to **Online Store > Themes > Customize**.
2. Add the app block where you want the form to appear on the storefront.

---



## Additional Information

### Ngrok Setup

```bash
npm install -g ngrok
```

### Start Ngrok Tunnel (For Manual setup only)

```bash
ngrok http <Port>
```

After starting, Ngrok will provide you a URL like `https://abcd1234.ngrok.io`.  
Update your `application_url` in `shopify.app.toml` accordingly for local development.

---

## Prisma Setup (Database)

This project uses [Prisma ORM](https://www.prisma.io/) with SQLite for local development.

### Database

(Optional) Open Prisma Studio to visualize your database:

```bash
npx prisma studio
```
---

### Production Environment

In production, you must manually create a `.env` file and set the necessary variables.

The main environment variables you need for production are:

| Variable              | Description |
|------------------------|-------------|
| `SHOPIFY_API_KEY`      | Your app’s API key |
| `SHOPIFY_API_SECRET`   | Your app’s API secret |
| `SHOPIFY_APP_URL`      | Your deployed app's URL |
| `SCOPES`               | Comma-separated list of required access scopes |

Here is an example of how your `.env` file should look:

```env
SHOPIFY_API_KEY=your-shopify-api-key
SHOPIFY_API_SECRET=your-shopify-api-secret
SHOPIFY_APP_URL=https://your-production-app.com
SCOPES=read_products,write_products
```

---


## Screenshot Previews

| Customer-Facing View | Admin View 1 | Admin View 2 |
|:--------------------:|:------------:|:------------:|
| ![Frontend](https://drive.google.com/uc?id=1F4Z1U6aY0Dum7RFmYlQVlkqrWMRULO-o) | ![Admin 1](https://drive.google.com/uc?id=1ScFEIvp1-2HgSDBC703YHCNRD-ZqlUMV) | ![Admin 2](https://drive.google.com/uc?id=1CnY1otRWc0cXFvkIDw22pelx8ghedY9B) |

---

## Screen Recording

- [App Running (Video Link)](https://drive.google.com/file/d/1rQ8GGls0eCTCIngD4PHdhCwl1JfReEdh/view?usp=drive_link)

---

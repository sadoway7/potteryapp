# Rumfor Market Tracker

## Vision
To create the most comprehensive community-driven market platform where artisans can discover, track, and analyze craft markets worldwide.

## Problem Being Solved
Artisans currently struggle with:
- Fragmented market information
- No central platform for vendor experiences
- Difficulty tracking expenses across events
- Lack of coordination tools

## Solution
Rumfor Market Tracker provides:
- Crowdsourced market database
- Vendor networking tools
- Expense tracking per market event
- Coordinated planning via message boards

## Features
- User authentication (registration/login)
- Market creation and discovery
- Market tracking with custom statuses
- Date-specific message boards
- Expense tracking per market event
- EJS templating with layout inheritance
- Responsive mobile-first design

## Documentation
- [PLANNING.md](PLANNING.md) - Task management and progress tracking
- [ARCHITECTURE.md](ARCHITECTURE.md) - Technical architecture and design
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment instructions
- [LAYOUTS.md](LAYOUTS.md) - EJS layout system documentation

## Development Setup
1. Clone the repository
2. Run `npm install`
3. Create `.env` file with database credentials
4. Run `npm run db:migrate`
5. Start dev server with `npm run dev`

## View Architecture
The application uses EJS templating with express-ejs-layouts for consistent page structure:
- [`src/views/layouts/main.ejs`](src/views/layouts/main.ejs) - Main layout template
- [`src/views/layouts/header.ejs`](src/views/layouts/header.ejs) - Header partial
- [`src/views/layouts/footer.ejs`](src/views/layouts/footer.ejs) - Footer partial
- Individual view files extend the main layout using `<%- body %>` placeholder

## Workflow
- Tasks are managed in [PLANNING.md](PLANNING.md)
- File statuses tracked using symbol system
- Follow MVC architecture pattern
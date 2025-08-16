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

## Documentation
- [PLANNING.md](PLANNING.md) - Task management and progress tracking
- [ARCHITECTURE.md](ARCHITECTURE.md) - Technical architecture and design
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment instructions

## Development Setup
1. Clone the repository
2. Run `npm install`
3. Create `.env` file with database credentials
4. Run `npm run db:migrate`
5. Start dev server with `npm run dev`

## Workflow
- Tasks are managed in [PLANNING.md](PLANNING.md)
- File statuses tracked using symbol system
- Follow MVC architecture pattern
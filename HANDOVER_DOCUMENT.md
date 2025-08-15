# Rumfor Market Tracker - Developer Handover Document

**Version: 1.0**

This document provides a comprehensive overview of the Rumfor Market Tracker application for a new developer. It covers the project's vision, features, technical architecture, and setup procedures.

---

## 1. Project Overview

### 1.1. Vision & Purpose

The Rumfor Market Tracker is a mobile-first progressive web application designed to help vendors (e.g., at farmers' markets, craft fairs) manage their business operations. The core goal is to provide a centralized platform for vendors to discover new markets, track their application status for various markets, log performance metrics (sales, costs), and share community knowledge about markets.

### 1.2. Target Audience

The primary users are small business vendors who sell goods at multiple, non-permanent locations.

### 1.3. Core Problem Solved

The app solves the organizational chaos of managing participation in many different markets. It replaces spreadsheets, notebooks, and scattered calendar reminders with a single, streamlined tool, helping vendors make data-driven decisions about which markets are most profitable and suitable for them.

---

## 2. Core Concepts

Understanding these two concepts is critical to understanding the application's data model:

*   **Public Market Profile:** This is the central, community-editable "template" for a market. It contains objective information like name, address, hours, and contact details. It also holds community-sourced data like the message board and positive attribute ratings. Anyone can view these profiles.

*   **Private Tracked Market:** When a user decides they are interested in a market, they "track" it. This creates a **private copy** of the market information linked to their user account. This private record is where they manage their personal application **status** (`Interested`, `Application Sent`, `Approved`, etc.), log their private sales and cost data for events they attend, and keep private notes.

---

## 3. Feature Breakdown

### 3.1. User Authentication
-   **Functionality:** Users can register for a new account and log in. The system uses JWT (JSON Web Tokens) for session management.
-   **Implementation:**
    -   Password hashing is handled by `bcryptjs`.
    -   JWTs are created upon successful login.
    -   An authentication middleware (`src/middleware/auth.middleware.js`) protects routes that require a logged-in user.

### 3.2. Market Discovery (Public)
-   **Functionality:** All users (logged-in or not) can browse, search, and filter a public database of markets. The discovery page displays markets in a card format, and clicking a card leads to the detailed Public Market Profile page.
-   **Implementation:**
    -   The `/discover` page (`src/views/discover.ejs`) shows a list of markets.
    -   The `/market/:id` page (`src/views/market.ejs`) shows the detailed profile.
    -   The backend API (`GET /api/markets`) will eventually support search and location-based filtering.

### 3.3. Market Tracking (Private)
-   **Functionality:** A logged-in user can choose to "track" any market from a Public Market Profile. This adds the market to their personal dashboard (`/dashboard`). From their dashboard, they can manage their relationship with that market.
-   **Status Management:** A key feature is managing a private status for each tracked market.
    -   **System Statuses:** `Interested`, `Application Sent`, `Approved`, `Complete`. These are required.
    -   **Custom Statuses:** Users can create their own statuses for their workflow.
    -   **Side Effects:** When a user sets their status to `Approved`, they will be publicly listed as an "Attending Vendor" on the Public Market Profile.
-   **Implementation:**
    -   The user's dashboard is rendered by `src/views/dashboard.ejs`.
    -   The detailed management page is `src/views/manage-market.ejs`.
    -   APIs for tracking/untracking and updating status will be built out under `/api/markets/`.

### 3.4. Event Logging
-   **Functionality:** For each date a vendor attends a market, they can create an "Event Log". In this log, they can record their total sales, total costs (like booth fees), and private notes for that day.
-   **Implementation:** This is handled by the `tracked_market_events` table and will have API endpoints nested under a user's tracked market ID.

### 3.5. Community Features
-   **Market Message Boards:**
    -   **Functionality:** Each Public Market Profile has its own public message board. Any logged-in user can post questions or comments for the community to see.
    -   **Implementation:** The `market.ejs` view contains the UI. The client-side JS in `public/js/main.js` handles form submission via `fetch` to create an interactive experience. The API is at `POST /api/markets/:marketId/messages`.
-   **Positive Attribute Ratings:**
    -   **Functionality:** To avoid negative "review bombing," the app uses a positive-only rating system. Users can upvote predefined attributes like "High Foot Traffic" or "Family Friendly".
    -   **Implementation:** The UI is on `market.ejs`. Client-side JS handles the voting via a `fetch` call to the API at `POST /api/markets/:marketId/attributes/:attributeId/vote`.

---

## 4. Technical Deep Dive

### 4.1. Technology Stack
-   **Backend:** Node.js, Express.js
-   **Frontend:** EJS (Embedded JavaScript) for server-side rendering, with plain JavaScript for client-side interactivity.
-   **Database:** PostgreSQL
-   **Styling:** Plain CSS

### 4.2. Directory Structure & Data Flow
*(This section is a summary of `ARCHITECTURE.md`)*
-   **/public**: Static assets (CSS, client-side JS).
-   **/src**: All application source code.
    -   `/routes`: API and view route definitions.
    -   `/controllers`: Handles HTTP request/response cycle.
    -   `/services`: Contains core business logic and database interactions.
    -   `/db`: Manages DB connection (`connection.js`) and schema (`init.sql`).
    -   `/middleware`: Authentication middleware.
    -   `/views`: EJS templates, including a main layout in `/layouts`.
-   **Data Flow:** Request -> `routes` -> `controllers` -> `services` -> DB -> `services` -> `controllers` -> Response (JSON or rendered EJS view).

---

## 5. Database Schema
*(A detailed reference of the tables. See `ARCHITECTURE.md` for the full schema.)*
-   `users`: Stores user credentials.
-   `markets`: The public market "templates".
-   `tracked_markets`: Links a `user` to a `market` and stores their private `status`.
-   `tracked_market_events`: Stores a user's private sales/cost logs for a specific date.
-   `message_board_posts`: Stores the public messages for each market.
-   `market_attributes` & `market_attribute_votes`: Manages the positive rating system.
-   `custom_statuses`: Stores user-defined statuses.

---

## 6. API Endpoint Reference (as of v1.0)

-   **Auth (`/api/auth`)**
    -   `POST /register`: Creates a new user.
    -   `POST /login`: Logs in a user and returns a JWT.
-   **Markets (`/api/markets`)**
    -   `GET /`: Get all public markets.
    -   `GET /:id`: Get a single market profile.
    -   `POST /`: Create a new market profile (requires auth).
-   **Message Board (`/api/markets/:marketId/messages`)**
    -   `GET /`: Get all messages for a market.
    -   `POST /`: Post a new message (requires auth).
-   **Ratings (`/api/markets/:marketId/attributes/:attributeId/vote`)**
    -   `POST /`: Records a vote for a market attribute (requires auth).

---

## 7. Getting Started

### 7.1. Local Development Setup
1.  **Clone the repository.**
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Set up environment variables:**
    *   Create a `.env` file in the project root.
    *   Copy the contents of `.env.example` (if present) or add the required variables (see `src/db/connection.js` for database variables and `src/services/auth.service.js` for `JWT_SECRET`).
4.  **Set up the database:**
    *   Ensure you have a local PostgreSQL server running.
    *   Update your `.env` file with your local database credentials.
    *   Run the migration to create the tables:
        ```bash
        npm run db:migrate
        ```
5.  **Run the application:**
    *   To run in development mode with auto-restarting:
        ```bash
        npm run dev
        ```
    *   The application should be available at `http://localhost:3000`.

### 7.2. Deployment
For deploying to a production environment like Namecheap, please refer to the detailed instructions in **`DEPLOYMENT.md`**.

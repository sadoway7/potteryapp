# Rumfor Market Tracker - Application Architecture

This document outlines the architecture of the Rumfor Market Tracker application. It is intended to be a living document that is updated as the application evolves. Its purpose is to ensure the codebase remains organized, modular, and easy to maintain.

## Guiding Principles

1.  **Modularity:** Functionality is broken down into small, single-purpose modules. This makes the code easier to understand, test, and refactor.
2.  **Separation of Concerns:** The application is divided into distinct layers (routes, controllers, services, models), each with a clear responsibility. This prevents business logic from leaking into the presentation layer, and database logic from leaking into the business layer.
3.  **Lightweight Stack:** The technology stack is chosen to be efficient and compatible with a standard Node.js shared hosting environment (like Namecheap).

## Directory Structure Overview

The project is structured to separate concerns into different directories.

-   **/public**: Contains all static assets that will be served directly to the client's browser.
    -   `/css`: Stylesheets (CSS files).
    -   `/js`: Client-side JavaScript files.
    -   `/images`: Static images (logos, icons, etc.).

-   **/src**: Contains all the application's source code.
    -   `/controllers`: Handles the incoming HTTP requests, validates input, and calls the appropriate service to handle the business logic. It then sends the response back to the client. **Controllers should not contain direct database access.**
    -   `/db`: Manages the database connection and holds migration files. This is the single source of truth for database schema and connectivity.
    -   `/middleware`: Contains Express middleware functions, such as authentication checks or logging.
    -   `/models`: Defines the data structures (schemas) for the database tables. This layer is responsible for how data is structured but not for querying it.
    -   `/routes`: Defines the API endpoints and maps them to the corresponding controller functions. This is the entry point for all API requests.
    -   `/services`: Contains the core business logic of the application. Services are called by controllers and are responsible for orchestrating data from models to perform specific tasks. **All database queries should be initiated from this layer.**
    -   `/utils`: Holds utility functions that can be reused across the application (e.g., date formatters, password hashing).
    -   `/views`: Contains the EJS template files used for server-side rendering of the UI.

-   **/tests**: Contains all the test files for the application.

-   **server.js**: The main entry point for the application. It initializes the Express server, sets up middleware, and starts listening for requests.

## Data Flow

A typical request-response cycle follows this pattern:

1.  **Request:** A client sends an HTTP request to an endpoint (e.g., `POST /api/markets`).
2.  **Routing (`/src/routes`):** The Express router matches the endpoint to a specific controller function.
3.  **Controller (`/src/controllers`):** The controller function receives the request. It extracts and validates data from the request body/params. It then calls a service function to perform the required action, passing the validated data.
4.  **Service (`/src/services`):** The service contains the business logic. It interacts with one or more database models to fetch or save data. For example, it might call the `Market` model to create a new market entry in the database.
5.  **Model (`/src/models`):** This layer defines the data schema but the actual query is executed by the service via the database connection.
6.  **Response:** The service returns data (or a success/error status) to the controller. The controller then formats this into an HTTP response and sends it back to the client (either as JSON for an API call or by rendering an EJS view).

This structured approach ensures that the application is robust, scalable, and easy for any developer to understand.

## Database Schema

The database is the backbone of the application. The schema is designed to be relational and expandable.

### Table: `users`

Stores user account information.

-   `id`: SERIAL PRIMARY KEY
-   `email`: VARCHAR(255) UNIQUE NOT NULL
-   `password_hash`: VARCHAR(255) NOT NULL
-   `created_at`: TIMESTAMPTZ DEFAULT NOW()

### Table: `markets`

Stores the public profiles for all markets. This is the central "template" for a market.

-   `id`: SERIAL PRIMARY KEY
-   `name`: VARCHAR(255) NOT NULL
-   `description`: TEXT
-   `address`: VARCHAR(255)
-   `latitude`: DECIMAL(9, 6)
-   `longitude`: DECIMAL(9, 6)
-   `contact_email`: VARCHAR(255)
-   `website`: VARCHAR(255)
-   `created_by_user_id`: INTEGER REFERENCES users(id)
-   `created_at`: TIMESTAMPTZ DEFAULT NOW()

### Table: `market_dates`

Stores recurring date/time information for a market.

-   `id`: SERIAL PRIMARY KEY
-   `market_id`: INTEGER REFERENCES markets(id) ON DELETE CASCADE
-   `day_of_week`: VARCHAR(20) -- e.g., "Saturday"
-   `start_time`: TIME
-   `end_time`: TIME
-   `season_start`: DATE
-   `season_end`: DATE

### Table: `market_attributes`

Stores the predefined positive attributes that vendors can vote on.

-   `id`: SERIAL PRIMARY KEY
-   `attribute_name`: VARCHAR(100) UNIQUE NOT NULL -- e.g., "Good for Crafts", "High Foot Traffic"

### Table: `market_attribute_votes`

A join table to track user votes on market attributes.

-   `id`: SERIAL PRIMARY KEY
-   `user_id`: INTEGER REFERENCES users(id) ON DELETE CASCADE
-   `market_id`: INTEGER REFERENCES markets(id) ON DELETE CASCADE
-   `attribute_id`: INTEGER REFERENCES market_attributes(id) ON DELETE CASCADE
-   UNIQUE (`user_id`, `market_id`, `attribute_id`)

### Table: `tracked_markets`

A user's private record of a market they are tracking.

-   `id`: SERIAL PRIMARY KEY
-   `user_id`: INTEGER REFERENCES users(id) ON DELETE CASCADE
-   `market_id`: INTEGER REFERENCES markets(id) ON DELETE CASCADE
-   `status`: VARCHAR(50) NOT NULL DEFAULT 'Interested' -- e.g., 'Interested', 'Application Sent', 'Approved', 'Complete', or a custom status
-   UNIQUE (`user_id`, `market_id`)

### Table: `custom_statuses`

Stores custom statuses created by users.

-   `id`: SERIAL PRIMARY KEY
-   `user_id`: INTEGER REFERENCES users(id) ON DELETE CASCADE
-   `status_name`: VARCHAR(50) NOT NULL
-   UNIQUE (`user_id`, `status_name`)

### Table: `tracked_market_events`

Stores the private logs for each day a vendor attends a market.

-   `id`: SERIAL PRIMARY KEY
-   `tracked_market_id`: INTEGER REFERENCES tracked_markets(id) ON DELETE CASCADE
-   `event_date`: DATE NOT NULL
-   `sales_total`: DECIMAL(10, 2)
-   `costs_total`: DECIMAL(10, 2)
-   `private_notes`: TEXT
-   `created_at`: TIMESTAMPTZ DEFAULT NOW()

### Table: `message_board_posts`

Stores posts for the public message board of each market.

-   `id`: SERIAL PRIMARY KEY
-   `market_id`: INTEGER REFERENCES markets(id) ON DELETE CASCADE
-   `user_id`: INTEGER REFERENCES users(id) ON DELETE CASCADE
-   `content`: TEXT NOT NULL
-   `parent_post_id`: INTEGER REFERENCES message_board_posts(id) ON DELETE CASCADE -- For threaded replies
-   `created_at`: TIMESTAMPTZ DEFAULT NOW()

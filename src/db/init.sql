-- Rumfor Market Tracker - Database Initialization Script

-- Drop tables in reverse order of creation to handle dependencies
DROP TABLE IF EXISTS message_board_posts;
DROP TABLE IF EXISTS tracked_market_events;
DROP TABLE IF EXISTS custom_statuses;
DROP TABLE IF EXISTS tracked_markets;
DROP TABLE IF EXISTS market_attribute_votes;
DROP TABLE IF EXISTS market_attributes;
DROP TABLE IF EXISTS market_dates;
DROP TABLE IF EXISTS markets;
DROP TABLE IF EXISTS users;

-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create markets table
CREATE TABLE markets (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    address VARCHAR(255),
    latitude DECIMAL(9, 6),
    longitude DECIMAL(9, 6),
    contact_email VARCHAR(255),
    website VARCHAR(255),
    created_by_user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create market_dates table
CREATE TABLE market_dates (
    id SERIAL PRIMARY KEY,
    market_id INTEGER REFERENCES markets(id) ON DELETE CASCADE,
    day_of_week VARCHAR(20),
    start_time TIME,
    end_time TIME,
    season_start DATE,
    season_end DATE
);

-- Create market_attributes table
CREATE TABLE market_attributes (
    id SERIAL PRIMARY KEY,
    attribute_name VARCHAR(100) UNIQUE NOT NULL
);

-- Create market_attribute_votes table
CREATE TABLE market_attribute_votes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    market_id INTEGER REFERENCES markets(id) ON DELETE CASCADE,
    attribute_id INTEGER REFERENCES market_attributes(id) ON DELETE CASCADE,
    UNIQUE (user_id, market_id, attribute_id)
);

-- Create tracked_markets table
CREATE TABLE tracked_markets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    market_id INTEGER REFERENCES markets(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'Interested',
    UNIQUE (user_id, market_id)
);

-- Create custom_statuses table
CREATE TABLE custom_statuses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    status_name VARCHAR(50) NOT NULL,
    UNIQUE (user_id, status_name)
);

-- Create tracked_market_events table
CREATE TABLE tracked_market_events (
    id SERIAL PRIMARY KEY,
    tracked_market_id INTEGER REFERENCES tracked_markets(id) ON DELETE CASCADE,
    event_date DATE NOT NULL,
    sales_total DECIMAL(10, 2),
    costs_total DECIMAL(10, 2),
    private_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create message_board_posts table
CREATE TABLE message_board_posts (
    id SERIAL PRIMARY KEY,
    market_id INTEGER REFERENCES markets(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    parent_post_id INTEGER REFERENCES message_board_posts(id) ON DELETE CASCADE, -- For threaded replies
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert some initial data for market attributes
INSERT INTO market_attributes (attribute_name) VALUES
('Good for Crafts'),
('High Foot Traffic'),
('Family Friendly'),
('Good for Produce'),
('Live Music'),
('Easy Parking');

-- Informative message
\echo 'Database schema created successfully.'

-- Initialize the database with required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create initial database if it doesn't exist
-- This is handled by the POSTGRES_DB environment variable
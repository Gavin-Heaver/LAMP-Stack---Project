/*
**  Database Schema for LAMP Stack Personal Contact Manager  **
**    Created by Daniela Cifuentes Cabrera  -- Group 20      **
*/

-- Create database if not existing so there's no error if schema is imported more than once  --
CREATE DATABASE IF NOT EXISTS contact_manager;
-- Select database so all tables created in it
USE contact_manager;


--  Users Table - stores account info for registered users  --
CREATE TABLE users
(
    -- user ID --
    id INT AUTO_INCREMENT PRIMARY KEY,

    -- personal info --
    firstName VARCHAR(50),
    lastName VARCHAR(50),

    -- login info --
    username VARCHAR(50) NOT NULL UNIQUE,
    -- password is hashed, length to support hashing algorithms
    password VARCHAR(255) NOT NULL
);


--  Contacts Table - stores unique contacts for users  --
CREATE TABLE contacts
(
    -- Unique contact ID --
    id INT AUTO_INCREMENT PRIMARY KEY,

    -- User ID of contact owner --
    userId INT NOT NULL,

    -- contact info --
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,

    -- Foreign Key Constraint for users, if user deleted all associated contacts deleted --
    CONSTRAINT fk_contacts_user
        FOREIGN KEY (userId)
        REFERENCES users(id)
        ON DELETE CASCADE
);

--  Index for search  --
--    queries are filtered by userId and lastName / firstName  --
CREATE INDEX idx_contacts_user_search
ON contacts (userId, lastName, firstName);
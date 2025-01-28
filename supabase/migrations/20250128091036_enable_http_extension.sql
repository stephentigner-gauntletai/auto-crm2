-- Migration: Enable HTTP Extension
-- Description: Enables the http extension required for making HTTP requests from database functions
-- Created at: 2025-01-28 09:10:36

-- Enable the http extension for making HTTP requests from database functions
create extension if not exists "http" with schema "extensions";

# IDX Exchange Property Search Platform

A Zillow-style real estate platform backed by real MLS property data.

## Project Objectives

- Property search with filters and pagination
- Property detail pages with photos, maps, and open house data
- A full REST API connecting a React frontend to a MySQL database

## Tech Stack

- Frontend: React (Create React App) 
- Backend: Node.js + Express 
- Database: MySQL 8 running in Docker 
- Testing: Jest + React Testing Library + Supertest 

## Current Progress
### Week 1: Environment Setup & Database Import 

- Docker Desktop installed 
- MySQL 8 container running with `rets` database
- `rets_property` and `rets_openhouse` tables imported and verified

### Week 2: Backend Foundation + REST API Basics

- Backend foundation
- Working health check endpoint

### Week 3: Property Search Endpoint with Filters & Indexing

- Property search endpoint
- Indexes exist and are being used
- Filter combinations work

### Week 4: Property Detail & Open House Endpoints
- Property by ID 
- Openhouses by property ID

### Week 5: React Setup & Listings Page
- Create React App
- Property grid shows cards with real data fetched from backend

### Week 6: Filter UI + Introduction to Testing
- Working filter form
- Introduction of Unit Test
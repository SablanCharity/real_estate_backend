# Real Estate Listing and Viewing Request Management System (Backend API)

A RESTful backend prototype built with **NestJS**, **TypeORM**, and **MySQL** for managing real estate property listings, user accounts, viewing requests, and status audit logs. Developed for **ITEC 116 – Systems Integration and Architecture 2**.

## Technology Stack
* **Framework:** NestJS (Node.js / TypeScript)
* **ORM:** TypeORM
* **Database:** MySQL (Laragon)
* **Authentication & Security:** Passport JWT, bcrypt, Role-Based Access Control (RBAC), class-validator

## Database Entities
* `users` – Stores Admin, Agent, and Customer accounts with hashed passwords
* `properties` – Real estate listings managed by Agents/Admins
* `property_images` – Image URLs linked to property listings
* `viewing_requests` – Property viewing appointments submitted by Customers
* `viewing_logs` – Automated audit trail of viewing request status updates

## Local Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/SablanCharity/real_estate_backend.git](https://github.com/SablanCharity/real_estate_backend.git)
   cd real_estate_backend
OdooSPIT_online: Modular Inventory Management System (IMS) - StockMaster

📜 Project Overview

StockMaster is a modular Inventory Management System designed to digitize and streamline all stock-related operations within a business. The primary goal is to replace manual registers, Excel sheets, and scattered tracking methods with a centralized, real-time, and easy-to-use application.

✨ Features

StockMaster offers a robust set of features to handle the full lifecycle of inventory management, from product creation to stock adjustment.

Core Inventory Operations

Feature

Description

Key Actions

Receipts (Incoming Stock)

Process goods arriving from vendors.

Create Receipt, Add Supplier/Products, Input Quantities, Validate (Increases stock).

Delivery Orders (Outgoing Stock)

Process stock leaving the warehouse for customer shipment (e.g., sales orders).

Pick Items, Pack Items, Validate (Decreases stock).

Internal Transfers

Move stock between locations within the company (e.g., Warehouse 1 → Warehouse 2, or Rack A → Rack B).

Log movement, Update location tracking (Total stock unchanged).

Stock Adjustments

Correct mismatches between recorded stock and physical count.

Select Product/Location, Enter Counted Quantity, System auto-updates and logs adjustment.

Product & Warehouse Management

Product Management: Create and update product details (Name, SKU/Code, Category, Unit of Measure). Track stock availability per location and set up reordering rules.

Multi-warehouse Support: Manage inventory across multiple warehouses and locations simultaneously.

Dashboard & Navigation

Real-time Dashboard: Provides a snapshot of all inventory operations upon login.

Key KPIs: Total Products in Stock, Low Stock / Out of Stock Items, Pending Receipts, Pending Deliveries, Internal Transfers Scheduled.

Dynamic Filters: Filter by document type (Receipts, Delivery, Internal, Adjustments), status (Draft, Waiting, Ready, Done, Canceled), warehouse/location, or product category.

Navigation Structure: Dedicated sections for Products, Operations (Receipts, Delivery, Adjustment, Move History), Dashboard, Settings, and Profile.

Additional Functionality

Low Stock Alerts: Automated alerts to notify managers when stock levels drop below predefined thresholds.

SKU Search & Smart Filters: Fast and efficient searching and filtering across the system.

Stock Ledger: Every movement (receipt, delivery, transfer, adjustment) is logged in a complete stock ledger for historical tracking and audit.

👥 Target Users

StockMaster is designed to serve the following key roles within a business:

Inventory Managers: Responsible for overall stock management, setting reordering rules, and monitoring KPIs.

Warehouse Staff: Responsible for physical operations, including performing transfers, picking items for delivery, shelving received goods, and cycle counting.

🔒 Authentication

The system uses a secure authentication flow:

User signs up or logs in.

Provides OTP-based password reset functionality.

Upon successful login, the user is redirected to the Inventory Dashboard.

🗺️ Inventory Flow Example

A simplified illustration of how stock moves through the system:

Receive Goods: Receive 100 kg of Steel from a vendor (Stock: +100).

Internal Transfer: Move the 100 kg from the Main Store to the Production Rack (Total Stock Unchanged, Location Updated).

Deliver Goods: Fulfill a sales order by delivering 20 kg of Steel (Stock: -20).

Adjust Damaged Items: Log 3 kg of damaged steel as a stock adjustment (Stock: -3).

All actions are automatically recorded in the Stock Ledger.

🛠️ How to Edit This Code

There are several straightforward ways to contribute to and modify this application.

1. Use Your Preferred Local IDE (Recommended)

To work locally using your own Integrated Development Environment (IDE), clone this repository and push your changes.

Prerequisite: Ensure you have Node.js and npm installed. You can use nvm (Node Version Manager) for easy installation and management.

Follow these steps to set up and run the project locally:

# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev

import axios from 'axios'
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api'
})

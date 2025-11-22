# Inventory Management System - Backend Architecture Guide

## Table of Contents
1. [System Overview](#system-overview)
2. [Architecture](#architecture)
3. [Database Schema](#database-schema)
4. [Project Structure](#project-structure)
5. [Models Explained](#models-explained)
6. [Controllers & Business Logic](#controllers--business-logic)
7. [Stock Management System](#stock-management-system)
8. [User Roles & Permissions](#user-roles--permissions)
9. [Data Flow](#data-flow)
10. [Setup Instructions](#setup-instructions)

---

## System Overview

The Inventory Management System (IMS) is a comprehensive solution designed to digitize and streamline all stock-related operations within a business. It replaces manual registers, Excel sheets, and scattered tracking methods with a centralized, real-time application.

### Key Features
- **Product Management**: Create and manage products with SKU, categories, and reorder levels
- **Receipt Management**: Track incoming stock from vendors
- **Delivery Management**: Manage outgoing stock to customers
- **Internal Transfers**: Move stock between warehouses
- **Stock Adjustments**: Correct inventory mismatches through physical counts
- **Real-time Dashboard**: KPI tracking and operational insights
- **Stock Ledger**: Complete audit trail of all movements
- **Multi-warehouse Support**: Manage multiple warehouse locations

---

## Architecture

### High-Level Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (React/Vue)                   │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP/REST API
┌──────────────────────▼──────────────────────────────────────┐
│                    Express.js Server                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Routes (Auth, Products, Receipts, etc.)            │  │
│  └──────────────────────────────────────────────────────┘  │
│                       ▼                                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Middleware (Auth, CORS, Error Handler)             │  │
│  └──────────────────────────────────────────────────────┘  │
│                       ▼                                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Controllers (Business Logic)                        │  │
│  └──────────────────────────────────────────────────────┘  │
│                       ▼                                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Utilities (Stock Manager, Document Generator)      │  │
│  └──────────────────────────────────────────────────────┘  │
│                       ▼                                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Models (Mongoose Schemas)                          │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────────┘
                       │ Mongoose ODM
┌──────────────────────▼──────────────────────────────────────┐
│              MongoDB Database                               │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **ODM**: Mongoose
- **Authentication**: JWT (with OTP support)
- **Encryption**: bcryptjs

---

## Database Schema

### Collections Overview
1. **Users** - System users with authentication
2. **Products** - Product catalog with pricing and reorder levels
3. **Warehouses** - Physical warehouse locations
4. **Suppliers** - Vendor information
5. **StockBalance** - Current stock levels per location
6. **StockLedger** - Complete audit trail
7. **Receipts** - Incoming stock records
8. **DeliveryOrders** - Outgoing stock records
9. **InternalTransfers** - Inter-warehouse movements
10. **StockAdjustments** - Physical count adjustments

### Relationship Diagram
```
User (1) ──── (M) Warehouse
         ├──── (M) Receipt (createdBy)
         ├──── (M) DeliveryOrder (createdBy)
         ├──── (M) InternalTransfer (createdBy)
         └──── (M) StockAdjustment (createdBy)

Product (1) ──── (M) StockBalance
         ├──── (M) StockLedger
         ├──── (M) Receipt (items)
         ├──── (M) DeliveryOrder (items)
         ├──── (M) InternalTransfer (items)
         └──── (M) StockAdjustment (items)

Warehouse (1) ──── (M) StockBalance
          ├──── (M) Receipt
          ├──── (M) DeliveryOrder
          ├──── (M) StockLedger
          └──── (M) InternalTransfer

Supplier (1) ──── (M) Product
        └──── (M) Receipt
```

---

## Project Structure

```
OdooSPIT_online/
├── server/
│   ├── config/
│   │   └── db.js                 # Database connection config
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   ├── productController.js  # Product management
│   │   ├── receiptController.js  # Receipt operations
│   │   ├── deliveryController.js # Delivery operations
│   │   ├── transferController.js # Transfer operations
│   │   ├── adjustmentController.js # Adjustment operations
│   │   ├── dashboardController.js  # Dashboard & reports
│   │   └── warehouseController.js  # Warehouse management
│   ├── middleware/
│   │   ├── authMiddleware.js     # Auth verification
│   │   ├── commonMiddleware.js   # CORS, logging
│   │   └── errorHandler.js       # Error handling
│   ├── models/
│   │   ├── User.js               # User schema
│   │   ├── Product.js            # Product schema
│   │   ├── Warehouse.js          # Warehouse schema
│   │   ├── Supplier.js           # Supplier schema
│   │   ├── StockBalance.js       # Current stock
│   │   ├── StockLedger.js        # Stock audit trail
│   │   ├── Receipt.js            # Receipt schema
│   │   ├── DeliveryOrder.js      # Delivery schema
│   │   ├── InternalTransfer.js   # Transfer schema
│   │   └── StockAdjustment.js    # Adjustment schema
│   ├── routes/
│   │   ├── authRoutes.js         # Auth endpoints
│   │   ├── productRoutes.js      # Product endpoints
│   │   ├── receiptRoutes.js      # Receipt endpoints
│   │   ├── deliveryRoutes.js     # Delivery endpoints
│   │   ├── transferRoutes.js     # Transfer endpoints
│   │   ├── adjustmentRoutes.js   # Adjustment endpoints
│   │   ├── dashboardRoutes.js    # Dashboard endpoints
│   │   └── warehouseRoutes.js    # Warehouse endpoints
│   ├── utils/
│   │   ├── documentGenerator.js  # Document number generation
│   │   ├── stockManager.js       # Stock update logic
│   │   ├── logger.js             # Logging utility
│   │   ├── validators.js         # Data validation
│   │   └── responseFormatter.js  # Response formatting
│   └── server.js                 # Main application entry
├── package.json
├── .env.example
└── README.md
```

---

## Models Explained

### 1. User Model
Manages system users with authentication.

**Fields:**
- `name`: User's full name
- `email`: Unique email for login
- `phone`: Contact number
- `password`: Hashed password (bcryptjs)
- `role`: One of ['inventory_manager', 'warehouse_staff', 'admin']
- `warehouse`: Reference to assigned warehouse
- `isActive`: Account status
- `otp`: OTP for password reset
- `otpExpire`: OTP expiration time

**Key Methods:**
- `matchPassword(password)`: Compare hashed passwords

---

### 2. Product Model
Central product catalog.

**Fields:**
- `name`: Product name
- `sku`: Unique SKU (uppercase)
- `description`: Product details
- `category`: Category classification
- `uom`: Unit of Measure (units, kg, liters, etc.)
- `reorderLevel`: Minimum stock to trigger reorder
- `reorderQuantity`: Quantity to order when below reorder level
- `maxStockLevel`: Maximum allowed stock
- `minimumStockLevel`: Minimum allowed stock
- `price`: Object with costPrice and sellingPrice
- `supplier`: Reference to supplier
- `isActive`: Product status

**Indexes:**
- SKU (unique)
- Category
- isActive

---

### 3. Warehouse Model
Physical warehouse locations.

**Fields:**
- `name`: Warehouse name
- `code`: Unique warehouse code
- `location`: Object with address, city, state, zipCode, country
- `inchargeUser`: User managing warehouse
- `capacity`: Object with totalCapacity, usedCapacity, unit
- `isActive`: Warehouse status

---

### 4. Supplier Model
Vendor information.

**Fields:**
- `name`: Supplier name
- `email`: Supplier email
- `phone`: Contact number
- `code`: Unique supplier code
- `contactPerson`: Primary contact
- `address`: Supplier address details
- `paymentTerms`: Payment terms
- `isActive`: Supplier status

---

### 5. StockBalance Model
Current stock snapshot per product per warehouse.

**Fields:**
- `product`: Reference to product
- `warehouse`: Reference to warehouse
- `currentStock`: Current quantity in stock
- `reservedStock`: Quantity reserved for orders
- `availableStock`: currentStock - reservedStock
- `lastUpdated`: Last update timestamp

**Indexes:**
- Composite unique index on (product, warehouse)

---

### 6. StockLedger Model
Complete audit trail of all stock movements.

**Fields:**
- `product`: Reference to product
- `warehouse`: Reference to warehouse
- `movementType`: One of ['inward', 'outward', 'transfer_out', 'transfer_in', 'adjustment', 'return']
- `quantity`: Movement quantity
- `reference`: Type of document (receipt, delivery, transfer, adjustment)
- `referenceId`: ID of the reference document
- `balanceBefore`: Stock before movement
- `balanceAfter`: Stock after movement
- `remark`: Additional notes
- `createdBy`: User who created entry
- `createdAt`: Timestamp

**Indexes:**
- Composite index on (product, warehouse, createdAt)

---

### 7. Receipt Model
Incoming stock from suppliers.

**Fields:**
- `receiptNumber`: Auto-generated unique number
- `supplier`: Reference to supplier
- `warehouse`: Destination warehouse
- `status`: One of ['draft', 'waiting', 'ready', 'done', 'canceled']
- `items`: Array of items received
  - `product`: Product reference
  - `quantityOrdered`: Ordered quantity
  - `quantityReceived`: Actual received quantity
  - `unit`: Unit of measure
  - `costPrice`: Cost per unit
- `purchaseOrderNumber`: PO reference
- `invoiceNumber`: Invoice reference
- `receivedDate`: Actual receipt date
- `expectedDate`: Expected delivery date
- `totalValue`: Total receipt value
- `createdBy`, `approvedBy`: User references

---

### 8. DeliveryOrder Model
Outgoing stock to customers.

**Fields:**
- `deliveryNumber`: Auto-generated unique number
- `customer`: Object with name, email, phone, address
- `warehouse`: Source warehouse
- `status`: One of ['draft', 'picking', 'packed', 'ready', 'done', 'canceled']
- `items`: Array with product, quantities at each stage
- `salesOrderNumber`: SO reference
- `expectedDeliveryDate`: Planned delivery date
- `deliveryDate`: Actual delivery date
- Tracking: `pickedBy`, `packedBy`, `deliveredBy` users
- `totalValue`: Total delivery value

---

### 9. InternalTransfer Model
Stock movements between warehouses.

**Fields:**
- `transferNumber`: Auto-generated unique number
- `fromWarehouse`, `toWarehouse`: Source and destination
- `status`: One of ['draft', 'ready', 'in_transit', 'received', 'canceled']
- `reason`: Transfer reason (production, rebalancing, consolidation, etc.)
- `items`: Array of products transferred
- `shippedDate`, `receivedDate`: Timeline dates
- `shippedBy`, `receivedBy`: User references

---

### 10. StockAdjustment Model
Corrections from physical counts.

**Fields:**
- `adjustmentNumber`: Auto-generated unique number
- `warehouse`: Target warehouse
- `status`: One of ['draft', 'ready', 'done', 'canceled']
- `adjustmentType`: One of ['physical_count', 'damage', 'loss', 'excess', 'return', 'correction']
- `items`: Array with recorded vs physical quantities
  - `recordedQuantity`: System quantity
  - `physicalQuantity`: Actual count
  - `difference`: Calculated difference
  - `reason`: Reason for difference
- `countingDate`: Date of physical count
- `approvedBy`: Approval user

---

## Controllers & Business Logic

### Auth Controller
Handles user authentication and authorization.

**Endpoints:**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/request-otp` - Request OTP for password reset
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/reset-password` - Reset password with OTP
- `GET /api/auth/me` - Get current user

**Key Features:**
- Password hashing with bcryptjs
- OTP-based password reset
- Role-based access control

---

### Product Controller
Manages product catalog.

**Endpoints:**
- `POST /api/products` - Create product
- `GET /api/products` - List products with filters
- `GET /api/products/:id` - Get product details
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Soft delete product
- `GET /api/products/stock/summary` - Stock summary

**Features:**
- SKU uniqueness validation
- Category filtering
- Stock availability per warehouse
- Search functionality

---

### Receipt Controller
Manages incoming stock.

**Endpoints:**
- `POST /api/receipts` - Create receipt
- `GET /api/receipts` - List receipts with filters
- `GET /api/receipts/:id` - Get receipt details
- `PUT /api/receipts/:id/receive` - Confirm receipt (updates stock)
- `PUT /api/receipts/:id` - Update receipt
- `DELETE /api/receipts/:id` - Cancel receipt

**Workflow:**
1. Create receipt (draft)
2. Add items
3. Confirm receipt (updates stock in StockBalance and StockLedger)
4. Items recorded in audit trail

---

### Delivery Controller
Manages outgoing stock.

**Endpoints:**
- `POST /api/deliveries` - Create delivery
- `GET /api/deliveries` - List deliveries
- `GET /api/deliveries/:id` - Get delivery details
- `PUT /api/deliveries/:id/pick` - Mark items as picked
- `PUT /api/deliveries/:id/pack` - Mark items as packed
- `PUT /api/deliveries/:id/deliver` - Confirm delivery (updates stock)
- `DELETE /api/deliveries/:id` - Cancel delivery

**Workflow:**
1. Create delivery order (draft)
2. Pick items (picking)
3. Pack items (packed)
4. Deliver items (done - updates stock)

---

### Transfer Controller
Manages internal transfers.

**Endpoints:**
- `POST /api/transfers` - Create transfer
- `GET /api/transfers` - List transfers
- `GET /api/transfers/:id` - Get transfer details
- `PUT /api/transfers/:id/ship` - Ship items
- `PUT /api/transfers/:id/receive` - Receive items
- `DELETE /api/transfers/:id` - Cancel transfer

**Workflow:**
1. Create transfer (draft)
2. Ship items (in_transit - updates stock at source)
3. Receive items (received - updates stock at destination)

---

### Adjustment Controller
Manages stock corrections.

**Endpoints:**
- `POST /api/adjustments` - Create adjustment
- `GET /api/adjustments` - List adjustments
- `GET /api/adjustments/:id` - Get adjustment details
- `PUT /api/adjustments/:id/approve` - Approve and apply
- `PUT /api/adjustments/:id` - Update adjustment
- `DELETE /api/adjustments/:id` - Cancel adjustment

**Workflow:**
1. Create adjustment with physical count (draft)
2. Approve adjustment (done - updates stock based on difference)

---

### Dashboard Controller
Provides analytics and reports.

**Endpoints:**
- `GET /api/dashboard/summary` - KPI summary
- `GET /api/dashboard/stock-movement` - Stock movement history
- `GET /api/dashboard/product-stock-history/:productId` - Product history
- `GET /api/dashboard/warehouse-stock` - Warehouse stock summary
- `GET /api/dashboard/operations-summary` - Operations breakdown

**KPIs Provided:**
- Total products in stock
- Low stock items
- Out of stock items
- Pending receipts/deliveries/transfers

---

## Stock Management System

### Stock Update Logic (stockManager.js)

#### 1. Receipt Stock Update
```
updateStockOnReceipt(product, warehouse, quantity, receiptId, userId)
├─ Fetch existing StockBalance
├─ Update: currentStock += quantity
├─ Create StockLedger entry (movementType: 'inward')
└─ Return updated balance
```

#### 2. Delivery Stock Update
```
updateStockOnDelivery(product, warehouse, quantity, deliveryId, userId)
├─ Fetch StockBalance
├─ Validate: currentStock >= quantity
├─ Update: currentStock -= quantity
├─ Create StockLedger entry (movementType: 'outward')
└─ Return updated balance
```

#### 3. Transfer Stock Update
```
updateStockOnTransfer(product, fromWh, toWh, quantity, transferId, userId)
├─ Reduce: fromWh.currentStock -= quantity
├─ Increase: toWh.currentStock += quantity
├─ Create 2 StockLedger entries (transfer_out, transfer_in)
└─ Return both updated balances
```

#### 4. Adjustment Stock Update
```
updateStockOnAdjustment(product, warehouse, difference, adjustmentId, userId)
├─ Fetch StockBalance
├─ Update: currentStock += difference
├─ Create StockLedger entry (movementType: 'adjustment')
└─ Return updated balance
```

### StockLedger Structure
Every movement creates a ledger entry with:
- Before/after balances for audit trail
- Reference to the document (Receipt/Delivery/Transfer/Adjustment)
- User who performed action
- Complete timestamp

---

## User Roles & Permissions

### Inventory Manager
- Create/update products
- Create receipts
- Approve receipts
- View all dashboards
- Manage warehouses

### Warehouse Staff
- View products
- Create delivery orders
- Pick/pack items
- Receive transfers
- Create adjustments

### Admin
- All permissions
- User management
- Warehouse management
- Configuration

---

## Data Flow

### Example: Complete Stock Journey

```
STEP 1: RECEIVE GOODS
├─ Create Receipt
│  └─ Supplier: Steel Vendor
│  └─ Product: Steel Rods
│  └─ Quantity: 100 kg
│  └─ Status: draft
├─ Confirm Receipt
│  └─ StockBalance Updated: 0 → 100
│  └─ StockLedger Entry:
│     ├─ movementType: inward
│     ├─ quantity: 100
│     ├─ balanceBefore: 0
│     └─ balanceAfter: 100

STEP 2: INTERNAL TRANSFER
├─ Create Transfer
│  ├─ From: Main Store
│  ├─ To: Production Floor
│  ├─ Product: Steel Rods
│  └─ Quantity: 50 kg
├─ Ship Transfer
│  └─ Main Store Balance: 100 → 50
│  └─ Production Floor Balance: 0 → 50
│  └─ 2 StockLedger Entries:
│     ├─ Main Store: transfer_out
│     └─ Production: transfer_in

STEP 3: DELIVERY TO CUSTOMER
├─ Create Delivery Order
│  ├─ Customer: ABC Corp
│  ├─ Product: Steel Rods
│  ├─ Quantity: 20 kg
│  └─ Status: draft
├─ Pick Items → Pack Items → Confirm Delivery
│  └─ Production Floor Balance: 50 → 30
│  └─ StockLedger Entry:
│     ├─ movementType: outward
│     ├─ quantity: 20
│     └─ balanceAfter: 30

STEP 4: ADJUST FOR DAMAGE
├─ Create Adjustment
│  ├─ Recorded: 30 kg
│  ├─ Physical Count: 27 kg
│  ├─ Difference: -3 kg
│  └─ Reason: Damage
├─ Approve Adjustment
│  └─ Production Floor Balance: 30 → 27
│  └─ StockLedger Entry:
│     ├─ movementType: adjustment
│     ├─ quantity: 3 (decrease)
│     └─ balanceAfter: 27

FINAL STATE:
Main Store: 50 kg
Production Floor: 27 kg
Total: 77 kg (100 received - 20 delivered - 3 damaged)
```

---

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

### Installation Steps

1. **Clone Repository**
```bash
git clone <repository-url>
cd OdooSPIT_online
```

2. **Install Dependencies**
```bash
npm install
```

3. **Configure Environment**
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/inventory-system
JWT_SECRET=your_secret_key_here
```

4. **Start Development Server**
```bash
npm run dev
```

Server will run on `http://localhost:5000`

5. **Health Check**
```bash
curl http://localhost:5000/api/health
```

### Database Connection
- MongoDB must be running
- Connection string in `.env` should match your setup
- Mongoose will auto-create collections on first insert

### Project Features
✅ Modular architecture
✅ Clean separation of concerns
✅ Comprehensive error handling
✅ Complete audit trail
✅ Real-time stock tracking
✅ Multi-warehouse support
✅ Role-based access control
✅ Production-ready code

---

## Next Steps
1. Implement JWT authentication properly
2. Add email notifications
3. Create frontend interfaces
4. Set up automated backups
5. Implement advanced reporting
6. Add inventory forecasting


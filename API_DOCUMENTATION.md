# Inventory Management System - API Documentation

## Table of Contents
1. [Getting Started](#getting-started)
2. [Authentication](#authentication)
3. [API Endpoints](#api-endpoints)
4. [Request/Response Examples](#requestresponse-examples)
5. [Error Handling](#error-handling)
6. [Testing Guide](#testing-guide)

---

## Getting Started

### Base URL
```
http://localhost:5000/api
```

### Headers
All requests (except auth endpoints) should include:
```
Content-Type: application/json
Authorization: Bearer <your_token>
```

### Response Format
All responses follow this format:
```json
{
  "success": true/false,
  "message": "Description",
  "data": { /* response data */ }
}
```

---

## Authentication

### 1. Register User

**Endpoint:** `POST /api/auth/register`

**Description:** Create a new user account

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "password": "SecurePass123",
  "role": "warehouse_staff"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "warehouse_staff"
    },
    "token": "token_507f1f77bcf86cd799439011_1234567890"
  }
}
```

**cURL:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "password": "SecurePass123",
    "role": "warehouse_staff"
  }'
```

---

### 2. Login User

**Endpoint:** `POST /api/auth/login`

**Description:** Authenticate user and get token

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "warehouse_staff"
    },
    "token": "token_507f1f77bcf86cd799439011_1234567890"
  }
}
```

**cURL:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

---

### 3. Request OTP

**Endpoint:** `POST /api/auth/request-otp`

**Description:** Request OTP for password reset

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "OTP sent successfully"
}
```

---

### 4. Verify OTP

**Endpoint:** `POST /api/auth/verify-otp`

**Description:** Verify OTP code

**Request Body:**
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "OTP verified successfully",
  "data": {
    "email": "john@example.com"
  }
}
```

---

### 5. Reset Password

**Endpoint:** `POST /api/auth/reset-password`

**Description:** Reset password with verified OTP

**Request Body:**
```json
{
  "email": "john@example.com",
  "otp": "123456",
  "newPassword": "NewSecurePass456"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

---

### 6. Get Current User

**Endpoint:** `GET /api/auth/me`

**Description:** Get authenticated user details

**Headers Required:** Yes (Bearer token)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "9876543210",
      "role": "warehouse_staff",
      "warehouse": "507f1f77bcf86cd799439012",
      "isActive": true
    }
  }
}
```

**cURL:**
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer token_507f1f77bcf86cd799439011_1234567890"
```

---

## API Endpoints

## WAREHOUSES

### 1. Create Warehouse

**Endpoint:** `POST /api/warehouses`

**Description:** Create a new warehouse

**Request Body:**
```json
{
  "name": "Main Store",
  "code": "MS001",
  "address": "123 Industrial Road",
  "city": "Mumbai",
  "state": "Maharashtra",
  "zipCode": "400001",
  "country": "India",
  "totalCapacity": 10000,
  "capacityUnit": "units",
  "inchargeUserId": "507f1f77bcf86cd799439011"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Warehouse created successfully",
  "data": {
    "warehouse": {
      "_id": "507f1f77bcf86cd799439013",
      "name": "Main Store",
      "code": "MS001",
      "location": {
        "address": "123 Industrial Road",
        "city": "Mumbai",
        "state": "Maharashtra",
        "zipCode": "400001",
        "country": "India"
      },
      "capacity": {
        "totalCapacity": 10000,
        "usedCapacity": 0,
        "unit": "units"
      },
      "isActive": true
    }
  }
}
```

**cURL:**
```bash
curl -X POST http://localhost:5000/api/warehouses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Main Store",
    "code": "MS001",
    "address": "123 Industrial Road",
    "city": "Mumbai",
    "state": "Maharashtra",
    "zipCode": "400001",
    "country": "India",
    "totalCapacity": 10000,
    "capacityUnit": "units"
  }'
```

---

### 2. Get All Warehouses

**Endpoint:** `GET /api/warehouses`

**Query Parameters:**
- `isActive` (optional): true/false

**Response (200):**
```json
{
  "success": true,
  "data": {
    "count": 2,
    "warehouses": [
      {
        "_id": "507f1f77bcf86cd799439013",
        "name": "Main Store",
        "code": "MS001",
        "location": { /* location data */ },
        "capacity": { /* capacity data */ },
        "isActive": true
      }
    ]
  }
}
```

**cURL:**
```bash
curl -X GET "http://localhost:5000/api/warehouses?isActive=true" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 3. Get Warehouse by ID

**Endpoint:** `GET /api/warehouses/:id`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "warehouse": {
      "_id": "507f1f77bcf86cd799439013",
      "name": "Main Store",
      "code": "MS001",
      /* warehouse details */
    }
  }
}
```

---

### 4. Update Warehouse

**Endpoint:** `PUT /api/warehouses/:id`

**Request Body:** (any warehouse fields except code)
```json
{
  "name": "Main Store Updated",
  "totalCapacity": 15000
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Warehouse updated successfully",
  "data": { /* updated warehouse */ }
}
```

---

### 5. Delete/Deactivate Warehouse

**Endpoint:** `DELETE /api/warehouses/:id`

**Response (200):**
```json
{
  "success": true,
  "message": "Warehouse deactivated successfully",
  "data": { /* warehouse with isActive: false */ }
}
```

---

## PRODUCTS

### 1. Create Product

**Endpoint:** `POST /api/products`

**Description:** Create a new product

**Request Body:**
```json
{
  "name": "Steel Rods",
  "sku": "STL-ROD-001",
  "description": "High quality steel rods",
  "category": "raw_material",
  "uom": "kg",
  "reorderLevel": 100,
  "reorderQuantity": 500,
  "maxStockLevel": 2000,
  "minimumStockLevel": 50,
  "costPrice": 150,
  "sellingPrice": 250
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "product": {
      "_id": "507f1f77bcf86cd799439014",
      "name": "Steel Rods",
      "sku": "STL-ROD-001",
      "category": "raw_material",
      "uom": "kg",
      "reorderLevel": 100,
      "reorderQuantity": 500,
      "maxStockLevel": 2000,
      "minimumStockLevel": 50,
      "price": {
        "costPrice": 150,
        "sellingPrice": 250
      },
      "isActive": true,
      "createdAt": "2024-11-22T10:30:00Z"
    }
  }
}
```

**cURL:**
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Steel Rods",
    "sku": "STL-ROD-001",
    "category": "raw_material",
    "uom": "kg",
    "reorderLevel": 100,
    "reorderQuantity": 500,
    "maxStockLevel": 2000,
    "minimumStockLevel": 50,
    "costPrice": 150,
    "sellingPrice": 250
  }'
```

---

### 2. Get All Products

**Endpoint:** `GET /api/products`

**Query Parameters:**
- `category` (optional): raw_material, finished_goods, spare_parts, consumables, others
- `isActive` (optional): true/false
- `search` (optional): Search by name or SKU

**Response (200):**
```json
{
  "success": true,
  "data": {
    "count": 10,
    "products": [
      {
        "_id": "507f1f77bcf86cd799439014",
        "name": "Steel Rods",
        "sku": "STL-ROD-001",
        "category": "raw_material",
        "stocks": [
          {
            "_id": "507f1f77bcf86cd799439015",
            "currentStock": 500,
            "warehouse": { /* warehouse details */ }
          }
        ]
      }
    ]
  }
}
```

**cURL:**
```bash
curl -X GET "http://localhost:5000/api/products?category=raw_material&isActive=true" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 3. Get Product by ID

**Endpoint:** `GET /api/products/:id`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "product": {
      "_id": "507f1f77bcf86cd799439014",
      "name": "Steel Rods",
      "sku": "STL-ROD-001",
      "stocks": [
        {
          "warehouse": "507f1f77bcf86cd799439013",
          "currentStock": 500,
          "availableStock": 450
        }
      ]
    }
  }
}
```

---

### 4. Update Product

**Endpoint:** `PUT /api/products/:id`

**Request Body:** (any field except sku)
```json
{
  "reorderLevel": 150,
  "reorderQuantity": 600
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": { /* updated product */ }
}
```

---

### 5. Delete Product (Soft Delete)

**Endpoint:** `DELETE /api/products/:id`

**Response (200):**
```json
{
  "success": true,
  "message": "Product deleted successfully",
  "data": { /* product with isActive: false */ }
}
```

---

### 6. Get Stock Summary

**Endpoint:** `GET /api/products/stock/summary`

**Query Parameters:**
- `warehouseId` (optional): Filter by warehouse

**Response (200):**
```json
{
  "success": true,
  "data": {
    "count": 10,
    "stocks": [
      {
        "_id": "507f1f77bcf86cd799439015",
        "product": {
          "_id": "507f1f77bcf86cd799439014",
          "name": "Steel Rods",
          "sku": "STL-ROD-001"
        },
        "warehouse": {
          "_id": "507f1f77bcf86cd799439013",
          "name": "Main Store"
        },
        "currentStock": 500,
        "availableStock": 450,
        "reservedStock": 50
      }
    ]
  }
}
```

---

## RECEIPTS (Incoming Stock)

### 1. Create Receipt

**Endpoint:** `POST /api/receipts`

**Description:** Create incoming goods receipt

**Request Body:**
```json
{
  "supplierId": "507f1f77bcf86cd799439016",
  "warehouseId": "507f1f77bcf86cd799439013",
  "expectedDate": "2024-11-25T00:00:00Z",
  "purchaseOrderNumber": "PO-2024-001",
  "invoiceNumber": "INV-2024-001",
  "items": [
    {
      "productId": "507f1f77bcf86cd799439014",
      "quantityOrdered": 100,
      "costPrice": 150
    }
  ],
  "notes": "First delivery"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Receipt created successfully",
  "data": {
    "receipt": {
      "_id": "507f1f77bcf86cd799439017",
      "receiptNumber": "RCP-202411-00001",
      "supplier": { /* supplier details */ },
      "warehouse": { /* warehouse details */ },
      "status": "draft",
      "items": [
        {
          "product": "507f1f77bcf86cd799439014",
          "quantityOrdered": 100,
          "quantityReceived": 0,
          "costPrice": 150
        }
      ],
      "totalValue": 15000,
      "createdAt": "2024-11-22T10:30:00Z"
    }
  }
}
```

**cURL:**
```bash
curl -X POST http://localhost:5000/api/receipts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "supplierId": "507f1f77bcf86cd799439016",
    "warehouseId": "507f1f77bcf86cd799439013",
    "expectedDate": "2024-11-25T00:00:00Z",
    "items": [
      {
        "productId": "507f1f77bcf86cd799439014",
        "quantityOrdered": 100,
        "costPrice": 150
      }
    ]
  }'
```

---

### 2. Get All Receipts

**Endpoint:** `GET /api/receipts`

**Query Parameters:**
- `status` (optional): draft, waiting, ready, done, canceled
- `warehouseId` (optional): Filter by warehouse
- `supplierId` (optional): Filter by supplier
- `fromDate` (optional): Start date (ISO format)
- `toDate` (optional): End date (ISO format)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "count": 5,
    "receipts": [
      {
        "_id": "507f1f77bcf86cd799439017",
        "receiptNumber": "RCP-202411-00001",
        "status": "draft",
        /* receipt details */
      }
    ]
  }
}
```

---

### 3. Get Receipt by ID

**Endpoint:** `GET /api/receipts/:id`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "receipt": { /* full receipt details */ }
  }
}
```

---

### 4. Confirm Receipt (Update Stock)

**Endpoint:** `PUT /api/receipts/:id/receive`

**Description:** Confirm receipt and update warehouse stock

**Request Body:**
```json
{
  "receivedItems": [
    {
      "itemId": "item_id_from_items_array",
      "quantityReceived": 100
    }
  ]
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Receipt confirmed and stock updated",
  "data": {
    "receipt": {
      "status": "done",
      "receivedDate": "2024-11-22T10:35:00Z",
      "approvedBy": "507f1f77bcf86cd799439011",
      "items": [
        {
          "quantityReceived": 100,
          /* other item data */
        }
      ]
    }
  }
}
```

**What happens:**
- StockBalance updated: currentStock += 100
- StockLedger entry created with movementType: 'inward'
- Receipt status changed to 'done'

**cURL:**
```bash
curl -X PUT http://localhost:5000/api/receipts/507f1f77bcf86cd799439017/receive \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "receivedItems": [
      {
        "itemId": "item_id",
        "quantityReceived": 100
      }
    ]
  }'
```

---

### 5. Update Receipt

**Endpoint:** `PUT /api/receipts/:id`

**Note:** Only draft receipts can be updated

**Response (200):**
```json
{
  "success": true,
  "message": "Receipt updated successfully"
}
```

---

### 6. Cancel Receipt

**Endpoint:** `DELETE /api/receipts/:id`

**Response (200):**
```json
{
  "success": true,
  "message": "Receipt canceled successfully"
}
```

---

## DELIVERIES (Outgoing Stock)

### 1. Create Delivery

**Endpoint:** `POST /api/deliveries`

**Request Body:**
```json
{
  "customer": {
    "name": "ABC Corporation",
    "email": "contact@abc.com",
    "phone": "9999999999",
    "address": "456 Commercial Plaza"
  },
  "warehouseId": "507f1f77bcf86cd799439013",
  "expectedDeliveryDate": "2024-11-26T00:00:00Z",
  "salesOrderNumber": "SO-2024-001",
  "items": [
    {
      "productId": "507f1f77bcf86cd799439014",
      "quantityOrdered": 50,
      "price": 250
    }
  ]
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Delivery order created successfully",
  "data": {
    "delivery": {
      "_id": "507f1f77bcf86cd799439018",
      "deliveryNumber": "DLV-202411-00001",
      "customer": { /* customer details */ },
      "status": "draft",
      "items": [
        {
          "product": "507f1f77bcf86cd799439014",
          "quantityOrdered": 50,
          "quantityPicked": 0,
          "quantityPacked": 0,
          "quantityDelivered": 0
        }
      ],
      "totalValue": 12500
    }
  }
}
```

---

### 2. Get All Deliveries

**Endpoint:** `GET /api/deliveries`

**Query Parameters:**
- `status`: draft, picking, packed, ready, done, canceled
- `warehouseId`: Filter by warehouse
- `fromDate`, `toDate`: Date range

---

### 3. Get Delivery by ID

**Endpoint:** `GET /api/deliveries/:id`

---

### 4. Pick Items

**Endpoint:** `PUT /api/deliveries/:id/pick`

**Description:** Mark items as picked from warehouse

**Request Body:**
```json
{
  "pickedItems": [
    {
      "itemId": "item_id",
      "quantityPicked": 50
    }
  ]
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Items marked as picked",
  "data": {
    "delivery": {
      "status": "picking",
      "pickingDate": "2024-11-22T11:00:00Z",
      "pickedBy": "507f1f77bcf86cd799439011"
    }
  }
}
```

---

### 5. Pack Items

**Endpoint:** `PUT /api/deliveries/:id/pack`

**Description:** Mark items as packed and ready for shipment

**Request Body:**
```json
{
  "packedItems": [
    {
      "itemId": "item_id",
      "quantityPacked": 50
    }
  ]
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Items marked as packed",
  "data": {
    "delivery": {
      "status": "packed",
      "packingDate": "2024-11-22T12:00:00Z",
      "packedBy": "507f1f77bcf86cd799439011"
    }
  }
}
```

---

### 6. Confirm Delivery (Update Stock)

**Endpoint:** `PUT /api/deliveries/:id/deliver`

**Description:** Confirm delivery and reduce warehouse stock

**Request Body:**
```json
{
  "deliveredItems": [
    {
      "itemId": "item_id",
      "quantityDelivered": 50
    }
  ]
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Delivery confirmed and stock updated",
  "data": {
    "delivery": {
      "status": "done",
      "deliveryDate": "2024-11-22T14:00:00Z",
      "deliveredBy": "507f1f77bcf86cd799439011"
    }
  }
}
```

**What happens:**
- StockBalance updated: currentStock -= 50
- StockLedger entry created with movementType: 'outward'
- Delivery status changed to 'done'

**cURL:**
```bash
curl -X PUT http://localhost:5000/api/deliveries/507f1f77bcf86cd799439018/deliver \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "deliveredItems": [
      {
        "itemId": "item_id",
        "quantityDelivered": 50
      }
    ]
  }'
```

---

### 7. Cancel Delivery

**Endpoint:** `DELETE /api/deliveries/:id`

---

## INTERNAL TRANSFERS

### 1. Create Transfer

**Endpoint:** `POST /api/transfers`

**Request Body:**
```json
{
  "fromWarehouseId": "507f1f77bcf86cd799439013",
  "toWarehouseId": "507f1f77bcf86cd799439019",
  "reason": "production",
  "expectedDate": "2024-11-24T00:00:00Z",
  "items": [
    {
      "productId": "507f1f77bcf86cd799439014",
      "quantityRequested": 50
    }
  ]
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Transfer created successfully",
  "data": {
    "transfer": {
      "_id": "507f1f77bcf86cd799439020",
      "transferNumber": "TRN-202411-00001",
      "fromWarehouse": { /* warehouse */ },
      "toWarehouse": { /* warehouse */ },
      "status": "draft",
      "reason": "production"
    }
  }
}
```

---

### 2. Get All Transfers

**Endpoint:** `GET /api/transfers`

**Query Parameters:**
- `status`: draft, ready, in_transit, received, canceled
- `fromWarehouseId`, `toWarehouseId`: Filter
- `reason`: production, rebalancing, consolidation, etc.

---

### 3. Get Transfer by ID

**Endpoint:** `GET /api/transfers/:id`

---

### 4. Ship Transfer

**Endpoint:** `PUT /api/transfers/:id/ship`

**Description:** Ship items from source warehouse

**Request Body:**
```json
{
  "shippedItems": [
    {
      "itemId": "item_id",
      "quantityShipped": 50
    }
  ]
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Items shipped and stock transferred",
  "data": {
    "transfer": {
      "status": "in_transit",
      "shippedDate": "2024-11-23T10:00:00Z"
    }
  }
}
```

**What happens:**
- Source warehouse: currentStock -= 50
- Destination warehouse: currentStock += 50
- 2 StockLedger entries (transfer_out, transfer_in)

**cURL:**
```bash
curl -X PUT http://localhost:5000/api/transfers/507f1f77bcf86cd799439020/ship \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "shippedItems": [
      {
        "itemId": "item_id",
        "quantityShipped": 50
      }
    ]
  }'
```

---

### 5. Receive Transfer

**Endpoint:** `PUT /api/transfers/:id/receive`

**Description:** Confirm receipt at destination warehouse

**Request Body:**
```json
{
  "receivedItems": [
    {
      "itemId": "item_id",
      "quantityReceived": 50
    }
  ]
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Transfer received successfully",
  "data": {
    "transfer": {
      "status": "received",
      "receivedDate": "2024-11-24T10:00:00Z"
    }
  }
}
```

---

### 6. Cancel Transfer

**Endpoint:** `DELETE /api/transfers/:id`

---

## STOCK ADJUSTMENTS

### 1. Create Adjustment

**Endpoint:** `POST /api/adjustments`

**Description:** Create adjustment from physical count

**Request Body:**
```json
{
  "warehouseId": "507f1f77bcf86cd799439013",
  "adjustmentType": "physical_count",
  "countingDate": "2024-11-22T00:00:00Z",
  "items": [
    {
      "productId": "507f1f77bcf86cd799439014",
      "recordedQuantity": 100,
      "physicalQuantity": 95,
      "reason": "damage"
    }
  ],
  "reason": "Monthly physical count"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Adjustment created successfully",
  "data": {
    "adjustment": {
      "_id": "507f1f77bcf86cd799439021",
      "adjustmentNumber": "ADJ-202411-00001",
      "status": "draft",
      "items": [
        {
          "product": "507f1f77bcf86cd799439014",
          "recordedQuantity": 100,
          "physicalQuantity": 95,
          "difference": -5
        }
      ]
    }
  }
}
```

---

### 2. Get All Adjustments

**Endpoint:** `GET /api/adjustments`

**Query Parameters:**
- `status`: draft, ready, done, canceled
- `warehouseId`: Filter by warehouse
- `adjustmentType`: physical_count, damage, loss, excess, return, correction
- `fromDate`, `toDate`: Date range

---

### 3. Get Adjustment by ID

**Endpoint:** `GET /api/adjustments/:id`

---

### 4. Approve Adjustment (Update Stock)

**Endpoint:** `PUT /api/adjustments/:id/approve`

**Description:** Approve and apply adjustment to stock

**Response (200):**
```json
{
  "success": true,
  "message": "Adjustment approved and stock updated",
  "data": {
    "adjustment": {
      "status": "done",
      "adjustedDate": "2024-11-22T15:00:00Z",
      "approvedBy": "507f1f77bcf86cd799439011"
    }
  }
}
```

**What happens:**
- For each item, difference is applied to stock
- StockBalance updated: currentStock += difference (negative if loss)
- StockLedger entry created with movementType: 'adjustment'

**cURL:**
```bash
curl -X PUT http://localhost:5000/api/adjustments/507f1f77bcf86cd799439021/approve \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 5. Update Adjustment

**Endpoint:** `PUT /api/adjustments/:id`

**Note:** Only draft adjustments can be updated

---

### 6. Cancel Adjustment

**Endpoint:** `DELETE /api/adjustments/:id`

---

## DASHBOARD & ANALYTICS

### 1. Get Dashboard Summary

**Endpoint:** `GET /api/dashboard/summary`

**Query Parameters:**
- `warehouseId` (optional): Get summary for specific warehouse

**Response (200):**
```json
{
  "success": true,
  "data": {
    "kpis": {
      "totalProducts": 25,
      "totalStockLocations": 12,
      "lowStockItems": 3,
      "outOfStockItems": 1,
      "pendingReceipts": 2,
      "pendingDeliveries": 4,
      "pendingTransfers": 1
    },
    "lowStockDetails": [
      {
        "product": { "name": "Steel Rods", "sku": "STL-ROD-001" },
        "currentStock": 80,
        "reorderLevel": 100,
        "warehouse": { "name": "Main Store" }
      }
    ],
    "outOfStockDetails": []
  }
}
```

**cURL:**
```bash
curl -X GET "http://localhost:5000/api/dashboard/summary?warehouseId=507f1f77bcf86cd799439013" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 2. Get Stock Movement

**Endpoint:** `GET /api/dashboard/stock-movement`

**Query Parameters:**
- `warehouseId` (optional): Filter by warehouse
- `movementType` (optional): inward, outward, transfer_out, transfer_in, adjustment
- `fromDate`, `toDate`: Date range

**Response (200):**
```json
{
  "success": true,
  "data": {
    "count": 15,
    "movements": [
      {
        "_id": "507f1f77bcf86cd799439022",
        "product": { "name": "Steel Rods" },
        "warehouse": { "name": "Main Store" },
        "movementType": "inward",
        "quantity": 100,
        "balanceBefore": 200,
        "balanceAfter": 300,
        "reference": "receipt",
        "createdAt": "2024-11-22T10:30:00Z",
        "createdBy": { "name": "John Doe" }
      }
    ]
  }
}
```

---

### 3. Get Product Stock History

**Endpoint:** `GET /api/dashboard/product-stock-history/:productId`

**Query Parameters:**
- `warehouseId` (optional): Filter by warehouse
- `fromDate`, `toDate`: Date range

**Response (200):**
```json
{
  "success": true,
  "data": {
    "product": {
      "id": "507f1f77bcf86cd799439014",
      "name": "Steel Rods",
      "sku": "STL-ROD-001"
    },
    "historyCount": 8,
    "history": [
      {
        "_id": "507f1f77bcf86cd799439022",
        "warehouse": { "name": "Main Store" },
        "movementType": "inward",
        "quantity": 100,
        "balanceBefore": 200,
        "balanceAfter": 300,
        "reference": "receipt",
        "createdAt": "2024-11-22T10:30:00Z"
      }
    ]
  }
}
```

---

### 4. Get Warehouse Stock

**Endpoint:** `GET /api/dashboard/warehouse-stock`

**Query Parameters:**
- `warehouseId` (optional): Get stock for specific warehouse

**Response (200):**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalItems": 15,
      "totalQuantity": 5000,
      "totalValue": 750000
    },
    "stocks": [
      {
        "_id": "507f1f77bcf86cd799439015",
        "product": {
          "name": "Steel Rods",
          "sku": "STL-ROD-001"
        },
        "warehouse": { "name": "Main Store" },
        "currentStock": 500,
        "reservedStock": 50,
        "availableStock": 450
      }
    ]
  }
}
```

---

### 5. Get Operations Summary

**Endpoint:** `GET /api/dashboard/operations-summary`

**Query Parameters:**
- `warehouseId` (optional): Filter by warehouse
- `fromDate`, `toDate`: Date range

**Response (200):**
```json
{
  "success": true,
  "data": {
    "receiptsByStatus": [
      { "_id": "done", "count": 10 },
      { "_id": "draft", "count": 2 }
    ],
    "deliveriesByStatus": [
      { "_id": "done", "count": 15 },
      { "_id": "picking", "count": 3 }
    ],
    "transfersByStatus": [
      { "_id": "received", "count": 5 },
      { "_id": "in_transit", "count": 1 }
    ],
    "adjustmentsByStatus": [
      { "_id": "done", "count": 8 }
    ]
  }
}
```

---

## Error Handling

### Common Error Responses

**400 Bad Request**
```json
{
  "success": false,
  "message": "Please provide all required fields"
}
```

**401 Unauthorized**
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

**404 Not Found**
```json
{
  "success": false,
  "message": "Resource not found"
}
```

**500 Internal Server Error**
```json
{
  "success": false,
  "message": "Server Error"
}
```

---

## Testing Guide

### Using Postman

1. **Import Collection**
   - Create new collection "IMS"
   - Add the endpoints below

2. **Set Environment Variables**
   ```
   base_url: http://localhost:5000/api
   token: (populated after login)
   warehouseId: (get from warehouse creation)
   productId: (get from product creation)
   ```

3. **Test Sequence**

   **Step 1: Register User**
   ```
   POST {{base_url}}/auth/register
   Body: {
     "name": "Test User",
     "email": "test@example.com",
     "phone": "9876543210",
     "password": "Test123",
     "role": "inventory_manager"
   }
   ```

   **Step 2: Login**
   ```
   POST {{base_url}}/auth/login
   Body: {
     "email": "test@example.com",
     "password": "Test123"
   }
   Save response token to {{token}}
   ```

   **Step 3: Create Warehouse**
   ```
   POST {{base_url}}/warehouses
   Headers: Authorization: Bearer {{token}}
   Body: {
     "name": "Main Store",
     "code": "MS001",
     "address": "123 Road",
     "city": "Mumbai",
     "state": "Maharashtra",
     "zipCode": "400001",
     "totalCapacity": 10000
   }
   Save warehouse ID to {{warehouseId}}
   ```

   **Step 4: Create Product**
   ```
   POST {{base_url}}/products
   Headers: Authorization: Bearer {{token}}
   Body: {
     "name": "Steel Rods",
     "sku": "STL-ROD-001",
     "category": "raw_material",
     "uom": "kg",
     "reorderLevel": 100,
     "reorderQuantity": 500,
     "maxStockLevel": 2000,
     "minimumStockLevel": 50,
     "costPrice": 150,
     "sellingPrice": 250
   }
   Save product ID to {{productId}}
   ```

   **Step 5: Create Receipt**
   ```
   POST {{base_url}}/receipts
   Headers: Authorization: Bearer {{token}}
   Body: {
     "supplierId": "SUPPLIER_ID",
     "warehouseId": "{{warehouseId}}",
     "expectedDate": "2024-11-25T00:00:00Z",
     "items": [{
       "productId": "{{productId}}",
       "quantityOrdered": 100,
       "costPrice": 150
     }]
   }
   Save receipt ID
   ```

   **Step 6: Confirm Receipt**
   ```
   PUT {{base_url}}/receipts/RECEIPT_ID/receive
   Headers: Authorization: Bearer {{token}}
   Body: {
     "receivedItems": [{
       "itemId": "ITEM_ID",
       "quantityReceived": 100
     }]
   }
   Stock updated: 0 → 100
   ```

   **Step 7: Create Delivery**
   ```
   POST {{base_url}}/deliveries
   Headers: Authorization: Bearer {{token}}
   Body: {
     "customer": {
       "name": "ABC Corp",
       "email": "contact@abc.com",
       "phone": "9999999999",
       "address": "456 Plaza"
     },
     "warehouseId": "{{warehouseId}}",
     "expectedDeliveryDate": "2024-11-26T00:00:00Z",
     "items": [{
       "productId": "{{productId}}",
       "quantityOrdered": 50,
       "price": 250
     }]
   }
   Save delivery ID
   ```

   **Step 8: Pick Items**
   ```
   PUT {{base_url}}/deliveries/DELIVERY_ID/pick
   Headers: Authorization: Bearer {{token}}
   Body: {
     "pickedItems": [{
       "itemId": "ITEM_ID",
       "quantityPicked": 50
     }]
   }
   ```

   **Step 9: Pack Items**
   ```
   PUT {{base_url}}/deliveries/DELIVERY_ID/pack
   Headers: Authorization: Bearer {{token}}
   Body: {
     "packedItems": [{
       "itemId": "ITEM_ID",
       "quantityPacked": 50
     }]
   }
   ```

   **Step 10: Confirm Delivery**
   ```
   PUT {{base_url}}/deliveries/DELIVERY_ID/deliver
   Headers: Authorization: Bearer {{token}}
   Body: {
     "deliveredItems": [{
       "itemId": "ITEM_ID",
       "quantityDelivered": 50
     }]
   }
   Stock updated: 100 → 50
   ```

   **Step 11: Check Dashboard**
   ```
   GET {{base_url}}/dashboard/summary?warehouseId={{warehouseId}}
   Headers: Authorization: Bearer {{token}}
   ```

### Using cURL

Complete end-to-end flow:

```bash
# 1. Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","phone":"9876543210","password":"Test123"}'

# 2. Login
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test123"}' | jq -r '.data.token')

# 3. Create warehouse
WAREHOUSE=$(curl -s -X POST http://localhost:5000/api/warehouses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Store","code":"S1","address":"123 Rd","city":"Mumbai","state":"MH","zipCode":"400001","totalCapacity":10000}' | jq -r '.data.warehouse._id')

# 4. Create product
PRODUCT=$(curl -s -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Steel","sku":"STL001","category":"raw_material","uom":"kg","reorderLevel":100,"reorderQuantity":500,"maxStockLevel":2000,"minimumStockLevel":50,"costPrice":150,"sellingPrice":250}' | jq -r '.data.product._id')

echo "Token: $TOKEN"
echo "Warehouse ID: $WAREHOUSE"
echo "Product ID: $PRODUCT"
```

---

## Quick Reference

### Status Transitions

**Receipt:** draft → done → (final)
**Delivery:** draft → picking → packed → done → (final)
**Transfer:** draft → in_transit → received → (final)
**Adjustment:** draft → done → (final)

### Movement Types in Stock Ledger
- `inward`: Incoming stock (from receipt)
- `outward`: Outgoing stock (from delivery)
- `transfer_out`: Stock leaving warehouse
- `transfer_in`: Stock arriving at warehouse
- `adjustment`: Correction from physical count
- `return`: Returned goods

### Always Check
- Stock availability before delivery/transfer
- Reorder levels after each operation
- Audit trail in StockLedger
- Dashboard KPIs for low stock alerts


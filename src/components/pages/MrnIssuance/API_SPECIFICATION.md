# MRN Issuance - API Endpoints Specification

## Base URL

```
{API_BASE_URL}/api
```

## Authentication

All endpoints require Bearer token authentication:

```
Authorization: Bearer {token}
```

---

## 1. Get MRN Details

**Endpoint:** `GET /mrns/{id}`

**Description:** Retrieves MRN details including all material line items. Used to load MRN for issuance.

**Path Parameters:**

- `id` (string, required): MRN ID

**Response (200 OK):**

```json
{
  "data": {
    "id": "MRN-001",
    "status": "finalized",
    "warehouse_id": "WH-001",
    "batch_id": "BATCH-001",
    "batch": {
      "batch_no": "B2024-001",
      "id": "BATCH-001"
    },
    "warehouse": {
      "name": "Main Warehouse",
      "id": "WH-001"
    },
    "details": [
      {
        "id": "MRN-DTL-001",
        "stock_item_id": "MAT-001",
        "qty": 100,
        "stock_item": {
          "name": "Cotton Fabric",
          "id": "MAT-001"
        }
      }
    ]
  }
}
```

**Error Responses:**

- `404 Not Found`: MRN not found
- `401 Unauthorized`: Invalid or missing token

---

## 2. Get Inventory Balance

**Endpoint:** `GET /inventory/balance`

**Description:** Gets available balance for a specific material at a specific location.

**Query Parameters:**

- `location_id` (string, required): Location identifier
- `stock_item_id` (string, required): Stock item/material identifier

**Example Request:**

```
GET /inventory/balance?location_id=LOC-A1-01&stock_item_id=MAT-001
```

**Response (200 OK):**

```json
{
  "available_balance": 250,
  "location_id": "LOC-A1-01",
  "stock_item_id": "MAT-001",
  "stock_item_name": "Cotton Fabric",
  "uom": "meters"
}
```

**Error Responses:**

- `404 Not Found`: Location or stock item not found
- `400 Bad Request`: Missing required parameters

---

## 3. Issue Transaction

**Endpoint:** `POST /mrn-issuance/issue`

**Description:** Creates an issuance transaction for a specific MRN detail line item.

**Request Body:**

```json
{
  "mrn_detail_id": "MRN-DTL-001",
  "location_id": "LOC-A1-01",
  "qty": 50
}
```

**Validations:**

- MRN must be finalized (status != "open")
- Quantity must be > 0
- Quantity must not exceed available balance at location
- Location must have the specified material
- MRN detail must not already be issued

**Response (201 Created):**

```json
{
  "message": "Transaction issued successfully",
  "data": {
    "issuance_id": "ISS-001",
    "mrn_detail_id": "MRN-DTL-001",
    "location_id": "LOC-A1-01",
    "qty": 50,
    "issued_at": "2024-03-11T10:30:00Z",
    "issued_by": "USER-001"
  }
}
```

**Error Responses:**

- `400 Bad Request`: Validation failed
  ```json
  {
    "error": "Quantity exceeds available balance",
    "available": 30,
    "requested": 50
  }
  ```
- `404 Not Found`: MRN detail not found
- `409 Conflict`: Transaction already issued

---

## 4. Delete Issued Transaction

**Endpoint:** `DELETE /mrn-issuance/delete/{mrn_detail_id}`

**Description:** Deletes an issued transaction. Only allowed if parent MRN issuance is not completed.

**Path Parameters:**

- `mrn_detail_id` (string, required): MRN detail line item ID

**Validations:**

- Transaction must exist
- Parent issuance must not be completed
- Must restore inventory balance at location

**Response (200 OK):**

```json
{
  "message": "Transaction deleted successfully",
  "mrn_detail_id": "MRN-DTL-001",
  "restored_qty": 50,
  "location_id": "LOC-A1-01"
}
```

**Error Responses:**

- `404 Not Found`: Transaction not found
- `403 Forbidden`: Cannot delete - issuance already completed
  ```json
  {
    "error": "Cannot delete transactions after issuance completion"
  }
  ```

---

## 5. Complete MRN Issuance

**Endpoint:** `POST /mrn-issuance/complete`

**Description:** Marks the MRN issuance as completed. After this, transactions cannot be deleted.

**Request Body:**

```json
{
  "mrn_id": "MRN-001"
}
```

**Validations:**

- MRN must exist and be finalized
- At least one transaction must be issued
- Cannot complete if already completed

**Response (200 OK):**

```json
{
  "message": "MRN Issuance completed successfully",
  "mrn_id": "MRN-001",
  "completed_at": "2024-03-11T10:45:00Z",
  "completed_by": "USER-001",
  "total_transactions": 3,
  "total_qty_issued": 150
}
```

**Error Responses:**

- `400 Bad Request`: No transactions issued
  ```json
  {
    "error": "Cannot complete issuance with no transactions"
  }
  ```
- `404 Not Found`: MRN not found
- `409 Conflict`: Already completed

---

## 6. Search MRN for Issuance

**Endpoint:** `POST /mrn-issuance/search`

**Description:** Search for MRNs that can be issued (advance search functionality).

**Request Body:**

```json
{
  "mrn_id": "MRN-001",
  "batch_no": "B2024",
  "warehouse_name": "Main",
  "status": "finalized"
}
```

**Note:** All fields are optional. Empty string means "any value".

**Response (200 OK):**

```json
[
  {
    "id": "MRN-001",
    "batch": {
      "batch_no": "B2024-001"
    },
    "warehouse": {
      "name": "Main Warehouse"
    },
    "status": "finalized",
    "created_at": "2024-03-10T08:00:00Z"
  }
]
```

---

## Database Schema Suggestions

### Table: `mrn_issuances`

```sql
CREATE TABLE mrn_issuances (
  id VARCHAR(50) PRIMARY KEY,
  mrn_id VARCHAR(50) NOT NULL,
  status VARCHAR(20) DEFAULT 'open', -- 'open', 'completed'
  completed_at TIMESTAMP NULL,
  completed_by VARCHAR(50) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(50),
  FOREIGN KEY (mrn_id) REFERENCES mrns(id)
);
```

### Table: `mrn_issuance_transactions`

```sql
CREATE TABLE mrn_issuance_transactions (
  id VARCHAR(50) PRIMARY KEY,
  mrn_issuance_id VARCHAR(50) NOT NULL,
  mrn_detail_id VARCHAR(50) NOT NULL,
  location_id VARCHAR(50) NOT NULL,
  stock_item_id VARCHAR(50) NOT NULL,
  qty INT NOT NULL,
  issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  issued_by VARCHAR(50),
  deleted_at TIMESTAMP NULL,
  deleted_by VARCHAR(50) NULL,
  FOREIGN KEY (mrn_issuance_id) REFERENCES mrn_issuances(id),
  FOREIGN KEY (mrn_detail_id) REFERENCES mrn_details(id),
  FOREIGN KEY (location_id) REFERENCES locations(id),
  FOREIGN KEY (stock_item_id) REFERENCES stock_items(id)
);
```

---

## Business Logic Notes

### Inventory Updates

1. **On Issue Transaction:**
   - Deduct quantity from `location_id` inventory
   - Update `inventory_transactions` table
   - Mark MRN detail as issued

2. **On Delete Transaction:**
   - Add quantity back to `location_id` inventory
   - Create reversal entry in `inventory_transactions`
   - Mark MRN detail as not issued

3. **On Complete Issuance:**
   - Create/update `mrn_issuance` record with status "completed"
   - Record completion timestamp and user
   - Prevent further modifications

### Validation Rules

- MRN status must be "finalized" (not "open")
- Cannot issue more than available balance at location
- Cannot delete transactions after issuance completion
- Must have at least one transaction to complete issuance
- Each MRN detail can only be issued once (unless deleted first)

### Concurrency Handling

- Use database transactions for inventory updates
- Lock inventory records during balance checks and updates
- Handle race conditions in quantity validation

---

## Testing Example

### cURL Example - Issue Transaction

```bash
curl -X POST https://api.example.com/api/mrn-issuance/issue \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "mrn_detail_id": "MRN-DTL-001",
    "location_id": "LOC-A1-01",
    "qty": 50
  }'
```

### Postman Collection

Consider creating a Postman collection with all endpoints and example requests for testing.

---

## Security Considerations

1. **Authorization:**
   - Verify user has permission for "mrn_issuance" screen
   - Check user's warehouse access rights
   - Audit all transactions with user ID and timestamp

2. **Input Validation:**
   - Sanitize all inputs to prevent SQL injection
   - Validate data types and ranges
   - Check for special characters in IDs

3. **Rate Limiting:**
   - Implement rate limits to prevent abuse
   - Consider throttling for scanning operations

---

## Performance Optimization

1. **Indexing:**
   - Index on `mrn_id`, `location_id`, `stock_item_id`
   - Composite index on `(location_id, stock_item_id)` for balance queries

2. **Caching:**
   - Cache MRN details for frequently accessed records
   - Cache inventory balances with short TTL (1-5 minutes)

3. **Bulk Operations:**
   - Consider adding bulk issue endpoint for multiple transactions
   - Use database batch inserts for better performance

---

## Error Code Reference

| Code | Description                                      |
| ---- | ------------------------------------------------ |
| 400  | Bad Request - Validation failed                  |
| 401  | Unauthorized - Invalid/missing token             |
| 403  | Forbidden - Operation not allowed                |
| 404  | Not Found - Resource doesn't exist               |
| 409  | Conflict - State conflict (already issued, etc.) |
| 500  | Internal Server Error                            |

---

## Change Log

| Date       | Version | Changes                   |
| ---------- | ------- | ------------------------- |
| 2024-03-11 | 1.0     | Initial API specification |

---

## Contact

For questions or clarifications about these API endpoints, contact the backend development team.

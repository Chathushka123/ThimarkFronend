# Thimark ERP System — User Guide

**Version:** 2.0  
**Date:** May 12, 2026  
**Audience:** All System Users

---

## Table of Contents

1. [Getting Started](#1-getting-started)
2. [Suppliers](#2-suppliers)
3. [Materials (Stock Items)](#3-materials-stock-items)
4. [Models & Products](#4-models--products)
5. [Warehouses & Locations](#5-warehouses--locations)
6. [Batch Planning](#6-batch-planning)
7. [Purchase Orders](#7-purchase-orders)
8. [Goods Receipt Note (GRN)](#8-goods-receipt-note-grn)
9. [GRN Confirmation](#9-grn-confirmation)
10. [Material Requisition Note (MRN)](#10-material-requisition-note-mrn)
11. [MRN Issuance](#11-mrn-issuance)
12. [Stock Transfer](#12-stock-transfer)
13. [Returnable Items](#13-returnable-items)
14. [Invoice](#14-invoice)
15. [Inventory Dashboard](#15-inventory-dashboard)
16. [Reports](#16-reports)
17. [User Administration](#17-user-administration)
18. [Troubleshooting](#18-troubleshooting)
19. [Quick Reference](#19-quick-reference)

---

## 1. Getting Started

### 1.1 Logging In

1. Open your browser (Chrome, Firefox, or Edge recommended)
2. Go to the system URL provided by your administrator
3. Enter your **Email Address** and **Password**
4. Click **Login**

> **First Login?** You will receive temporary credentials from your administrator. Change your password immediately after first login via **User Profile → Change Password**.

**Password Rules:**
- Minimum 8 characters
- Mix of letters and numbers
- Change every 90 days

---

### 1.2 Screen Layout

```
┌──────────────────────────────────────────────────────────────┐
│  [Logo / Home]                      [Your Name]  [Logout]   │  ← Top Bar
├────────────────┬─────────────────────────────────────────────┤
│                │                                             │
│  Dashboard     │                                             │
│  Suppliers     │                                             │
│  Purchase Ord  │          MAIN WORK AREA                     │
│  GRN           │      (Forms, Tables, Report Grids)         │
│  GRN Confirm   │                                             │
│  MRN           │                                             │
│  MRN Issuance  │                                             │
│  Stock Transf  │                                             │
│  Returnables   │                                             │
│  Inventory     │                                             │
│  Materials     │                                             │
│  Models        │                                             │
│  Batches       │                                             │
│  Warehouses    │                                             │
│  Invoice       │                                             │
│  Reports       │                                             │
│  Admin         │                                             │
│                │                                             │
└────────────────┴─────────────────────────────────────────────┘
     ↑ Side Menu (click ☰ to collapse/expand)
```

---

### 1.3 Common Buttons

| Button | What It Does |
|--------|--------------|
| **New** | Clear the form to create a new record |
| **Save** | Save the current record |
| **Delete** | Delete the current record |
| **Search** | Open the advanced search window |
| **Populate** | Reload/refresh data from the server |
| **Refresh** | Refresh the current list or grid |
| **Print** | Print or export the current record |

---

### 1.4 Status Messages

| Color | Meaning |
|-------|---------|
| 🟢 Green | Action was successful |
| 🟡 Yellow | Warning — review before continuing |
| 🔴 Red | Error — action did not complete |
| 🔵 Blue | Information only |

---

### 1.5 Required Fields

Fields marked with a **red asterisk ( * )** are mandatory. You cannot save until all required fields are filled.

---

### 1.6 Unsaved Changes Warning

If you navigate away from a page with unsaved changes, the browser will prompt you to confirm. Always **Save** before switching to another page.

---

## 2. Suppliers

**Who uses this:** Procurement Officers, Administrators

Suppliers are the vendors you purchase raw materials from. Every Purchase Order is linked to a supplier.

---

### 2.1 View All Suppliers

1. Click **Suppliers** in the left menu
2. The grid lists all registered suppliers with their name, address, contact number, and email

---

### 2.2 Add a New Supplier

1. Click **Suppliers** in the left menu
2. Fill in the form at the top of the page:

| Field | Required | Notes |
|-------|----------|-------|
| Supplier Name | ✅ Yes | Full legal or trading name |
| Address | No | Physical or postal address |
| Contact No | No | Phone number including country code if applicable |
| Email | No | Business email used for PO communication |

3. Click **Save**
4. The new supplier appears immediately in the grid below

---

### 2.3 Edit a Supplier

1. Find the supplier in the grid
2. Click the **Edit** (pencil) icon on the row
3. The form at the top fills with the supplier's current data
4. Update the necessary fields
5. Click **Save**

---

### 2.4 Delete a Supplier

1. Find the supplier in the grid
2. Click the **Delete** (trash) icon on the row
3. Confirm when prompted

> ⚠️ **Warning:** Do not delete suppliers that are linked to existing Purchase Orders. Set them as inactive instead by adding "(INACTIVE)" to their name.

---

## 3. Materials (Stock Items)

**Who uses this:** Inventory Controllers, Warehouse Managers, Production Planners

Materials are all raw materials and consumables tracked in your warehouses.

---

### 3.1 Create a New Material

1. Click **Materials** in the left menu
2. Click **New**
3. Fill in the form:

| Field | Required | Notes |
|-------|----------|-------|
| Material Code | ✅ Yes | Unique code, e.g. `FAB-001` |
| Material Name | ✅ Yes | Clear, descriptive name |
| Category | ✅ Yes | Material / Consumable / Returnable |
| Unit of Measurement (UOM) | ✅ Yes | Meters, Pieces, Kilograms, etc. |
| Supplier | No | Primary supplier |
| Lead Time (days) | No | Days to receive from order |
| Minimum Quantity | No | Reorder trigger level |
| Unit Price | No | Cost per unit |

4. Click **Save**

**Category Guide:**
- **Material** — Raw production inputs (fabrics, leather, yarn)
- **Consumable** — Used up in production (needles, thread, oil)
- **Returnable** — Reusable items (hangers, racks, pallets)

---

### 3.2 Search for a Material

**Method 1 — Advanced Search (🔍):**
1. Click the Search icon
2. Enter any known detail (code, name, or supplier)
3. Click **OK** — results appear in the grid
4. Click a row to load the material

**Method 2 — Browse the Grid:**
1. Scroll through the materials grid
2. Click the **Edit** icon on any row

> **Tip:** Leave all fields blank to return all records. Partial text works — type `fab` to find all fabrics.

---

### 3.3 Edit a Material

1. Search for and open the material
2. Update the required fields
3. Click **Save**

> ⚠️ Do not change the Material Code after creation — it is referenced throughout the system.

---

### 3.4 Material Coding Standards

```
Format:   [Prefix]-[Number]

FAB-001   Fabrics
BTN-001   Buttons
ZIP-001   Zippers
TRD-001   Threads
PKG-001   Packaging
ELS-001   Elastics
LBL-001   Labels
```

---

## 4. Models & Products

**Who uses this:** Production Planners, Warehouse Managers

A **Model** defines a specific product you manufacture — the sizes it comes in and the materials needed to make one unit.

---

### 4.1 Model Structure

```
Main Model  (Style / Design)
├── Model A  (Colour Variant 1 — with material consumption)
└── Model B  (Colour Variant 2 — with material consumption)
```

---

### 4.2 Create a Main Model

1. Click **Models** in the left menu
2. In the **Main Model** section:
   - Enter the **Main Model Name** (e.g., `Classic T-Shirt`)
   - Enter sizes separated by commas, no spaces (e.g., `S,M,L,XL`)
3. Click **Save**

**Size Format Examples:**

| Product Type | Format | Example |
|---|---|---|
| General Apparel | Letters | `S,M,L,XL,XXL` |
| Trousers / Jeans | Numbers | `28,30,32,34,36` |
| Kids Wear | Age | `2Y,4Y,6Y,8Y` |
| Footwear | Shoe Size | `6,7,8,9,10,11` |

---

### 4.3 Create a Model (Product Variant)

1. Select the **Main Model** from the dropdown
2. Sizes automatically load from the main model
3. Fill in **Model Name** and **Colour**
4. In the **Model Stock Items** grid, click **Add Row** for each material:
   - Select the **Stock Item** from the dropdown
   - Enter the **Consumption** (quantity needed per finished piece)
5. Click **Save**

> ⚠️ Consumption is **per finished piece**, not per batch total.

---

## 5. Warehouses & Locations

**Who uses this:** Warehouse Managers, Administrators

---

### 5.1 Create a Warehouse

1. Click **Warehouses** in the left menu
2. Click **New**
3. Fill in:

| Field | Required | Example |
|-------|----------|---------|
| Warehouse Name | ✅ Yes | `Main Warehouse` |
| Warehouse Code | ✅ Yes | `WH-001` |
| Location Basis | No | ✅ Check if you want bin/rack tracking |

4. Click **Save**

---

### 5.2 Add Bins & Racks

*(Only if Location Basis is enabled)*

1. Open the warehouse record
2. In the **Warehouse Locations** grid, click **Add Row**
3. Enter:
   - **Bin** — Zone or area code (e.g., `A`, `FAB`)
   - **Rack** — Shelf position (e.g., `01`, `R1-L2`)
4. Click **Save**
5. Print and affix physical labels to the matching warehouse locations

**Example Locations:**

| Bin | Rack | Full Location | Use For |
|-----|------|---------------|---------|
| A | 01 | A-01 | Fabrics, Zone A, Rack 1 |
| B | 01 | B-01 | Trims, Zone B, Rack 1 |
| C | 01 | C-01 | Packaging, Zone C, Rack 1 |

---

## 6. Batch Planning

**Who uses this:** Production Planners, Warehouse Managers

A **Batch** is a production order specifying which product to make and how many pieces of each size.

---

### 6.1 Create a New Batch

1. Click **Batches** in the left menu
2. Click **New**
3. Enter a unique **Batch Number** (recommended: `BTH-YYYY-###`)
4. Select the **Model** from the dropdown
5. Enter the **Quantity** for each size in the grid
6. Click **Save**

> If a size will not be produced, enter **0** — do not leave it blank.

---

### 6.2 Find and Edit a Batch

1. Click the Search icon (🔍)
2. Search by Batch Number or Model Name
3. Click the batch in results to load it
4. Update quantities as needed
5. Click **Save**

---

## 7. Purchase Orders

**Who uses this:** Procurement Officers, Finance, Warehouse Managers

A Purchase Order (PO) is a formal document sent to a supplier to request the delivery of materials at an agreed price.

---

### 7.1 PO Status Workflow

```
DRAFT → Pending Approval → Approved → Sent → Partial Receipt → Fully Received → Closed
```

| Status | Meaning |
|--------|---------|
| **Draft** | PO is being prepared — not yet submitted |
| **Pending Approval** | Submitted for management review |
| **Approved** | Management has approved the PO |
| **Sent** | PO has been sent to the supplier |
| **Partial** | Some items from the PO have been received (GRN) |
| **Received** | All items have been fully received |
| **Closed** | PO is closed and no further activity is expected |

> Only **Approved** and **Sent** POs are available for GRN creation.

---

### 7.2 Create a New Purchase Order

1. Click **Purchase Orders** in the left menu
2. Click **New** (a PO number is auto-generated in the format `PO-YYMMDD-NNNN`)
3. Fill in **Card 1 — Order Details**:

| Field | Required | Notes |
|-------|----------|-------|
| PO Number | ✅ Auto | Auto-generated; can be edited |
| Supplier | ✅ Yes | Select from dropdown |
| Order Date | ✅ Yes | Defaults to today |
| Expected Delivery Date | ✅ Yes | Estimated receipt date |
| Status | ✅ Yes | Start with **DRAFT** |
| Notes | No | Any special instructions for the supplier |

4. In **Card 2 — Line Items**, click **Add Row** for each material to order:

| Column | Required | Notes |
|--------|----------|-------|
| Material | ✅ Yes | Select from stock item dropdown |
| UOM | Auto | Fills from the material record |
| Quantity | ✅ Yes | Quantity to order |
| Unit Price | ✅ Yes | Agreed price per unit |
| Expected Delivery | No | Item-level delivery date if different from PO |

5. In **Card 3 — Financial Summary**, review the automatically calculated totals:
   - **Subtotal** — sum of all line items
   - **Discount (%)** — enter a percentage discount if applicable
   - **Tax** — enter a flat tax amount if applicable
   - **Shipping Cost** — enter freight/delivery charges
   - **Total Amount** — final payable amount

6. Click **Save**

> **Tip:** The financial summary recalculates automatically whenever you change line items or the discount/tax/shipping fields.

---

### 7.3 Edit a Purchase Order

1. Use **Advanced Search** (🔍) to find the PO
2. Load it by clicking the row in search results
3. Update the required fields or line items
4. Click **Save**

> ⚠️ Once a PO is in **Approved** or later status, line items may be locked. Contact your administrator if changes are needed.

---

### 7.4 Record a Payment Transaction

1. Open a Purchase Order
2. In **Card 4 — Payment Transactions**:
   - Enter the **Amount** paid
   - Enter a **Note** (e.g., "50% advance", "Final payment — Invoice #123")
   - Click **Add Transaction**
3. The transaction appears in the **Payment History** table below with the date recorded automatically

The payment history table shows:
- **#** — Transaction sequence
- **Amount** — Amount paid
- **Note** — Reference or description
- **Date** — Date the payment was recorded

---

### 7.5 Search for a Purchase Order

1. Click the **Advanced Search** button (🔍)
2. Search by PO Number, supplier, or status
3. Click a row in the results to load the PO

---

## 8. Goods Receipt Note (GRN)

**Who uses this:** Warehouse Managers, Stock Clerks, Receiving Staff

A GRN records the physical receipt of goods against a Purchase Order. Each item scanned into a warehouse location is recorded as a GRN transaction.

---

### 8.1 GRN Status Workflow

```
Creating → Completed
```

| Status | Meaning |
|--------|---------|
| **Creating** | GRN is open and items are being received |
| **Completed** | GRN is finalised; stock has been updated |

---

### 8.2 Create a New GRN

1. Click **GRN** in the left menu
2. Click **New GRN**
3. Fill in the header:

| Field | Required | Notes |
|-------|----------|-------|
| PO Number | ✅ Yes | Select from the dropdown — only Approved/Sent POs appear |
| Warehouse | ✅ Yes | The warehouse receiving the goods |
| GRN Date | ✅ Yes | Date of physical receipt |

4. After selecting the PO, the **Purchase Order Details Panel** expands automatically, showing:
   - Supplier information
   - Order date and total amount
   - A table of all ordered items with columns:
     - **Material** — item code and name
     - **Quantity** — total quantity ordered
     - **GRN Qty** — quantity already received (orange)
     - **Balance Qty** — remaining quantity to receive (green = still pending, red = over-received)

---

### 8.3 Add GRN Transactions (Receive Items)

For each physical item being received:

1. Enter or scan the **Location ID** (bin-rack label on the warehouse shelf)
   - The system automatically looks up the material assigned to that location
   - The **Material** field fills automatically (read-only)
   - The **Unit Price** fills automatically from the matched PO line item
2. Enter or verify the **Quantity** being received
3. Click **Add Transaction**
4. The transaction card appears in the list below with a delete option

Repeat for each item or pallet received.

> **Tip:** If a location has a QR code or barcode label, scan it directly into the **Location ID** field. The material and price fill automatically.

> **Note:** Unit Price is automatically populated from the Purchase Order and cannot be manually edited — this ensures price consistency with the approved PO.

---

### 8.4 Complete a GRN

Once all items have been received and verified:

1. Click **Complete GRN**
2. A confirmation popup appears — review the summary
3. Click **Yes** to finalise
4. Status changes to **Completed** and stock levels are updated

> ⚠️ A completed GRN **cannot be reopened**. Verify all transactions are correct before completing.

---

### 8.5 Delete a GRN Transaction

If a transaction was entered incorrectly before the GRN is completed:

1. Find the transaction card in the list
2. Click the **Delete** icon on the card
3. Confirm deletion when prompted

---

### 8.6 Find an Existing GRN

1. Click the **Advanced Search** button (🔍)
2. Search by GRN number, PO number, or date range
3. Click the result to load the GRN

---

## 9. GRN Confirmation

**Who uses this:** Warehouse Managers, Supervisors

GRN Confirmation is used to review, verify, and commit (confirm) open GRN transactions before stock is updated in the system.

---

### 9.1 View Open GRN Transactions

1. Click **GRN Confirmation** in the left menu
2. A grid displays all pending (uncommitted) GRN transactions including:
   - GRN number
   - Material name and code
   - Quantity
   - Warehouse location
   - Date

---

### 9.2 Commit a Single Transaction

1. Find the transaction row in the grid
2. Click the **Commit** (tick/save) button on the row
3. The transaction is confirmed and the row is removed from the pending list

---

### 9.3 Save All (Bulk Commit)

1. Review all transactions in the grid
2. Click **Save All** to commit all pending transactions at once
3. A success message confirms how many were committed

> ⚠️ Once committed, GRN transactions update the physical stock levels. Verify quantities are correct before committing.

---

## 10. Material Requisition Note (MRN)

**Who uses this:** Production Planners, Cutting/Production Staff, Warehouse Staff

An MRN is a formal request for materials to be issued from the warehouse to the production floor for a specific batch.

---

### 10.1 MRN Status Workflow

```
Open → Finalized
```

| Status | Meaning |
|--------|---------|
| **Open** | MRN is being prepared or partially issued |
| **Finalized** | Issuance is complete; MRN is closed |

---

### 10.2 Create a New MRN

1. Click **MRN** in the left menu
2. Click **New**
3. Fill in:

| Field | Required | Notes |
|-------|----------|-------|
| MRN ID | ✅ Auto | System-generated; can be overridden |
| Batch | ✅ Yes | Select the production batch this MRN is for |
| Warehouse | ✅ Yes | The warehouse from which materials will be issued |

4. In the **Materials** section, click **Add to Grid** for each required material:

| Field | Required | Notes |
|-------|----------|-------|
| Material | ✅ Yes | Select from dropdown |
| Required Quantity | ✅ Yes | Quantity needed for production |

5. Click **Save**

---

### 10.3 Finalize an MRN

Once all materials have been issued:

1. Open the MRN
2. Click **Finalize**
3. A confirmation popup appears — click **Yes**
4. Status changes to **Finalized**

---

### 10.4 Reopen an MRN

If a finalized MRN needs to be amended:

1. Open the finalized MRN
2. Click **Reopen**
3. Confirm when prompted
4. Status returns to **Open** for editing

---

### 10.5 Print / Download an MRN

1. Open the MRN
2. Click **Print** or **Download**
3. The MRN is exported as a printable document for physical picking or record-keeping

---

### 10.6 Search for an MRN

1. Click the **Advanced Search** button (🔍)
2. Search by MRN ID, batch number, or warehouse
3. Click the row to load the MRN

---

## 11. MRN Issuance

**Who uses this:** Warehouse Staff, Stock Clerks

MRN Issuance is the physical process of picking materials from warehouse locations and issuing them to production. Staff scan location IDs or enter them manually to record which location the stock was picked from.

---

### 11.1 Load an MRN for Issuance

**Method 1 — Scan or Type:**
1. Click **MRN Issuance** in the left menu
2. Enter or scan the **MRN Number** into the search field
3. Press **Enter** — the MRN details load automatically

**Method 2 — Advanced Search:**
1. Click the **Advanced Search** button (🔍)
2. Search by MRN number or batch
3. Click the result to load the MRN

The screen shows all materials required for the MRN along with their:
- Required quantity
- Quantity already issued
- Balance to issue
- Status indicator

---

### 11.2 Process an Issuance

For each material line in the MRN:

1. Enter or scan the **Location ID** of the warehouse shelf where the material is stored
   - The location is validated automatically
2. Enter the **Issue Quantity** — how much is being taken from that location
3. Click **Issue** (or press Enter)
4. The picked quantity is deducted from the location and added to the issued total

You can issue from multiple locations for the same material (partial picks) until the required quantity is met.

---

### 11.3 Using the QR Scanner

If your device supports a camera:

1. Click the **QR Scanner** icon
2. Point the camera at the location's QR code label
3. The location ID fills automatically
4. Enter the quantity and click **Issue**

---

### 11.4 Delete an Issuance Transaction

If a transaction was made in error before the MRN is completed:

1. Find the transaction in the issued transactions list
2. Click the **Delete** icon
3. Confirm deletion — stock is returned to the location

---

### 11.5 Complete the Issuance

Once all required materials have been issued:

1. Click **Complete Issuance**
2. A confirmation popup appears
3. Click **Yes** to finalise
4. The MRN status updates to **Finalized** and stock levels are updated

---

## 12. Stock Transfer

**Who uses this:** Warehouse Managers, Stock Clerks

Stock Transfer moves inventory from one warehouse location to another within the system.

---

### 12.1 Perform a Stock Transfer

1. Click **Stock Transfer** in the left menu
2. Enter or scan the **From Location ID** (the location you are moving stock out of)
   - Press **Enter** or **Tab** to validate — the material and current quantity display automatically
3. Enter or scan the **To Location ID** (the destination location)
4. Enter the **Transfer Quantity**
5. Click **Save**

> ⚠️ The transfer quantity cannot exceed the current stock at the source location.

---

## 13. Returnable Items

**Who uses this:** Warehouse Staff, Production Staff

Returnables tracks the dispatch and return of reusable items (e.g., hangers, racks, garment covers) that are sent out and must be returned.

---

### 13.1 Create a Returnable Dispatch

1. Click **Returnables** in the left menu
2. Enter or scan the **Requester ID** (e.g., employee or department code)
   - Press **Enter** or **Tab** — the requester details load automatically
3. Enter or scan the **Material ID** of the returnable item
   - Material details load automatically
4. Enter the **Dispatch Quantity**
5. Click **Save / Print** to record the dispatch and optionally print a receipt

---

### 13.2 View Returnable History

The grid on the page shows all previous returnable transactions for quick reference.

Click the **Edit** icon on any row to reload that record and make corrections if needed.

---

## 14. Invoice

**Who uses this:** Finance, Sales, Customer Service

The Invoice module creates customer invoices for goods or services delivered.

---

### 14.1 Create a New Invoice

1. Click **Invoice** in the left menu
2. Click **New**
3. Fill in the header:

| Field | Required | Notes |
|-------|----------|-------|
| Bill No | ✅ Auto | Auto-generated or enter manually |
| Customer Name | ✅ Yes | Full name of the customer |
| Mobile | No | Customer phone number |
| Address | No | Delivery or billing address |
| Invoice Date | ✅ Yes | Defaults to today |
| Due Date | ✅ Yes | Payment due date |
| Invoice Status | No | Draft / Issued / Paid / Overdue |

4. In the **Invoice Details** grid, add line items:

| Column | Required | Notes |
|--------|----------|-------|
| Description | ✅ Yes | Item or service description |
| Quantity | ✅ Yes | Amount delivered |
| Unit Price | ✅ Yes | Price per unit |
| Total | Auto | Calculated automatically |

5. Review the **Total Amount**, **Paid**, and **Balance** fields in the summary
6. Click **Save**

---

### 14.2 Record a Payment Against an Invoice

1. Open the invoice
2. In the **Payment Details** grid, add a payment row:
   - Enter the **Amount Paid** and the **Payment Date**
3. The **Balance** updates automatically
4. Click **Save**

---

### 14.3 Print an Invoice

1. Open the saved invoice
2. Click **Print** — the invoice opens in a print-friendly format
3. Use your browser's Print function (Ctrl+P) to print or save as PDF

---

### 14.4 Find an Invoice

1. Enter the **Bill No** in the search field and press **Enter**
   - The invoice loads automatically if found

**Or** use the **Advanced Search** (🔍):
1. Click the search icon
2. Search by bill number, customer name, or status
3. Click the result to load the invoice

---

## 15. Inventory Dashboard

**Who uses this:** All users

The Inventory Dashboard provides a real-time view of all stock across your warehouses.

---

### 15.1 View Inventory

1. Click **Inventory** in the left menu
2. Select a **Warehouse** from the dropdown
3. The screen shows all bins and racks with their current stock quantities

---

### 15.2 Search for a Material Location

1. Click in the **Search box** at the top of the dashboard
2. Type at least **3 characters** (material name or code)
3. Matching locations highlight in **yellow** automatically
4. Note the bin/rack codes and quantities shown

```
Type "Cotton"   → All Cotton locations highlighted
Type "FAB-001"  → Exact material code location highlighted
Type "BTN"      → All Button locations highlighted
```

> Search is not case-sensitive. Clear the search box to return to the full view.

---

### 15.3 Fullscreen Mode

Press the **Fullscreen** icon to expand the dashboard for floor-level use or team viewing. Click again to exit.

---

### 15.4 Daily Inventory Check (Warehouse Managers)

1. Login → Open Inventory Dashboard
2. Select each warehouse in turn
3. Look for:
   - Items below minimum quantity
   - Empty locations that should have stock
   - Unusually high or low quantities
4. Investigate and resolve discrepancies before end of day

---

## 16. Reports

**Who uses this:** Managers, Planners, Finance, Warehouse Staff

The Reports section provides pre-built analytical views across the system.

---

### 16.1 Available Reports

| Report | Description | Who Uses It |
|--------|-------------|-------------|
| **Current Stock** | Real-time stock levels across all warehouses and locations | Warehouse Managers, Planners |
| **Daily Output** | Production output count per day/batch | Production Managers |
| **GRN Pending / Completed** | Status of all GRN receipts — which have been fully received and which are still pending | Procurement, Warehouse |
| **Material Consumption Per Model** | How much material was consumed per garment model across batches | Production Planners, Cost Controllers |
| **MRN Activity Per User** | Tracks which users processed which MRN issuances | Supervisors, Administrators |
| **MRN Turnaround Time** | Measures how long it takes from MRN creation to full issuance | Warehouse Performance |
| **Purchase Order Status** | Summary of all POs with their current status, amounts, and receipt progress | Procurement, Finance |

---

### 16.2 Running a Report

1. Click **Reports** in the left menu
2. Select the report type from the sub-menu
3. Apply any available filters (date range, warehouse, batch, etc.)
4. Click **Run** or **Generate**
5. The report displays in the main area

> Results can generally be exported or printed using the **Export** or **Print** button at the top of the report.

---

## 17. User Administration

> **For System Administrators only.**

---

### 17.1 Create a New User

1. Click **Administration → Create User**
2. Click **New**
3. Fill in:

| Field | Required |
|-------|----------|
| Email | ✅ Yes — must be unique |
| First Name | ✅ Yes |
| Last Name | ✅ Yes |
| User Role | ✅ Yes |
| Password | ✅ Yes — temporary |

4. Click **Save**
5. Communicate login credentials to the user **securely** (by phone or encrypted message — never plain email)

---

### 17.2 Available Roles

| Role | Access |
|------|--------|
| **System Administrator** | Full access to all modules |
| **Warehouse Manager** | Full: Inventory, Warehouse, GRN, MRN Issuance, Batches |
| **Inventory Controller** | Read/Write: Stock items, inventory, GRN |
| **Production Planner** | Full: Models, Batches, MRN; Read: Inventory |
| **Procurement Officer** | Full: Suppliers, Purchase Orders; Read: Materials |
| **Stock Clerk** | Read: Inventory; Limited write: GRN Issuance, Stock Transfer |

---

### 17.3 Reset a User Password

1. Search for the user → open their record
2. Click **Change Password**
3. Enter a new temporary password
4. Click **Save**
5. Inform the user by phone and instruct them to change it on next login

---

### 17.4 Deactivate / Remove a User

1. Open the user's record
2. Click **Delete**
3. Confirm when prompted

> Prefer deactivation over deletion — this preserves the audit trail.

---

### 17.5 Manage User Roles

1. Click **Administration → User Roles**
2. Create or modify role definitions as needed
3. Click **Save**

---

### 17.6 Manage Permissions

1. Click **Administration → Permissions**
2. The grid shows all modules (rows) vs roles (columns)
3. Check or uncheck permissions:
   - **Read** — View only
   - **Write** — Create and edit
   - **Full** — Create, edit, delete
4. Click **Save** — changes take effect immediately

**Recommended Permission Matrix:**

| Module | Admin | WH Manager | Inv Controller | Planner | Procurement | Stock Clerk |
|--------|-------|------------|----------------|---------|-------------|-------------|
| Materials | Full | Write | Write | Read | Read | Read |
| Models | Full | Read | Read | Full | — | — |
| Warehouses | Full | Full | Write | Read | — | Read |
| Batches | Full | Write | Write | Full | — | Read |
| Inventory | Full | Full | Write | Read | — | Read |
| Suppliers | Full | — | — | — | Full | — |
| Purchase Orders | Full | Read | Read | Read | Full | — |
| GRN | Full | Full | Write | — | Read | Write |
| GRN Confirmation | Full | Full | — | — | — | — |
| MRN | Full | Write | — | Full | — | — |
| MRN Issuance | Full | Full | — | Read | — | Write |
| Stock Transfer | Full | Full | Write | — | — | Write |
| Returnables | Full | Write | — | — | — | Write |
| Invoice | Full | — | — | — | Full | — |
| Reports | Full | Full | Read | Read | Read | Read |
| Users/Roles/Permissions | Full | — | — | — | — | — |

---

## 18. Troubleshooting

### 18.1 Cannot Log In

| Check | Action |
|-------|--------|
| Email spelling | Verify using the full email address |
| Password | Check Caps Lock; request a password reset from admin |
| Browser | Clear cache (Ctrl+Shift+Delete), close all tabs, reopen |
| Account | Contact administrator — account may be inactive |
| Network | Confirm VPN or intranet is connected if required |

---

### 18.2 Cannot Save a Record

| Check | Action |
|-------|--------|
| Required fields ( * ) | Fill in all mandatory fields |
| Duplicate code/number | Verify the code is not already taken |
| Permissions | Verify your role has Write access to this module |
| Session expired | Log out and back in; re-enter the data |
| Field validation | Check that numbers, dates, and dropdowns are correctly filled |

---

### 18.3 Search Returns No Results

| Check | Action |
|-------|--------|
| Minimum characters | Type at least 3 characters |
| Spelling | Try a shorter or partial term |
| Wrong module | Confirm you are in the correct section |
| Record deleted | Ask a colleague to check or contact IT |
| Filters | Check that no status/date filters are inadvertently applied |

---

### 18.4 Location Not Found (GRN / MRN Issuance / Stock Transfer)

| Check | Action |
|-------|--------|
| Location ID format | Verify the label matches exactly (e.g., `A-01` not `A01`) |
| QR code damaged | Enter the location ID manually |
| Location not set up | Ask administrator to add the location in the Warehouses module |
| Wrong warehouse | Confirm the correct warehouse is selected in the header |

---

### 18.5 PO Not Available in GRN Dropdown

| Check | Action |
|-------|--------|
| PO Status | Only **Approved** or **Sent** POs appear in the GRN PO dropdown |
| PO Exists | Confirm the PO was saved in the Purchase Orders module |
| Permissions | Confirm your role has GRN write access |

---

### 18.6 Material Not Auto-filling in GRN

| Check | Action |
|-------|--------|
| Location set up | Ensure the location has a material assigned in the Warehouses module |
| PO selected | A PO must be selected before scanning a location (for price auto-fill) |
| Material on PO | The material must be listed as a line item on the selected PO |

---

### 18.7 Unsaved Changes Lost After Navigation

The browser shows a warning if you try to leave a page with unsaved changes. If you accidentally navigated away:
1. Return to the page immediately
2. Do not refresh — use the browser's **Back** button
3. Re-enter the data and click **Save**

---

## 19. Quick Reference

### 19.1 End-to-End Procurement Flow

```
1. Add Supplier          → Suppliers module
2. Create Purchase Order → Purchase Orders module (Status: DRAFT)
3. Approve PO            → Update Status to APPROVED
4. Send PO to Supplier   → Update Status to SENT
5. Receive Goods         → GRN module (scan location, add transactions)
6. Confirm GRN           → GRN Confirmation module (commit transactions)
7. Record Payment        → Purchase Orders → Payment Transactions card
```

---

### 19.2 End-to-End Production Issuance Flow

```
1. Create Batch     → Batches module
2. Create MRN       → MRN module (link to batch and warehouse)
3. Issue Materials  → MRN Issuance module (scan locations, enter quantities)
4. Complete MRN     → MRN Issuance → Complete Issuance
5. Verify Stock     → Inventory Dashboard
```

---

### 19.3 Keyboard Shortcuts

| Key | Action |
|-----|--------|
| **Enter** | Confirm field entry / trigger lookup in scan fields |
| **Tab** | Move to next field |
| **Ctrl + S** | Save (where browser allows) |
| **Ctrl + P** | Print current page |
| **F11** | Browser fullscreen |

---

### 19.4 Common Error Messages

| Message | Cause | Solution |
|---------|-------|---------|
| "Unauthorized" | Your role lacks access to this module | Contact administrator for permission |
| "Record not found" | The ID or code entered does not exist | Verify the value and try again |
| "Duplicate entry" | A record with the same code already exists | Use a different code or search for the existing record |
| "Required field missing" | A mandatory field ( * ) is empty | Fill in the highlighted field and save again |
| "Please Contact System Administrator" | An unexpected server error occurred | Note the time and contact your IT team |
| "No valid GRN detail selected" | Tried to commit with no transactions selected | Select at least one transaction in the GRN Confirmation grid |

---

### 19.5 Module Access Summary

| Module | Location in Menu | Primary Action |
|--------|-----------------|----------------|
| Suppliers | Procurement → Suppliers | Manage vendor contacts |
| Purchase Orders | Procurement → Purchase Orders | Create and manage POs |
| GRN | Warehouse → GRN | Receive goods from suppliers |
| GRN Confirmation | Warehouse → GRN Confirmation | Commit pending receipts |
| MRN | Production → MRN | Request materials for production |
| MRN Issuance | Production → MRN Issuance | Issue materials from warehouse |
| Stock Transfer | Warehouse → Stock Transfer | Move stock between locations |
| Returnable Items | Warehouse → Returnables | Track loaned/returned items |
| Invoice | Finance → Invoice | Create customer invoices |
| Inventory | Inventory → Dashboard | View real-time stock |
| Materials | Master Data → Materials | Manage stock item catalogue |
| Models | Master Data → Models | Define products and consumption |
| Batches | Production → Batches | Create production orders |
| Warehouses | Master Data → Warehouses | Set up warehouse locations |
| Reports | Reports → (select type) | Analytical views |
| Administration | Admin → (select) | Users, Roles, Permissions |

---

*Document maintained by the Thimark Development Team. For corrections or additions, contact your system administrator.*

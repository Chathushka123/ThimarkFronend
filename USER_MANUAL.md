# Thimark Inventory Management System
## User Manual

**Version:** 1.0  
**Date:** March 16, 2026  
**Audience:** All System Users

---

## Table of Contents

1. [Getting Started](#1-getting-started)
2. [Materials (Stock Items)](#2-materials-stock-items)
3. [Models & Products](#3-models--products)
4. [Warehouses & Locations](#4-warehouses--locations)
5. [Batch Planning](#5-batch-planning)
6. [Inventory Dashboard](#6-inventory-dashboard)
7. [User Administration](#7-user-administration) *(Admin only)*
8. [Troubleshooting](#8-troubleshooting)
9. [Quick Reference](#9-quick-reference)

---

## 1. Getting Started

### 1.1 Logging In

1. Open your browser (Chrome, Firefox, or Edge)
2. Go to the system URL provided by your administrator
3. Enter your **Email Address** and **Password**
4. Click **Login**

> **First Login?** You will receive temporary credentials from your administrator. You may be required to change your password immediately.

**Password Rules:**
- Minimum 8 characters
- Mix of letters and numbers
- Change every 90 days

---

### 1.2 Screen Layout

```
┌──────────────────────────────────────────────────────┐
│  [Logo / Home]              [Your Name]  [Logout]    │  ← Top Bar
├────────────┬─────────────────────────────────────────┤
│            │                                         │
│ Dashboard  │                                         │
│ Inventory  │          MAIN WORK AREA                 │
│ Materials  │      (Forms, Tables, Reports)           │
│ Models     │                                         │
│ Warehouses │                                         │
│ Batches    │                                         │
│ Admin      │                                         │
│            │                                         │
└────────────┴─────────────────────────────────────────┘
    ↑ Side Menu
```

---

### 1.3 Common Buttons

| Button | Icon | What It Does |
|--------|------|--------------|
| New | 📄 | Create a new record |
| Save | 💾 | Save the current record |
| Delete | 🗑️ | Delete the current record |
| Search | 🔍 | Open the advanced search window |
| Populate | 📁 | Load / refresh an existing record |
| Refresh | 🔄 | Reload the current data |

---

### 1.4 Understanding Messages

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

## 2. Materials (Stock Items)

**Who uses this:** Inventory Controllers, Warehouse Managers, Production Planners

Materials are all raw materials, consumables, and returnable items you track in your warehouse.

---

### 2.1 Create a New Material

1. Click **Materials** in the left menu
2. Click **New** (📄)
3. Fill in the form:

| Field | Required | Notes |
|-------|----------|-------|
| Material Code | ✅ Yes | Unique code, e.g. `FAB-001` |
| Material Name | ✅ Yes | Clear, descriptive name |
| Category | ✅ Yes | Material / Consumable / Returnable |
| Unit of Measurement (UOM) | ✅ Yes | Meters, Pieces, Kilograms, etc. |
| Supplier | No | Primary supplier name |
| Lead Time (days) | No | Days to receive from supplier |
| Minimum Quantity | No | Reorder trigger level |
| Unit Price | No | Cost per unit |

4. Click **Save** (💾)
5. A green message confirms success. Note the Material ID assigned.

**Category Guide:**
- **Material** — Raw production inputs (fabrics, leather, yarn)
- **Consumable** — Used up in production (needles, thread spools, oil)
- **Returnable** — Reusable items not consumed (hangers, racks, pallets)

---

### 2.2 Search for a Material

**Method 1 — Advanced Search:**
1. Click the **Search icon** (🔍)
2. Enter any known detail (code, name, or supplier)
3. Click **OK**
4. Results appear (up to 20 records)
5. Click a row to load the material

**Method 2 — Grid Browse:**
1. Open the Materials module
2. Scroll through the grid
3. Click the **Edit** icon on a row to open it

> **Tip:** Leave all fields empty to return all records. Partial text works — type "fab" to find all fabrics.

---

### 2.3 Edit a Material

1. Search for and open the material
2. Change the fields you need to update
3. Click **Save**

> ⚠️ **Do not change the Material Code** after creation — it is used as a reference throughout the system.

---

### 2.4 Delete a Material

1. Open the material record
2. Verify it is safe to delete (no existing inventory or transactions)
3. Click **Delete**
4. Confirm when prompted

> ⚠️ **Warning:** Deletion is permanent. If in doubt, add "DISCONTINUED" to the material name instead of deleting.

---

### 2.5 Naming & Coding Standards

**Material Name Format:**
```
[Type] - [Specification] - [Size]

Examples:
  Fabric - Cotton Twill - 60"
  Button - Metal 4-hole - 15mm
  Zipper - Nylon Invisible - 5"
```

**Material Code Format:**
```
[Prefix]-[Number]

Examples:
  FAB-001  (Fabrics)
  BTN-001  (Buttons)
  ZIP-001  (Zippers)
  TRD-001  (Threads)
  PKG-001  (Packaging)
```

---

## 3. Models & Products

**Who uses this:** Production Planners, Warehouse Managers

A **Model** defines a specific product you manufacture — its sizes and the materials needed to make one unit.

---

### 3.1 Understanding the Model Structure

```
Main Model  (Style / Design)
├── Model A  (Color Variant 1 — with material consumption)
└── Model B  (Color Variant 2 — with material consumption)
```

**Example:**
- Main Model: `Classic T-Shirt`
  - Model: `Classic T-Shirt - White` (sizes S, M, L, XL)
  - Model: `Classic T-Shirt - Navy Blue` (sizes S, M, L, XL)

---

### 3.2 Create a Main Model

1. Click **Models** in the left menu
2. In the **Main Model** section at the top of the form:
   - Enter the **Main Model Name** (e.g., `Classic T-Shirt`)
   - Enter the **Sizes** separated by commas — no spaces (e.g., `S,M,L,XL`)
3. Click **Save**

**Size Format Examples:**

| Product Type | Format | Example |
|---|---|---|
| General Apparel | Letters | `S,M,L,XL,XXL` |
| Trousers / Jeans | Numbers | `28,30,32,34,36` |
| Kids Wear | Age | `2Y,4Y,6Y,8Y` |
| Footwear | Shoe Size | `6,7,8,9,10,11` |

---

### 3.3 Create a Model (Product Variant)

1. Select the **Main Model** from the dropdown
2. The sizes automatically load from the main model
3. Fill in:

| Field | Required | Example |
|-------|----------|---------|
| Model Name | ✅ Yes | `Classic T-Shirt - White` |
| Color | ✅ Yes | `White` |

4. In the **Model Stock Items** grid, click **Add Row** (➕) for each material:
   - Select the **Stock Item** from the dropdown
   - Enter the **Consumption** — quantity needed per finished piece

**Consumption Example (T-Shirt):**

| Material | Consumption | UOM |
|----------|-------------|-----|
| Cotton Fabric 60" | 1.5 | Meters |
| Thread - White | 250 | Meters |
| Label - Brand | 1 | Pieces |
| Button Metal 4-hole | 2 | Pieces |

5. Click **Save**

> ⚠️ **Consumption is per finished piece, not per batch total.**

---

### 3.4 Edit a Model

1. Find the model in the grid and click the **Edit** icon
2. Update the required fields or consumption grid
3. Click **Save**

> Note: Changes only affect **future batches**. Existing batches keep their original consumption figures.

---

## 4. Warehouses & Locations

**Who uses this:** Warehouse Managers, System Administrators

---

### 4.1 Create a Warehouse

1. Click **Warehouses** in the left menu
2. Click **New** (📄)
3. Fill in:

| Field | Required | Example |
|-------|----------|---------|
| Warehouse Name | ✅ Yes | `Main Warehouse` |
| Warehouse Code | ✅ Yes | `WH-001` |
| Location Basis | No | ✅ Check if you want bin/rack tracking |

4. Click **Save**

**Location Basis explained:**
- **Checked ✅** — Stock is tracked down to specific bins and racks (recommended for large warehouses)
- **Unchecked** — Stock is tracked at warehouse level only (simpler)

---

### 4.2 Add Bins & Racks to a Warehouse

*(Only needed when Location Basis is enabled)*

1. Open the warehouse record
2. In the **Warehouse Locations** grid, click **Add Row** (➕)
3. For each location, enter:
   - **Bin** — Zone or area code (e.g., `A`, `FAB`)
   - **Rack** — Shelf or position code (e.g., `01`, `R1-L2`)

**Example Locations:**

| Bin | Rack | Full Location | Use For |
|-----|------|---------------|---------|
| A | 01 | A-01 | Fabrics, Zone A, Rack 1 |
| A | 02 | A-02 | Fabrics, Zone A, Rack 2 |
| B | 01 | B-01 | Trims, Zone B, Rack 1 |
| C | 01 | C-01 | Packaging, Zone C, Rack 1 |

4. Click **Save**
5. Print and affix physical labels to matching locations in the warehouse

**Location Naming Tips:**
- Keep codes short (A-01 is better than ZONE-A-RACK-001)
- Use logical sequences that staff can memorize
- Plan ahead — leave room to add more locations
- Be consistent across all warehouses

---

## 5. Batch Planning

**Who uses this:** Production Planners, Warehouse Managers

A **Batch** is a production order — it specifies which product to make and how many pieces of each size.

---

### 5.1 Create a New Batch

1. Click **Batches** in the left menu
2. Click **New** (📄)
3. Enter a unique **Batch Number**:
   ```
   Recommended format:  BTH-YYYY-###
   Example:             BTH-2026-001
   ```
4. Select the **Model** from the dropdown
   - System automatically fills in all sizes from the model
5. In the size grid, enter the **Quantity** for each size:

| Size | Quantity |
|------|----------|
| S | 100 |
| M | 150 |
| L | 120 |
| XL | 80 |
| XXL | 50 |
| **Total** | **500** |

6. Click **Save** (💾)
7. A green message confirms success. Note the Batch ID.

> If a size will not be produced, enter **0** — do not leave it blank.

---

### 5.2 Find and Edit a Batch

1. Click the **Search icon** (🔍)
2. Search by Batch Number or Model Name
3. Click the batch in results to load it
4. Update quantities as needed
5. Click **Save**

> Do **not** change the Batch Number — doing so creates a new batch.

---

### 5.3 Cancel / Delete a Batch

**To cancel** (recommended): Set all quantities to 0 and add "CANCELLED" to the batch number.

**To delete** (use sparingly):
1. Load the batch
2. Verify production has NOT started
3. Click **Delete** → Confirm

---

### 5.4 Batch Planning Checklist

Before saving a batch, confirm:

- [ ] Batch number is unique and follows the naming format
- [ ] Correct model is selected
- [ ] Quantities are entered for all required sizes
- [ ] Total quantity matches your production target
- [ ] Quantities are whole numbers (no decimals for pieces)
- [ ] Production team has been informed

---

### 5.5 Material Requirement Calculation

Once a batch is created, you can calculate material requirements manually:

```
Material Required = Batch Quantity × Consumption per Piece

Example — Batch of 500 Classic T-Shirts (White):
  Cotton Fabric (1.5m each): 500 × 1.5 = 750 meters
  Thread (250m each):        500 × 250 = 125,000 meters
  Labels (1 each):           500 × 1   = 500 pieces
```

---

## 6. Inventory Dashboard

**Who uses this:** All users

The Inventory Dashboard gives a real-time view of all stock across your warehouses.

---

### 6.1 View Inventory

1. Click **Inventory** in the left menu
2. Select a **Warehouse** from the dropdown at the top
3. The screen shows all bins and racks with their current stock quantities

---

### 6.2 Search for a Material Location

1. Click in the **Search box** at the top of the dashboard
2. Type at least **3 characters** (material name or code)
3. The system automatically highlights matching locations in **yellow**
4. Note the bin/rack codes and quantities shown

**Examples:**
```
Type "Cotton"   → All Cotton locations highlighted
Type "FAB-001"  → Exact material code location highlighted
Type "BTN"      → All Button locations highlighted
```

**Tips:**
- Clear the search box to return to full view
- Search is not case-sensitive
- Use material codes for the most precise results

---

### 6.3 Fullscreen Mode

Press the **Fullscreen icon** to expand the dashboard for floor-level use, team viewing, or stock counting. Click again to exit.

---

### 6.4 Daily Inventory Check (For Warehouse Managers)

Recommended morning routine:

1. Login → Open Inventory Dashboard
2. Select each warehouse in turn
3. Look for:
   - Items below minimum quantity
   - Empty locations that should have stock
   - Unusually high or low quantities
4. Investigate and resolve discrepancies before end of day

---

### 6.5 Stock Count Process (For Stock Clerks)

1. Receive your count assignment (which bins/racks to count)
2. Open Inventory Dashboard → search for the material
3. Note the **system quantity**
4. Perform the **physical count**
5. If there is a difference, report to your supervisor immediately
6. Do not adjust quantities yourself without authorization

---

## 7. User Administration

> **For System Administrators only.**

---

### 7.1 Create a New User

1. Click **Administration** → **Create User**
2. Click **New** (📄)
3. Fill in:

| Field | Required |
|-------|----------|
| Email | ✅ Yes — must be unique |
| First Name | ✅ Yes |
| Last Name | ✅ Yes |
| User Role | ✅ Yes |
| Password | ✅ Yes — temporary |

4. Click **Save**
5. Communicate login credentials to the user **securely** (phone or encrypted message — not plain email)

**Available Roles:**

| Role | Access Level |
|------|-------------|
| System Administrator | Full — all modules |
| Warehouse Manager | Full — inventory, warehouse, batches |
| Inventory Controller | Read/Write — stock items, inventory |
| Production Planner | Full — models, batches; Read — inventory |
| Stock Clerk | Read — inventory; Limited write to locations |

---

### 7.2 Reset a User Password

1. Search for the user → open their record
2. Click **Change Password**
3. Enter a new temporary password
4. Click **Save**
5. Inform the user by phone — instruct them to change it on next login

---

### 7.3 Deactivate a User

When an employee leaves or transfers:

1. Open their user record
2. Click **Delete Master** → Confirm

> Deactivation is preferred over deletion — it preserves the audit trail.

---

### 7.4 Manage Permissions

1. Click **Administration** → **Permissions**
2. The grid shows all modules (rows) vs all roles (columns)
3. Check or uncheck permissions as needed:
   - **Read** — View only
   - **Write** — Create and edit
   - **Full** — Create, edit, delete
4. Click **Save** — changes take effect immediately

**Recommended Permission Matrix:**

| Module | Admin | WH Manager | Inv Controller | Planner | Stock Clerk |
|--------|-------|------------|---------------|---------|-------------|
| Materials | Full | Write | Write | Read | Read |
| Models | Full | Read | Read | Full | Read |
| Warehouses | Full | Full | Write | Read | Read |
| Batches | Full | Write | Write | Full | Read |
| Inventory | Full | Full | Write | Read | Read |
| Users/Roles/Permissions | Full | — | — | — | — |

---

## 8. Troubleshooting

### 8.1 Cannot Log In

| Check | Action |
|-------|--------|
| Email | Verify spelling — use full email address |
| Password | Check Caps Lock; try password reset |
| Browser | Clear cache, close all tabs, reopen |
| Account | Contact administrator — account may be inactive |

---

### 8.2 Cannot Save a Record

| Check | Action |
|-------|--------|
| Required fields | Fill in all fields marked with * |
| Duplicate code | Check if the code already exists |
| Permissions | Verify your role has Write access |
| Session | If logged out, log back in and re-enter data |

---

### 8.3 Search Returns No Results

| Check | Action |
|-------|--------|
| Minimum characters | Type at least 3 characters |
| Spelling | Try a shorter or partial term |
| Wrong module | Confirm you are in the correct module |
| Record deleted | Ask a colleague to check, or contact IT |

---

### 8.4 Common Error Messages

| Message | Meaning | Action |
|---------|---------|--------|
| `Field is required` | Mandatory field is empty | Fill in the marked field |
| `Email already exists` | Duplicate email | Edit the existing user instead |
| `Unauthorized` | No permission for this action | Contact administrator |
| `Session expired` | Inactive too long | Log in again |
| `Network error` | Internet connection lost | Check connection and retry |
| `Server error` | System-side problem | Screenshot and contact IT |

---

### 8.5 Getting Help

When contacting IT support, always provide:

1. Your name and role
2. The module you were using
3. Exactly what you were trying to do
4. The error message (screenshot if possible)
5. The date and time it occurred

---

## 9. Quick Reference

### Login
```
1. Open browser → go to system URL
2. Enter email and password
3. Click Login
```

### Create Any Record
```
1. Open the module from left menu
2. Click New (📄)
3. Fill in all required fields (*)
4. Click Save (💾)
5. Confirm green success message
```

### Search for Any Record
```
1. Click Search icon (🔍)
2. Enter partial text in any field
3. Click OK
4. Click the row to open the record
```

### Find Material in Warehouse
```
1. Click Inventory in left menu
2. Select warehouse
3. Type material name or code in search box
4. Yellow highlights = where the material is stored
```

### Plan a Production Batch
```
1. Click Batches → New
2. Enter batch number (BTH-YYYY-###)
3. Select model
4. Enter quantity per size
5. Save
```

---

### Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Refresh page | F5 |
| Full screen browser | F11 |
| Find on page | Ctrl + F |

---

## Glossary

| Term | Meaning |
|------|---------|
| **Batch** | A production order with size-wise quantities |
| **Bin** | Storage area or zone within a warehouse |
| **Consumable** | Item used up in production (needles, oil, thread) |
| **GRN** | Goods Receipt Note — for receiving stock from suppliers *(coming soon)* |
| **Main Model** | Base product style that groups color variants |
| **Material** | Raw material or component used in production |
| **Model** | A specific product variant (color/style) with material consumption |
| **MRN** | Material Requisition Note — request for materials *(coming soon)* |
| **Rack** | Shelf or position within a bin |
| **Returnable** | Reusable item not consumed in production |
| **UOM** | Unit of Measurement (Meters, Pieces, Kilograms, etc.) |

---

*For technical issues contact your IT Helpdesk. For process questions contact your Supervisor or Warehouse Manager.*

---
**Document:** Thimark IMS — User Manual v1.0 | March 16, 2026

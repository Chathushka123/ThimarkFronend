# Standard Operating Procedures (SOP)

## Thimark Inventory Management System

### Functional User Guide

**Document Version:** 1.0  
**Last Updated:** March 9, 2026  
**Document Type:** Functional SOP  
**Project Status:** In Development

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [User Roles & Responsibilities](#2-user-roles--responsibilities)
3. [Getting Started](#3-getting-started)
4. [Stock Item Management](#4-stock-item-management)
5. [Model Management](#5-model-management)
6. [Warehouse Operations](#6-warehouse-operations)
7. [Batch Creation & Planning](#7-batch-creation--planning)
8. [Inventory Dashboard & Monitoring](#8-inventory-dashboard--monitoring)
9. [User Administration](#9-user-administration)
10. [Future Operations](#10-future-operations)
11. [Reports & Analytics](#11-reports--analytics)
12. [Best Practices & Guidelines](#12-best-practices--guidelines)
13. [Troubleshooting Guide](#13-troubleshooting-guide)

---

## 1. System Overview

### 1.1 Purpose

The Thimark Inventory Management System is designed to streamline warehouse operations, production planning, and inventory control for manufacturing businesses. This system helps manage stock items, production models, warehouse locations, batch planning, and provides real-time inventory visibility.

### 1.2 Business Objectives

- **Reduce stock discrepancies** through accurate tracking
- **Optimize warehouse space** utilization
- **Streamline production planning** with batch management
- **Improve inventory visibility** with real-time dashboard
- **Ensure accountability** through user access controls
- **Support decision-making** with inventory analytics

### 1.3 System Capabilities

**Currently Available:**

- ✅ Stock Item (Material) Management
- ✅ Model & Product Management
- ✅ Warehouse & Location Management
- ✅ Batch Creation & Planning
- ✅ Real-time Inventory Dashboard
- ✅ User & Role Management
- ✅ Permission Controls

**Coming Soon:**

- 🔄 Goods Receipt Note (GRN) Processing
- 🔄 Material Requisition Note (MRN) Creation
- 🔄 Material Issuance Process
- 🔄 Cost Sheet Creation

### 1.4 Key Features

- **Multi-warehouse Support:** Manage multiple warehouse locations
- **Location-Based Tracking:** Track inventory by bin and rack
- **Model-Based Planning:** Create batches based on product models
- **Size-Wise Planning:** Allocate quantities by size
- **Real-Time Search:** Quick material search and location
- **Role-Based Access:** Control who can access and modify data
- **Audit Trail:** Track all changes with user information

---

## 2. User Roles & Responsibilities

### 2.1 System Administrator

**Primary Responsibilities:**

- Create and manage user accounts
- Assign roles to users
- Configure system permissions
- Monitor system access
- Manage system security

**Access Level:** Full access to all modules

**Daily Activities:**

- Review new user requests
- Update user permissions as needed
- Monitor system activity logs
- Ensure data backup completion

**Key Performance Indicators:**

- User account accuracy: 100%
- Permission setup time: < 15 minutes per user
- Security incident response: < 2 hours

---

### 2.2 Warehouse Manager

**Primary Responsibilities:**

- Oversee warehouse operations
- Monitor inventory levels
- Approve warehouse transactions
- Ensure proper stock placement
- Generate warehouse reports

**Access Level:** Full access to inventory, warehouse, and batch modules

**Daily Activities:**

- Review daily inventory positions
- Monitor stock movements
- Check bin/rack utilization
- Verify batch allocations
- Review low stock alerts

**Key Performance Indicators:**

- Inventory accuracy: > 98%
- Stock placement compliance: > 95%
- Report generation: Daily
- Stock discrepancy resolution: < 24 hours

---

### 2.3 Inventory Controller

**Primary Responsibilities:**

- Maintain accurate stock records
- Process stock receipts (when GRN is implemented)
- Issue materials to production (when MRN issuance is implemented)
- Update inventory records
- Reconcile stock discrepancies

**Access Level:** Read/Write access to stock items, inventory, and batches

**Daily Activities:**

- Update stock quantities
- Record material receipts
- Process material issues
- Perform cycle counts
- Update material master data

**Key Performance Indicators:**

- Data entry accuracy: > 99%
- Transaction processing time: < 5 minutes per transaction
- Stock update timeliness: Real-time
- Discrepancy reporting: Within 1 hour of discovery

---

### 2.4 Production Planner

**Primary Responsibilities:**

- Create production batches
- Plan material requirements
- Define model specifications
- Allocate size-wise quantities
- Coordinate with procurement

**Access Level:** Full access to models, batches; Read access to inventory

**Daily Activities:**

- Create new production batches
- Review material availability
- Update batch quantities
- Monitor model inventory
- Generate production reports

**Key Performance Indicators:**

- Batch creation accuracy: > 95%
- Planning lead time: 2-3 days ahead
- Material availability check: Daily
- Batch completion rate: > 90%

---

### 2.5 Stock Clerk

**Primary Responsibilities:**

- Perform physical stock counts
- Locate materials in warehouse
- Update bin/rack information
- Assist with material movements
- Report stock issues

**Access Level:** Read access to inventory; Limited write access to stock locations

**Daily Activities:**

- Conduct cycle counts
- Locate materials for picking
- Update stock locations
- Report damaged stock
- Assist with stock transfers

**Key Performance Indicators:**

- Count accuracy: > 99%
- Material location time: < 5 minutes
- Location update timeliness: Real-time
- Issue reporting: Immediate

---

## 3. Getting Started

### 3.1 Accessing the System

**Step 1: Open the Application**

1. Open your web browser (Chrome, Firefox, or Edge recommended)
2. Navigate to the system URL: `https://thimark.com` (or provided URL)
3. Bookmark the page for easy access

**Step 2: Login**

1. Enter your **Email Address**
2. Enter your **Password**
3. Click **"Login"** button
4. System will redirect you to the dashboard

**First-Time Login:**

- You will receive login credentials from the System Administrator
- You may be prompted to change your password on first login
- Contact IT support if you cannot access the system

**Password Requirements:**

- Minimum 8 characters
- Include letters and numbers
- Change every 90 days (recommended)

### 3.2 Navigation Overview

**Top Navigation Bar:**

- **Company Logo:** Click to return to home/dashboard
- **User Profile:** Your name and role (top right)
- **Logout:** Sign out of the system

**Side Menu (Left Panel):**

- **Dashboard:** Main overview screen
- **Inventory:** Real-time stock visibility
- **Materials:** Stock item master data
- **Models:** Product model definitions
- **Warehouses:** Warehouse and location management
- **Batches:** Production batch planning
- **Administration:** User and permission management (Admin only)

**Main Work Area:**

- Forms and data entry screens
- Grid/table views
- Reports and dashboards

### 3.3 Common Screen Elements

**Standard Buttons:**

- 🔍 **Search Icon:** Open advanced search
- 📄 **New:** Create new record
- 💾 **Save:** Save current record
- 🗑️ **Delete:** Delete current record
- 🔄 **Refresh:** Reload data
- 📁 **Populate:** Load existing record

**Data Entry Fields:**

- **Required fields** are marked with red asterisk (\*)
- **Dropdown fields** show available options
- **Date fields** have calendar picker
- **Grid rows** can be added/edited/deleted inline

**Messages:**

- **Green messages:** Success
- **Yellow messages:** Warnings
- **Red messages:** Errors
- **Blue messages:** Information

### 3.4 General Guidelines

**DO:**

- ✅ Save your work frequently
- ✅ Use the Search function to find existing records
- ✅ Verify data before saving
- ✅ Log out when finished
- ✅ Report errors immediately

**DON'T:**

- ❌ Share your password
- ❌ Leave system unattended while logged in
- ❌ Delete records without verification
- ❌ Close browser without saving
- ❌ Bypass required fields

---

## 4. Stock Item Management

### 4.1 Overview

Stock Items (also called Materials) are the raw materials, consumables, and returnable items used in your operations. This module maintains the master data for all inventory items.

### 4.2 Who Uses This Module

- **Inventory Controllers:** Create and maintain material records
- **Warehouse Managers:** Review material information
- **Production Planners:** Check material specifications
- **Procurement Staff:** Reference material details for purchasing

### 4.3 Creating a New Stock Item

### 4.3 Creating a New Stock Item

**Purpose:** Add a new material to the system for tracking and management.

**When to Use:** When receiving a new type of material, consumable, or returnable item.

**Step-by-Step Procedure:**

**Step 1: Navigate to Materials Module**

1. Click **"Materials"** from the left menu
2. System displays the Materials screen

**Step 2: Create New Record**

1. Click the **"New"** button (📄 icon) at the top right
2. System clears the form for new entry

**Step 3: Enter Material Information**

Fill in the following fields:

| Field               | Required | Description           | Example                            |
| ------------------- | -------- | --------------------- | ---------------------------------- |
| Material Code       | Yes      | Unique identifier     | MAT-001, FAB-2023                  |
| Material Name       | Yes      | Descriptive name      | Cotton Fabric 60", Zipper 5"       |
| Category            | Yes      | Type of item          | Material / Consumable / Returnable |
| Supplier            | No       | Primary supplier name | ABC Textiles Ltd.                  |
| Lead Time (days)    | No       | Days to receive order | 7, 14, 30                          |
| Minimum Quantity    | No       | Reorder level         | 100, 500                           |
| Size/Dimension      | No       | Material size         | 60" width, 5 inch                  |
| Unit Price          | No       | Cost per unit         | 150.00, 25.50                      |
| Unit of Measurement | Yes      | How it's measured     | Meters, Pieces, Yards              |

**Step 4: Select Category**
Choose one:

- **Material:** Raw materials for production (fabrics, threads, etc.)
- **Consumable:** Items used up in production (needles, oil, etc.)
- **Returnable:** Reusable items (racks, hangers, etc.)

**Step 5: Set Unit of Measurement (UOM)**

1. Click the **UOM dropdown**
2. Select appropriate unit:
   - Meters, Yards, Feet (for fabrics)
   - Pieces, Units (for buttons, zippers)
   - Kilograms, Pounds (for weighted items)
   - Liters, Gallons (for liquids)

**Step 6: Save the Record**

1. Click the **"Save"** button (💾 icon)
2. System validates all required fields
3. If successful: Green message "Material saved successfully"
4. If error: Red message with specific issue
5. System assigns a unique Material ID automatically

**Step 7: Verify Saved Record**

1. Note the Material ID displayed
2. Use Search to find and verify the record
3. Confirm all information is correct

**Common Mistakes to Avoid:**

- ❌ Using duplicate material codes
- ❌ Selecting wrong category
- ❌ Incorrect UOM for material type
- ❌ Missing required fields
- ❌ Not saving before navigating away

**Tips for Success:**

- ✅ Use consistent naming conventions
- ✅ Include key specifications in material name
- ✅ Double-check supplier information
- ✅ Set realistic lead times for planning
- ✅ Document material codes in separate registry

---

### 4.4 Searching for Stock Items

**Purpose:** Quickly locate existing materials in the system.

**Method 1: Advanced Search**

1. Click the **Search icon** (🔍) at top right
2. Advanced Search dialog opens
3. Enter search criteria in any field:
   - Material Code
   - Material Name
   - Supplier
4. Click **"OK"**
5. System displays matching records (max 20 results)
6. Click on desired record to load it

**Method 2: Grid View**

1. Navigate to Materials module
2. System shows recent materials in grid
3. Scroll through the list
4. Click **Edit icon** on any row to load record

**Search Tips:**

- Use partial text for broader results
- Leave fields empty to see all records
- System searches are not case-sensitive
- Use wildcards (%) for flexible matching

---

### 4.5 Editing Stock Items

**Purpose:** Update material information as needed.

**When to Edit:**

- Supplier information changes
- Price updates
- Lead time adjustments
- Correcting data entry errors
- Updating UOM

**Procedure:**

1. Search for and load the material (see 4.4)
2. Modify the necessary fields
3. Click **"Save"** button
4. System updates the record
5. Verify changes are saved correctly

**Important:**

- Material Code should NOT be changed once created (creates new item if changed)
- Price changes should be documented for audit
- Notify users if UOM changes (affects calculations)

---

### 4.6 Deleting Stock Items

**Purpose:** Remove obsolete or incorrect materials.

**⚠️ Warning:** Deletion is permanent and may affect related records.

**When to Delete:**

- Duplicate entries
- Test records
- Discontinued materials (with no transaction history)

**When NOT to Delete:**

- Materials with existing inventory
- Materials used in models
- Materials with transaction history

**Procedure:**

1. Load the material record
2. Verify it can be safely deleted
3. Click **"Delete"** button
4. System prompts for confirmation
5. Click **"Yes"** to confirm
6. System removes the record

**Best Practice:** Instead of deleting, consider marking materials as "Inactive" or "Discontinued" in the name field.

---

### 4.7 Material Categories Explained

**Material:**

- Primary items used in production
- Examples: Fabrics, yarns, leather, accessories
- Typically purchased in bulk
- Requires careful inventory tracking
- Used in production costing

**Consumable:**

- Items consumed during production
- Examples: Thread, needles, oil, cleaning supplies
- May not be tracked per unit
- Expensed when used
- Lower value items

**Returnable:**

- Reusable items
- Examples: Hangers, racks, pallets, containers
- Tracked for location and custody
- Not consumed in production
- Usually higher value items

---

### 4.8 Material Data Best Practices

**Naming Conventions:**

```
Format: [Material Type] - [Specification] - [Size/Grade]
Examples:
- Fabric - Cotton Twill - 60" width
- Button - Metal 4-hole - 15mm
- Zipper - Nylon Invisible - 5"
```

**Material Code Standards:**

```
Format: [Category Prefix]-[Sequential Number]
Examples:
- FAB-001, FAB-002 (Fabrics)
- BTN-001, BTN-002 (Buttons)
- ZIP-001, ZIP-002 (Zippers)
- TRD-001, TRD-002 (Threads)
```

**Required Information Checklist:**

- [ ] Accurate material code
- [ ] Clear material name
- [ ] Correct category
- [ ] Appropriate UOM
- [ ] Supplier information (if known)
- [ ] Current unit price (for costing)

---

## 5. Model Management

### 5.1 Overview

Models represent the products you manufacture. Each model can have multiple sizes and associated materials with consumption quantities. This module is critical for production planning and material requirement calculation.

### 5.2 Who Uses This Module

- **Production Planners:** Create and maintain model definitions
- **Warehouse Managers:** Review model specifications
- **Inventory Controllers:** Check material requirements
- **Costing Team:** Calculate production costs

### 5.3 Understanding Model Hierarchy

**Two-Level Structure:**

```
Main Model (Style/Design)
    ├── Model 1 (Color Variant 1)
    │   ├── Size: S, M, L, XL
    │   └── Materials: Fabric, Buttons, Thread
    │
    └── Model 2 (Color Variant 2)
        ├── Size: S, M, L, XL
        └── Materials: Fabric, Buttons, Thread
```

**Example:**

- **Main Model:** "Classic T-Shirt"
  - **Model 1:** Classic T-Shirt - White (Sizes: S, M, L, XL)
  - **Model 2:** Classic T-Shirt - Black (Sizes: S, M, L, XL)

### 5.4 Creating a Main Model

**Purpose:** Define the base product style with standard sizes.

**Step-by-Step Procedure:**

**Step 1: Navigate to Models Module**

1. Click **"Models"** from the left menu
2. System displays the Models screen

**Step 2: Enter Main Model Information**

1. Locate the **"Main Model"** section at top of form
2. Enter **Main Model Name**: Descriptive style name
   - Example: "Classic T-Shirt", "Slim Fit Jeans"
3. Enter **Sizes** (comma-separated):
   - Example: `S,M,L,XL` or `28,30,32,34,36`
   - Use standard size codes
   - No spaces after commas

**Step 3: Save Main Model**

1. Click **"Save"** button
2. System validates and saves the main model
3. Main model appears in the main model grid
4. Now you can create color variants (models) under this main model

**Main Model Sizing Examples:**

| Product Type      | Size Format | Example           |
| ----------------- | ----------- | ----------------- |
| Apparel - General | Letters     | S,M,L,XL,XXL      |
| Apparel - Pants   | Numbers     | 28,30,32,34,36,38 |
| Apparel - Kids    | Age         | 2Y,4Y,6Y,8Y,10Y   |
| Footwear          | Shoe Size   | 6,7,8,9,10,11,12  |
| One Size          | Single      | OneSize or OS     |

**Tips:**

- Define sizes at main model level (inherited by all variants)
- Use consistent size codes across similar products
- Consider creating size groups (e.g., "Regular Sizes")

---

### 5.5 Creating a Model (Product Variant)

**Purpose:** Create specific color/variant of a main model with material consumption.

**When to Use:** For each color or variant of a base style.

**Step-by-Step Procedure:**

**Step 1: Select Main Model**

1. In the **"Main Model"** dropdown
2. Select the appropriate main model
3. System loads the predefined sizes

**Step 2: Enter Model Details**

| Field      | Required | Description                 | Example                 |
| ---------- | -------- | --------------------------- | ----------------------- |
| Model Name | Yes      | Variant name                | Classic T-Shirt - White |
| Color      | Yes      | Color of variant            | White, Black, Navy Blue |
| Sizes      | Yes      | Auto-loaded from main model | S,M,L,XL                |

**Step 3: Add Material Consumption**

This is critical for production planning!

1. Locate the **"Model Stock Items"** grid
2. Click **"Add Row"** button (➕)
3. For each row, enter:
   - **Stock Item:** Select material from dropdown
   - **Consumption:** Enter quantity needed per unit

**Example for T-Shirt:**
| Material | Consumption | UOM |
|----------|-------------|-----|
| Cotton Fabric 60" | 1.5 | Meters |
| Thread - White | 250 | Meters |
| Label - Brand | 1 | Pieces |
| Button - 4 hole | 0 | Pieces |

**Step 4: Verify Consumption Accuracy**

1. Review each material and quantity
2. Ensure UOM matches material master
3. Consumption should be per finished piece
4. Include all materials (fabric, trims, packaging)

**Step 5: Save the Model**

1. Click **"Save"** button
2. System validates all fields
3. Model appears in models grid
4. Can now be used in batch creation

**Common Consumption Mistakes:**

- ❌ Wrong UOM (using pieces when should be meters)
- ❌ Total consumption instead of per-piece
- ❌ Missing materials (forgot labels, buttons)
- ❌ Incorrect decimal places (1.5 vs 15)

**Consumption Calculation Tips:**

```
Fabric Consumption Formula:
= (Product Length + Allowance) × (Product Width + Allowance) × Layers

Example: T-Shirt
Length: 70cm + 5cm allowance = 75cm = 0.75m
Width: 50cm (from 60" fabric width)
Consumption per piece: 0.75 meters

For size grading:
Small: 0.75m, Medium: 0.80m, Large: 0.85m, XL: 0.90m
Use average: 0.825m per piece
```

---

### 5.6 Editing Models

**Purpose:** Update model specifications or material consumption.

**When to Edit:**

- Consumption rates change
- Add/remove materials
- Update sizes
- Correct errors

**Procedure:**

1. Click **Edit icon** on model row in grid
2. System loads model details
3. Modify necessary information
4. Update material consumption in grid
5. Click **"Save"**

**Important Notes:**

- Changing consumption affects future batches only
- Existing batches retain original consumption
- Document why consumption changed
- Notify production planning team

---

### 5.7 Model Management Best Practices

**Naming Conventions:**

```
Format: [Main Model Name] - [Color/Variant]
Examples:
- Classic T-Shirt - White
- Classic T-Shirt - Navy Blue
- Slim Fit Jeans - Dark Wash
- Slim Fit Jeans - Stone Wash
```

**Model Coding (Internal Reference):**

```
Format: [Style Code]-[Variant Code]
Examples:
- TS001-WH (T-Shirt 001 - White)
- TS001-BLK (T-Shirt 001 - Black)
- JN045-DW (Jeans 045 - Dark Wash)
```

**Material Consumption Checklist:**

- [ ] All fabrics included
- [ ] All trims included (buttons, zippers, labels)
- [ ] Packaging materials included
- [ ] Consumption is per piece
- [ ] UOM matches material master
- [ ] Allowances included in consumption
- [ ] Wastage factored in

**Review Schedule:**

- Review consumptions quarterly
- Update when prices change significantly
- Verify after production runs
- Document all changes

---

## 6. Warehouse Operations

### 6.1 Overview

Warehouse module manages physical storage locations including warehouses, bins, and racks. Proper setup ensures accurate inventory tracking and efficient material location.

### 6.2 Who Uses This Module

- **Warehouse Managers:** Create and maintain warehouse setup
- **Inventory Controllers:** Reference locations for transactions
- **Stock Clerks:** Locate materials using bin/rack codes
- **System Administrators:** Initial warehouse configuration

### 6.3 Creating a Warehouse

**Purpose:** Set up a new warehouse facility in the system.

**When to Use:**

- Opening new warehouse
- Separating storage areas logically
- Different physical locations

**Step-by-Step Procedure:**

**Step 1: Navigate to Warehouse Module**

1. Click **"Warehouses"** from left menu
2. System displays Warehouse screen

**Step 2: Create New Warehouse**

1. Click **"New"** button (📄)
2. System clears form for new entry

**Step 3: Enter Warehouse Information**

| Field          | Required | Description              | Example                           |
| -------------- | -------- | ------------------------ | --------------------------------- |
| Warehouse Name | Yes      | Descriptive name         | Main Warehouse, Finished Goods WH |
| Warehouse Code | Yes      | Short unique code        | WH-001, WH-FG                     |
| Location Basis | No       | Enable bin/rack tracking | ✓ Check if using locations        |

**Step 4: Configure Location Tracking**

**If Location Basis is CHECKED:**

- System enables bin and rack management
- You must define bins and racks
- Inventory tracked by specific location
- More accurate but requires more data entry

**If Location Basis is UNCHECKED:**

- Warehouse-level tracking only
- No bin/rack details needed
- Simpler but less precise

**Recommendation:** Use Location Basis for:

- Large warehouses
- Multiple storage zones
- High-value inventory
- Compliance requirements

**Step 5: Save Warehouse**

1. Click **"Save"** button
2. System creates the warehouse
3. If location-based, proceed to add locations
4. If not location-based, warehouse is ready to use

---

### 6.4 Managing Warehouse Locations (Bins & Racks)

**Purpose:** Define specific storage positions within a warehouse.

**Terminology:**

- **Bin:** Physical storage compartment or area
- **Rack:** Shelving unit or position identifier
- **Location:** Combination of Bin + Rack (unique position)

**Step-by-Step Procedure:**

**Step 1: Load Warehouse**

1. Use Search to find warehouse
2. Click on warehouse record
3. System loads warehouse details

**Step 2: Add Locations**

1. Locate **"Warehouse Locations"** grid
2. Click **"Add Row"** button (➕)
3. For each location, enter:
   - **Bin:** Zone or area code
   - **Rack:** Position or shelf code

**Example Location Schema:**

**Simple Numbering:**
| Bin | Rack | Full Location | Storage Type |
|-----|------|---------------|--------------|
| A | 01 | A-01 | Fabrics Zone A, Rack 1 |
| A | 02 | A-02 | Fabrics Zone A, Rack 2 |
| B | 01 | B-01 | Trims Zone B, Rack 1 |
| B | 02 | B-02 | Trims Zone B, Rack 2 |

**Advanced Numbering:**
| Bin | Rack | Full Location | Storage Type |
|-----|------|---------------|--------------|
| FAB-A | R01-L1 | FAB-A-R01-L1 | Fabrics Area A, Rack 01, Level 1 |
| FAB-A | R01-L2 | FAB-A-R01-L2 | Fabrics Area A, Rack 01, Level 2 |
| TRM-B | R10-L1 | TRM-B-R10-L1 | Trims Area B, Rack 10, Level 1 |

**Step 3: Save Locations**

1. Enter all bins and racks
2. Add enough rows for all positions
3. Click **"Save"** button
4. System stores all locations

**Step 4: Physical Labeling**

1. Print location labels
2. Affix labels to physical positions
3. Train staff on location system
4. Conduct verification walk-through

**Location Naming Best Practices:**

**Zone-Based (Recommended):**

```
Format: [Zone]-[Rack]-[Level]
A-01-L1 = Zone A, Rack 1, Level 1
B-05-L2 = Zone B, Rack 5, Level 2
```

**Product-Type Based:**

```
Format: [Product Type]-[Sequence]
FAB-001 = Fabric location 1
TRM-001 = Trim location 1
FG-001 = Finished Goods location 1
```

**Alphanumeric Grid:**

```
Format: [Row][Column]
A1, A2, A3 (Row A, Columns 1-3)
B1, B2, B3 (Row B, Columns 1-3)
```

**Tips for Success:**

- Make locations easy to remember
- Use logical sequences
- Consider product flow
- Plan for expansion
- Keep codes short but descriptive

---

### 6.5 Warehouse Organization Guidelines

**Zoning Strategy:**

**By Material Type:**

- Zone A: Fabrics
- Zone B: Trims and Accessories
- Zone C: Packaging Materials
- Zone D: Finished Goods
- Zone E: Returns and Quality Hold

**By Movement Speed (ABC Analysis):**

- Zone A: Fast-moving items (near exit)
- Zone B: Medium-moving items
- Zone C: Slow-moving items (back of warehouse)

**By Storage Requirements:**

- Climate-controlled zone
- Heavy items (ground level)
- Light items (upper racks)
- Hazardous materials (separate area)

**Layout Principles:**

- Place heavy items on lower racks
- Fast movers near shipping area
- Similar items together
- Clear aisle markings
- Emergency exits accessible

**Capacity Planning:**

```
Per Bin Capacity = Length × Width × Height
Example:

Bin: 2m × 1m × 2m = 4 cubic meters
Reserve 20% for accessibility = 3.2 cubic meters usable
```

---

## 7. Batch Creation & Planning

### 7.1 Overview

Batch creation is a critical process for production planning. A batch represents a production order with size-wise quantity allocation based on a specific model.

### 7.2 Who Uses This Module

- **Production Planners:** Create and manage batches
- **Warehouse Managers:** Review batch requirements
- **Inventory Controllers:** Check material availability
- **Production Supervisors:** Execute batch production

### 7.3 Understanding Batches

**What is a Batch?**
A batch is a production order that specifies:

- What product to make (Model)
- How many pieces of each size
- When to produce
- Batch identification number

**Batch Components:**

1. **Batch Number:** Unique identifier (e.g., BTH-2026-001)
2. **Model:** Product being produced
3. **Size Breakdown:** Quantity for each size
4. **Total Quantity:** Sum of all sizes

**Example Batch:**

```
Batch Number: BTH-2026-001
Model: Classic T-Shirt - White
Sizes and Quantities:
  S:  100 pieces
  M:  150 pieces
  L:  120 pieces
  XL:  80 pieces
Total: 450 pieces
```

### 7.4 Creating a Production Batch

**Purpose:** Plan a production run with specific quantities by size.

**Prerequisites:**

- Model must be created with sizes defined
- Material consumption must be set in model
- Batch number format must be decided

**Step-by-Step Procedure:**

**Step 1: Navigate to Batch Module**

1. Click **"Batches"** from left menu
2. System displays Batch screen

**Step 2: Create New Batch**

1. Click **"New"** button (📄)
2. System clears form and size grid

**Step 3: Enter Batch Number**

1. Enter unique **Batch Number**
2. Use consistent format:
   - BTH-YYYY-### (e.g., BTH-2026-001)
   - BATCH-DATE-SEQ (e.g., BATCH-20260309-01)
   - Custom format per company policy

**Step 4: Select Model**

1. Click **Model** dropdown
2. Select the product model for this batch
3. System automatically:
   - Fetches all sizes for the model
   - Populates the size grid
   - Sets quantities to 0 (default)

**Step 5: Enter Size-Wise Quantities**

1. Review the size grid (auto-populated with model sizes)
2. For each size row, enter quantity in the **Quantity** column
3. Enter only numeric values (no decimals for pieces)
4. Leave 0 if not producing that size

**Size Grid Example:**
| Size | Quantity |
|------|----------|
| S | 100 |
| M | 150 |
| L | 120 |
| XL | 80 |
| XXL | 50 |

**Step 6: Verify Quantities**

1. Check each size quantity is correct
2. Verify total matches production target
3. Ensure no negative quantities
4. Confirm quantities are realistic for production capacity

**Step 7: Save Batch**

1. Click **"Save"** button (💾)
2. System validates:
   - Batch number is unique
   - Model is selected
   - At least one size has quantity > 0
3. If validation passes:
   - Green message: "Batch saved successfully"
   - System assigns Batch ID
4. If validation fails:
   - Red message with specific error
   - Correct the error and save again

**Post-Save Actions:**

1. Note the Batch ID for future reference
2. Print batch card if needed
3. Inform production supervisor
4. Check material availability (when GRN implemented)

---

### 7.5 Editing an Existing Batch

**Purpose:** Modify batch quantities after creation.

**When to Edit:**

- Production targets change
- Size distribution needs adjustment
- Correcting data entry errors
- Canceling specific sizes

**Procedure:**

**Step 1: Find the Batch**

1. Click **Search icon** (🔍) at top right
2. Enter search criteria:
   - Batch Number
   - Model Name
3. Click **"OK"**
4. System displays matching batches

**Step 2: Load Batch**

1. Click on the batch row in search results
2. System loads batch details:
   - Batch Number
   - Batch ID
   - Model
   - Size grid with current quantities

**Step 3: Modify Quantities**

1. Change quantities in size grid as needed
2. Increase or decrease as required
3. Set to 0 to remove size from batch

**Step 4: Save Changes**

1. Click **"Save"** button
2. System updates the batch
3. System maintains audit trail of changes

**Important Notes:**

- Batch Number should NOT be changed (creates new batch)
- Model should generally NOT be changed (creates confusion)
- Only modify quantities as needed
- Document reason for major changes

---

### 7.6 Deleting a Batch

**Purpose:** Remove incorrect or cancelled batches.

**⚠️ Warning:** Only delete batches that have NOT started production.

**When to Delete:**

- Duplicate batch created by mistake
- Batch created in error
- Order cancelled before production
- Test batches

**When NOT to Delete:**

- Production has started
- Materials already allocated
- Batch has transaction history

**Procedure:**

1. Search for and load the batch
2. Verify it's safe to delete
3. Click **"Delete"** button
4. System prompts for confirmation
5. Click **"Yes"** to confirm
6. System removes the batch

**Best Practice:** Instead of deleting, consider:

- Setting all quantities to 0 (cancelled batch)
- Adding "CANCELLED" to batch number
- Keeping record for audit purposes

---

### 7.7 Batch Planning Best Practices

**Batch Numbering System:**

```
Format: BTH-[Year]-[Sequence]
Examples:
BTH-2026-001 = First batch of 2026
BTH-2026-002 = Second batch of 2026

Alternative Format: BTH-[Date]-[Sequence]
Examples:
BTH-20260309-01 = First batch of March 9, 2026
BTH-20260309-02 = Second batch of March 9, 2026
```

**Size Distribution Guidelines:**

```
Standard Distribution (Based on Sales Data):
XS:   5%
S:   15%
M:   30%
L:   30%
XL:  15%
XXL:  5%
Total: 100%

Example for 1000 pieces:
XS:   50
S:   150
M:   300
L:   300
XL:  150
XXL:  50
```

**Batch Size Considerations:**

- Minimum efficient quantity (based on setup time)
- Machine capacity constraints
- Material availability
- Delivery deadlines
- Storage capacity

**Material Requirement Calculation:**

```
Example: Classic T-Shirt - White
Batch Quantity: 450 pieces

Material Requirements:
Cotton Fabric (1.5m per piece): 450 × 1.5 = 675 meters
Thread White (250m per piece): 450 × 250 = 112,500 meters = 112.5 km
Labels (1 per piece): 450 × 1 = 450 pieces
```

**Batch Planning Checklist:**

- [ ] Batch number is unique
- [ ] Correct model selected
- [ ] All required sizes included
- [ ] Quantities match production target
- [ ] Total pieces calculated
- [ ] Material availability checked
- [ ] Production capacity verified
- [ ] Delivery date feasible
- [ ] Batch saved successfully
- [ ] Production team notified

---

### 7.8 Batch Workflow

**Standard Batch Lifecycle:**

```
1. PLANNING       → Batch created by production planner
2. APPROVED       → Warehouse manager reviews and approves
3. MATERIAL CHECK → Verify material availability
4. IN PRODUCTION  → Production underway
5. COMPLETED      → All pieces produced
6. QC PASSED      → Quality check completed
7. STORED         → Finished goods in warehouse
```

**Status Tracking (Future Enhancement):**
Currently, batch status is managed outside the system. Future versions will include:

- Status field in batch
- Approval workflow
- Material reservation
- Production progress tracking
- Completion confirmation

---

## 8. Inventory Dashboard & Monitoring

### 8.1 Overview

The Inventory Dashboard provides real-time visibility of stock across all warehouse locations. It's the primary tool for quick stock checks and material location.

### 8.2 Who Uses This Module

- **Warehouse Managers:** Monitor overall inventory
- **Stock Clerks:** Locate materials for picking
- **Inventory Controllers:** Check stock levels
- **Production Planners:** Verify material availability

### 8.3 Accessing the Dashboard

**Step 1: Navigate to Inventory**

1. Click **"Inventory"** from left menu
2. System displays the inventory dashboard

**Step 2: Select Warehouse**

1. Click **Warehouse dropdown** at top
2. Select desired warehouse
3. System loads inventory for that warehouse
4. Display shows all bins/racks with stock

**Step 3: View Inventory Layout**
The screen displays:

- Warehouse bins and racks (visual layout)
- Material name and code
- Current quantity in each location
- Unit of measurement
- Color-coded indicators (if configured)

---

### 8.4 Searching for Materials

**Purpose:** Quickly locate where a specific material is stored.

**Live Search Feature:**

**Step 1: Use Search Box**

1. Click in the **Search box** at top of screen
2. Start typing material name or code
3. Type at least 3 characters

**Step 2: View Results**

1. System automatically searches as you type (400ms delay)
2. All matching bins/racks highlight in **yellow**
3. Material name and code display prominently
4. Current quantity shows for each location

**Step 3: Navigate to Material**

1. System automatically scrolls to first match
2. All matching locations remain highlighted
3. Review quantity in each location
4. Note the bin/rack codes for physical picking

**Search Examples:**

```
Search: "Cotton"
Results: All locations with Cotton items highlighted
- FAB-A-R01: Cotton Fabric 60" - 150 meters
- FAB-A-R05: Cotton Blend 45" - 80 meters
- FAB-B-R02: Cotton Thread White - 5000 meters

Search: "BTN"
Results: All locations with Button items highlighted
- TRM-A-R01: BTN-001 Metal 4-hole - 5000 pieces
- TRM-A-R03: BTN-002 Plastic 2-hole - 3000 pieces

Search: "MAT-001"
Results: Specific material code
- FAB-A-R01: MAT-001 Cotton Fabric - 150 meters
```

**Search Tips:**

- ✅ Type at least 3 characters for search to activate
- ✅ Use material codes for exact matches
- ✅ Use partial names for broader results
- ✅ Search is not case-sensitive
- ✅ Clear search to see all items again

---

### 8.5 Using Fullscreen Mode

**Purpose:** Maximize visibility for warehouse operations.

**When to Use:**

- During physical stock counts
- For warehouse floor displays
- When monitoring from distance
- During picking operations

**How to Use:**

1. Click **Fullscreen icon** (usually top corner)
2. Display expands to full browser window
3. All controls remain accessible
4. Larger text and bins for visibility
5. Click fullscreen icon again to exit

**Benefits:**

- Better visibility from distance
- More items visible on screen
- Easier for team viewing
- Professional presentation mode

---

### 8.6 Inventory Monitoring Procedures

**Daily Inventory Check (Warehouse Manager):**

**Morning Routine:**

1. Login to system
2. Navigate to Inventory Dashboard
3. Select each warehouse in turn
4. Review overall stock levels
5. Note any unusually low stocks
6. Check for discrepancies

**Items to Monitor:**

- Materials below minimum quantity
- Locations with zero stock
- Overstocked locations
- Unusual stock movements

**Stock Count Procedures (Stock Clerk):**

**Cycle Count Process:**

1. Receive count assignment (specific bins/racks)
2. Open Inventory Dashboard
3. Search for materials to count
4. Note system quantity
5. Perform physical count
6. Compare physical vs system
7. Report discrepancies immediately

**Physical Count Best Practices:**

- Count during low-activity periods
- Count twice if possible
- Note damaged/defective items separately
- Document reasons for discrepancies
- Update system promptly

**Material Location Process (Picking):**

When Production Requests Material:

1. Receive material requisition (when MRN implemented)
2. Open Inventory Dashboard
3. Search for required material
4. Note all locations with stock
5. Pick from nearest/easiest location
6. Verify material code before taking
7. Update system after picking (when issuance implemented)

---

### 8.7 Inventory Accuracy Management

**Target Accuracy:** >98%

**Factors Affecting Accuracy:**

- Data entry errors
- Unreported movements
- Damaged/lost items
- Theft or shrinkage
- System errors
- Mislabeled items

**Maintaining Accuracy:**

**Daily Actions:**

- Enter all receipts immediately
- Record all issues when they occur
- Update locations when moving stock
- Report discrepancies same day
- Verify quantities before saving

**Weekly Actions:**

- Perform random bin counts
- Reconcile high-value items
- Review movement reports
- Investigate variances
- Update minimum quantities if needed

**Monthly Actions:**

- Full cycle count of fast movers
- Review slow-moving items
- Analyze accuracy trends
- Train staff on procedures
- Update procedures as needed

**Discrepancy Resolution Process:**

**Step 1: Identify Discrepancy**

- Physical count doesn't match system
- Note the difference (+ or -)

**Step 2: Investigate**

- Check recent transactions
- Verify material identification
- Check adjacent locations (misplaced?)
- Review movement history
- Interview staff if needed

**Step 3: Root Cause**
Determine cause:

- Data entry error
- Unreported movement
- Damaged goods
- Mislabeled material
- Theft
- System error

**Step 4: Correct**

- Adjust system quantity to match physical
- Document adjustment reason
- Report to warehouse manager
- Take corrective action on cause

**Step 5: Prevent**

- Retrain staff if needed
- Improve labels or locations
- Strengthen procedures
- Monitor frequently

---

## 9. User Administration

### 9.1 Overview

User Administration encompasses creating user accounts, assigning roles, managing permissions, and maintaining system security. Only System Administrators should access these functions.

### 9.2 User Management

**9.2.1 Creating a New User Account**

**Purpose:** Grant system access to a new employee.

**Prerequisites:**

- User's official email address
- Department and position information
- Appropriate role identified
- Manager approval obtained

**Step-by-Step Procedure:**

**Step 1: Navigate to User Management**

1. Click **"Administration"** from left menu
2. Select **"Create User"** (or "User Management")
3. System displays user management screen

**Step 2: Create New User**

1. Click **"New"** button (📄)
2. System clears form for new entry

**Step 3: Enter User Information**

| Field      | Required | Description            | Example                  |
| ---------- | -------- | ---------------------- | ------------------------ |
| Email      | Yes      | Official email address | john.smith@company.com   |
| First Name | Yes      | User's first name      | John                     |
| Last Name  | Yes      | User's last name       | Smith                    |
| User Role  | Yes      | Access level role      | Warehouse Manager        |
| Password   | Yes      | Initial password       | Auto-generated or manual |

**Step 4: Select User Role**

1. Click **User Role** dropdown
2. Select appropriate role based on job function:
   - System Administrator
   - Warehouse Manager
   - Inventory Controller
   - Production Planner
   - Stock Clerk

**Step 5: Set Password**
**Option A: Auto-Generated**

- System generates secure password
- Note password to provide to user
- User changes on first login

**Option B: Manual Entry**

- Enter temporary password
- Must meet complexity requirements
- User changes on first login

**Step 6: Save User Account**

1. Click **"Save"** button (💾)
2. System validates all fields
3. Checks email is unique
4. If successful:
   - Green message: "User saved successfully"
   - System assigns User ID
   - System may send welcome email
5. If error:
   - Red message with specific issue
   - Correct and save again

**Step 7: Communicate to User**

1. Inform user of account creation
2. Provide login credentials securely:
   - Email: [their email]
   - Password: [temporary password]
3. System URL: [application URL]
4. Instructions for first login
5. Requirement to change password

**Step 8: Verify Access**

1. Ask user to login
2. Verify they can access appropriate modules
3. Confirm permissions are correct
4. Assist with any login issues

---

**9.2.2 Editing User Accounts**

**Purpose:** Update user information or change roles.

**When to Edit:**

- User changes department
- Role adjustment needed
- Email change required
- Correcting data entry errors

**Procedure:**

1. **Search for User**:
   - Click Search icon (🔍)
   - Enter user email or name
   - Click "OK"
   - Select user from results

2. **Modify Information**:
   - Update required fields
   - Change role if needed
   - DO NOT change email unless necessary

3. **Save Changes**:
   - Click "Save" button
   - Verify changes are saved
   - Notify user of any changes

**Important:** Changing a user's role affects their permissions immediately upon next login.

---

**9.2.3 Resetting User Passwords**

**Purpose:** Provide new password when user forgets or gets locked out.

**When to Reset:**

- User forgot password
- Security breach suspected
- Account compromised
- Policy violation

**Procedure:**

1. **Load User Account**:
   - Search for user
   - Select their record

2. **Change Password**:
   - Click "Change Password" button
   - System prompts for confirmation
   - Click "Yes" to proceed

3. **Set New Password**:
   - Enter new temporary password
   - OR system generates one
   - Note the password securely

4. **Save**:
   - Click "Save"
   - System updates password

5. **Communicate**:
   - Inform user via phone or secure message
   - Provide new password
   - Instruct to change on next login
   - Verify they can login

**Password Security:**

- Never send passwords via regular email
- Use phone call or encrypted message
- Require immediate password change
- Document password reset in log

---

**9.2.4 Deactivating/Deleting User Accounts**

**Purpose:** Remove access for terminated or transferred employees.

**Deactivation vs Deletion:**

- **Deactivation:** User record remains, audit trail preserved (RECOMMENDED)
- **Deletion:** User record removed, may break audit trail (USE SPARINGLY)

**When to Deactivate:**

- Employee terminated
- Employee transferred
- Long-term leave
- Security concern

**Procedure:**

1. **Load User Account**:
   - Search for user
   - Select their record

2. **Verify Decision**:
   - Confirm with HR/Management
   - Check for dependent records
   - Consider audit requirements

3. **Deactivate/Delete**:
   - Click "Delete Master" button
   - System prompts for confirmation
   - Click "Yes" to proceed
   - System deactivates or deletes

4. **Verify**:
   - Confirm user cannot login
   - Check audit log entry
   - Document in organization records

**Important:** Cannot delete own account (prevented by system).

---

### 9.3 Role Management

**9.3.1 Understanding Roles**

**Purpose:** Roles group users with similar job functions and access needs.

**Standard Roles:**

**System Administrator**

- Full access to all modules
- User management
- Permission configuration
- System settings
- Audit logs

**Warehouse Manager**

- Full access to inventory modules
- Read/write warehouse operations
- Batch review and approval
- Stock reports
- User read access

**Inventory Controller**

- Read/write stock items
- Inventory updates
- Transaction processing
- Stock counts
- Location updates

**Production Planner**

- Full access to models and batches
- Read access to inventory
- Planning reports
- Material requirements

**Stock Clerk**

- Read access to inventory
- Limited write to locations
- Stock counting
- Material location
- Basic reports

---

**9.3.2 Creating a New Role**

**Purpose:** Define a new user role for specific job function.

**When to Create:**

- New job position created
- Existing roles don't fit needs
- Need specialized access levels
- Organizational changes

**Procedure:**

**Step 1: Navigate to Roles**

1. Click **"Administration"** from left menu
2. Select **"User Roles"** or **"Roles"**
3. System displays roles management screen

**Step 2: Create New Role**

1. Click **"New"** button
2. System clears form

**Step 3: Enter Role Information**

| Field       | Required | Description       | Example                          |
| ----------- | -------- | ----------------- | -------------------------------- |
| Role Code   | Yes      | Short unique code | WH-MGR, INV-CTRL                 |
| Role Name   | Yes      | Descriptive name  | Warehouse Manager                |
| Description | No       | Role purpose      | Manages all warehouse operations |

**Step 4: Save Role**

1. Click **"Save"** button
2. System validates uniqueness
3. Role is created
4. Now configure permissions for this role

**Step 5: Assign Permissions**
(See section 9.4 Permission Management)

---

**9.3.3 Modifying Roles**

**Purpose:** Update role definitions or permissions.

**Procedure:**

1. Search for and load role
2. Modify role information
3. Save changes
4. Update permissions if needed

**Note:** Changes affect all users assigned to this role immediately.

---

### 9.4 Permission Management

**9.4.1 Understanding Permissions**

**Permission Levels:**

**Read (r):**

- View data only
- No modifications allowed
- Save/Delete buttons hidden
- Grid viewing permitted
- Reports accessible

**Write (w):**

- Create new records
- Modify existing records
- Save button enabled
- Delete may not be allowed
- Full data entry

**Full Access (rw):**

- Complete CRUD operations
- Create, Read, Update, Delete
- All buttons enabled
- Administrative functions
- No restrictions

**9.4.2 Configuring Permissions**

**Purpose:** Set which roles can access which modules.

**Screen-Level Permissions:**

The system shows a grid with:

- **Rows:** Module names (Materials, Models, Warehouses, etc.)
- **Columns:** Role names (Administrator, Manager, Clerk, etc.)
- **Cells:** Permission checkboxes (Read, Write, Full)

**Procedure:**

**Step 1: Navigate to Permissions**

1. Click **"Administration"** from left menu
2. Select **"Permissions"**
3. System displays permission grid

**Step 2: Review Current Permissions**

1. Grid shows all modules vs all roles
2. Checked boxes indicate granted permissions
3. Empty boxes = no access

**Step 3: Modify Permissions**

1. Click checkbox for Role-Module combination
2. Select permission level:
   - Read only
   - Write (includes read)
   - Full access (includes all)
3. Check multiple as needed
4. Consider security implications

**Step 4: Save Permissions**

1. Click **"Save"** button
2. System updates all permissions
3. Changes take effect immediately
4. Users see new access on next page load

**Example Permission Matrix:**

| Module      | Admin | WH Manager | Inv Controller | Production | Stock Clerk |
| ----------- | ----- | ---------- | -------------- | ---------- | ----------- |
| Materials   | Full  | Write      | Write          | Read       | Read        |
| Models      | Full  | Read       | Read           | Full       | Read        |
| Warehouses  | Full  | Full       | Write          | Read       | Read        |
| Batches     | Full  | Write      | Write          | Full       | Read        |
| Inventory   | Full  | Full       | Write          | Read       | Read        |
| Users       | Full  | -          | -              | -          | -           |
| Roles       | Full  | -          | -              | -          | -           |
| Permissions | Full  | -          | -              | -          | -           |

**Permission Best Practices:**

- Follow principle of least privilege
- Grant only necessary access
- Review permissions quarterly
- Document permission rationale
- Test permissions after changes
- Audit access regularly

---

## 10. Future Operations

### 10.1 Goods Receipt Note (GRN) Process

**Status:** Coming Soon

**Purpose:** Formally receive materials from suppliers into inventory.

**Planned Workflow:**

**Step 1: Create GRN**

1. Navigate to GRN module
2. Enter supplier information
3. Link to Purchase Order (if applicable)
4. Enter expected items and quantities

**Step 2: Physical Receipt**

1. Supplier delivers materials
2. Inspect quality and quantity
3. Note any discrepancies
4. Accept or reject items

**Step 3: Record in System**

1. Enter actual received quantities
2. Select warehouse and location
3. Record batch/lot numbers
4. Attach supporting documents
5. Save GRN

**Step 4: Update Inventory**

1. System automatically increases stock
2. Updates warehouse location quantities
3. Records transaction history
4. Generates GRN report

**Step 5: Approval**

1. Warehouse manager reviews GRN
2. Approves or queries discrepancies
3. Finance processes for payment
4. Documents archived

**Benefits:**

- Accurate inventory receipts
- Quality control integration
- Purchase order tracking
- Supplier performance metrics
- Audit trail for received goods

---

### 10.2 Material Requisition Note (MRN) Creation

**Status:** Coming Soon

**Purpose:** Request materials from warehouse for production or operations.

**Planned Workflow:**

**Step 1: Create MRN**

1. Navigate to MRN module
2. Select requesting department
3. Add required materials to grid:
   - Material name/code
   - Required quantity
   - Purpose/reason
   - Priority level
4. Set required date
5. Add remarks if needed

**Step 2: Check Availability**

1. System checks current stock levels
2. Highlights unavailable items
3. Suggests alternatives (if configured)
4. Warns of low stock impact

**Step 3: Submit for Approval**

1. Review MRN details
2. Submit to supervisor
3. System sends notification
4. MRN status: "Pending Approval"

**Step 4: Approval Process**

1. Supervisor reviews MRN
2. Can approve, reject, or modify
3. If approved: Status: "Approved"
4. If rejected: Returns with comments
5. Warehouse receives approved MRNs

**Benefits:**

- Controlled material issuance
- Approval routing
- Stock allocation
- Consumption tracking
- Department-wise material usage

---

### 10.3 MRN Issuance Process

**Status:** Coming Soon

**Purpose:** Execute approved MRNs by physically issuing materials.

**Planned Workflow:**

**Step 1: View Approved MRNs**

1. Navigate to MRN Issuance module
2. System shows list of approved MRNs
3. Sort by priority/date
4. Select MRN to process

**Step 2: Prepare for Issuance**

1. Load MRN details
2. Review required materials and quantities
3. Check locations in inventory dashboard
4. Print picking list
5. Gather materials from locations

**Step 3: Physical Picking**

1. Navigate to warehouse locations
2. Verify material codes
3. Pick required quantities
4. Check quality/condition
5. Note any issues

**Step 4: Record Issuance**

1. Enter actual issued quantities
2. Select source locations (bins/racks)
3. Record batch/serial numbers (if tracked)
4. Note any shortages
5. Enter issuer name
6. Get recipient acknowledgment

**Step 5: Update Inventory**

1. System reduces stock quantities
2. Updates location stock levels
3. Records transaction
4. Generates issue slip
5. Status: "Issued"

**Step 6: Returns Process (If Applicable)**

1. Unused materials returned
2. Create return note
3. Inspect returned items
4. Update inventory to add back
5. Document return reason

**Benefits:**

- Controlled stock release
- Accurate consumption tracking
- Location-wise deductions
- Return management
- Accountability through acknowledgment

---

### 10.4 Cost Sheet Creation

**Status:** Coming Soon

**Purpose:** Calculate complete cost of producing each product.

**Planned Workflow:**

**Step 1: Select Product**

1. Navigate to Cost Sheet module
2. Select model for costing
3. System loads model details
4. Shows material consumption

**Step 2: Material Cost Calculation**

1. System fetches current material prices
2. Multiplies consumption × unit price
3. Calculates total material cost per piece
4. Shows breakdown by material

**Example:**

```
Classic T-Shirt - White
Material Costs:
- Cotton Fabric 60": 1.5m × ₹150/m = ₹225.00
- Thread White: 250m × ₹0.05/m = ₹12.50
- Label: 1 piece × ₹2.00 = ₹2.00
- Button: 0 piece × ₹0 = ₹0.00
Total Material Cost: ₹239.50
```

**Step 3: Add Labor Cost**

1. Enter direct labor hours/cost
2. Add setup time
3. Include quality check time
4. Calculate labor per piece

**Step 4: Add Overhead Costs**

1. Factory overhead (electricity, rent, etc.)
2. Administrative overhead
3. Can be percentage of material+labor
4. Or fixed amount per piece

**Step 5: Calculate Total Cost**

```
Total Production Cost = Material Cost + Labor Cost + Overhead Cost

Example:
Material Cost: ₹239.50
Labor Cost: ₹80.00
Overhead: ₹40.00
Total Cost: ₹359.50
```

**Step 6: Set Selling Price**

1. Add desired profit margin
2. Calculate selling price
3. Compare with market rates
4. Adjust as needed

```
Profit Margin: 30%
Selling Price = ₹359.50 + (₹359.50 × 30%)
= ₹359.50 + ₹107.85
= ₹467.35
Round to: ₹470.00
```

**Step 7: Save Cost Sheet**

1. Review all calculations
2. Enter cost sheet version/date
3. Add notes if needed
4. Save cost sheet
5. Can compare versions over time

**Benefits:**

- Accurate product costing
- Pricing decisions
- Margin analysis
- Cost control identification
- Profitability tracking

---

## 11. Reports & Analytics

### 11.1 Overview

While comprehensive reporting is planned for future development, current system provides basic reports through data exports and dashboard views.

### 11.2 Current Reporting Capabilities

**11.2.1 Inventory Dashboard**

- Real-time stock positions
- Warehouse-wise inventory
- Location-wise stock
- Material search and location
- Visual stock representation

**11.2.2 Data Export**
Most modules allow data export:

1. Navigate to module
2. View grid data
3. Copy data to Excel
4. Process as needed

**11.2.3 Manual Reports**

**Stock Position Report:**

1. Open Inventory Dashboard
2. Select warehouse
3. Screenshot or data export
4. Compile stock positions
5. Share with stakeholders

**Batch Summary:**

1. Navigate to Batches module
2. Search for date range (via Advance Search)
3. Review batch list
4. Export to Excel
5. Calculate totals and summaries

**Material Master List:**

1. Open Materials module
2. View all materials in grid
3. Export list
4. Add to material catalog

### 11.3 Planned Reporting Features

**Coming Soon:**

**Stock Reports:**

- Stock position by warehouse
- Stock position by material category
- Stock aging report
- Slow-moving/Fast-moving analysis
- Stock value report
- Reorder level alert report

**Movement Reports:**

- Material receipt report (GRN summary)
- Material issue report (MRN summary)
- Stock transfer report
- Inventory adjustment report
- Movement by date range

**Production Reports:**

- Batch schedule report
- Batch completion report
- Material consumption report
- Production efficiency report
- Batch-wise cost report

**Management Reports:**

- Inventory turnover ratio
- Stock accuracy report
- Warehouse utilization report
- ABC analysis report
- Demand forecast report

**User Reports:**

- User activity log
- Transaction audit report
- Login history
- Permission changes log
- System access report

### 11.4 Report Request Process

**Current Process:**

1. User identifies report need
2. Contacts System Administrator or IT
3. Specifies:
   - Report purpose
   - Required data fields
   - Date range
   - Grouping/sorting requirements
4. IT extracts data from database
5. Formats in Excel/PDF
6. Delivers to user

**Best Practice:**

- Maintain standard report templates
- Document frequently requested reports
- Schedule recurring reports
- Automate where possible

---

## 12. Best Practices & Guidelines

### 12.1 Data Entry Standards

**12.1.1 General Principles**

- **Accuracy First:** Double-check before saving
- **Consistency:** Use same formats and conventions
- **Completeness:** Fill all required fields
- **Timeliness:** Enter data immediately
- **Verification:** Review saved records

**12.1.2 Naming Conventions**

**Material Names:**

```
Format: [Type] - [Specification] - [Size]
Good: Cotton Fabric - Twill - 60"
Avoid: cotton twill 60 inch fabric
```

**Model Names:**

```
Format: [Style] - [Variant]
Good: Classic T-Shirt - Navy Blue
Avoid: tshirt navy
```

**Warehouse Names:**

```
Format: [Location] - [Purpose]
Good: Main Warehouse - Fabrics
Avoid: wh1
```

**12.1.3 Code Standards**

**Sequential Numbering:**

```
Materials: MAT-001, MAT-002, MAT-003
Batches: BTH-2026-001, BTH-2026-002
```

**Category Prefixes:**

```
FAB-001 (Fabrics)
TRM-001 (Trims)
PKG-001 (Packaging)
```

**12.1.4 Data Quality Checklist**
Before saving any record:

- [ ] Spelling is correct
- [ ] Numbers are accurate
- [ ] Units are specified
- [ ] Codes are unique
- [ ] Category is appropriate
- [ ] All required fields filled
- [ ] Consistent with existing data

---

### 12.2 System Security Guidelines

**12.2.1 Password Security**

- Change password every 90 days
- Never share passwords
- Use strong passwords (8+ characters, mix of letters/numbers)
- Don't write passwords down
- Log out when leaving workstation

**12.2.2 Access Control**

- Use only your own login
- Don't let others use your account
- Report lost passwords immediately
- Request access only to needed modules
- Log out at end of shift

**12.2.3 Data Protection**

- Don't delete records without verification
- Keep backups of critical data exports
- Report suspicious activity
- Don't bypass security measures
- Verify recipient before sharing data

**12.2.4 Physical Security**

- Lock computer when away
- Don't leave printouts unattended
- Secure mobile devices
- Use VPN for remote access
- Report lost devices immediately

---

### 12.3 Operational Best Practices

**12.3.1 Daily Procedures**

**Start of Shift:**

1. Login to system
2. Review pending tasks
3. Check dashboard for alerts
4. Coordinate with team
5. Plan day's work

**During Shift:**

1. Enter data real-time
2. Save work frequently
3. Report issues immediately
4. Verify critical transactions
5. Communicate with team

**End of Shift:**

1. Complete pending entries
2. Review day's transactions
3. Report any discrepancies
4. Hand over to next shift
5. Log out properly

**12.3.2 Transaction Processing**

**Before Transaction:**

- Verify all information
- Check authorization if needed
- Ensure material codes are correct
- Confirm quantities

**During Transaction:**

- Follow standard procedures
- Enter data carefully
- Use correct UOM
- Specify locations accurately

**After Transaction:**

- Verify data is saved
- Check for error messages
- Review transaction on screen
- Print confirmations if needed
- Update physical records if maintained

**12.3.3 Error Handling**

**When Error Occurs:**

1. Don't panic
2. Read error message carefully
3. Note exact error text
4. Check data entered
5. Try again if simple mistake
6. If persists, contact IT support

**Error Prevention:**

- Verify data before saving
- Use dropdowns vs free text
- Follow naming standards
- Enter quantities carefully
- Check UOM selection

---

### 12.4 Communication Protocols

**12.4.1 Reporting Issues**

**System Errors:**

1. Screenshot the error
2. Note what you were doing
3. Note date/time
4. Report to IT immediately
5. Don't retry multiple times

**Data Discrepancies:**

1. Document the discrepancy
2. Note expected vs actual
3. Check recent transactions
4. Report to supervisor
5. Await resolution before proceeding

**Process Issues:**

1. Identify specific problem
2. Document impact
3. Suggest solution if possible
4. Report through proper channels
5. Follow up for resolution

**12.4.2 Inter-Department Communication**

**Inventory to Production:**

- Material availability status
- Stock level alerts
- Batch material requirements
- Quality issues
- Delivery timelines

**Warehouse to Inventory:**

- Receipts processed
- Issues completed
- Location changes
- Physical count results
- Discrepancies found

**Production to Planning:**

- Batch start/completion
- Material consumption
- Production issues
- Quantity changes
- Timeline updates

---

## 13. Troubleshooting Guide

### 13.1 Common User Issues

**13.1.1 Cannot Login**

**Problem:** Login page won't accept credentials

**Solutions:**

1. **Verify Email:**
   - Check spelling
   - Use complete email address
   - Case doesn't matter

2. **Verify Password:**
   - Check caps lock
   - Ensure correct password
   - Try password reset

3. **Clear Browser:**
   - Clear browser cache
   - Close all browser windows
   - Reopen and try again

4. **Contact IT:**
   - If still can't login
   - Request password reset
   - Verify account is active

---

**13.1.2 Page Not Loading**

**Problem:** System is slow or pages won't load

**Solutions:**

1. **Check Internet:**
   - Verify internet connection
   - Try other websites
   - Restart router if needed

2. **Refresh Page:**
   - Press F5 or click refresh
   - Clear browser cache
   - Close and reopen browser

3. **Try Different Browser:**
   - Use Chrome, Firefox, or Edge
   - Update browser to latest version

4. **Contact IT:**
   - If problem persists
   - Report specific page/action
   - Note any error messages

---

**13.1.3 Cannot Save Data**

**Problem:** Save button doesn't work or shows error

**Solutions:**

1. **Check Required Fields:**
   - Look for red asterisks (\*)
   - Fill allrequired fields
   - Read error message carefully

2. **Verify Data:**
   - Check numeric fields have numbers
   - Ensure dates are valid
   - Check for duplicate codes

3. **Check Permissions:**
   - Verify you have write access
   - Contact admin if "unauthorized"
   - May need role change

4. **Try Again:**
   - Refresh page
   - Re-enter data
   - Save again
   - If fails, contact IT

---

**13.1.4 Search Not Working**

**Problem:** Can't find records that should exist

**Solutions:**

1. **Check Search Criteria:**
   - Type at least 3 characters
   - Use partial text
   - Try different field

2. **Check Spelling:**
   - Verify spelling is correct
   - System is not case-sensitive
   - Try shorter search term

3. **Clear and Retry:**
   - Clear all search fields
   - Try advanced search
   - Search by different field

4. **Verify Record Exists:**
   - Ask colleague to search
   - Check if record was deleted
   - May be in different module

---

**13.1.5 Grid Not Showing Data**

**Problem:** Grid is empty when data should be there

**Solutions:**

1. **Refresh:**
   - Click refresh button
   - Reload page
   - Select filters again

2. **Check Filters:**
   - Clear any filters
   - Check dropdown selections
   - Try different date range

3. **Verify Permissions:**
   - Check you have read access
   - Some data may be restricted
   - Contact admin if needed

4. **Check Database:**
   - Data may not be entered yet
   - Ask if others see data
   - Report to IT if problem persists

---

### 13.2 Error Messages Explained

**"Field is required"**

- Missing a mandatory field
- Look for red asterisk (\*)
- Fill the field and save again

**"Email already exists"**

- Email is already in system
- Check for duplicate users
- Use different email
- Or load existing user to edit

**"Unauthorized"**

- Don't have permission for this action
- Contact System Administrator
- May need role change
- Or may be read-only access

**"Session expired"**

- Been inactive too long
- Need to login again
- Save work if possible
- Login fresh

**"Network error"**

- Internet connection issue
- Check network
- Try again in a moment
- Contact IT if persists

**"Server error"**

- System problem
- Not your fault
- Note what you were doing
- Report to IT immediately
- Try again later

---

### 13.3 Getting Help

**13.3.1 Internal Support**

**IT Helpdesk:**

- Email: itsupport@company.com
- Phone: [IT support number]
- Available: [Business hours]

**When Contacting IT, Provide:**

- Your name and role
- Module you're using
- What you were trying to do
- Exact error message
- Screenshot if possible
- When problem started

**System Administrator:**

- For access/permission issues
- User account problems
- Role changes
- Password resets

**13.3.2 User Documentation**

**This SOP:**

- Keep handy for reference
- Review relevant sections
- Follow procedures carefully
- Note updates

**Quick Reference Guides:**

- One-page guides for common tasks
- Located: [Location/Link]
- Printable versions available

**13.3.3 Training**

**New User Training:**

- Initial system overview
- Module-specific training
- Hands-on practice
- Q&A session

**Refresh Training:**

- Quarterly review sessions
- Updates to system
- Best practices reminder
- New features

**On-Demand Training:**

- Request specific training
- One-on-one sessions
- Group training available
- Video tutorials (if available)

---

## 14. Appendices

### 14.1 Glossary of Terms

| Term               | Definition                                                           |
| ------------------ | -------------------------------------------------------------------- |
| **Batch**          | A production order specifying product model and size-wise quantities |
| **Bin**            | A storage compartment or area within a warehouse                     |
| **Consumable**     | Items used up during production (needles, thread, oil, etc.)         |
| **Cost Sheet**     | Document showing complete cost breakdown for production              |
| **GRN**            | Goods Receipt Note - Document for receiving inventory from suppliers |
| **Location Basis** | Warehouse configuration enabling bin/rack level tracking             |
| **Main Model**     | Base product style with standard sizes                               |
| **Material**       | Raw materials and components used in production                      |
| **Model**          | Specific color/variant of a main model with material consumption     |
| **MRN**            | Material Requisition Note - Request for materials from warehouse     |
| **Qty_json**       | Size-wise quantity data stored in JSON format                        |
| **Rack**           | Shelving unit or position within a bin                               |
| **Returnable**     | Reusable items not consumed in production (hangers, racks, pallets)  |
| **Role**           | Group of permissions assigned to users with similar job functions    |
| **UOM**            | Unit of Measurement - How inventory items are measured               |
| **WHL**            | Warehouse Location Items - Inventory at specific locations           |

### 14.2 Standard Operating Hours

**System Availability:**

- 24/7 access (internet required)
- Planned maintenance: Sundays 2-4 AM
- Emergency maintenance: As announced

**Support Hours:**

- IT Helpdesk: Monday-Friday, 9 AM - 6 PM
- System Administrator: Monday-Friday, 9 AM - 5 PM
- Emergency Support: [Contact emergency number]

### 14.3 Escalation Matrix

| Issue Type        | First Contact        | Second Contact       | Third Contact      |
| ----------------- | -------------------- | -------------------- | ------------------ |
| Login/Access      | IT Helpdesk          | System Administrator | IT Manager         |
| Data Entry Error  | Immediate Supervisor | Department Head      | Operations Manager |
| System Error      | IT Helpdesk          | IT Support Team      | IT Manager         |
| Permission Issue  | System Administrator | IT Manager           | Operations Manager |
| Process Issue     | Immediate Supervisor | Department Head      | Operations Manager |
| Security Incident | System Administrator | IT Manager           | Management         |

### 14.4 Contact Directory

**IT Department:**

- IT Helpdesk: itsupport@company.com | Ext: [Extension]
- System Administrator: sysadmin@company.com | Ext: [Extension]
- IT Manager: itmanager@company.com | Ext: [Extension]

**Operations:**

- Warehouse Manager: whmanager@company.com | Ext: [Extension]
- Production Manager: prodmanager@company.com | Ext: [Extension]
- Quality Manager: qcmanager@company.com | Ext: [Extension]

**Administration:**

- HR Department: hr@company.com | Ext: [Extension]
- Admin Manager: admin@company.com | Ext: [Extension]

### 14.5 Form Templates

**Material Request Form** (Manual/Printable)

**Material Request Form** (Manual/Printable)

```
Date: _______________
Requested By: _______________
Department: _______________

Materials Required:
┌──────────────────┬──────────┬─────┬──────────┐
│ Material Name    │ Code     │ Qty │ UOM      │
├──────────────────┼──────────┼─────┼──────────┤
│                  │          │     │          │
│                  │          │     │          │
│                  │          │     │          │
└──────────────────┴──────────┴─────┴──────────┘

Purpose: _________________________________
Required Date: _______________

Approved By: _______________ Date: _______
```

**Stock Count Sheet**

```
Warehouse: _______________
Date: _______________
Counted By: _______________

┌──────┬──────┬───────────┬────────┬─────────┬──────┐
│ Bin  │ Rack │ Material  │ System │ Physical│ Diff │
├──────┼──────┼───────────┼────────┼─────────┼──────┤
│      │      │           │        │         │      │
│      │      │           │        │         │      │
│      │      │           │        │         │      │
└──────┴──────┴───────────┴────────┴─────────┴──────┘

Verified By: _______________ Date: _______
```

### 14.6 Quick Reference Cards

**Login Procedure:**

1. Open browser
2. Go to: [System URL]
3. Enter email and password
4. Click Login

**Search for Material:**

1. Click Search icon (🔍)
2. Enter material name or code
3. Click OK
4. Click on result

**Create New Batch:**

1. Go to Batches
2. Click New button
3. Enter Batch Number
4. Select Model
5. Enter quantities for each size
6. Click Save

**Check Inventory:**

1. Go to Inventory Dashboard
2. Select Warehouse
3. Type material name in search (3+ chars)
4. View highlighted locations

---

## Document Revision History

| Version | Date          | Author              | Changes                        |
| ------- | ------------- | ------------------- | ------------------------------ |
| 1.0     | March 9, 2026 | Implementation Team | Initial functional SOP created |

---

## Document Approval

| Role               | Name | Signature | Date |
| ------------------ | ---- | --------- | ---- |
| Operations Manager |      |           |      |
| Warehouse Manager  |      |           |      |
| IT Manager         |      |           |      |
| Production Manager |      |           |      |
| Quality Manager    |      |           |      |

---

## Training Acknowledgment

I acknowledge that I have received, read, and understood this Standard Operating Procedure. I agree to follow the procedures outlined in this document and will seek clarification if I am unsure of any procedure.

**Employee Name:** ************\_\_\_************

**Employee ID:** ************\_\_\_************

**Role:** ************\_\_\_************

**Signature:** ************\_\_\_************

**Date:** ************\_\_\_************

**Trainer Name:** ************\_\_\_************

**Trainer Signature:** ************\_\_\_************

---

## Feedback & Continuous Improvement

This SOP is a living document. Please provide feedback for improvements:

**Suggestions:**

- Procedures that need clarification
- Missing information
- Better ways to perform tasks
- Additional training needs

**Submit Feedback To:**

- Email: operations@company.com
- Internal form: [Link/Location]
- Direct to your supervisor

**SOP Review Schedule:**

- Reviewed: Quarterly
- Updated: As needed
- Major Revision: Annually

---

**For Questions or Support:**

- IT Helpdesk: itsupport@company.com | [Phone]
- System Administrator: sysadmin@company.com | [Phone]
- Operations Manager: operations@company.com | [Phone]

---

**END OF DOCUMENT**

_This is a functional Standard Operating Procedure focused on user operations and business processes. For technical documentation, refer to the Technical Development Guide (separate document)._

---

© 2026 Thimark. All Rights Reserved.  
Confidential - For Internal Use Only
customButton={<i className="fa fa-edit"></i>}
className="table table-responsive table-striped table-sm">
<GridHeader typeName="GridHeader"
columns={componentList["gridData"].columns} />
<GridBody typeName="GridBody"
rows={componentList["gridData"].data} />
</Grid>
</div>
</div>
</div>
</div>
</div>
</ControlCenter>
);
}

````

#### Step 4: Event Script (ES File)
```javascript
// ModuleNameES.js
import React, { useEffect, useState } from 'react';
import { generateModuleNameDisplay } from './ModuleNameDS';
import config from './ModuleNameCS';
import API from '../../../api/API';

const ModuleName = () => {
    let [rendered, setRendered] = useState(true);

    function reRender() {
        setRendered(!rendered);
    }

    /*********************************************************/
    /********      Framework Action Definitions     **********/
    /*********************************************************/

    config["CONTROL_CENTER"].renderFunction = reRender;
    config["CONTROL_CENTER"].event.onSave = handleSave;
    config["CONTROL_CENTER"].event.onNew = handleNew;
    config["buttonAdvanceSearch"].event.onClick = handleAdvanceSearchPopup;
    config["CONTROL_CENTER"].event.onAdvanceSearch = handleAdvanceSearch;
    config["CONTROL_CENTER"].event.onAdvanceSearchDone = handleAdvanceSearchDone;

    /*********************************************************/
    /********       User Defined Declarations       **********/
    /*********************************************************/

    useEffect(() => {
        __checkIsAuthorized();
        __setFormReadWrite(true);
        // Load initial data
    }, []);

    function __checkIsAuthorized() {
        const apiRequest = { "screen": "ModuleName" }
        API.post(`permissions/isAuthorized`, apiRequest)
            .then(response => {
                const isAuthorized = response.data;
                __setFormReadWrite(isAuthorized);
            })
            .catch(error => {
                __setFormReadWrite("r");
            });
    }

    function __setFormReadWrite(status) {
        if (status === "r") {
            config["buttonNew"].setVisible(false);
            config["buttonSave"].setVisible(false);
        }
    }

    window.onbeforeunload = function () {
        if (config["CONTROL_CENTER"].state.modified ||
            config["CONTROL_CENTER"].state.new ||
            config["CONTROL_CENTER"].state.deleted) {
            return true;
        }
    };

    /*********************************************************/
    /********        User Defined Functions         **********/
    /*********************************************************/

    async function handleSave() {
        try {
            document.getElementById("spinner").style.display = "";

            // Get form values
            const id = config['inputId'].data.value;
            const field = config['inputField'].data.value;
            const gridData = config['gridData'].data;

            // Validations
            if (!field || field.trim() === "") {
                config["CONTROL_CENTER"].promptWarningMessage("Field is required", "");
                return;
            }

            // Prepare API request
            const apiRequest = {
                id: parseInt(id),
                field: field,
                grid_data: gridData
            };

            // API Call
            let response = await API.post(`modulename/createAndUpdate`, apiRequest);

            if (response.status === 200 || response.status === 201) {
                if (!id || id === "") {
                    config['inputId'].setValue(response.data.data.id);
                }
                config["CONTROL_CENTER"].promptBaseMessage("Saved successfully", "");
                config["CONTROL_CENTER"].state.modified = false;
                config["CONTROL_CENTER"].state.new = false;
            }

        } catch (error) {
            console.log(error);
            handleError(error);
        } finally {
            document.getElementById("spinner").style.display = "none";
        }
    }

    function handleNew() {
        config['inputId'].setValue('');
        config['inputField'].setValue('');
        config['gridData'].setData([]);
        config["CONTROL_CENTER"].state.new = true;
    }

    async function handleAdvanceSearchPopup() {
        let data = [];
        const getData = await __getAll();

        if (getData && getData !== "Error" && getData.length > 0) {
            getData.forEach((value, index) => {
                data.push({
                    "id_search": value.id,
                    "field_search": value.field
                });
            });
        }

        let msg = "";
        if (data.length > 20) {
            msg = "Only 20 records are loaded. Please narrow your search";
            data = data.slice(0, 20);
        }

        config["CONTROL_CENTER"].showAdvanceSearch(data, msg);
    }

    async function handleAdvanceSearch(event, searchCriteria, callback) {
        // Implement search logic
        callback(searchResults, message);
    }

    async function handleAdvanceSearchDone(event, selectedRow) {
        const id = selectedRow.id_search;
        await formPopulate(id);
    }

    async function formPopulate(id) {
        try {
            document.getElementById("spinner").style.display = "";

            const apiRequest = { id: parseInt(id) };
            let response = await API.post(`modulename/getById`, apiRequest);

            if (response.status === 200) {
                let data = response.data.data;
                config['inputId'].setValue(data.id);
                config['inputField'].setValue(data.field);
                config['gridData'].setData(data.grid_data || []);
                config["CONTROL_CENTER"].state.populated = true;
            }

        } catch (error) {
            console.log(error);
            handleError(error);
        } finally {
            document.getElementById("spinner").style.display = "none";
        }
    }

    function handleError(error) {
        // Standard error handling (see section 7.2.1)
    }

    return generateModuleNameDisplay(config);
}

export default ModuleName;
````

#### Step 5: Add Route

```javascript
// In src/App.js or routing file
import ModuleName from "./components/pages/ModuleName/ModuleNameES";

// Add route
<PrivateRoute exact path="/modulename" component={ModuleName} />;
```

---

### 8.2 Grid Operations

#### 8.2.1 Setting Grid Data

```javascript
// Set data
config["gridName"].setData(arrayOfObjects);

// Get data
const gridData = config["gridName"].data;

// Clear grid
config["gridName"].setData([]);

// Add row
const currentData = config["gridName"].data || [];
const newRow = { id: 0, field1: "", field2: "" };
config["gridName"].setData([...currentData, newRow]);
```

#### 8.2.2 Row Operations

```javascript
// Edit button handler
config["gridName"].event.onRowCustomButton = handleRowEdit;

function handleRowEdit(e, r) {
  const id = config["gridName"].getValueWiltColName(r, "id");
  const field = config["gridName"].getValueWiltColName(r, "field_name");

  // Populate form fields
  config["inputId"].setValue(id);
  config["inputField"].setValue(field);
}
```

#### 8.2.3 Grid Column Types

```javascript
// TextBox Column
{ objectType: "TextBox", colIndex: 0, datatype: "text", name: "Name",
  placeholder: "Name", visible: true, editable: true, sqlColumn: "name" }

// IntegerField Column
{ objectType: "IntegerField", colIndex: 1, datatype: "number", name: "Quantity",
  placeholder: "Quantity", visible: true, editable: true, sqlColumn: "quantity" }

// NumberField Column (Decimal)
{ objectType: "NumberField", colIndex: 2, datatype: "number", name: "Price",
  placeholder: "Price", visible: true, editable: true, sqlColumn: "price" }

// DropDown Column
{ objectType: "DropDown", colIndex: 3, datatype: "dropdown", name: "Status",
  visible: true, editable: true, sqlColumn: "status",
  options: [{ value: "active", text: "Active" }, { value: "inactive", text: "Inactive" }] }
```

---

## 9. API Integration

### 9.1 API Configuration

#### 9.1.1 Base Configuration

File: `src/api/API.js`

```javascript
import axios from "axios";
import { getToken } from "../utils/Common";

axios.defaults.headers.common["Authorization"] = "Bearer " + getToken();

export default axios.create({
  baseURL: `${process.env.REACT_APP_DB_API_URL}`,
});
```

#### 9.1.2 Environment Variables

Create `.env` files for each environment:

**.env.development:**

```
REACT_APP_DB_API_URL=http://localhost:8000/api
```

**.env.staging:**

```
REACT_APP_DB_API_URL=https://staging-api.thimark.com/api
```

**.env.production:**

```
REACT_APP_DB_API_URL=https://api.thimark.com/api
```

---

### 9.2 API Call Patterns

#### 9.2.1 GET Request

```javascript
// Simple GET
const response = await API.get(`endpoint`);
const data = response.data;

// GET with ID
const response = await API.get(`endpoint/${id}`);

// GET with query parameters
const response = await API.get(`endpoint?param1=value1&param2=value2`);
```

#### 9.2.2 POST Request

```javascript
// POST with body
const apiRequest = {
  field1: value1,
  field2: value2,
};
const response = await API.post(`endpoint`, apiRequest);

// POST for search
const searchCriteria = {
  name: "search term",
  status: "active",
};
const response = await API.post(`search`, searchCriteria);
```

#### 9.2.3 PUT Request

```javascript
const apiRequest = {
  id: id,
  field: updatedValue,
};
const response = await API.put(`endpoint/${id}`, apiRequest);
```

#### 9.2.4 DELETE Request

```javascript
const response = await API.delete(`endpoint/${id}`);
```

---

### 9.3 Standard API Response Format

#### 9.3.1 Success Response

```json
{
  "status": 200,
  "message": "Operation successful",
  "data": {
    "id": 1,
    "field": "value"
  }
}
```

#### 9.3.2 Error Response

```json
{
  "status": 400,
  "message": "Validation failed",
  "errors": {
    "field_name": ["Field is required", "Field must be unique"]
  }
}
```

#### 9.3.3 List Response

```json
{
  "status": 200,
  "data": [
    { "id": 1, "name": "Item 1" },
    { "id": 2, "name": "Item 2" }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "per_page": 20
  }
}
```

---

### 9.4 Authentication

#### 9.4.1 Login Flow

```javascript
// Login request
const loginRequest = {
  email: email,
  password: password,
};

const response = await API.post(`auth/login`, loginRequest);

if (response.status === 200) {
  const token = response.data.token;
  const user = response.data.user;

  // Store token
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));

  // Update axios headers
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}
```

#### 9.4.2 Token Management

File: `src/utils/Common.js`

```javascript
// Get token
export function getToken() {
  return localStorage.getItem("token");
}

// Get user
export function getUser() {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
}

// Remove token
export function removeToken() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

// Check if logged in
export function isLoggedIn() {
  return !!getToken();
}
```

---

## 10. Deployment Procedures

### 10.1 Pre-Deployment Checklist

#### 10.1.1 Code Quality

- [ ] All console.log statements removed or commented
- [ ] No hardcoded API URLs (use environment variables)
- [ ] Error handling implemented for all API calls
- [ ] Loading spinners added for async operations
- [ ] Validation messages are user-friendly
- [ ] Authorization checks in place

#### 10.1.2 Testing

- [ ] All CRUD operations tested
- [ ] Grid operations tested (add, edit, delete)
- [ ] Form validation tested
- [ ] Advance search tested
- [ ] Permission checks tested
- [ ] Cross-browser testing completed
- [ ] Mobile responsiveness checked

#### 10.1.3 Configuration

- [ ] Environment variables configured
- [ ] API endpoints verified
- [ ] Database connection tested
- [ ] Token authentication working
- [ ] CORS configured on backend

---

### 10.2 Build Process

#### 10.2.1 Development Build

```bash
# Install dependencies
npm install

# Start development server
npm start

# Access application
# http://localhost:3000
```

#### 10.2.2 Staging Build

```bash
# Create staging build
npm run build:staging

# Output: build/ folder
# Deploy build folder to staging server
```

#### 10.2.3 Production Build

```bash
# Create production build
npm run build:production

# Output: build/ folder
# Optimized and minified
# Deploy to production server
```

---

### 10.3 Deployment Steps

#### 10.3.1 Development Environment

```bash
# Clone repository
git clone <repository-url>
cd ThimarkFronend

# Install dependencies
npm install

# Configure environment
cp .env.example .env.development
# Edit .env.development with correct API URL

# Start server
npm start
```

#### 10.3.2 Staging Deployment

```bash
# 1. Create staging build
npm run build:staging

# 2. Test build locally
npx serve -s build

# 3. Deploy to staging server
# Option A: FTP Upload
# Upload build/ folder contents to server

# Option B: CI/CD Pipeline
git push origin staging
# Automated build and deployment

# 4. Verify deployment
# Access staging URL and test functionality
```

#### 10.3.3 Production Deployment

```bash
# 1. Merge to main branch
git checkout main
git merge develop
git push origin main

# 2. Create production build
npm run build:production

# 3. Backup current production
# SSH to server
ssh user@production-server
cd /var/www/thimark
mv build build_backup_$(date +%Y%m%d_%H%M%S)

# 4. Deploy new build
# Upload new build folder
scp -r build/* user@production-server:/var/www/thimark/build/

# 5. Verify deployment
# Access production URL
# Test critical functionality

# 6. Monitor for errors
tail -f /var/log/nginx/error.log
```

---

### 10.4 Server Configuration

#### 10.4.1 Nginx Configuration

```nginx
server {
    listen 80;
    server_name thimark.com www.thimark.com;

    root /var/www/thimark/build;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### 10.4.2 Apache Configuration (Alternative)

```apache
<VirtualHost *:80>
    ServerName thimark.com
    ServerAlias www.thimark.com
    DocumentRoot /var/www/thimark/build

    <Directory /var/www/thimark/build>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted

        # Enable React Router
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>

    # Proxy API requests
    ProxyPass /api http://localhost:8000/api
    ProxyPassReverse /api http://localhost:8000/api

    ErrorLog ${APACHE_LOG_DIR}/thimark_error.log
    CustomLog ${APACHE_LOG_DIR}/thimark_access.log combined
</VirtualHost>
```

---

### 10.5 Post-Deployment Verification

#### 10.5.1 Smoke Test Checklist

- [ ] Application loads without errors
- [ ] Login functionality works
- [ ] Dashboard displays correctly
- [ ] Navigation works
- [ ] API calls successful
- [ ] Grid data loads
- [ ] Form submissions work
- [ ] Search functionality operational
- [ ] Authorization checks working

#### 10.5.2 Performance Checks

```bash
# Check page load time
curl -o /dev/null -s -w 'Total: %{time_total}s\n' https://thimark.com

# Check API response time
curl -o /dev/null -s -w 'Total: %{time_total}s\n' https://api.thimark.com/health

# Monitor server resources
top
htop
df -h
```

---

## 11. Troubleshooting & Maintenance

### 11.1 Common Issues

#### 11.1.1 Application Won't Start

**Problem:** `npm start` fails

**Solutions:**

```bash
# Clear node_modules and reinstall
rm -rf node_modules
rm package-lock.json
npm install

# Clear npm cache
npm cache clean --force

# Check Node version (should be 14+)
node -v

# Update npm
npm install -g npm@latest
```

#### 11.1.2 Build Fails

**Problem:** `npm run build` fails

**Solutions:**

```bash
# Check for syntax errors
npm run build 2>&1 | grep error

# Increase memory limit
export NODE_OPTIONS=--max_old_space_size=4096
npm run build

# Check environment variables
cat .env.production
```

#### 11.1.3 API Calls Failing

**Problem:** 401 Unauthorized or 403 Forbidden

**Solutions:**

```javascript
// Check token existence
console.log(localStorage.getItem("token"));

// Check token format in headers
console.log(axios.defaults.headers.common["Authorization"]);

// Refresh token
// Implement token refresh logic in API interceptor
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response.status === 401) {
      // Redirect to login
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);
```

#### 11.1.4 CORS Errors

**Problem:** Cross-Origin Request Blocked

**Solutions:**

```javascript
// Backend: Add CORS middleware (Laravel example)
// In config/cors.php
'paths' => ['api/*'],
'allowed_methods' => ['*'],
'allowed_origins' => ['http://localhost:3000', 'https://thimark.com'],
'allowed_headers' => ['*'],
'supports_credentials' => false,
```

#### 11.1.5 Grid Not Displaying Data

**Problem:** Grid shows no data despite successful API call

**Solutions:**

```javascript
// Check data structure
console.log("Grid data:", config["gridName"].data);

// Verify column mapping
console.log("Grid columns:", config["gridName"].columns);

// Check if data is array
if (!Array.isArray(gridData)) {
  gridData = [gridData];
}

// Clear and reset
config["gridName"].setData([]);
setTimeout(() => {
  config["gridName"].setData(newData);
}, 100);
```

---

### 11.2 Performance Optimization

#### 11.2.1 Code Splitting

```javascript
// Use React.lazy for route-based code splitting
import React, { Suspense, lazy } from "react";

const Material = lazy(() => import("./components/pages/Material/MaterialES"));
const Model = lazy(() => import("./components/pages/Model/ModelES"));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Route path="/material" component={Material} />
      <Route path="/model" component={Model} />
    </Suspense>
  );
}
```

#### 11.2.2 Memoization

```javascript
import React, { useMemo, useCallback } from "react";

// Memoize expensive calculations
const expensiveCalculation = useMemo(() => {
  return gridData.reduce((sum, item) => sum + item.quantity, 0);
}, [gridData]);

// Memoize callbacks
const handleSave = useCallback(async () => {
  // Save logic
}, [dependencies]);
```

#### 11.2.3 Debouncing

```javascript
// Debounce search
useEffect(() => {
  const timer = setTimeout(() => {
    if (searchTerm.length >= 3) {
      performSearch(searchTerm);
    }
  }, 400);

  return () => clearTimeout(timer);
}, [searchTerm]);
```

#### 11.2.4 Image Optimization

```bash
# Install image optimization plugin
npm install --save-dev image-webpack-loader

# Configure in webpack (if ejected)
{
    test: /\.(png|jpe?g|gif|svg)$/i,
    use: [
        {
            loader: 'file-loader',
        },
        {
            loader: 'image-webpack-loader',
            options: {
                mozjpeg: { progressive: true, quality: 65 },
                optipng: { enabled: true },
                pngquant: { quality: [0.65, 0.90], speed: 4 },
                gifsicle: { interlaced: false },
            },
        },
    ],
}
```

---

### 11.3 Database Maintenance

#### 11.3.1 Regular Backups

```bash
# Daily backup script (Backend server)
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/thimark"
DB_NAME="thimark_db"

# Create backup
mysqldump -u root -p$DB_PASSWORD $DB_NAME > $BACKUP_DIR/backup_$DATE.sql

# Compress
gzip $BACKUP_DIR/backup_$DATE.sql

# Delete backups older than 30 days
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -delete
```

#### 11.3.2 Index Optimization

```sql
-- Analyze commonly queried tables
ANALYZE TABLE materials;
ANALYZE TABLE models;
ANALYZE TABLE warehouses;
ANALYZE TABLE batches;

-- Add indexes for frequently searched columns
CREATE INDEX idx_material_code ON materials(code);
CREATE INDEX idx_model_name ON models(name);
CREATE INDEX idx_batch_no ON batches(batch_no);
```

---

### 11.4 Monitoring

#### 11.4.1 Error Logging

```javascript
// Implement global error boundary
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    // Log to error reporting service
    console.error("Error:", error);
    console.error("Error Info:", errorInfo);

    // Send to backend logging service
    API.post("logs/frontend-error", {
      error: error.toString(),
      errorInfo: errorInfo,
      url: window.location.href,
      user: getUser(),
    });
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}
```

#### 11.4.2 Performance Monitoring

```javascript
// Add performance marks
performance.mark("component-render-start");
// ... component rendering
performance.mark("component-render-end");
performance.measure(
  "component-render",
  "component-render-start",
  "component-render-end",
);

// Log measurements
const measure = performance.getEntriesByName("component-render")[0];
console.log(`Render time: ${measure.duration}ms`);
```

---

### 11.5 Security Best Practices

#### 11.5.1 Input Sanitization

```javascript
// Sanitize user inputs before sending to API
function sanitizeInput(input) {
  if (typeof input !== "string") return input;

  return input
    .trim()
    .replace(/[<>]/g, "") // Remove angle brackets
    .substring(0, 1000); // Limit length
}

// Use before API call
const batch_no = sanitizeInput(config["inputBatchNo"].data.value);
```

#### 11.5.2 XSS Prevention

```javascript
// Use React's built-in escaping
// React automatically escapes content in JSX

// For dangerouslySetInnerHTML (avoid if possible)
import DOMPurify from "dompurify";

const cleanHTML = DOMPurify.sanitize(dirtyHTML);
<div dangerouslySetInnerHTML={{ __html: cleanHTML }} />;
```

#### 11.5.3 Token Security

```javascript
// Set token expiration
const tokenExpiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
localStorage.setItem("tokenExpiry", tokenExpiry);

// Check token expiration
function isTokenExpired() {
  const expiry = localStorage.getItem("tokenExpiry");
  return Date.now() > parseInt(expiry);
}

// Implement auto-logout
setInterval(() => {
  if (isTokenExpired()) {
    removeToken();
    window.location.href = "/login";
  }
}, 60000); // Check every minute
```

---

## 12. Appendices

### 12.1 Glossary

| Term | Definition                                                                                |
| ---- | ----------------------------------------------------------------------------------------- |
| API  | Application Programming Interface - Method for communication between frontend and backend |
| CRUD | Create, Read, Update, Delete - Basic database operations                                  |
| CS   | Configuration Schema - File defining component structure and validation                   |
| DS   | Display Schema - File defining UI layout and component rendering                          |
| ES   | Event Script - File containing business logic and event handlers                          |
| GRN  | Goods Receipt Note - Document for receiving inventory                                     |
| MRN  | Material Requisition Note - Document for requesting materials                             |
| SOP  | Standard Operating Procedure - Documented process guidelines                              |
| UOM  | Unit of Measurement - Standard unit for measuring items                                   |
| WHL  | Warehouse Location Items - Inventory items at specific locations                          |

---

### 12.2 Contact Information

**Development Team:**

- Email: dev@thimark.com
- Support: support@thimark.com

**System Administrator:**

- Email: admin@thimark.com

**Emergency Contact:**

- Phone: [Emergency Contact Number]
- Email: emergency@thimark.com

---

### 12.3 Version History

| Version | Date          | Author           | Changes              |
| ------- | ------------- | ---------------- | -------------------- |
| 1.0     | March 9, 2026 | Development Team | Initial SOP creation |

---

### 12.4 References

**External Documentation:**

- [React Documentation](https://reactjs.org/docs)
- [Axios Documentation](https://axios-http.com/docs)
- [Bootstrap Documentation](https://getbootstrap.com/docs)
- [Handsontable Documentation](https://handsontable.com/docs)

**Internal Documentation:**

- API Documentation (Backend team)
- Database Schema Documentation
- Network Architecture Documentation

---

### 12.5 Training Resources

**New Developer Onboarding:**

1. Review this SOP document
2. Set up development environment
3. Study BASE framework components
4. Review existing modules (Material, Model, Warehouse)
5. Create test module following development pattern
6. Code review with senior developer
7. Deploy to staging environment

**Module Development Training:**

1. Understand three-file pattern (ES/CS/DS)
2. Practice CRUD operations
3. Learn grid operations
4. Implement advance search
5. Add authorization checks
6. Test thoroughly

---

## Document Sign-Off

| Role                 | Name | Signature | Date |
| -------------------- | ---- | --------- | ---- |
| Project Manager      |      |           |      |
| Lead Developer       |      |           |      |
| QA Lead              |      |           |      |
| System Administrator |      |           |      |

---

**End of Document**

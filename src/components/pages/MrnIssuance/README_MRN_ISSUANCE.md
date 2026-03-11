# MRN Issuance - Mobile-Friendly Interface

## Overview

The MRN Issuance module provides a mobile-friendly, card-based interface for issuing materials from Material Receipt Notes (MRNs). This interface is optimized for scanning operations and touch-based interactions.

## Features

### 1. MRN Loading

- **Scan/Enter MRN ID**: Users can scan or manually enter an MRN ID to load details
- **Validation**: System checks if MRN is finalized (open MRNs cannot be issued)
- **API Used**: `GET /mrns/{id}`

### 2. Card-Based Material Display

Each MRN detail is displayed in a mobile-friendly card showing:

- Material name and ID
- MRN quantity
- Issuance status (Issued/Not Issued)
- Location scanning field
- Available balance (after location scan)
- Issue quantity input
- Issue button

### 3. Location Scanning & Balance Check

- Users scan location ID for each material
- System automatically fetches available balance from that location
- **API Used**: `GET /inventory/balance?location_id={location_id}&stock_item_id={stock_item_id}`

### 4. Issue Transaction

- Users enter issue quantity
- System validates quantity against available balance
- Transaction is recorded and card updates to show issued status
- **API Used**: `POST /mrn-issuance/issue`
  ```json
  {
    "mrn_detail_id": "string",
    "location_id": "string",
    "qty": number
  }
  ```

### 5. Delete Issued Transaction

- Users can delete transactions before completion
- Delete option is hidden after MRN issuance is completed
- **API Used**: `DELETE /mrn-issuance/delete/{mrn_detail_id}`

### 6. Complete Issuance

- Finalizes the MRN issuance process
- After completion, transactions cannot be deleted
- **API Used**: `POST /mrn-issuance/complete`
  ```json
  {
    "mrn_id": "string"
  }
  ```

## File Structure

### MrnIssuanceCS.js (Configuration/Schema)

Contains component definitions and configurations:

- Input fields (MRN scan, MRN details)
- Buttons (Load, Issue, Complete, Delete)
- Popup configurations
- Labels and schema definitions

### MrnIssuanceDS.js (Display/UI)

Handles the visual presentation:

- Mobile-responsive card layout
- Scan input fields with large touch targets
- Real-time status updates
- Empty states and loading indicators
- Responsive grid system (Bootstrap-based)

### MrnIssuanceES.js (Event Handlers/Logic)

Manages business logic and API interactions:

- MRN loading and validation
- Location scanning and balance fetching
- Issue quantity management
- Transaction creation and deletion
- Completion workflow
- Error handling

## User Workflow

1. **Start New Issuance**
   - Click "New Issuance" button to clear form
   - Scan or enter MRN ID
   - Click "Load MRN" button

2. **Validate MRN**
   - System checks if MRN status is "open"
   - If open: Shows error "MRN is not finalized"
   - If finalized: Loads MRN details into cards

3. **Issue Materials** (for each material):
   - Scan location ID in the card
   - System fetches and displays available balance
   - Enter issue quantity
   - Click "Issue" button
   - Card updates to show issued status

4. **Delete Transaction** (optional, before completion):
   - Click trash icon on issued card
   - Confirm deletion in popup
   - Transaction is removed and card resets

5. **Complete Issuance**
   - Click "Complete Issuance" button
   - Confirm in popup
   - System finalizes the issuance
   - Delete options are hidden

## API Endpoints Required

### Backend Implementation Needed:

1. **GET /mrns/{id}**
   - Already exists (used in MRN module)
   - Returns MRN with details array

2. **GET /inventory/balance**
   - Query params: `location_id`, `stock_item_id`
   - Returns: `{ available_balance: number }`

3. **POST /mrn-issuance/issue**
   - Body: `{ mrn_detail_id, location_id, qty }`
   - Creates issuance transaction
   - Returns: Success message

4. **DELETE /mrn-issuance/delete/{mrn_detail_id}**
   - Deletes issued transaction
   - Only allowed if issuance not completed

5. **POST /mrn-issuance/complete**
   - Body: `{ mrn_id }`
   - Marks issuance as completed
   - Returns: Success message

6. **POST /mrn-issuance/search** (for advance search)
   - Body: Search criteria
   - Returns: Array of matching MRNs

## Mobile Optimization

### Responsive Design

- Cards stack vertically on mobile devices
- Full-width buttons for easy tapping
- Large input fields (16px font) to prevent zoom on iOS
- Touch-friendly spacing (minimum 44×44px touch targets)

### Performance

- Lazy rendering of cards
- Optimized re-renders using React state management
- Efficient API calls only when needed

### Accessibility

- Clear visual feedback for scanned items
- Color-coded status indicators
- Loading spinners for async operations
- Error messages with descriptive text

## Styling

Custom CSS added to `custom.css`:

- Mobile-first responsive breakpoints
- Card hover effects
- Input focus states
- Success/error state styling
- Loading indicator animations

## Testing Checklist

- [ ] Load finalized MRN successfully
- [ ] Reject open MRN with proper error message
- [ ] Scan location and fetch balance
- [ ] Issue transaction with valid quantity
- [ ] Validate quantity against available balance
- [ ] Delete issued transaction before completion
- [ ] Complete issuance successfully
- [ ] Verify delete disabled after completion
- [ ] Test on mobile devices (iOS and Android)
- [ ] Test with barcode scanner input
- [ ] Test advance search functionality
- [ ] Test error handling for API failures

## Future Enhancements

1. **Batch Scanning**: Support scanning multiple locations/quantities at once
2. **Offline Mode**: Queue transactions when offline, sync when online
3. **Camera Integration**: Use device camera for barcode scanning
4. **Print Labels**: Generate and print issuance labels
5. **Reports**: View issuance history and analytics
6. **Partial Issuance**: Allow issuing partial quantities with notes

## Browser Support

- Chrome 90+ (Desktop & Mobile)
- Safari 14+ (iOS & macOS)
- Firefox 88+
- Edge 90+

## Notes for Developers

- Always validate input before API calls
- Handle loading states properly to prevent duplicate requests
- Clear state when starting new issuance
- Maintain consistent error handling across all operations
- Use proper TypeScript types if migrating to TypeScript
- Consider adding unit tests for critical functions

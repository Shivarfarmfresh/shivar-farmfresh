# Shivar Farmfresh — Google Sheets Order Logger
## Setup Guide (10 minutes, completely free)

---

## STEP 1 — Create a Google Sheet

1. Go to **sheets.google.com**
2. Create a new sheet — name it **Shivar Orders**
3. Copy the Sheet URL from the browser — you'll need it in Step 3

---

## STEP 2 — Create the Apps Script

1. In your Google Sheet, click **Extensions → Apps Script**
2. Delete everything in the editor
3. Paste the code below:

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Add headers on first run
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Order Ref', 'Date & Time', 'Status',
        'Customer Name', 'Phone', 'Address', 'PIN',
        'Items', 'Product Total (₹)', 'GST 5% (₹)', 'HSN Code',
        'Shipping Zone', 'Shipping (₹)', 'Grand Total (₹)',
        'Payment Method', 'Screenshot Uploaded', 'Notes'
      ]);
      // Format header row
      sheet.getRange(1, 1, 1, 17).setFontWeight('bold').setBackground('#0f2914').setFontColor('#ffffff');
      sheet.setFrozenRows(1);
    }
    
    const data = JSON.parse(e.postData.contents);
    const items = data.items.map(i => `${i.name} ${i.weight} ×${i.qty} = ₹${i.total}`).join(' | ');
    
    sheet.appendRow([
      data.ref,
      data.dateLocal,
      data.status,
      data.customer.name,
      data.customer.phone,
      data.customer.address,
      data.customer.pincode,
      items,
      data.pricing.productTotal,
      data.pricing.gst,
      data.pricing.hsnCode,
      data.pricing.shippingZone,
      data.pricing.shipping,
      data.pricing.grandTotal,
      data.payment.method,
      data.payment.screenshotUploaded ? 'Yes — check WhatsApp' : 'No',
      data.customer.note || ''
    ]);
    
    // Color new row based on status
    const lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 1, 1, 17).setBackground('#f0faf4');
    
    return ContentService.createTextOutput(JSON.stringify({ success: true, ref: data.ref }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput('Shivar Farmfresh Order API is running.')
    .setMimeType(ContentService.MimeType.TEXT);
}
```

---

## STEP 3 — Deploy as Web App

1. Click **Deploy → New deployment**
2. Click the ⚙️ gear icon → Select **Web app**
3. Set:
   - **Description**: Shivar Orders Receiver
   - **Execute as**: Me
   - **Who has access**: **Anyone**
4. Click **Deploy**
5. **Copy the Web App URL** — it looks like:
   `https://script.google.com/macros/s/AKfycb.../exec`

---

## STEP 4 — Paste URL into your website

1. Open `index.html` on GitHub
2. Find this line near the top of the `<script>` section:
   ```javascript
   const GOOGLE_SHEET_URL = ''; // ← paste your Google Apps Script URL here
   ```
3. Paste your URL inside the quotes:
   ```javascript
   const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/YOUR_ID/exec';
   ```
4. Commit the change — live in 2 minutes

---

## What Your Sheet Will Look Like

Every order appears as a new row with:

| Order Ref | Date | Status | Name | Phone | Address | Items | GST | Grand Total | ... |
|---|---|---|---|---|---|---|---|---|---|
| SF-930720 | 08/03/2026 | Awaiting Verification | Prashant G | 7776931359 | Pune... | 1kg ×1 | ₹33 | ₹768 | ... |

---

## For GST Filing

The sheet automatically captures:
- **HSN Code**: 09103030 (packaged turmeric powder)
- **GST Rate**: 5%
- **GST Amount** per order
- **Grand Total** per order

Export as Excel or CSV every month for your CA / GST filing.

---

## To Mark Orders as Confirmed

When you verify a payment, just change the **Status** column from
`Awaiting Verification` → `Confirmed & Dispatched`

You can also add a **Tracking Number** column manually.

# Business Processes

The protocol has three required business processes: terminal activation, terminal check-in, and transaction processing.

## Terminal Activation

Each terminal must be activated once before it can process transactions.

1. The partner receives `vendor_sn`, `vendor_key`, `app_id`, and activation codes through onboarding.
2. The terminal calls `POST /terminal/activate` signed with `vendor_sn` and `vendor_key`.
3. MUWE returns `terminal_sn` and `terminal_key`.
4. The terminal stores both values securely and uses them for check-in and transaction requests.

Activation codes belong to stores, have usage limits, and can expire. A multi-use activation code creates a new terminal identity for every successful activation.

## Terminal Check-in

Check-in rotates the terminal key and limits the useful lifetime of a leaked key.

1. The terminal signs `POST /terminal/checkin` with the current `terminal_sn` and `terminal_key`.
2. MUWE returns a fresh `terminal_key`.
3. The client replaces the stored key only after a successful response.
4. After check-in, only the current and previous keys are valid.

Check in at least once per day and before the first transaction of the day.

## Transactions

Transaction APIs are signed with `terminal_sn` and `terminal_key`.

| Flow | API | Purpose |
| --- | --- | --- |
| Barcode payment | `POST /upay/v2/pay` | Cashier scans a customer payment barcode. |
| QR payment | `POST /upay/v2/precreate` | Merchant creates an order and displays a QR code or payment URL. |
| Query | `POST /upay/v2/query` | Resolve uncertain results and fetch the latest order state. |
| Refund | `POST /upay/v2/refund` | Refund a paid order, including multiple partial refunds. |
| Cancel | `POST /upay/v2/cancel` | Cancel an unpaid or uncertain order. |
| Revoke | `POST /upay/v2/revoke` | Same-day reversal when supported; use only when explicitly enabled. |

The client must treat network timeouts and `*_IN_PROGRESS` business results as uncertain. Query before showing final success or creating a replacement order.

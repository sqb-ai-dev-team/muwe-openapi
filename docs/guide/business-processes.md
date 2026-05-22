# Business Processes

The protocol has three required business processes: terminal activation, terminal check-in, and transaction processing.

<div class="process-flow" aria-label="Business process overview">
  <div class="process-flow__row">
    <div class="process-flow__step"><strong>Activate terminal</strong><span>Bind the physical or logical terminal and receive terminal credentials.</span></div>
    <div class="process-flow__step"><strong>Check in</strong><span>Rotate the terminal key before daily transaction processing.</span></div>
    <div class="process-flow__step"><strong>Create transaction</strong><span>Start a payment request, QR order, or MIS-to-POS pushed order.</span></div>
    <div class="process-flow__step"><strong>Resolve result</strong><span>Use notification, query, cancel, refund, or revoke according to the final state.</span></div>
  </div>
</div>

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
| Merchant-initiated payment | `POST /upay/v2/pay` | Merchant starts a payment request and the consumer completes payment through the configured provider flow. |
| QR payment | `POST /upay/v2/precreate` | Merchant creates an order and displays a QR code or payment URL. |
| MIS-to-POS order push | Partner integration | Merchant MIS or cashier system creates an order and pushes it to a bound POS terminal. |
| Query | `POST /upay/v2/query` | Resolve uncertain results and fetch the latest order state. |
| Refund | `POST /upay/v2/refund` | Refund a paid order, including multiple partial refunds. |
| Cancel | `POST /upay/v2/cancel` | Cancel an unpaid or uncertain order. |
| Revoke | `POST /upay/v2/revoke` | Same-day reversal when supported; use only when explicitly enabled. |

MUWE supports MIS-to-POS order push scenarios in the same transaction lifecycle. A merchant MIS or cashier system can create an order, send it to a bound POS terminal, complete the consumer-facing payment flow on the POS, and then use notification or query to reconcile the final result.

The client must treat network timeouts and `*_IN_PROGRESS` business results as uncertain. Query before showing final success or creating a replacement order.

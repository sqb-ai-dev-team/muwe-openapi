# Business Processes

MUWE transactions are initiated from the terminal dimension. A terminal is a customer-owned physical device, POS application, cashier workstation, or logical integration endpoint that has developer capability and is activated into MUWE before it can send transaction requests.

<div class="process-map" aria-label="Business process overview">
  <div class="process-map__lane">
    <div class="process-map__lane-title">Customer terminal</div>
    <div class="process-map__node"><span>1</span><strong>Activate own terminal</strong><p>Use the onboarding activation code to register the customer's terminal with MUWE.</p></div>
    <div class="process-map__node"><span>2</span><strong>Check in</strong><p>Rotate the terminal key before transaction processing.</p></div>
  </div>
  <div class="process-map__lane">
    <div class="process-map__lane-title">Merchant operation</div>
    <div class="process-map__node"><span>3</span><strong>Create transaction</strong><p>Start a pay, QR, or MIS-to-POS order from a terminal identity.</p></div>
    <div class="process-map__node"><span>4</span><strong>Consumer pays</strong><p>Complete payment through the configured provider or POS flow.</p></div>
  </div>
  <div class="process-map__lane">
    <div class="process-map__lane-title">Recovery and reconciliation</div>
    <div class="process-map__node"><span>5</span><strong>Resolve result</strong><p>Use notification and query to reach a final state.</p></div>
    <div class="process-map__node"><span>6</span><strong>Reverse if needed</strong><p>Cancel, refund, or revoke according to order state and provider capability.</p></div>
  </div>
</div>

## Terminal Activation

Terminal activation is not activation of a MUWE-owned terminal. It is the process where a developer-capable customer activates its own terminal into the MUWE system. The activated terminal receives a MUWE terminal identity, and later transactions are initiated from that terminal dimension.

1. The partner or customer receives `vendor_sn`, `vendor_key`, `app_id`, and activation codes through onboarding.
2. The customer's terminal calls `POST /terminal/activate`, signed with `vendor_sn` and `vendor_key`.
3. MUWE validates the activation code, store scope, application, and terminal metadata.
4. MUWE returns `terminal_sn` and `terminal_key`.
5. The customer terminal stores both values securely and uses them for check-in and transaction requests.

Activation codes belong to stores, have usage limits, and can expire. A multi-use activation code creates a new MUWE terminal identity for every successful customer terminal activation.

## Terminal Check-in

Check-in rotates the terminal key and limits the useful lifetime of a leaked key.

1. The customer terminal signs `POST /terminal/checkin` with the current `terminal_sn` and `terminal_key`.
2. MUWE returns a fresh `terminal_key`.
3. The client replaces the stored key only after a successful response.
4. After check-in, only the current and previous keys are valid.

Check in at least once per day and before the first transaction of the day.

## Transactions

Transaction APIs are signed with `terminal_sn` and `terminal_key`. The merchant system can be a POS device, cashier application, MIS, or another customer terminal that was activated into MUWE.

<div class="flow-grid" aria-label="Transaction flows">
  <div class="flow-card">
    <strong>Merchant-initiated payment</strong>
    <code>POST /upay/v2/pay</code>
    <p>The merchant starts a payment request from an activated terminal, and the consumer completes payment through the configured provider flow.</p>
  </div>
  <div class="flow-card">
    <strong>QR payment</strong>
    <code>POST /upay/v2/precreate</code>
    <p>The merchant creates an order and displays a QR code or payment URL. The final payment result arrives later by notification or query.</p>
  </div>
  <div class="flow-card">
    <strong>MIS-to-POS order push</strong>
    <code>Partner integration</code>
    <p>Merchant MIS creates an order and pushes it to a bound POS terminal, where the consumer-facing payment flow is completed.</p>
  </div>
  <div class="flow-card">
    <strong>Query</strong>
    <code>POST /upay/v2/query</code>
    <p>Resolve uncertain results and fetch the latest order state before delivery or replacement actions.</p>
  </div>
  <div class="flow-card">
    <strong>Refund</strong>
    <code>POST /upay/v2/refund</code>
    <p>Refund a paid order, including multiple partial refunds identified by `refund_request_no`.</p>
  </div>
  <div class="flow-card">
    <strong>Cancel / Revoke</strong>
    <code>/cancel and /revoke</code>
    <p>Cancel unpaid or uncertain orders; revoke same-day paid orders only when the provider supports it.</p>
  </div>
</div>

MUWE supports MIS-to-POS order push scenarios in the same transaction lifecycle. A merchant MIS or cashier system can create an order, send it to a bound POS terminal, complete the consumer-facing payment flow on the POS, and then use notification or query to reconcile the final result.

The client must treat network timeouts and `*_IN_PROGRESS` business results as uncertain. Query before showing final success or creating a replacement order.

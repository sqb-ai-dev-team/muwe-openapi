# Payment Flow

Payment APIs return request-level results in `result_code` and business results in `biz_response.result_code`. HTTP 200 does not mean the payment succeeded. All payment requests are initiated from an activated customer terminal identity.

<div class="sequence-diagram" aria-label="Payment lifecycle">
  <div class="sequence-diagram__actors">
    <span>Customer terminal</span>
    <span>MUWE OpenAPI</span>
    <span>Payment provider</span>
    <span>Consumer</span>
  </div>
  <div class="sequence-diagram__body">
    <div class="sequence-step"><strong>1</strong><p>Terminal submits signed pay, pre-create, or pushed order request with `terminal_sn`.</p></div>
    <div class="sequence-step sequence-step--right"><strong>2</strong><p>MUWE validates terminal credentials, merchant scope, idempotency key, and provider route.</p></div>
    <div class="sequence-step sequence-step--right"><strong>3</strong><p>Provider handles payment authorization or returns the consumer payment payload.</p></div>
    <div class="sequence-step sequence-step--dashed"><strong>4</strong><p>Consumer completes payment in the configured channel or at the bound POS terminal.</p></div>
    <div class="sequence-step sequence-step--right"><strong>5</strong><p>MUWE returns success, failure, or in-progress business status.</p></div>
    <div class="sequence-step sequence-step--warn"><strong>6</strong><p>If the result is uncertain, query before delivery, cancel, refund, or retry decisions.</p></div>
  </div>
</div>

## Merchant-Initiated Payment

<div class="mini-sequence" aria-label="Merchant initiated payment sequence">
  <div><strong>Customer terminal</strong><span>Creates order and calls `POST /upay/v2/pay` with a unique `client_sn`.</span></div>
  <div><strong>MUWE OpenAPI</strong><span>Validates terminal signature, routes the request, and returns business result.</span></div>
  <div><strong>Provider / consumer</strong><span>Completes payment or leaves the order in progress.</span></div>
</div>

1. Cashier, POS, or merchant MIS starts the payment request from an activated customer terminal.
2. Client submits `POST /upay/v2/pay` with a unique `client_sn`.
3. If `biz_response.result_code` is `PAY_SUCCESS`, deliver goods.
4. If it is `PAY_IN_PROGRESS`, or the network fails after the request may have reached MUWE, query by `client_sn`.
5. If the order cannot reach a final state within the merchant timeout, call `POST /upay/v2/cancel`.
6. Never reuse the same `client_sn` for a new payment attempt after a failed or uncertain pay request.

## MIS-to-POS Order Push

<div class="mini-sequence" aria-label="MIS to POS order push sequence">
  <div><strong>Merchant MIS</strong><span>Creates an order for a selected bound POS terminal.</span></div>
  <div><strong>Bound POS terminal</strong><span>Receives the order and drives the consumer payment flow.</span></div>
  <div><strong>MUWE / provider</strong><span>Processes payment and exposes the final result by notification or query.</span></div>
</div>

1. Merchant MIS or cashier system creates an order for a bound POS terminal.
2. The POS receives the order and drives the consumer-facing payment flow.
3. MUWE processes the payment through the configured provider.
4. The client receives notification or polls `POST /upay/v2/query` until a final order status is reached.

## QR Pre-create

<div class="mini-sequence" aria-label="QR pre-create sequence">
  <div><strong>Customer terminal</strong><span>Calls `POST /upay/v2/precreate` for a merchant order.</span></div>
  <div><strong>MUWE OpenAPI</strong><span>Returns `qr_code` or provider payment payload.</span></div>
  <div><strong>Consumer app</strong><span>Scans or opens the payment payload and completes payment.</span></div>
</div>

1. Client calls `POST /upay/v2/precreate`.
2. MUWE returns `qr_code` or a provider payment payload.
3. Merchant renders the QR code or payment URL.
4. Customer completes payment in the provider app.
5. Client waits for notification or polls `POST /upay/v2/query`.

## Refund

Refunds are idempotent by `refund_request_no`.

1. Query the order and confirm it is refundable.
2. Call `POST /upay/v2/refund` with either `sn` or `client_sn` and a unique `refund_request_no`.
3. If the refund result is uncertain, query using the original order identity and `refund_request_no`.
4. Do not submit a replacement refund with a new `refund_request_no` until the first one is final.

## Cancel Recovery

`cancel` is for unpaid or uncertain orders. Use it when the client cannot prove that a payment failed but must prevent later success.

If `cancel` returns `CANCEL_SUCCESS`, the order is closed. If it returns `CANCEL_ERROR`, `CANCEL_ABORT_ERROR`, or a network timeout, keep querying and escalate if the order does not reach a final state.

## Revoke

`revoke` is not the same operation as `cancel`. Use `POST /upay/v2/revoke` only for same-day reversal of a paid order when the provider route explicitly supports it.

## Final Statuses

| Status | Meaning |
| --- | --- |
| `PAID` | Payment completed. |
| `PAY_CANCELED` | Payment failed and was canceled. |
| `REFUNDED` | Fully refunded. |
| `PARTIAL_REFUNDED` | Partially refunded. |
| `CANCELED` | Order canceled before payment completion. |

Intermediate states such as `CREATED`, `IN_PROG`, `ERROR_RECOVERY`, and `PRE_SUCCESS` are not final. Query until a final state is returned or support intervention is required.

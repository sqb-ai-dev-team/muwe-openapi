# Payment Flow

Payment APIs return request-level results in `result_code` and business results in `biz_response.result_code`. HTTP 200 does not mean the payment succeeded.

<div class="process-flow" aria-label="Payment lifecycle">
  <div class="process-flow__row">
    <div class="process-flow__step"><strong>Create request</strong><span>Submit pay, pre-create, or a POS-bound order from the merchant system.</span></div>
    <div class="process-flow__step"><strong>Consumer pays</strong><span>The consumer completes payment through the configured provider or POS flow.</span></div>
    <div class="process-flow__step"><strong>Receive result</strong><span>MUWE returns a final or in-progress business result.</span></div>
    <div class="process-flow__step"><strong>Recover uncertainty</strong><span>Query before delivery; cancel only when success cannot be proven in time.</span></div>
  </div>
</div>

## Merchant-Initiated Payment

1. Cashier, POS, or merchant MIS starts the payment request.
2. Client submits `POST /upay/v2/pay` with a unique `client_sn`.
3. If `biz_response.result_code` is `PAY_SUCCESS`, deliver goods.
4. If it is `PAY_IN_PROGRESS`, or the network fails after the request may have reached MUWE, query by `client_sn`.
5. If the order cannot reach a final state within the merchant timeout, call `POST /upay/v2/cancel`.
6. Never reuse the same `client_sn` for a new payment attempt after a failed or uncertain pay request.

## MIS-to-POS Order Push

1. Merchant MIS or cashier system creates an order for a bound POS terminal.
2. The POS receives the order and drives the consumer-facing payment flow.
3. MUWE processes the payment through the configured provider.
4. The client receives notification or polls `POST /upay/v2/query` until a final order status is reached.

## QR Pre-create

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

`cancel` is for unilateral or uncertain orders. Use it when the client cannot prove that a payment failed but must prevent later success.

If `cancel` returns `CANCEL_SUCCESS`, the order is closed. If it returns `CANCEL_ERROR`, `CANCEL_ABORT_ERROR`, or a network timeout, keep querying and escalate if the order does not reach a final state.

## Final Statuses

| Status | Meaning |
| --- | --- |
| `PAID` | Payment completed. |
| `PAY_CANCELED` | Payment failed and was canceled. |
| `REFUNDED` | Fully refunded. |
| `PARTIAL_REFUNDED` | Partially refunded. |
| `CANCELED` | Order canceled before payment completion. |

Intermediate states such as `CREATED`, `IN_PROG`, `ERROR_RECOVERY`, and `PRE_SUCCESS` are not final. Query until a final state is returned or support intervention is required.

# Payment Flow

Payment APIs return request-level results in `result_code` and business results in `biz_response.result_code`. HTTP 200 does not mean the payment succeeded.

## Barcode Payment

1. Cashier scans the customer's barcode.
2. Client submits `POST /upay/v2/pay` with a unique `client_sn`.
3. If `biz_response.result_code` is `PAY_SUCCESS`, deliver goods.
4. If it is `PAY_IN_PROGRESS`, or the network fails after the request may have reached MUWE, query by `client_sn`.
5. If the order cannot reach a final state within the merchant timeout, call `POST /upay/v2/cancel`.
6. Never reuse the same `client_sn` for a new payment attempt after a failed or uncertain pay request.

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

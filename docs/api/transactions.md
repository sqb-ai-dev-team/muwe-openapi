# Transactions

## Pay

`POST /upay/v2/pay`

Creates a merchant-initiated payment transaction.

Required request fields:

| Field | Type | Notes |
| --- | --- | --- |
| `terminal_sn` | string | Terminal serial number. |
| `client_sn` | string | Unique order number in the client system. |
| `total_amount` | string | Amount in cents. |
| `dynamic_id` | string | Payment credential or provider payment token supplied by the consumer/provider flow. |
| `subject` | string | Transaction subject. |
| `operator` | string | Cashier or operator identifier. |

## Pre-create

`POST /upay/v2/precreate`

Creates a QR-code payment order.

Required request fields:

| Field | Type | Notes |
| --- | --- | --- |
| `terminal_sn` | string | Terminal serial number. |
| `client_sn` | string | Unique order number in the client system. |
| `total_amount` | string | Amount in cents. |
| `payway` | string | Payment provider. |
| `subject` | string | Transaction subject. |
| `operator` | string | Cashier or operator identifier. |

## Query

`POST /upay/v2/query`

Queries order status after an uncertain payment result or callback gap.

## Refund

`POST /upay/v2/refund`

Refunds a paid transaction. Refund behavior must be idempotent using the client-side refund serial number.

## Cancel

`POST /upay/v2/cancel`

Cancels an unpaid or uncertain order before completion.

## Revoke

`POST /upay/v2/revoke`

Reverses a transaction when supported by the payment provider and settlement window.

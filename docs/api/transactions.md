# Transactions

Transaction APIs are signed with `terminal_sn` and the current `terminal_key`. All money amounts are integer strings in cents.

`client_sn` must be unique in the partner system. If a payment attempt fails and the cashier retries, submit a new transaction with a new `client_sn`.

## Common Request Fields

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `terminal_sn` | string(32) | Yes | Terminal serial number. |
| `client_sn` | string(32) | Yes for pay/pre-create; conditional for query/refund/cancel/revoke | Partner order number. |
| `sn` | string(16) | Conditional | MUWE order number. If both `sn` and `client_sn` are sent, `sn` has priority. |
| `operator` | string(32) | Operation-specific | Cashier or operator identifier. |
| `extended` | object | No | Up to 24 provider passthrough fields. Keys <= 64 chars, values <= 256 chars. |
| `goods_details` | array | No | Goods lines. Each item has `goods_id`, `goods_name`, `quantity`, `price`, and `promotion_type`. |

## Pay

`POST /upay/v2/pay`

Creates a barcode payment transaction. MUWE can infer the provider from `dynamic_id`; send `payway` only when the provider must be fixed.

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `terminal_sn` | string(32) | Yes | Terminal serial number. |
| `client_sn` | string(32) | Yes | Unique partner order number. |
| `total_amount` | string(10) | Yes | Total amount in cents. |
| `payway` | string | No | Payment service provider. |
| `dynamic_id` | string(32) | Yes | Customer payment barcode. |
| `subject` | string(64) | Yes | Transaction subject. |
| `operator` | string(32) | Yes | Cashier or operator identifier. |
| `description` | string(255) | No | Detailed transaction description. |
| `longitude` | string | No | Must be sent with `latitude`. |
| `latitude` | string | No | Must be sent with `longitude`. |
| `device_id` | string(32) | No | Terminal device identifier. |
| `extended` | object | No | Provider passthrough fields. |
| `goods_details` | array | No | Goods detail lines. |
| `reflect` | string(64) | No | Returned unchanged in responses/callbacks. |
| `notify_url` | string(128) | No | Callback URL for payment result. |

Business result codes include `PAY_SUCCESS`, `PAY_FAIL`, and `PAY_FAIL_ERROR`. For uncertain responses or network failure after submission, query the order before deciding what the cashier sees.

## Pre-create

`POST /upay/v2/precreate`

Creates an order and returns a QR code or provider WAP payload.

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `terminal_sn` | string(32) | Yes | Terminal serial number. |
| `client_sn` | string(32) | Yes | Unique partner order number. |
| `total_amount` | string(10) | Yes | Total amount in cents. |
| `payway` | string | Yes | Payment service provider. |
| `sub_payway` | string | No | Payment method. |
| `payer_uid` | string(64) | No | Required by some official account or mini-program flows. |
| `subject` | string(64) | Yes | Transaction subject. |
| `operator` | string(32) | Yes | Cashier or operator identifier. |
| `description` | string(255) | No | Detailed transaction description. |
| `longitude` | string | No | Must be sent with `latitude`. |
| `latitude` | string | No | Must be sent with `longitude`. |
| `device_id` | string(32) | No | Terminal device identifier. |
| `extended` | object | No | Provider passthrough fields. |
| `goods_details` | array | No | Goods detail lines. |
| `reflect` | string(64) | No | Returned unchanged in responses/callbacks. |
| `notify_url` | string(128) | No | Callback URL for payment result. |

Business result codes include `PRECREATE_SUCCESS` and `PRECREATE_FAIL`. After success, poll/query the order. Pre-created orders are normally valid for about four minutes; use a short polling interval early, then slow down.

## Query

`POST /upay/v2/query`

Gets the latest order or refund state. Either `sn` or `client_sn` is required. If both are present, `sn` is used first.

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `terminal_sn` | string(32) | Yes | Terminal serial number. |
| `sn` | string(16) | Conditional | MUWE order number. |
| `client_sn` | string(32) | Conditional | Partner order number. |
| `refund_request_no` | string(20) | No | Query one partial refund result. |

Successful query uses `biz_response.result_code = SUCCESS`. The client must inspect `biz_response.data.order_status`.

## Refund

`POST /upay/v2/refund`

Refunds a paid order. Multiple partial refunds are supported. Either `sn` or `client_sn` is required; `sn` has priority when both are present.

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `terminal_sn` | string(32) | Yes | Terminal serial number. |
| `sn` | string(16) | Conditional | MUWE order number. |
| `client_sn` | string(32) | Conditional | Partner order number. |
| `refund_request_no` | string(20) | Yes | Idempotency key for one refund request. Reuse it for retries of the same refund. |
| `operator` | string(32) | Yes | Cashier or operator identifier. |
| `refund_amount` | string(10) | Yes | Refund amount in cents. Must not exceed refundable amount. |
| `extended` | object | No | Provider passthrough fields. |
| `goods_details` | array | No | Refunded goods lines. |

Business result codes include `REFUND_SUCCESS`, `REFUND_ERROR`, and `FAIL`. Refund requests are normally accepted only within the provider's refund window.

## Cancel

`POST /upay/v2/cancel`

Cancels an unpaid or uncertain order. Either `sn` or `client_sn` is required; `sn` has priority when both are present.

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `terminal_sn` | string(32) | Yes | Terminal serial number. |
| `sn` | string(16) | Conditional | MUWE order number. |
| `client_sn` | string(32) | Conditional | Partner order number. |

Business result codes include `CANCEL_SUCCESS`, `CANCEL_ERROR`, `CANCEL_ABORT_SUCCESS`, `CANCEL_ABORT_ERROR`, and `FAIL`.

## Revoke

`POST /upay/v2/revoke`

Reverses a transaction when the payment provider and settlement window support same-day reversal. Prefer refund for normal post-payment returns.

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `terminal_sn` | string(32) | Yes | Terminal serial number. |
| `sn` | string(16) | Conditional | MUWE order number. |
| `client_sn` | string(32) | Conditional | Partner order number. |

## Common Response Fields

| Field | Type | Notes |
| --- | --- | --- |
| `result_code` | string | Request result: `200`, `400`, or `500`. |
| `error_code` | string | Request-level error code when `result_code` is not `200`. |
| `error_message` | string | Request-level error message. |
| `biz_response.result_code` | string | Business result code. |
| `biz_response.error_code` | string | Business error code. |
| `biz_response.error_message` | string | Business error message. |
| `biz_response.data.sn` | string(16) | MUWE order number. |
| `biz_response.data.client_sn` | string(32) | Partner order number. |
| `biz_response.data.client_tsn` | string(53) | Refund transaction serial number, usually `client_sn-refund_request_no`. |
| `biz_response.data.trade_no` | string(64) | Provider order number. |
| `biz_response.data.status` | string(32) | Transaction status. |
| `biz_response.data.order_status` | string(32) | Order status. |
| `biz_response.data.payway` | string | Payment provider. |
| `biz_response.data.payway_name` | string(128) | Provider name. |
| `biz_response.data.sub_payway` | string | Payment method. |
| `biz_response.data.payer_uid` | string(64) | Payer ID in provider system. |
| `biz_response.data.payer_login` | string(128) | Masked payer login. |
| `biz_response.data.total_amount` | string(10) | Original amount in cents. |
| `biz_response.data.net_amount` | string(10) | Remaining net amount in cents. |
| `biz_response.data.subject` | string(64) | Transaction subject. |
| `biz_response.data.finish_time` | string(13) | MUWE finish time in Unix milliseconds. |
| `biz_response.data.channel_finish_time` | string(13) | Provider finish time in Unix milliseconds. |
| `biz_response.data.operator` | string(32) | Operator identifier. |
| `biz_response.data.reflect` | string(64) | Reflected request value. |
| `biz_response.data.qr_code` | string(128) | QR payment value or URL for pre-create. |
| `biz_response.data.wap_pay_request` | string(1024) | Provider WAP payload. |
| `biz_response.data.payment_list` | array | Preferential information. |

## Examples

### Pay Success

```json
{
  "result_code": "200",
  "biz_response": {
    "result_code": "PAY_SUCCESS",
    "data": {
      "sn": "7894259244067349",
      "client_sn": "muwe-mx-100001",
      "status": "SUCCESS",
      "payway": "3",
      "sub_payway": "1",
      "order_status": "PAID",
      "trade_no": "4003262001201704187463804544",
      "total_amount": "1000",
      "net_amount": "1000",
      "finish_time": "1492506702864",
      "channel_finish_time": "1492506702000",
      "subject": "MUWE demo order",
      "operator": "cashier-01"
    }
  }
}
```

### Request Error

```json
{
  "result_code": "400",
  "error_code": "INVALID_PARAMS",
  "error_message": "total_amount must be an integer string in cents"
}
```

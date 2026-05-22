# Refund

`POST /upay/v2/refund`

Refunds a paid order. Multiple partial refunds are supported when the provider and merchant configuration allow them.

## Request

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `terminal_sn` | string(32) | Yes | Terminal serial number. |
| `sn` | string(16) | Conditional | MUWE order serial number. |
| `client_sn` | string(32) | Conditional | Client order number. |
| `refund_request_no` | string(20) | Yes | Client refund idempotency key. |
| `operator` | string(32) | Yes | Operator identifier. |
| `refund_amount` | string(10) | Yes | Refund amount in cents; less than or equal to remaining refundable amount. |
| `extended` | object | No | Provider extension fields. |
| `goods_details` | array | No | Goods being refunded. |

Either `sn` or `client_sn` must be present. If both are present, `sn` identifies the order.

## Example

```bash
curl -X POST 'https://vsi-api.shouqianba.com/upay/v2/refund' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: 10298371039 <md5-of-raw-body-plus-terminal-key>' \
  -d '{"terminal_sn":"10298371039","client_sn":"MEX202605220001","refund_request_no":"RF202605220001","refund_amount":"500","operator":"cashier01"}'
```

## Success

```json
{
  "result_code": "200",
  "biz_response": {
    "result_code": "REFUND_SUCCESS",
    "data": {
      "sn": "7893259247405832",
      "client_sn": "MEX202605220001",
      "client_tsn": "MEX202605220001-RF202605220001",
      "status": "SUCCESS",
      "order_status": "PARTIAL_REFUNDED",
      "total_amount": "1000",
      "net_amount": "500"
    }
  }
}
```

## Recovery

`refund_request_no` prevents duplicate refund requests. If the response is uncertain, query using the same order identity and the same `refund_request_no`; do not create a second refund id until the first result is final.

# Pay

`POST /upay/v2/pay`

Creates a barcode payment. MUWE determines the provider from `dynamic_id` unless `payway` is supplied.

## Request

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `terminal_sn` | string(32) | Yes | Terminal serial number. |
| `client_sn` | string(32) | Yes | Unique order number in the client system. |
| `total_amount` | string(10) | Yes | Amount in cents. |
| `payway` | string | No | Provider override. Omit to infer from barcode. |
| `dynamic_id` | string(32) | Yes | Customer payment barcode. |
| `subject` | string(64) | Yes | Transaction subject. |
| `operator` | string(32) | Yes | Cashier or operator identifier. |
| `description` | string(255) | No | Detailed transaction description. |
| `longitude` / `latitude` | string | No | Must be supplied together. |
| `device_id` | string(32) | No | Terminal device identifier. |
| `extended` | object | No | Provider extension fields, maximum 24 keys. |
| `goods_details` | array | No | Goods list; see Reference. |
| `reflect` | string(64) | No | Value echoed back for client reconciliation. |
| `notify_url` | string(128) | No | Callback URL for payment result. |

`client_sn` is an idempotency boundary for one payment attempt. If the first payment attempt fails and the customer retries a new payment, use a new `client_sn`.

## Example

```bash
curl -X POST 'https://vsi-api.shouqianba.com/upay/v2/pay' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: 10298371039 <md5-of-raw-body-plus-terminal-key>' \
  -d '{"terminal_sn":"10298371039","client_sn":"MEX202605220001","total_amount":"1000","dynamic_id":"130818341921441147","subject":"MUWE test order","operator":"cashier01","notify_url":"https://partner.example.mx/muwe/notify"}'
```

## Success

```json
{
  "result_code": "200",
  "biz_response": {
    "result_code": "PAY_SUCCESS",
    "data": {
      "sn": "7893259247405832",
      "client_sn": "MEX202605220001",
      "status": "SUCCESS",
      "order_status": "PAID",
      "payway": "3",
      "sub_payway": "1",
      "total_amount": "1000",
      "net_amount": "1000",
      "subject": "MUWE test order",
      "operator": "cashier01",
      "finish_time": "1779436800000"
    }
  }
}
```

## In Progress

```json
{
  "result_code": "200",
  "biz_response": {
    "result_code": "PAY_IN_PROGRESS",
    "data": {
      "sn": "789200393929142",
      "client_sn": "MEX202605220001",
      "status": "IN_PROG",
      "order_status": "CREATED",
      "total_amount": "1000"
    }
  }
}
```

## Recovery

- `PAY_SUCCESS`: deliver goods.
- `PAY_FAIL`: do not deliver goods; use a new `client_sn` for a new payment attempt.
- `PAY_IN_PROGRESS` or network timeout: query by `client_sn`.
- If polling cannot prove success before merchant timeout, call cancel.

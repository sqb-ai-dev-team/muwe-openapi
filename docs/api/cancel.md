# Cancel

`POST /upay/v2/cancel`

Cancels an unpaid or uncertain order to avoid a late payment result after the merchant has already failed the sale.

## Request

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `terminal_sn` | string(32) | Yes | Terminal serial number. |
| `sn` | string(16) | Conditional | MUWE order serial number. |
| `client_sn` | string(32) | Conditional | Client order number. |

Either `sn` or `client_sn` must be present. If both are present, `sn` identifies the order.

## Example

```bash
curl -X POST 'https://vsi-api.shouqianba.com/upay/v2/cancel' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: 10298371039 <md5-of-raw-body-plus-terminal-key>' \
  -d '{"terminal_sn":"10298371039","client_sn":"MEX202605220001"}'
```

## Success

```json
{
  "result_code": "200",
  "biz_response": {
    "result_code": "CANCEL_SUCCESS",
    "data": {
      "sn": "7893259247405832",
      "client_sn": "MEX202605220001",
      "status": "SUCCESS",
      "order_status": "CANCELED",
      "total_amount": "1000",
      "net_amount": "0"
    }
  }
}
```

## When To Call

Call cancel when pay is uncertain and the merchant cannot wait longer. If cancel is uncertain, continue querying. Do not deliver goods until query confirms `PAID`; do not assume failure until query or cancel reaches a final failure/canceled state.

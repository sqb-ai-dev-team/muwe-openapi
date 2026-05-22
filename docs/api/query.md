# Query

`POST /upay/v2/query`

Queries the latest order or refund status.

## Request

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `terminal_sn` | string(32) | Yes | Terminal serial number. |
| `sn` | string(16) | Conditional | MUWE order serial number. |
| `client_sn` | string(32) | Conditional | Client order number. |
| `refund_request_no` | string(20) | No | Refund request number for querying a partial refund. |

Either `sn` or `client_sn` must be present. If both are present, `sn` identifies the order.

## Example

```bash
curl -X POST 'https://vsi-api.shouqianba.com/upay/v2/query' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: 10298371039 <md5-of-raw-body-plus-terminal-key>' \
  -d '{"terminal_sn":"10298371039","client_sn":"MEX202605220001"}'
```

## Success

```json
{
  "result_code": "200",
  "biz_response": {
    "result_code": "SUCCESS",
    "data": {
      "sn": "7893259247405832",
      "client_sn": "MEX202605220001",
      "status": "SUCCESS",
      "order_status": "PAID",
      "payway": "3",
      "payway_name": "Wechat pay",
      "total_amount": "1000",
      "net_amount": "1000",
      "finish_time": "1779436800000"
    }
  }
}
```

## Usage

Use query after any timeout, `*_IN_PROGRESS`, callback gap, or operational reconciliation mismatch. Query is the only safe way to decide whether to deliver goods after an uncertain pay request.

# Log Upload

`POST /terminal/uploadLog`

Log upload is an operational endpoint for support diagnostics. It is not part of the payment authorization path.

## Signing

Sign with `terminal_sn` and the current `terminal_key`.

## Request

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `terminal_sn` | string(32) | Yes | Terminal serial number. |
| `device_id` | string | Yes | Device identifier. |
| `log_type` | string | Yes | Client-defined category such as `transaction`, `network`, or `device`. |
| `content` | string | Yes | Log payload or uploaded log reference agreed during onboarding. |
| `occurred_at` | string | No | Event time in ISO 8601 or Unix milliseconds. |

## Example

```bash
curl -X POST 'https://vsi-api.shouqianba.com/terminal/uploadLog' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: 10298371039 <md5-of-raw-body-plus-terminal-key>' \
  -d '{"terminal_sn":"10298371039","device_id":"android-imei-001","log_type":"network","content":"pay timeout client_sn=MEX202605220001","occurred_at":"2026-05-22T08:00:00Z"}'
```

## Response

```json
{
  "result_code": "200",
  "biz_response": {
    "result_code": "SUCCESS"
  }
}
```

Logs must never contain `vendor_key`, `terminal_key`, customer PAN data, or full payment credentials.

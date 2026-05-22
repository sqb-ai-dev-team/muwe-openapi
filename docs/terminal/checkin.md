# Check-in

`POST /terminal/checkin`

Check-in rotates a terminal key. Terminals should check in at least once per day and before the first transaction of the day.

## Signing

Sign with the terminal's current `terminal_sn` and `terminal_key`.

## Request

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `terminal_sn` | string(32) | Yes | Terminal serial number returned by activation or previous check-in. |
| `device_id` | string | Yes | Device identifier such as IMEI or iOS identifierForVendor. |
| `os_info` | string | No | Device OS information. |
| `sdk_version` | string | No | Client SDK or application integration version. |

## Example

```bash
curl -X POST 'https://vsi-api.shouqianba.com/terminal/checkin' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: 10298371039 <md5-of-raw-body-plus-current-terminal-key>' \
  -d '{"terminal_sn":"10298371039","device_id":"android-imei-001","os_info":"Android 14","sdk_version":"muwe-openapi-1.0.0"}'
```

## Success Response

```json
{
  "result_code": "200",
  "biz_response": {
    "terminal_sn": "10298371039",
    "terminal_key": "9d8d241c9912f0b7d7b45d93d7d81e40"
  }
}
```

## Key Rotation Rules

- Replace the stored key only after a successful check-in response.
- After check-in, only the current and previous terminal keys are valid.
- `ILLEGAL_SIGN` usually means the raw body, key, `terminal_sn`, or key generation changed. Do not create transactions until check-in is fixed.

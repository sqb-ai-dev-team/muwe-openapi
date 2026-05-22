# Activate

`POST /terminal/activate`

Activation registers a developer-capable customer terminal and returns the terminal credentials used for all later requests. It does not activate a MUWE-owned terminal. The customer terminal can be a physical POS device, POS application, cashier workstation, or logical integration endpoint.

## Signing

Sign activation with `vendor_sn` and `vendor_key`.

```http
Authorization: <vendor_sn> <md5(raw_body + vendor_key)>
Content-Type: application/json
```

## Request

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `app_id` | string | Yes | Vendor application ID registered with MUWE. |
| `code` | string | Yes | Activation code generated for the customer terminal onboarding scope. |
| `client_sn` | string | No | Customer terminal identifier in the partner system; unique per app. |
| `name` | string | No | Human-readable terminal name. |
| `device_id` | string | Yes | Device identifier such as IMEI or iOS identifierForVendor. |
| `os_info` | string | No | Device OS information. |

## Example

```bash
curl -X POST 'https://vsi-api.shouqianba.com/terminal/activate' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: VENDOR_SN <md5-of-raw-body-plus-vendor-key>' \
  -d '{"app_id":"muwe-mx","code":"A1B2C3D4","client_sn":"POS-MX-001","name":"Store 01 POS 01","device_id":"android-imei-001","os_info":"Android 14"}'
```

## Success Response

```json
{
  "result_code": "200",
  "biz_response": {
    "terminal_sn": "10298371039",
    "terminal_key": "68d499beda5f72116592f5c527465656"
  }
}
```

## Rules

- A customer terminal is activated once. Store `terminal_sn` and `terminal_key` securely after success.
- Activation codes are scoped to a store.
- Activation codes can expire and can have limited usage counts.
- Multi-use activation codes create a new MUWE terminal identity for every successful customer terminal activation.
- Later transaction requests are initiated from this terminal dimension and signed with the returned terminal credentials.
- If activation fails after a network timeout, retry the same activation request before creating operational workarounds.

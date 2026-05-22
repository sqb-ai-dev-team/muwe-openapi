# Revoke

`POST /upay/v2/revoke`

Revoke is a same-day reversal operation when the provider and merchant configuration support it. Prefer refund for normal post-payment returns.

## Request

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `terminal_sn` | string(32) | Yes | Terminal serial number. |
| `sn` | string(16) | Conditional | MUWE order serial number. |
| `client_sn` | string(32) | Conditional | Client order number. |

Either `sn` or `client_sn` must be present. If both are present, `sn` identifies the order.

## Example

```bash
curl -X POST 'https://vsi-api.shouqianba.com/upay/v2/revoke' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: 10298371039 <md5-of-raw-body-plus-terminal-key>' \
  -d '{"terminal_sn":"10298371039","client_sn":"MEX202605220001"}'
```

## Recovery

Treat revoke like cancel: if the response is uncertain, query before changing merchant-facing state. Do not use revoke unless it is explicitly enabled for the partner and provider.

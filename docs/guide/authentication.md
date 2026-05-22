# API Guide & Authentication

MUWE uses the Upay-compatible HTTPS JSON protocol. Every request is a UTF-8 JSON document signed at the application layer.

## Base URL

```text
https://vsi-api.shouqianba.com
```

Market-specific production domains may be assigned during partner onboarding. The request paths, JSON model, and signature rules stay versioned by this contract.

## HTTP Rules

| Rule | Requirement |
| --- | --- |
| Protocol | HTTPS only |
| Method | POST for all API operations |
| Content type | `application/json` |
| Encoding | UTF-8 request and response bodies |
| Authentication | `Authorization: <sn> <sign>` |

Do not sign a pretty-printed body and send a minified body, or the reverse. The exact UTF-8 byte stream sent over HTTP is the signature input.

## Signature

```text
sign = MD5(raw_utf8_request_body + key)
Authorization: <sn> <sign>
```

`sn` is the serial number that identifies the signing principal. `key` is the shared secret for that serial number.

| Operation | `sn` value | Signing key |
| --- | --- | --- |
| `POST /terminal/activate` | `vendor_sn` | `vendor_key` |
| `POST /terminal/checkin` | `terminal_sn` | Current `terminal_key` |
| Transaction APIs | `terminal_sn` | Current `terminal_key` |

The `terminal_sn` and `terminal_key` are returned by activation and refreshed by check-in. After a successful check-in, only the current and previous terminal keys are valid.

## Reproducible Signing Example

Raw body:

```json
{"terminal_sn":"10298371039","client_sn":"MEX202605220001","total_amount":"1000","dynamic_id":"130818341921441147","subject":"MUWE test order","operator":"cashier01"}
```

Key:

```text
68d499beda5f72116592f5c527465656
```

Signature input:

```text
{"terminal_sn":"10298371039","client_sn":"MEX202605220001","total_amount":"1000","dynamic_id":"130818341921441147","subject":"MUWE test order","operator":"cashier01"}68d499beda5f72116592f5c527465656
```

Header:

```http
Authorization: 10298371039 <md5-of-signature-input>
Content-Type: application/json
```

Use the [Developer Console](/console/) to reproduce the MD5 and Authorization header in browser. Partner implementations must calculate the MD5 over the exact request body bytes plus the key.

## Request Failure Handling

Request-level failures are returned before business processing.

| `result_code` | `error_code` | Meaning |
| --- | --- | --- |
| `400` | `INVALID_PARAMS` | JSON or field validation failed. Fix the request before retrying. |
| `400` | `INVALID_TERMINAL` | Terminal identity is invalid or disabled. Re-activate or contact support. |
| `400` | `ILLEGAL_SIGN` | Signature validation failed. Check raw body, serial number, key, and JSON encoding. |
| `500` | `REQUEST_FAIL` | Service is busy. Retry with the same idempotency key when the API allows it. |
| `500` | `UNKNOWN_SYSTEM_ERROR` | Unknown server error. Query existing orders before creating replacements. |

Never log `vendor_key` or `terminal_key`. Log request path, `sn`, `client_sn`, `sn`, `refund_request_no`, response code, and correlation IDs when available.

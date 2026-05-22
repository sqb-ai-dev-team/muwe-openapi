# API Overview

MUWE OpenAPI exposes terminal and transaction operations using the Upay-compatible protocol.

```http
POST {api_domain}/{path}
Content-Type: application/json
Authorization: <sn> <sign>
```

HTTP transport success does not mean business success. Clients must inspect both `result_code` and `biz_response.result_code`.

## Terminal APIs

| API | Purpose |
| --- | --- |
| [Activate](/terminal/activate) | Register a terminal and receive `terminal_sn` plus `terminal_key`. |
| [Check-in](/terminal/checkin) | Rotate terminal keys. |
| [Log Upload](/terminal/log-upload) | Upload diagnostic logs for support. |

## Transaction APIs

| API | Purpose |
| --- | --- |
| [Pay](/api/pay) | Merchant-initiated payment request completed through the configured provider flow. |
| [Pre-create](/api/precreate) | QR-code payment pre-creation. |
| [Query](/api/query) | Transaction status lookup. |
| [Refund](/api/refund) | Refund a paid transaction. |
| [Cancel](/api/cancel) | Cancel an unpaid or uncertain transaction. |
| [Revoke](/api/revoke) | Same-day reversal when supported. |

The same lifecycle also supports MIS-to-POS order push integrations, where a merchant MIS or cashier system pushes an order to a bound POS terminal and reconciles the result through notification or query.

Every endpoint page defines signing key, request fields, response shape, examples, and recovery rules. Keep these pages synchronized with `openapi/openapi.yaml`.

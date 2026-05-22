# API Overview

MUWE Mexico exposes an Upay-compatible API. Endpoint paths, signatures, state machines, response envelopes, and field values follow the ShouQianBa Web API contract. MUWE-specific documentation changes the partner-facing naming and examples, not the protocol semantics.

All JSON endpoints use JSON request bodies and JSON responses.

```http
POST {api_domain}/upay/v2/{operation}
Content-Type: application/json
Authorization: <sn> <sign>
```

The common top-level response shape is:

```json
{
  "result_code": "200",
  "biz_response": {
    "result_code": "PAY_SUCCESS",
    "data": {}
  }
}
```

HTTP transport success does not mean business success. Clients must inspect both `result_code` and `biz_response.result_code`.

## Endpoint Groups

| Group | Endpoints | Purpose |
| --- | --- | --- |
| Terminal | `/terminal/activate`, `/terminal/checkin`, `/terminal/uploadLog` | Terminal credential lifecycle and diagnostics. |
| Transactions | `/upay/v2/pay`, `/upay/v2/precreate`, `/upay/v2/query`, `/upay/v2/refund`, `/upay/v2/cancel`, `/upay/v2/revoke` | Payment, query, refund, cancellation, and reversal. |
| Appendix | Protocol values | Error codes, business result codes, states, providers, methods, and preferential types. |

# API Overview

All endpoints use JSON request bodies and JSON responses.

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

# Response Model

Every API returns a top-level request result. Transaction APIs also return a business response.

## Request Success With Business Result

```json
{
  "result_code": "200",
  "biz_response": {
    "result_code": "PAY_SUCCESS",
    "data": {}
  }
}
```

## Request Failure

```json
{
  "result_code": "400",
  "error_code": "ILLEGAL_SIGN",
  "error_message": "签名错误"
}
```

## Fields

| Field | Scope | Meaning |
| --- | --- | --- |
| `result_code` | top-level | Request processing result. `200` means the request was accepted for business handling. |
| `error_code` | top-level | Request-level error when `result_code` is not `200`. |
| `error_message` | top-level | Human-readable request-level error. |
| `biz_response.result_code` | business | Business operation result. |
| `biz_response.error_code` | business | Business error code. |
| `biz_response.error_message` | business | Business error message. |
| `biz_response.data` | business | Operation-specific data. |

Client logic must inspect both layers.

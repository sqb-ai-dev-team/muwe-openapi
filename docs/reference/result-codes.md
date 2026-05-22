# Result & Error Codes

## Request Error Codes

| `result_code` | `error_code` | Meaning |
| --- | --- | --- |
| `400` | `INVALID_PARAMS` | Invalid request parameters. |
| `400` | `INVALID_TERMINAL` | Invalid terminal identity. |
| `400` | `ILLEGAL_SIGN` | Signature verification failed. |
| `500` | `UNKNOWN_SYSTEM_ERROR` | Unknown system error. |
| `500` | `REQUEST_FAIL` | Service busy or temporary request failure. |
| `500` | `EXTERNAL_SERVICE_EXCEPTION` | External service error. Record full response for merchant support. |
| `500` | `PAY_STATUS_CLOSED` | Merchant payment permission is closed. |

## Business Result Codes

| Code | Meaning | Client action |
| --- | --- | --- |
| `PAY_SUCCESS` | Payment succeeded. | Deliver goods. |
| `PAY_FAIL` | Payment failed and the order has been canceled. | Do not deliver goods; retry with a new `client_sn` if needed. |
| `PAY_IN_PROGRESS` | Payment is still processing. | Query until final. |
| `PAY_FAIL_ERROR` | Payment failed but final result is unknown. | Query and escalate if unresolved. |
| `PRECREATE_SUCCESS` | QR order was created. | Render QR; wait for payment result. |
| `PRECREATE_FAIL` | QR order creation failed. | Fix error or retry with a new order when appropriate. |
| `SUCCESS` | Query or non-payment operation succeeded. | Read `data`. |
| `REFUND_SUCCESS` | Refund succeeded. | Reconcile refund. |
| `REFUND_ERROR` | Refund failed and result may be unknown. | Query using `refund_request_no`. |
| `CANCEL_SUCCESS` | Cancel succeeded. | Treat order as closed. |
| `CANCEL_ERROR` | Cancel failed and result may be unknown. | Query and escalate if needed. |
| `CANCEL_ABORT_SUCCESS` | Cancel attempt for an in-payment order succeeded. | Treat order as closed. |
| `CANCEL_ABORT_ERROR` | Cancel attempt for an in-payment order failed; status unknown. | Query and escalate. |

Business error codes are provider and scenario specific. Client systems must store unknown `error_code` values without dropping them.

# Order & Transaction Status

## Order Status

| Status | Type | Meaning |
| --- | --- | --- |
| `CREATED` | Intermediate | Order accepted but not final. Query again. |
| `PAID` | Final success | Payment completed. |
| `PAY_CANCELED` | Final failure | Payment failed and was canceled. |
| `REFUNDED` | Final refund | Order fully refunded. |
| `PARTIAL_REFUNDED` | Final payment with refund | Order partially refunded. |
| `REFUND_INPROGRESS` | Intermediate | Refund is processing. Query by `refund_request_no`. |
| `REFUND_ERROR` | Uncertain | Refund failed or result is unknown. Escalate after query. |
| `CANCELED` | Final canceled | Order canceled before completion. |
| `CANCEL_INPROGRESS` | Intermediate | Cancellation is processing. Query again. |
| `CANCEL_ERROR` | Uncertain | Cancellation failed or result is unknown. |
| `INVALID_STATUS_CODE` | Error | Provider returned an unmapped status. Store and escalate. |
| `PAY_ERROR` | Uncertain | Payment status is unknown. Query and escalate. |

## Transaction Status

| Status | Type | Meaning |
| --- | --- | --- |
| `SUCCESS` | Final success | Current operation completed. |
| `FAIL_CANCELED` | Final failure | Operation failed and the order was canceled. |
| `FAIL_ERROR` | Uncertain | Operation failed but result is not reliable. |
| `IN_PROG` | Intermediate | Operation is still processing. |
| `ERROR_RECOVERY` | Intermediate | Recovery/cancel operation is processing. |
| `PRE_SUCCESS` | Intermediate | Pre-operation succeeded but order is not paid. |

If MUWE responds with a `FAIL*` transaction status, the transaction is guaranteed failed from MUWE's perspective. Do not deliver goods unless a later query explicitly returns `PAID`.

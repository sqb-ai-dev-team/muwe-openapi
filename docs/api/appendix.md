# Appendix

This appendix defines protocol values shared by MUWE and the Upay-compatible ShouQianBa contract.

## Request Result Codes

Top-level `result_code` describes request-level processing.

| `result_code` | `error_code` | Meaning |
| --- | --- | --- |
| `200` | | Request accepted and business response returned. |
| `400` | `INVALID_PARAMS` | Invalid request parameters. |
| `400` | `INVALID_TERMINAL` | Invalid terminal. |
| `400` | `ILLEGAL_SIGN` | Invalid request signature. |
| `500` | `UNKNOWN_SYSTEM_ERROR` | System error. |
| `500` | `REQUEST_FAIL` | Service busy. Retry later. |
| `500` | `EXTERNAL_SERVICE_EXCEPTION` | External service error. Record the provider detail for merchant support. |
| `500` | `PAY_STATUS_CLOSED` | Merchant payment permission is closed. |

## Business Result Codes

`biz_response.result_code` describes the business result.

| Value | Meaning | Client handling |
| --- | --- | --- |
| `PAY_SUCCESS` | Payment succeeded. | Deliver goods or services. |
| `PAY_FAIL` | Payment failed and order was canceled. | Retry with a new `client_sn`. |
| `PAY_FAIL_ERROR` | Payment failed and result is unknown. | Query and escalate if still unknown. |
| `CANCEL_SUCCESS` | Order canceled. | Treat as final. |
| `CANCEL_ERROR` | Cancel result unknown. | Query and escalate if still unknown. |
| `CANCEL_ABORT_SUCCESS` | Cancel during payment succeeded. | Treat as final canceled. |
| `CANCEL_ABORT_ERROR` | Cancel during payment failed; status unknown. | Query and escalate. |
| `REFUND_SUCCESS` | Refund succeeded. | Treat as final for that refund request. |
| `REFUND_ERROR` | Refund result unknown. | Query by `refund_request_no`. |
| `PRECREATE_SUCCESS` | Pre-create succeeded. | Display QR or WAP payload and poll/query. |
| `PRECREATE_FAIL` | Pre-create failed. | Retry only after correcting the cause. |
| `SUCCESS` | Query or generic transaction succeeded. | Inspect `biz_response.data.order_status`. |
| `FAIL` | Business operation failed without changing order status. | Inspect `error_code`. |

## Business Error Codes

| Value | Meaning |
| --- | --- |
| `INVALID_BARCODE` | Invalid payment barcode. |
| `INSUFFICIENT_FUND` | Buyer has insufficient funds. |
| `EXPIRED_BARCODE` | Expired payment barcode. |
| `BUYER_OVER_DAILY_LIMIT` | Buyer daily limit exceeded. |
| `BUYER_OVER_TRANSACTION_LIMIT` | Buyer transaction limit exceeded. |
| `SELLER_OVER_DAILY_LIMIT` | Seller daily limit exceeded. |
| `TRADE_NOT_EXIST` | Provider trade does not exist. |
| `TRADE_HAS_SUCCESS` | Trade has already succeeded. |
| `SELLER_BALANCE_NOT_ENOUGH` | Seller balance is insufficient. |
| `REFUND_AMT_NOT_EQUAL_TOTAL` | Invalid refund amount. |
| `TRADE_FAILED` | Trade failed. |
| `UNEXPECTED_PROVIDER_ERROR` | Unknown payment provider. |
| `TRADE_TIMEOUT` | Trade timed out and was automatically canceled. |
| `ACCOUNT_BALANCE_NOT_ENOUGH` | Merchant balance is insufficient. |
| `CLIENT_SN_CONFLICT` | `client_sn` already exists. |
| `UPAY_ORDER_NOT_EXIST` | Order does not exist. |
| `REFUNDABLE_AMOUNT_NOT_ENOUGH` | Refundable amount is insufficient. |
| `UPAY_TERMINAL_NOT_EXISTS` | Terminal does not exist. |
| `UPAY_TERMINAL_STATUS_ABNORMAL` | Terminal is not active. |
| `UPAY_CANCEL_ORDER_NOOP` | Order is already canceled. |
| `UPAY_CANCEL_INVALID_ORDER_STATE` | Current order state cannot be canceled. |
| `UPAY_REFUND_ORDER_NOOP` | This refund request is already completed. |
| `UPAY_REFUND_INVALID_ORDER_STATE` | Current order state cannot be refunded. |
| `UPAY_STORE_OVER_DAILY_LIMIT` | Store daily collection limit exceeded. |
| `UPAY_TCP_ORDER_NOT_REFUNDABLE` | Campaign order cannot be refunded. |
| `EXTERNAL_SERVICE_EXCEPTION` | External service error. |

## Order Status

| Value | Meaning |
| --- | --- |
| `CREATED` | Order was created and is ready to be paid. |
| `PAID` | Order was paid. |
| `PAY_CANCELED` | Payment failed and the order was canceled. |
| `PAY_ERROR` | Payment failed and the result is unknown. |
| `REFUNDED` | Order was fully refunded. |
| `PARTIAL_REFUNDED` | Order was partially refunded. |
| `REFUND_INPROGRESS` | Refund is in progress. |
| `REFUND_ERROR` | Refund result is unknown. |
| `CANCELED` | Order was canceled by the client. |
| `CANCEL_ERROR` | Cancel result is unknown. |
| `CANCEL_INPROGRESS` | Cancel is in progress. |
| `INVALID_STATUS_CODE` | Invalid status code. |

Final order statuses are `PAID`, `PAY_CANCELED`, `REFUNDED`, `PARTIAL_REFUNDED`, and `CANCELED`.

## Transaction Status

| Value | Meaning | Handling |
| --- | --- | --- |
| `SUCCESS` | Transaction succeeded. | Final success. |
| `FAIL_CANCELED` | Transaction failed and was canceled. | Final failure. |
| `FAIL_PROTOCOL_1` | Provider protocol error. | Do not deliver. Escalate. |
| `FAIL_IO_1` | Provider IO error. | Do not deliver. Escalate. |
| `FAIL_PROTOCOL_2` | Provider protocol error. | Do not deliver. Escalate. |
| `FAIL_IO_2` | Provider IO error. | Do not deliver. Escalate. |
| `FAIL_PROTOCOL_3` | Provider protocol error. | Do not deliver. Escalate. |
| `FAIL_ERROR` | Failed payment cancellation also failed. | Do not deliver. Escalate. |
| `CANCEL_ERROR` | Client cancel failed. | Query and escalate. |
| `REFUND_ERROR` | Refund failed. | Query and escalate. |
| `CREATED` | Order accepted but not processed. | Query. |
| `ABORTED` | Confirmed closed failure. | Do not deliver. |
| `IN_PROG` | Order processing. | Query. |
| `ERROR_RECOVERY` | Cancellation in progress. | Query. |
| `PRE_SUCCESS` | Intermediate operation success. | Query. |

## Payment Service Providers

| `payway` | Name | Notes |
| --- | --- | --- |
| `1` | Alipay / Alipay-Local | Alipay or overseas local Alipay wallet. |
| `3` | WeChat Pay | WeChat payment. |
| `4` | Baidu Wallet | Baidu Wallet. |
| `5` | JD Wallet | Jingdong Pay. |
| `6` | QQ Wallet | QQ Wallet. Pre-create is not supported. |
| `7` | NFC | NFC payment. |
| `8` | Lakala Wallet | Lakala wallet. |
| `9` | China Mobile Wallet | He Bao payment. |
| `15` | Lakala WeChat | Lakala WeChat payment. |
| `16` | China Merchants Bank | CMB payment. |
| `17` | UnionPay | UnionPay Cloud QuickPass. |
| `18` | China Telecom Wallet | BestPay. |
| `19` | Weixin-Local | Overseas WeChat wallet. |
| `20` | Alipay Global | Alipay global wallet. |
| `22` | Sodexo Card | Sodexo prepaid card. |
| `100` | Stored-value Card | Stored-value-card payment. |
| `101` | Gift Card | Gift card payment. |

## Payment Methods

| `sub_payway` | Meaning |
| --- | --- |
| `1` | Barcode Payment |
| `2` | QR Code Payment |
| `3` | WAP Payment |
| `4` | Mini Payment |
| `5` | APP Payment |
| `6` | H5 Payment |

## Preferential Types

`payment_list` items contain `type` and `amount_total`.

| Type | Meaning |
| --- | --- |
| `HONGBAO_WOSAI` | Platform red packet. |
| `HONGBAO_WOSAI_MCH` | Merchant red packet. |
| `DISCOUNT_WOSAI` | Platform discount. |
| `DISCOUNT_WOSAI_MCH` | Merchant discount. |
| `DISCOUNT_CHANNEL` | Channel discount. |
| `DISCOUNT_CHANNEL_MCH` | Channel merchant discount. |
| `DISCOUNT_CHANNEL_MCH_TOP_UP` | Channel merchant discount requiring top-up. |
| `HONGBAO_CHANNEL` | Channel red packet. |
| `HONGBAO_CHANNEL_MCH` | Channel merchant red packet. |
| `HONGBAO_CHANNEL_MCH_TOP_UP` | Channel merchant red packet requiring top-up. |
| `CARD_PRE` | Provider prepaid card. |
| `CARD_BALANCE` | Provider stored-value card. |
| `BANKCARD_CREDIT` | Credit card. |
| `BANKCARD_DEBIT` | Debit card. |
| `WALLET_ALIPAY` | Alipay wallet balance. |
| `WALLET_ALIPAY_FINANCE` | Yu'E Bao. |
| `WALLET_WEIXIN` | WeChat wallet. |
| `ALIPAY_HUABEI` | Alipay Huabei. |
| `ALIPAY_POINT` | Alipay points. |

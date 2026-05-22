# Payment Providers

`payway` identifies the payment service provider. `sub_payway` identifies the payment method under that provider.

## Provider Values

| `payway` | Name | Note |
| --- | --- | --- |
| `1` | Alipay-Local | Local Alipay wallet. |
| `3` | Wechat pay | WeChat payment. |
| `4` | Baidu Wallet | Baidu Wallet. |
| `5` | JD wallet | JD wallet. |
| `6` | QQ Wallet | QQ Wallet; pre-create is not supported. |
| `7` | NFC | NFC payment. |
| `8` | Lakala wallet | Lakala wallet. |
| `9` | China Mobile Wallet | China Mobile wallet. |
| `15` | Lakala WeChat | Lakala WeChat payment. |
| `16` | China Merchants Bank | Bank payment provider. |
| `17` | UnionPay | UnionPay Cloud QuickPass. |
| `18` | China Telecom Wallet | Telecom wallet. |
| `19` | Weixin-Local | Overseas WeChat wallet. |
| `20` | Alipay Global | Alipay global wallet. |
| `22` | Sodexo card | Prepaid Sodexo card. |
| `100` | Stored-value-card payment | Stored value payment. |
| `101` | Gift card payment | Gift card payment. |

MUWE Mexico may enable only a subset of these values during onboarding. Do not hard-code provider availability; read the partner enablement configuration.

## Method Values

| `sub_payway` | Meaning |
| --- | --- |
| `1` | Consumer-presented payment credential |
| `2` | QR Code Payment |
| `3` | WAP Payment |
| `4` | Mini Payment |
| `5` | APP Payment |
| `6` | H5 Payment |

## Goods Detail

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `goods_id` | string(32) | Yes | Goods serial number. |
| `goods_name` | string(32) | Yes | Goods name. |
| `quantity` | number(10) | Yes | Quantity. |
| `price` | number(9) | Yes | Unit price in cents. |
| `promotion_type` | number(1) | Yes | `0` no discount, `1` institution discount. |

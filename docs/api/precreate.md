# Pre-create

`POST /upay/v2/precreate`

Creates a QR payment order. The merchant renders the returned QR value or payment URL.

## Request

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `terminal_sn` | string(32) | Yes | Terminal serial number. |
| `client_sn` | string(32) | Yes | Unique order number in the client system. |
| `total_amount` | string(10) | Yes | Amount in cents. |
| `payway` | string | Yes | Payment provider. |
| `sub_payway` | string | No | Payment method, for example QR, WAP, mini program. |
| `payer_uid` | string(64) | No | Provider payer ID when required by a method. |
| `subject` | string(64) | Yes | Transaction subject. |
| `operator` | string(32) | Yes | Operator identifier. |
| `description`, `longitude`, `latitude`, `device_id`, `extended`, `goods_details`, `reflect`, `notify_url` | mixed | No | Same meaning as Pay. |

## Example

```bash
curl -X POST 'https://vsi-api.shouqianba.com/upay/v2/precreate' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: 10298371039 <md5-of-raw-body-plus-terminal-key>' \
  -d '{"terminal_sn":"10298371039","client_sn":"MEX202605220002","total_amount":"2500","payway":"3","sub_payway":"2","subject":"QR test order","operator":"cashier01"}'
```

## Success

```json
{
  "result_code": "200",
  "biz_response": {
    "result_code": "PRECREATE_SUCCESS",
    "data": {
      "sn": "7893259247405833",
      "client_sn": "MEX202605220002",
      "order_status": "CREATED",
      "qr_code": "weixin://wxpay/bizpayurl?pr=example",
      "total_amount": "2500",
      "subject": "QR test order"
    }
  }
}
```

## Recovery

After `PRECREATE_SUCCESS`, wait for notification or query by `client_sn`. Do not treat pre-create success as payment success. Deliver goods only after query or notification shows `order_status = PAID`.

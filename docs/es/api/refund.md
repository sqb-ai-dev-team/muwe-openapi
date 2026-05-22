# Refund

`POST /upay/v2/refund`

Reembolsa una orden pagada. Campos requeridos: `terminal_sn`, `refund_request_no`, `refund_amount`, `operator`, y al menos uno de `sn` o `client_sn`.

`refund_request_no` es la clave de idempotencia. Si el resultado es incierto, consulte con el mismo `refund_request_no`.

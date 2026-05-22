# Pre-create

`POST /upay/v2/precreate`

Crea una orden QR. Campos requeridos: `terminal_sn`, `client_sn`, `total_amount`, `payway`, `subject`, `operator`.

`PRECREATE_SUCCESS` solo significa que la orden QR fue creada. No entregue bienes hasta que una notificacion o consulta confirme `order_status = PAID`.

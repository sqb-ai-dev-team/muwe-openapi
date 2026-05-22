# Pay

`POST /upay/v2/pay`

Crea una solicitud de pago iniciada por el comercio. El consumidor completa el pago mediante el metodo o flujo del proveedor configurado. Use `terminal_sn` y `terminal_key` para firmar.

Campos requeridos: `terminal_sn`, `client_sn`, `total_amount`, `dynamic_id`, `subject`, `operator`.

`client_sn` identifica un intento de pago. Si se necesita un nuevo intento real, use un nuevo `client_sn`.

Si el resultado es `PAY_SUCCESS`, entregue bienes. Si es `PAY_IN_PROGRESS` o hay timeout, consulte con `POST /upay/v2/query`. Si no se alcanza un estado final dentro del timeout comercial, llame `POST /upay/v2/cancel`.

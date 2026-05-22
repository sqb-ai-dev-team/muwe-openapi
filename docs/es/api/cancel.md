# Cancel

`POST /upay/v2/cancel`

Cancela una orden no pagada o incierta. Envie `terminal_sn` y al menos uno de `sn` o `client_sn`.

Use cancel cuando el pago es incierto y el comercio no puede esperar mas. Si cancel tambien es incierto, siga consultando.

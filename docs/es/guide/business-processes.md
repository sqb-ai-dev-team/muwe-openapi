# Procesos de negocio

El protocolo tiene tres procesos: activacion de terminal, check-in de terminal y transacciones.

## Activacion

Cada terminal se activa una vez con `POST /terminal/activate`, firmado con `vendor_sn` y `vendor_key`. La respuesta entrega `terminal_sn` y `terminal_key`, que deben guardarse de forma segura.

## Check-in

Cada terminal debe hacer check-in al menos una vez al dia y antes de la primera transaccion. `POST /terminal/checkin` se firma con `terminal_sn` y el `terminal_key` vigente. Despues del check-in solo son validas la clave actual y la anterior.

## Transacciones

| Flujo | API |
| --- | --- |
| Pago con codigo de barras | `POST /upay/v2/pay` |
| Pago QR | `POST /upay/v2/precreate` |
| Consulta | `POST /upay/v2/query` |
| Reembolso | `POST /upay/v2/refund` |
| Cancelacion | `POST /upay/v2/cancel` |
| Reversa | `POST /upay/v2/revoke` |

Los timeouts y resultados `*_IN_PROGRESS` son inciertos. El cliente debe consultar antes de entregar bienes o crear una orden reemplazo.

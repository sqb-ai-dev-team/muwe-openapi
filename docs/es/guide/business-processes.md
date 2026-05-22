# Procesos de negocio

El protocolo tiene tres procesos: activacion de terminal, check-in de terminal y transacciones.

<div class="process-flow" aria-label="Resumen de procesos de negocio">
  <div class="process-flow__row">
    <div class="process-flow__step"><strong>Activar terminal</strong><span>Vincula la terminal fisica o logica y recibe credenciales.</span></div>
    <div class="process-flow__step"><strong>Check-in</strong><span>Rota la llave de terminal antes del procesamiento diario.</span></div>
    <div class="process-flow__step"><strong>Crear transaccion</strong><span>Inicia una solicitud de pago, orden QR u orden enviada de MIS a POS.</span></div>
    <div class="process-flow__step"><strong>Resolver resultado</strong><span>Usa notificacion, consulta, cancelacion, reembolso o reversa segun el estado final.</span></div>
  </div>
</div>

## Activacion

Cada terminal se activa una vez con `POST /terminal/activate`, firmado con `vendor_sn` y `vendor_key`. La respuesta entrega `terminal_sn` y `terminal_key`, que deben guardarse de forma segura.

## Check-in

Cada terminal debe hacer check-in al menos una vez al dia y antes de la primera transaccion. `POST /terminal/checkin` se firma con `terminal_sn` y el `terminal_key` vigente. Despues del check-in solo son validas la clave actual y la anterior.

## Transacciones

| Flujo | API |
| --- | --- |
| Pago iniciado por el comercio | `POST /upay/v2/pay` |
| Pago QR | `POST /upay/v2/precreate` |
| Envio de orden MIS a POS | Integracion de partner |
| Consulta | `POST /upay/v2/query` |
| Reembolso | `POST /upay/v2/refund` |
| Cancelacion | `POST /upay/v2/cancel` |
| Reversa | `POST /upay/v2/revoke` |

MUWE tambien soporta escenarios de envio de ordenes de MIS a POS dentro del mismo ciclo de vida de transaccion. El sistema MIS o caja del comercio crea la orden, la envia a una terminal POS vinculada, completa el flujo de pago con el consumidor en el POS y luego reconcilia el resultado por notificacion o consulta.

Los timeouts y resultados `*_IN_PROGRESS` son inciertos. El cliente debe consultar antes de entregar bienes o crear una orden reemplazo.

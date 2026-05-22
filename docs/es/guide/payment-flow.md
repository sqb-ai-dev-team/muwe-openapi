# Flujo de Pago

Las APIs de pago devuelven resultados de solicitud en `result_code` y resultados de negocio en `biz_response.result_code`. HTTP 200 no significa que el pago fue exitoso. Todas las solicitudes de pago se inician desde una identidad de terminal del cliente activada.

<div class="sequence-diagram" aria-label="Ciclo de vida del pago">
  <div class="sequence-diagram__actors">
    <span>Terminal del cliente</span>
    <span>MUWE OpenAPI</span>
    <span>Proveedor de pago</span>
    <span>Consumidor</span>
  </div>
  <div class="sequence-diagram__body">
    <div class="sequence-step"><strong>1</strong><p>La terminal envia pay, pre-create u orden enviada firmada con `terminal_sn`.</p></div>
    <div class="sequence-step sequence-step--right"><strong>2</strong><p>MUWE valida credenciales de terminal, alcance del comercio, idempotencia y ruta de proveedor.</p></div>
    <div class="sequence-step sequence-step--right"><strong>3</strong><p>El proveedor maneja la autorizacion o devuelve el payload de pago del consumidor.</p></div>
    <div class="sequence-step sequence-step--dashed"><strong>4</strong><p>El consumidor completa el pago en el canal configurado o en la terminal POS vinculada.</p></div>
    <div class="sequence-step sequence-step--right"><strong>5</strong><p>MUWE devuelve estado de negocio exitoso, fallido o en progreso.</p></div>
    <div class="sequence-step sequence-step--warn"><strong>6</strong><p>Si el resultado es incierto, consulta antes de entregar, cancelar, reembolsar o reintentar.</p></div>
  </div>
</div>

## Pago iniciado por el comercio

<div class="mini-sequence" aria-label="Secuencia de pago iniciado por comercio">
  <div><strong>Terminal del cliente</strong><span>Crea la orden y llama `POST /upay/v2/pay` con un `client_sn` unico.</span></div>
  <div><strong>MUWE OpenAPI</strong><span>Valida la firma de terminal, enruta la solicitud y devuelve resultado de negocio.</span></div>
  <div><strong>Proveedor / consumidor</strong><span>Completa el pago o deja la orden en progreso.</span></div>
</div>

1. El cajero, POS o MIS del comercio inicia la solicitud de pago desde una terminal del cliente activada.
2. El cliente llama `POST /upay/v2/pay` con un `client_sn` unico.
3. Si `biz_response.result_code` es `PAY_SUCCESS`, entrega bienes.
4. Si es `PAY_IN_PROGRESS`, o hay error de red despues de que la solicitud pudo llegar a MUWE, consulta por `client_sn`.
5. Si la orden no llega a estado final dentro del tiempo limite del comercio, llama `POST /upay/v2/cancel`.
6. Nunca reutilices el mismo `client_sn` para un nuevo intento despues de un pago fallido o incierto.

## Envio de orden MIS a POS

<div class="mini-sequence" aria-label="Secuencia de orden MIS a POS">
  <div><strong>MIS del comercio</strong><span>Crea una orden para una terminal POS vinculada.</span></div>
  <div><strong>Terminal POS vinculada</strong><span>Recibe la orden y conduce el flujo de pago con el consumidor.</span></div>
  <div><strong>MUWE / proveedor</strong><span>Procesa el pago y expone el resultado final por notificacion o consulta.</span></div>
</div>

1. El MIS o caja del comercio crea una orden para una terminal POS vinculada.
2. El POS recibe la orden y conduce el flujo de pago con el consumidor.
3. MUWE procesa el pago con el proveedor configurado.
4. El cliente recibe notificacion o consulta `POST /upay/v2/query` hasta llegar a un estado final.

## Pre-creacion QR

<div class="mini-sequence" aria-label="Secuencia de pre-creacion QR">
  <div><strong>Terminal del cliente</strong><span>Llama `POST /upay/v2/precreate` para una orden del comercio.</span></div>
  <div><strong>MUWE OpenAPI</strong><span>Devuelve `qr_code` o payload de pago del proveedor.</span></div>
  <div><strong>App del consumidor</strong><span>Escanea o abre el payload de pago y completa el pago.</span></div>
</div>

1. El cliente llama `POST /upay/v2/precreate`.
2. MUWE devuelve `qr_code` o payload de pago del proveedor.
3. El comercio muestra el codigo QR o URL de pago.
4. El cliente final completa el pago en la app del proveedor.
5. El cliente espera notificacion o consulta `POST /upay/v2/query`.

## Reembolso

Los reembolsos son idempotentes por `refund_request_no`.

1. Consulta la orden y confirma que se puede reembolsar.
2. Llama `POST /upay/v2/refund` con `sn` o `client_sn` y un `refund_request_no` unico.
3. Si el resultado del reembolso es incierto, consulta usando la identidad de la orden original y `refund_request_no`.
4. No envies un reembolso de reemplazo con un nuevo `refund_request_no` hasta que el primero sea final.

## Recuperacion por cancelacion

`cancel` es para ordenes no pagadas o inciertas. Usalo cuando el cliente no puede probar que el pago fallo pero necesita prevenir un exito posterior.

Si `cancel` devuelve `CANCEL_SUCCESS`, la orden queda cerrada. Si devuelve `CANCEL_ERROR`, `CANCEL_ABORT_ERROR` o hay timeout de red, sigue consultando y escala si la orden no llega a estado final.

## Reversa

`revoke` no es la misma operacion que `cancel`. Usa `POST /upay/v2/revoke` solo para reversa del mismo dia de una orden pagada cuando la ruta del proveedor lo soporta explicitamente.

## Estados finales

| Estado | Significado |
| --- | --- |
| `PAID` | Pago completado. |
| `PAY_CANCELED` | Pago fallido y cancelado. |
| `REFUNDED` | Reembolso total. |
| `PARTIAL_REFUNDED` | Reembolso parcial. |
| `CANCELED` | Orden cancelada antes de completar el pago. |

Estados intermedios como `CREATED`, `IN_PROG`, `ERROR_RECOVERY` y `PRE_SUCCESS` no son finales. Consulta hasta recibir un estado final o requerir intervencion de soporte.

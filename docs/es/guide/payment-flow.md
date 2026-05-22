# Flujo de Pago

Las APIs de pago pueden devolver un resultado final o incierto. El cliente debe manejar ambos.

<div class="process-flow" aria-label="Ciclo de vida del pago">
  <div class="process-flow__row">
    <div class="process-flow__step"><strong>Crear solicitud</strong><span>Envia pay, pre-create o una orden vinculada a POS desde el sistema del comercio.</span></div>
    <div class="process-flow__step"><strong>Consumidor paga</strong><span>El consumidor completa el pago con el proveedor configurado o flujo POS.</span></div>
    <div class="process-flow__step"><strong>Recibir resultado</strong><span>MUWE devuelve un resultado de negocio final o en progreso.</span></div>
    <div class="process-flow__step"><strong>Recuperar incertidumbre</strong><span>Consulta antes de entregar; cancela solo si no se puede probar exito a tiempo.</span></div>
  </div>
</div>

## Pago iniciado por el comercio

1. El cajero, POS o MIS del comercio inicia la solicitud de pago.
2. El cliente llama `POST /upay/v2/pay` con un `client_sn` único.
3. Si la respuesta es exitosa, muestra el pago como completado.
4. Si la respuesta está en progreso o hay error de red después del envío, consulta por `client_sn`.
5. Si el pago no termina antes del tiempo límite, cancela la orden.

## Envio de orden MIS a POS

1. El MIS o caja del comercio crea una orden para una terminal POS vinculada.
2. El POS recibe la orden y conduce el flujo de pago con el consumidor.
3. MUWE procesa el pago con el proveedor configurado.
4. El cliente recibe notificacion o consulta `POST /upay/v2/query` hasta llegar a un estado final.

## Pre-creación QR

1. El cliente llama `POST /upay/v2/precreate`.
2. El servidor devuelve un código QR o parámetros del proveedor.
3. El cliente paga.
4. El sistema espera callback o consulta la orden.

## Estados Finales

| Estado | Significado |
| --- | --- |
| `PAID` | Pago completado. |
| `PAY_CANCELED` | Pago fallido y cancelado. |
| `REFUNDED` | Reembolso total. |
| `PARTIAL_REFUNDED` | Reembolso parcial. |
| `CANCELED` | Orden cancelada. |

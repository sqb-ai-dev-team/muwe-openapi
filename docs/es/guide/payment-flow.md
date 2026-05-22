# Flujo de Pago

Las APIs de pago pueden devolver un resultado final o incierto. El cliente debe manejar ambos.

## Pago con Código de Barras

1. El cajero escanea el código de pago del cliente.
2. El cliente llama `POST /upay/v2/pay` con un `client_sn` único.
3. Si la respuesta es exitosa, muestra el pago como completado.
4. Si la respuesta está en progreso o hay error de red después del envío, consulta por `client_sn`.
5. Si el pago no termina antes del tiempo límite, cancela la orden.

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

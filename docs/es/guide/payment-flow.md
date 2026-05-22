# Flujo de Pago

Las APIs de pago pueden devolver un resultado final o incierto. El cliente debe manejar ambos.

## Pago con Código de Barras

1. El cajero escanea el código de pago del cliente.
2. El cliente llama `POST /upay/v2/pay` con un `client_sn` único.
3. Si `biz_response.result_code` es `PAY_SUCCESS` y `order_status` es `PAID`, muestra el pago como completado.
4. Si la respuesta está en progreso, es incierta o hay error de red después del envío, consulta por `client_sn` o `sn`.
5. Si el pago no termina antes del tiempo límite, cancela la orden y vuelve a consultar si la cancelación queda incierta.

## Pre-creación QR

1. El cliente llama `POST /upay/v2/precreate`.
2. El servidor devuelve un código QR o parámetros del proveedor.
3. El cliente paga.
4. El sistema espera callback o consulta la orden. Una orden pre-creada normalmente es válida por unos cuatro minutos.

## Reembolso

1. El cliente llama `POST /upay/v2/refund` con `sn` o `client_sn`.
2. `refund_request_no` es la llave de idempotencia para ese reembolso. Los reintentos del mismo reembolso deben reutilizarla.
3. Para resultados inciertos, consulta con `refund_request_no`.

## Cancel y Revoke

Use cancel para órdenes no pagadas o inciertas antes de completarse. Revoke depende del proveedor y de la ventana operativa de reversa del mismo día; no reemplaza el flujo normal de refund.

## Estados Finales

| Estado | Significado |
| --- | --- |
| `PAID` | Pago completado. |
| `PAY_CANCELED` | Pago fallido y cancelado. |
| `REFUNDED` | Reembolso total. |
| `PARTIAL_REFUNDED` | Reembolso parcial. |
| `CANCELED` | Orden cancelada. |

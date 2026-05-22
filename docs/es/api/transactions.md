# Transacciones

Las APIs de transacción se firman con `terminal_sn` y el `terminal_key` vigente. Todos los montos son strings enteros en centavos.

`client_sn` debe ser único en el sistema del partner. Si un intento de pago falla y el cajero reintenta, use un nuevo `client_sn`.

## Pay

`POST /upay/v2/pay`

Crea una transacción con código de barras. MUWE puede inferir el proveedor desde `dynamic_id`; envíe `payway` solo cuando el proveedor deba fijarse.

| Campo | Tipo | Requerido | Notas |
| --- | --- | --- | --- |
| `terminal_sn` | string(32) | Sí | Número de serie de terminal. |
| `client_sn` | string(32) | Sí | Número único de orden del partner. |
| `total_amount` | string(10) | Sí | Monto total en centavos. |
| `payway` | string | No | Proveedor de pago. |
| `dynamic_id` | string(32) | Sí | Código de pago del cliente. |
| `subject` | string(64) | Sí | Concepto de la transacción. |
| `operator` | string(32) | Sí | Cajero u operador. |
| `description` | string(255) | No | Descripción detallada. |
| `longitude` | string | No | Debe enviarse con `latitude`. |
| `latitude` | string | No | Debe enviarse con `longitude`. |
| `device_id` | string(32) | No | Identificador del dispositivo. |
| `extended` | object | No | Campos passthrough para proveedor. |
| `goods_details` | array | No | Detalles de mercancía. |
| `reflect` | string(64) | No | Devuelto sin cambios en respuestas/callbacks. |
| `notify_url` | string(128) | No | URL de callback. |

## Pre-create

`POST /upay/v2/precreate`

Crea una orden y devuelve un QR o payload WAP.

| Campo | Tipo | Requerido | Notas |
| --- | --- | --- | --- |
| `terminal_sn` | string(32) | Sí | Número de serie de terminal. |
| `client_sn` | string(32) | Sí | Número único de orden del partner. |
| `total_amount` | string(10) | Sí | Monto total en centavos. |
| `payway` | string | Sí | Proveedor de pago. |
| `sub_payway` | string | No | Método de pago. |
| `payer_uid` | string(64) | No | Requerido por algunos flujos de official account o mini-program. |
| `subject` | string(64) | Sí | Concepto de la transacción. |
| `operator` | string(32) | Sí | Cajero u operador. |
| `description` | string(255) | No | Descripción detallada. |
| `longitude` | string | No | Debe enviarse con `latitude`. |
| `latitude` | string | No | Debe enviarse con `longitude`. |
| `device_id` | string(32) | No | Identificador del dispositivo. |
| `extended` | object | No | Campos passthrough para proveedor. |
| `goods_details` | array | No | Detalles de mercancía. |
| `reflect` | string(64) | No | Devuelto sin cambios. |
| `notify_url` | string(128) | No | URL de callback. |

Después de `PRECREATE_SUCCESS`, consulte la orden o espere callback. Una orden pre-creada normalmente es válida por unos cuatro minutos.

## Query

`POST /upay/v2/query`

Consulta el estado más reciente de una orden o reembolso. `sn` o `client_sn` es obligatorio. Si ambos se envían, `sn` tiene prioridad.

| Campo | Tipo | Requerido | Notas |
| --- | --- | --- | --- |
| `terminal_sn` | string(32) | Sí | Número de serie de terminal. |
| `sn` | string(16) | Condicional | Número de orden MUWE. |
| `client_sn` | string(32) | Condicional | Número de orden del partner. |
| `refund_request_no` | string(20) | No | Consulta un reembolso parcial específico. |

## Refund

`POST /upay/v2/refund`

Reembolsa una orden pagada. Soporta múltiples reembolsos parciales. `sn` o `client_sn` es obligatorio; `sn` tiene prioridad.

| Campo | Tipo | Requerido | Notas |
| --- | --- | --- | --- |
| `terminal_sn` | string(32) | Sí | Número de serie de terminal. |
| `sn` | string(16) | Condicional | Número de orden MUWE. |
| `client_sn` | string(32) | Condicional | Número de orden del partner. |
| `refund_request_no` | string(20) | Sí | Idempotency key del reembolso. Reutilizar en reintentos del mismo reembolso. |
| `operator` | string(32) | Sí | Cajero u operador. |
| `refund_amount` | string(10) | Sí | Monto del reembolso en centavos. |
| `extended` | object | No | Campos passthrough para proveedor. |
| `goods_details` | array | No | Mercancías reembolsadas. |

## Cancel

`POST /upay/v2/cancel`

Cancela una orden no pagada o incierta. `sn` o `client_sn` es obligatorio; `sn` tiene prioridad.

## Revoke

`POST /upay/v2/revoke`

Revierte una transacción cuando el proveedor y la ventana operativa soportan reversa del mismo día. Para devoluciones normales después del pago, use refund.

## Respuesta Común

| Campo | Tipo | Notas |
| --- | --- | --- |
| `result_code` | string | Resultado de solicitud: `200`, `400` o `500`. |
| `error_code` | string | Error de solicitud cuando `result_code` no es `200`. |
| `biz_response.result_code` | string | Resultado de negocio. |
| `biz_response.error_code` | string | Error de negocio. |
| `biz_response.data.sn` | string(16) | Número de orden MUWE. |
| `biz_response.data.client_sn` | string(32) | Número de orden del partner. |
| `biz_response.data.client_tsn` | string(53) | Serial de reembolso, normalmente `client_sn-refund_request_no`. |
| `biz_response.data.trade_no` | string(64) | Número de orden del proveedor. |
| `biz_response.data.status` | string(32) | Estado de transacción. |
| `biz_response.data.order_status` | string(32) | Estado de orden. |
| `biz_response.data.payway` | string | Proveedor de pago. |
| `biz_response.data.payway_name` | string(128) | Nombre del proveedor. |
| `biz_response.data.sub_payway` | string | Método de pago. |
| `biz_response.data.total_amount` | string(10) | Monto original en centavos. |
| `biz_response.data.net_amount` | string(10) | Monto neto restante en centavos. |
| `biz_response.data.qr_code` | string(128) | Valor o URL QR para pre-create. |
| `biz_response.data.wap_pay_request` | string(1024) | Payload WAP del proveedor. |

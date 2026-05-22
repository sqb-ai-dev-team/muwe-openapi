# Apéndice

Este apéndice define los valores de protocolo compartidos por MUWE y el contrato compatible con Upay de ShouQianBa.

## Códigos de Resultado de Solicitud

| `result_code` | `error_code` | Significado |
| --- | --- | --- |
| `200` | | Solicitud aceptada y respuesta de negocio devuelta. |
| `400` | `INVALID_PARAMS` | Parámetros inválidos. |
| `400` | `INVALID_TERMINAL` | Terminal inválida. |
| `400` | `ILLEGAL_SIGN` | Firma inválida. |
| `500` | `UNKNOWN_SYSTEM_ERROR` | Error de sistema. |
| `500` | `REQUEST_FAIL` | Servicio ocupado. Reintentar después. |
| `500` | `EXTERNAL_SERVICE_EXCEPTION` | Error de servicio externo. |
| `500` | `PAY_STATUS_CLOSED` | Permiso de cobro del comercio cerrado. |

## Códigos de Resultado de Negocio

| Valor | Significado | Manejo |
| --- | --- | --- |
| `PAY_SUCCESS` | Pago exitoso. | Entregar bienes o servicios. |
| `PAY_FAIL` | Pago falló y la orden fue cancelada. | Reintentar con un nuevo `client_sn`. |
| `PAY_FAIL_ERROR` | Pago falló y el resultado es desconocido. | Consultar y escalar si sigue incierto. |
| `CANCEL_SUCCESS` | Orden cancelada. | Estado final. |
| `CANCEL_ERROR` | Resultado de cancelación desconocido. | Consultar y escalar. |
| `CANCEL_ABORT_SUCCESS` | Cancelación durante pago exitosa. | Estado final cancelado. |
| `CANCEL_ABORT_ERROR` | Cancelación durante pago falló; estado desconocido. | Consultar y escalar. |
| `REFUND_SUCCESS` | Reembolso exitoso. | Estado final para ese reembolso. |
| `REFUND_ERROR` | Resultado de reembolso desconocido. | Consultar con `refund_request_no`. |
| `PRECREATE_SUCCESS` | Pre-creación exitosa. | Mostrar QR o payload WAP y consultar. |
| `PRECREATE_FAIL` | Pre-creación falló. | Corregir la causa antes de reintentar. |
| `SUCCESS` | Consulta u operación genérica exitosa. | Revisar `biz_response.data.order_status`. |
| `FAIL` | Operación falló sin cambiar el estado de la orden. | Revisar `error_code`. |

## Estado de Orden

| Valor | Significado |
| --- | --- |
| `CREATED` | Orden creada y lista para pago. |
| `PAID` | Orden pagada. |
| `PAY_CANCELED` | Pago falló y la orden fue cancelada. |
| `PAY_ERROR` | Pago falló y el resultado es desconocido. |
| `REFUNDED` | Orden totalmente reembolsada. |
| `PARTIAL_REFUNDED` | Orden parcialmente reembolsada. |
| `REFUND_INPROGRESS` | Reembolso en proceso. |
| `REFUND_ERROR` | Resultado de reembolso desconocido. |
| `CANCELED` | Orden cancelada por el cliente. |
| `CANCEL_ERROR` | Resultado de cancelación desconocido. |
| `CANCEL_INPROGRESS` | Cancelación en proceso. |
| `INVALID_STATUS_CODE` | Código de estado inválido. |

Estados finales: `PAID`, `PAY_CANCELED`, `REFUNDED`, `PARTIAL_REFUNDED` y `CANCELED`.

## Estado de Transacción

| Valor | Significado | Manejo |
| --- | --- | --- |
| `SUCCESS` | Transacción exitosa. | Éxito final. |
| `FAIL_CANCELED` | Transacción fallida y cancelada. | Falla final. |
| `FAIL_PROTOCOL_1` | Error de protocolo del proveedor. | No entregar. Escalar. |
| `FAIL_IO_1` | Error IO del proveedor. | No entregar. Escalar. |
| `FAIL_PROTOCOL_2` | Error de protocolo del proveedor. | No entregar. Escalar. |
| `FAIL_IO_2` | Error IO del proveedor. | No entregar. Escalar. |
| `FAIL_PROTOCOL_3` | Error de protocolo del proveedor. | No entregar. Escalar. |
| `FAIL_ERROR` | Falló la cancelación automática después de pago fallido. | No entregar. Escalar. |
| `CANCEL_ERROR` | Falló la cancelación solicitada por cliente. | Consultar y escalar. |
| `REFUND_ERROR` | Falló el reembolso. | Consultar y escalar. |
| `CREATED` | Orden aceptada pero no procesada. | Consultar. |
| `ABORTED` | Falla confirmada y cerrada. | No entregar. |
| `IN_PROG` | Orden en proceso. | Consultar. |
| `ERROR_RECOVERY` | Cancelación en proceso. | Consultar. |
| `PRE_SUCCESS` | Operación intermedia exitosa. | Consultar. |

## Proveedores y Métodos

| `payway` | Nombre | Notas |
| --- | --- | --- |
| `1` | Alipay / Alipay-Local | Alipay o wallet local overseas. |
| `3` | WeChat Pay | Pago WeChat. |
| `4` | Baidu Wallet | Baidu Wallet. |
| `5` | JD Wallet | Jingdong Pay. |
| `6` | QQ Wallet | Pre-create no soportado. |
| `7` | NFC | Pago NFC. |
| `17` | UnionPay | UnionPay Cloud QuickPass. |
| `19` | Weixin-Local | Wallet WeChat overseas. |
| `20` | Alipay Global | Alipay global. |
| `100` | Stored-value Card | Tarjeta de valor almacenado. |
| `101` | Gift Card | Tarjeta de regalo. |

| `sub_payway` | Significado |
| --- | --- |
| `1` | Pago con código de barras |
| `2` | Pago QR |
| `3` | Pago WAP |
| `4` | Mini Payment |
| `5` | APP Payment |
| `6` | H5 Payment |

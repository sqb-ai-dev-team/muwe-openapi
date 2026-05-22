# Transacciones

## Pay

`POST /upay/v2/pay`

Crea una transacción de pago con código de barras.

Campos requeridos:

| Campo | Tipo | Notas |
| --- | --- | --- |
| `terminal_sn` | string | Número de serie de la terminal. |
| `client_sn` | string | Número único de orden en el sistema del cliente. |
| `total_amount` | string | Monto en centavos. |
| `dynamic_id` | string | Código de pago del cliente. |
| `subject` | string | Concepto de la transacción. |
| `operator` | string | Identificador del cajero u operador. |

## Pre-create

`POST /upay/v2/precreate`

Crea una orden de pago QR.

Campos requeridos:

| Campo | Tipo | Notas |
| --- | --- | --- |
| `terminal_sn` | string | Número de serie de la terminal. |
| `client_sn` | string | Número único de orden en el sistema del cliente. |
| `total_amount` | string | Monto en centavos. |
| `payway` | string | Proveedor de pago. |
| `subject` | string | Concepto de la transacción. |
| `operator` | string | Identificador del cajero u operador. |

## Query

`POST /upay/v2/query`

Consulta el estado de una orden después de un resultado incierto.

## Refund

`POST /upay/v2/refund`

Reembolsa una transacción pagada.

## Cancel

`POST /upay/v2/cancel`

Cancela una orden no pagada o incierta.

## Revoke

`POST /upay/v2/revoke`

Revierte una transacción cuando el proveedor y la ventana operativa lo permiten.

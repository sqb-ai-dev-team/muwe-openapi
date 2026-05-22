# Carga de logs

`POST /terminal/uploadLog`

Endpoint operacional para diagnostico. No forma parte del flujo de autorizacion de pago.

| Campo | Tipo | Requerido | Descripcion |
| --- | --- | --- | --- |
| `terminal_sn` | string(32) | Si | Numero de serie. |
| `device_id` | string | Si | Identificador del dispositivo. |
| `log_type` | string | Si | Categoria del log. |
| `content` | string | Si | Contenido o referencia del log. |
| `occurred_at` | string | No | Momento del evento. |

Nunca envie `vendor_key`, `terminal_key` ni datos sensibles de pago en logs.

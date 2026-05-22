# Check-in

`POST /terminal/checkin`

Rota la clave de la terminal. Debe ejecutarse al menos una vez al dia.

| Campo | Tipo | Requerido | Descripcion |
| --- | --- | --- | --- |
| `terminal_sn` | string(32) | Si | Numero de serie de terminal. |
| `device_id` | string | Si | Identificador del dispositivo. |
| `os_info` | string | No | Sistema operativo. |
| `sdk_version` | string | No | Version de SDK o aplicacion. |

Despues de un check-in correcto, reemplace la clave almacenada. Solo la clave actual y la anterior siguen siendo validas.

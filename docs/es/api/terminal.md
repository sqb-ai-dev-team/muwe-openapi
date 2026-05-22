# APIs de Terminal

Las APIs de terminal de MUWE siguen el mismo ciclo de vida Upay: activar una vez, hacer check-in regularmente y firmar transacciones con las credenciales activas de la terminal.

## Activate

`POST /terminal/activate`

Registra una terminal y devuelve las credenciales para check-in y transacciones. Esta solicitud se firma con `vendor_sn` y `vendor_key`, entregados fuera de línea.

| Campo | Tipo | Requerido | Notas |
| --- | --- | --- | --- |
| `app_id` | string | Sí | ID de la aplicación del vendor registrada en MUWE. |
| `code` | string | Sí | Código de activación generado por MUWE. |
| `client_sn` | string | No | Identificador de la terminal en el sistema del partner. |
| `name` | string | No | Nombre legible de la terminal. |
| `device_id` | string | Sí | Identificador del dispositivo, como IMEI o identifierForVendor. |
| `os_info` | string | No | Información del sistema operativo. |
| `sdk_version` | string | No | Versión del SDK. |

La respuesta exitosa devuelve `terminal_sn` y `terminal_key`.

## Check-in

`POST /terminal/checkin`

Actualiza la llave de terminal. La solicitud se firma con el `terminal_sn` y `terminal_key` vigentes. Después de un check-in exitoso, solo la llave actual y la anterior son válidas.

| Campo | Tipo | Requerido | Notas |
| --- | --- | --- | --- |
| `terminal_sn` | string | Sí | Número de serie de la terminal. |
| `device_id` | string | Sí | Identificador del dispositivo. |
| `os_info` | string | No | Información del sistema operativo. |
| `sdk_version` | string | No | Versión del SDK. |

Las terminales deben hacer check-in al menos una vez al día, preferentemente antes de la primera transacción.

## Log Upload

`POST /terminal/uploadLog`

Sube logs comprimidos para diagnóstico. La solicitud se firma con `terminal_sn` y `terminal_key`.

El cuerpo es el flujo binario del log comprimido con gzip.

```json
{
  "result_code": "200",
  "error_code": "SUCCESS",
  "error_message": "ok"
}
```

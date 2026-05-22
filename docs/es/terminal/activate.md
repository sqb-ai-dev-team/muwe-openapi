# Activacion

`POST /terminal/activate`

Registra una terminal y devuelve las credenciales usadas por las siguientes solicitudes.

## Firma

Use `vendor_sn` y `vendor_key`.

## Campos

| Campo | Tipo | Requerido | Descripcion |
| --- | --- | --- | --- |
| `app_id` | string | Si | Aplicacion del vendor registrada en MUWE. |
| `code` | string | Si | Codigo de activacion. |
| `client_sn` | string | No | Identificador de terminal en el sistema del partner. |
| `name` | string | No | Nombre legible de la terminal. |
| `device_id` | string | Si | Identificador del dispositivo. |
| `os_info` | string | No | Informacion del sistema operativo. |

## Respuesta

```json
{
  "result_code": "200",
  "biz_response": {
    "terminal_sn": "10298371039",
    "terminal_key": "68d499beda5f72116592f5c527465656"
  }
}
```

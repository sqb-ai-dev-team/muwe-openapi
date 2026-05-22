# Activacion

`POST /terminal/activate`

Registra una terminal del cliente con capacidad de desarrollo y devuelve las credenciales usadas por las siguientes solicitudes. No activa una terminal propiedad de MUWE. La terminal del cliente puede ser un POS fisico, aplicacion POS, estacion de caja o endpoint logico de integracion.

## Firma

Use `vendor_sn` y `vendor_key`.

## Campos

| Campo | Tipo | Requerido | Descripcion |
| --- | --- | --- | --- |
| `app_id` | string | Si | Aplicacion del vendor registrada en MUWE. |
| `code` | string | Si | Codigo de activacion generado para el alcance de onboarding de la terminal del cliente. |
| `client_sn` | string | No | Identificador de la terminal del cliente en el sistema del partner. |
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

## Reglas

- Una terminal del cliente se activa una vez. Guarda `terminal_sn` y `terminal_key` de forma segura despues del exito.
- Los codigos de activacion pertenecen a tiendas.
- Los codigos pueden expirar y tener limites de uso.
- Un codigo multiuso crea una nueva identidad de terminal MUWE por cada activacion exitosa de una terminal del cliente.
- Las transacciones posteriores se inician desde esta dimension de terminal y se firman con las credenciales devueltas.

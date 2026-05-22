# Autenticación

Las solicitudes se autentican con una firma en la capa de aplicación.

## Encabezado

```http
Authorization: <sn> <sign>
Content-Type: application/json
```

## Firma

```text
sign = MD5(CONCAT(raw_utf8_request_body + key))
```

Se firma el cuerpo JSON exacto en bytes UTF-8. No cambie el formato del JSON después de calcular la firma.

## Selección de Llave

| Operación | Número de serie | Llave |
| --- | --- | --- |
| Activación de terminal | `vendor_sn` | `vendor_key` |
| Check-in y transacciones | `terminal_sn` | `terminal_key` |

`terminal_sn` y `terminal_key` se reciben después de una activación o check-in exitoso.

Use la [Consola de desarrollador](/es/console/) para reproducir el MD5 y el encabezado Authorization en el navegador.

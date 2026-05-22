# Resumen API

Todos los endpoints usan cuerpos JSON y respuestas JSON.

```http
POST {api_domain}/upay/v2/{operation}
Content-Type: application/json
Authorization: <sn> <sign>
```

La respuesta común tiene esta forma:

```json
{
  "result_code": "200",
  "biz_response": {
    "result_code": "PAY_SUCCESS",
    "data": {}
  }
}
```

Un transporte HTTP exitoso no significa éxito de negocio. El cliente debe validar `result_code` y `biz_response.result_code`.

## APIs de transaccion

| API | Proposito |
| --- | --- |
| [Pay](/es/api/pay) | Solicitud de pago iniciada por el comercio y completada con el flujo del proveedor configurado. |
| [Pre-create](/es/api/precreate) | Pre-creacion de pago QR. |
| [Query](/es/api/query) | Consulta de estado de transaccion. |
| [Refund](/es/api/refund) | Reembolso de una transaccion pagada. |
| [Cancel](/es/api/cancel) | Cancelacion de una transaccion no pagada o incierta. |
| [Revoke](/es/api/revoke) | Reversa del mismo dia cuando esta soportada. |

El mismo ciclo de vida tambien soporta integraciones de envio de ordenes de MIS a POS, donde el MIS o caja del comercio envia una orden a una terminal POS vinculada y reconcilia el resultado por notificacion o consulta.

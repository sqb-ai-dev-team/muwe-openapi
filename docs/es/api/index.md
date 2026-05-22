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

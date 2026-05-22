# Modelo de respuesta

Todas las APIs devuelven `result_code` en el nivel superior. Las transacciones tambien devuelven `biz_response`.

```json
{
  "result_code": "200",
  "biz_response": {
    "result_code": "PAY_SUCCESS",
    "data": {}
  }
}
```

El cliente debe revisar ambos niveles. `result_code = 200` no significa que el pago fue exitoso.

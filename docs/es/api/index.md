# Resumen API

MUWE Mexico expone una API compatible con Upay. Las rutas, firmas, estados, envelopes de respuesta y valores de campos siguen el contrato Web API de ShouQianBa. La documentación MUWE adapta nombres y ejemplos para partners, no la semántica del protocolo.

Todos los endpoints JSON usan cuerpos JSON y respuestas JSON.

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

## Grupos de Endpoints

| Grupo | Endpoints | Propósito |
| --- | --- | --- |
| Terminal | `/terminal/activate`, `/terminal/checkin`, `/terminal/uploadLog` | Ciclo de credenciales de terminal y diagnóstico. |
| Transacciones | `/upay/v2/pay`, `/upay/v2/precreate`, `/upay/v2/query`, `/upay/v2/refund`, `/upay/v2/cancel`, `/upay/v2/revoke` | Pago, consulta, reembolso, cancelación y reversa. |
| Apéndice | Valores de protocolo | Errores, resultados de negocio, estados, proveedores y métodos. |

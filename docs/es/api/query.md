# Query

`POST /upay/v2/query`

Consulta el estado de una orden o reembolso. Envie `terminal_sn` y al menos uno de `sn` o `client_sn`. Si ambos existen, `sn` tiene prioridad.

Use este endpoint despues de timeouts, resultados inciertos, ausencia de callback o conciliacion operativa.

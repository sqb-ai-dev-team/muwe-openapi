# Resumen

La API usa JSON sobre HTTPS. Todas las solicitudes y respuestas están codificadas en UTF-8.

El alcance inicial es deliberadamente pequeño:

- Aceptación de pagos con código de barras presentado por el cliente.
- Pre-creación de órdenes QR.
- Consulta y recuperación de transacciones con estado incierto.
- Reembolso, cancelación y reversa.

Las reglas específicas de México deben agregarse como extensiones versionadas, no como cambios silenciosos del contrato base.

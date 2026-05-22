# Resumen

La API usa JSON sobre HTTPS. Todas las solicitudes y respuestas están codificadas en UTF-8.

El alcance inicial es deliberadamente pequeño:

- Aceptacion de pagos mediante solicitudes iniciadas por el comercio.
- Pre-creación de órdenes QR.
- Envio de ordenes de MIS a POS.
- Consulta y recuperación de transacciones con estado incierto.
- Reembolso, cancelación y reversa.

Las reglas específicas de México deben agregarse como extensiones versionadas, no como cambios silenciosos del contrato base.

# MUWE OpenAPI

MUWE OpenAPI es la API de pagos para socios que integran servicios de digitalización comercial en México.

La primera versión de la documentación cubre el flujo compatible con Upay:

- Formato de solicitudes y firma.
- Identidad de terminal y uso de llaves.
- Solicitudes de pago iniciadas por el comercio, pre-creacion QR y envio de ordenes de MIS a POS.
- Consulta, reembolso, cancelación y reversa de transacciones.

Use esta documentación como contrato de integración para bancos, procesadores y adquirentes.

MUWE tambien soporta escenarios de envio de ordenes de MIS a POS: el sistema MIS o caja del comercio puede crear una orden y enviarla a una terminal POS vinculada, donde se completa el flujo de pago del consumidor y el resultado final puede consultarse o notificarse mediante el mismo ciclo de vida de transaccion.

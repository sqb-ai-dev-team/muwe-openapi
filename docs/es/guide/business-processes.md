# Procesos de negocio

Las transacciones de MUWE se inician desde la dimension de terminal. Una terminal es un dispositivo fisico del cliente, aplicacion POS, estacion de caja o endpoint logico de integracion con capacidad de desarrollo, activado en MUWE antes de enviar transacciones.

<div class="process-map" aria-label="Resumen de procesos de negocio">
  <div class="process-map__lane">
    <div class="process-map__lane-title">Terminal del cliente</div>
    <div class="process-map__node"><span>1</span><strong>Activar terminal propia</strong><p>Usa el codigo de activacion de onboarding para registrar la terminal del cliente en MUWE.</p></div>
    <div class="process-map__node"><span>2</span><strong>Check-in</strong><p>Rota la llave de terminal antes de procesar transacciones.</p></div>
  </div>
  <div class="process-map__lane">
    <div class="process-map__lane-title">Operacion del comercio</div>
    <div class="process-map__node"><span>3</span><strong>Crear transaccion</strong><p>Inicia un pago, orden QR u orden MIS-a-POS desde una identidad de terminal.</p></div>
    <div class="process-map__node"><span>4</span><strong>Consumidor paga</strong><p>Completa el pago con el proveedor configurado o flujo POS.</p></div>
  </div>
  <div class="process-map__lane">
    <div class="process-map__lane-title">Recuperacion y conciliacion</div>
    <div class="process-map__node"><span>5</span><strong>Resolver resultado</strong><p>Usa notificacion y consulta hasta llegar a un estado final.</p></div>
    <div class="process-map__node"><span>6</span><strong>Revertir si aplica</strong><p>Cancela, reembolsa o revoca segun el estado de la orden y capacidad del proveedor.</p></div>
  </div>
</div>

## Activacion de terminal

La activacion no es activacion de una terminal propiedad de MUWE. Es el proceso donde un cliente con capacidad de desarrollo activa su propia terminal dentro del sistema MUWE. La terminal activada recibe una identidad de terminal MUWE, y las transacciones posteriores se inician desde esa dimension de terminal.

1. El partner o cliente recibe `vendor_sn`, `vendor_key`, `app_id` y codigos de activacion durante onboarding.
2. La terminal del cliente llama `POST /terminal/activate`, firmado con `vendor_sn` y `vendor_key`.
3. MUWE valida el codigo de activacion, alcance de tienda, aplicacion y metadatos de terminal.
4. MUWE devuelve `terminal_sn` y `terminal_key`.
5. La terminal del cliente guarda ambos valores de forma segura y los usa para check-in y transacciones.

Los codigos de activacion pertenecen a tiendas, tienen limites de uso y pueden expirar. Un codigo multiuso crea una nueva identidad de terminal MUWE por cada activacion exitosa de una terminal del cliente.

## Check-in de terminal

El check-in rota la llave de terminal y limita la vida util de una llave filtrada.

1. La terminal del cliente firma `POST /terminal/checkin` con el `terminal_sn` y `terminal_key` vigentes.
2. MUWE devuelve un nuevo `terminal_key`.
3. El cliente reemplaza la llave guardada solo despues de una respuesta exitosa.
4. Despues del check-in solo son validas la llave actual y la anterior.

Haga check-in al menos una vez al dia y antes de la primera transaccion del dia.

## Transacciones

Las APIs de transaccion se firman con `terminal_sn` y `terminal_key`. El sistema del comercio puede ser un POS, aplicacion de caja, MIS u otra terminal del cliente activada en MUWE.

<div class="flow-grid" aria-label="Flujos de transaccion">
  <div class="flow-card">
    <strong>Pago iniciado por comercio</strong>
    <code>POST /upay/v2/pay</code>
    <p>El comercio inicia una solicitud de pago desde una terminal activada y el consumidor paga con el flujo configurado.</p>
  </div>
  <div class="flow-card">
    <strong>Pago QR</strong>
    <code>POST /upay/v2/precreate</code>
    <p>El comercio crea una orden y muestra un codigo QR o URL de pago. El resultado final llega despues por notificacion o consulta.</p>
  </div>
  <div class="flow-card">
    <strong>Orden MIS a POS</strong>
    <code>Integracion de partner</code>
    <p>El MIS del comercio crea una orden y la envia a una terminal POS vinculada, donde se completa el pago con el consumidor.</p>
  </div>
  <div class="flow-card">
    <strong>Consulta</strong>
    <code>POST /upay/v2/query</code>
    <p>Resuelve resultados inciertos y obtiene el estado mas reciente de la orden antes de entregar o reemplazar acciones.</p>
  </div>
  <div class="flow-card">
    <strong>Reembolso</strong>
    <code>POST /upay/v2/refund</code>
    <p>Reembolsa una orden pagada, incluidos reembolsos parciales multiples identificados por `refund_request_no`.</p>
  </div>
  <div class="flow-card">
    <strong>Cancelacion / Reversa</strong>
    <code>/cancel y /revoke</code>
    <p>Cancela ordenes no pagadas o inciertas; revoca ordenes pagadas del mismo dia solo si el proveedor lo soporta.</p>
  </div>
</div>

MUWE tambien soporta escenarios de envio de ordenes de MIS a POS dentro del mismo ciclo de vida de transaccion. El sistema MIS o caja del comercio crea la orden, la envia a una terminal POS vinculada, completa el flujo de pago con el consumidor en el POS y luego reconcilia el resultado por notificacion o consulta.

Los timeouts y resultados `*_IN_PROGRESS` son inciertos. El cliente debe consultar antes de entregar bienes o crear una orden reemplazo.

# Sistema Operativo Sunbrook · Documentación técnica y funcional
**Versión 8** · Archivo único `sunbrook_app_v8.html` (729 KB, sin dependencias externas)
Sunbrook International Development, SA de CV · Av. Transpeninsular #189 Ejido Chapultepec, 22780 Ensenada, B.C. · Tel. 646 151 9843

---

## 1. Arquitectura general

| Aspecto | Implementación |
|---|---|
| Tipo | Aplicación web de un solo archivo (HTML + CSS + JS embebidos) |
| Instalación | Se abre desde el navegador o se instala como PWA en el teléfono |
| Conexión | Funciona sin internet; la información vive en el dispositivo |
| Módulos | 25 secciones · 334 funciones · 25 ventanas emergentes |
| Roles | Admin, Oficina, Técnico, Chofer (cada uno ve solo lo suyo) |
| Logos | Blanco embebido para la app, negro para todos los documentos |

### Secciones
`dashboard` · `equipos` · `sunbrook` · `inventario` · `almacen` · `refacciones` · `venta` · `notasentrega` · `cotizaciones` · `rentas` · `clientes` · `entregas` · `visitas` · `rampas` · `reparaciones` · `checklists` · `preventivo` · `ruta` · `pendientes` · `miperfil` · `personal` · `caja` · `finanzas` · `diagnostico` · `admin`

---

## 2. Base de datos a prueba de fallas

La información **nunca se pierde**, aunque la aplicación falle, se cierre el navegador o se borre el caché. Cinco capas trabajando al mismo tiempo:

| Capa | Dónde vive | Para qué sirve |
|---|---|---|
| 1 | `localStorage['sunbrook_v8']` | Lectura y escritura inmediata |
| 2 | `localStorage['sunbrook_v8_bak']` | Copia de la versión anterior buena |
| 3 | `sessionStorage['sunbrook_v8_emg']` | Copia de emergencia de la sesión |
| 4 | IndexedDB `sunbrook_db` | Base estructurada; sobrevive limpiezas de caché |
| 5 | Respaldo `.json` descargable | Copia externa para Drive o correo |

**Cómo se recupera sola.** Al abrir, la app lee las cinco capas, descarta las corruptas (verifica que existan usuarios y equipos), compara la marca de tiempo `_meta` de cada una y **carga la más reciente que esté sana**, avisando de dónde se recuperó.

**Probado con fallas reales:**
- Archivo principal corrompido → recuperó 12 equipos y 6 clientes desde la copia de emergencia
- localStorage borrado por completo → recuperó 12 equipos y 3 checklists
- Archivo inválido importado → rechazado antes de tocar nada
- Tabla nueva faltante tras actualizar → `migrarBD()` la crea vacía sin romper lo demás

**Si se llena el almacenamiento**, libera automáticamente las fotos de registros antiguos (conservando el resto de la información) y avisa que se descargue un respaldo.

**Guardado automático** en cada cambio, más un guardado extra al cerrar o cambiar de pestaña. Cada guardado sella versión, fecha y usuario.

**Desde Admin**: `💾 Exportar respaldo` (genera el `.json`) e `♻️ Importar respaldo` (muestra qué contiene antes de restaurar y guarda copia de lo actual). Si pasan 7 días sin respaldo, la app lo recuerda.

---

## 3. Módulos y comportamientos

### 3.1 Dashboard
- Seis indicadores clickeables: equipos operando, listos para entregar, en reparación, pendientes abiertos, paradas de hoy y saldo de caja.
- Buscador de funciones con más de 250 sinónimos ("dinero"→Caja, "raya"→Personal, "yantas"→Equipos, "bodega"→Almacén).
- Un bloque por área con conteos en vivo, emoji grande centrado y acción rápida.
- Debajo: pendientes abiertos y completados con filtro por rango y reporte mensual.

### 3.2 Equipos y Equipos Sunbrook
- Alta con ID único, marca, modelo, tipo Gas/Eléctrico, torres, cliente, ubicación Maps, notas y fotos ilimitadas.
- Equipos de Gas exigen NP de filtro de aire y de aceite; si faltan se crea pendiente para Oficina.
- Los equipos propios guardan Factura de Compra, Pedimento, Anexo y DODA como documentos descargables.
- **QR**: no se pregunta aquí. La app detecta quién opera el equipo (dueño o quien lo renta) y usa el QR de ese cliente.
- Ficha con historial de checklists y reparaciones, botón directo a la reparación en curso.

### 3.3 Inventario y Almacén
- Columnas reales del Sheets: stock, NP, nombre mecánico, nombre sistemático, ubicación física y foto.
- Agrupado por ubicación con buscador integrado.
- Entradas y salidas; la salida por reparación **exige el nombre del técnico** y se adjunta al historial.
- **Refacciones pendientes de llegada** con botón "📦 Ya llegó" (pregunta quién fue por la pieza) y "↩️ Deshacer".
- Nunca hay mermas: ese motivo no existe.

### 3.4 Refacciones solicitadas
- Un técnico solo llena descripción, foto, equipo y especificaciones especiales; Oficina completa NP y proveedor.
- Etapas: Por cotizar → Por comprar → En camino (con guía de rastreo) → Llegó, falta instalar → Instalada.
- Si el equipo tiene reparación abierta, la refacción se anexa sola.
- Conectado con Almacén en ambos sentidos: entrada marca Recibida, instalación registra salida.

### 3.5 Checklists
- 14 secciones para Gas, 11 para Eléctrico, detectadas por el tipo de equipo.
- Tres estados: 🟢 **Bien** · 🟡 **Requiere atención** · 🔴 **Urgente** (atención 100% necesaria).
- Fotos y videos ilimitados, firma de quien recibe y firma del técnico tomada de su perfil.
- Al guardar: reporte automático de WhatsApp, notificación interna, pendiente si hay urgencias y botón "Cotizar estas fallas".

### 3.6 Servicios preventivos
- Insumos en fracciones sin gasolina; tabla Requerido / Subir a la van / Sobrante.
- Calendario navegable con filtro por vehículo; lunes primero, domingos bloqueados, sábados solo antes de las 11:00.
- **Antes de autorizar** se pide el NP de los filtros, se da de alta en inventario y se confirma existencia; si no hay, genera la solicitud.
- Se asigna primero el vehículo, luego técnico y ayudante **validando capacitaciones**.
- Agenda tipo Google Calendar con bloques arrastrables que se empujan entre sí.
- Botón "🗺️ Repartir en 2 unidades": agrupa por zona, propone rutas y pide autorización.

### 3.7 Ruta del día
- Vista calendario (franjas por hora, arrastre, comida marcada) o vista lista.
- Verificación previa: INE, licencia vigente y teléfono con más del 30%; insumos solo si hay preventivo ese día.
- **▶️ Iniciar ruta**: navega parada por parada con Google Maps, "Llegué / siguiente" y "🏁 Terminar ruta".
- Mandados a proveedor validan horario de apertura, cierre y comida.
- Comida del personal 12:00–13:00, postergable avisando a todos.

### 3.8 Visitas técnicas
- Equipo, cliente, quién recibe, falla, fotos y videos; siempre van 2 personas con roles.
- El técnico anota su herramienta y en la próxima visita se le precarga.
- EPP configurable (chaleco, lentes, guantes y mangas opcional).
- PDF imprimible de todo lo que debe llevar la van.

### 3.9 Reparaciones
- Montacargas y rampas, con fotos y videos del antes y del después.
- Varias fallas reportadas, cada una con qué se le hizo.
- **No se puede cerrar** con refacciones pendientes ni sin describir el trabajo realizado.
- Corrección ortográfica automática con diccionario de taller.

### 3.10 Rampas de troques
- Los 10 puntos de la instrucción de trabajo con los tres estados.
- Fotos por pares antes/después, ilimitados.
- Fallas reportadas con prioridad o "Ninguna".
- Genera reporte con logo negro y puede derivar en cotización o reparación.

### 3.11 Venta de mostrador, notas y cotizaciones
- Venta por refacción, servicio o equipo; carrito multiartículo; factura exige Constancia de Situación Fiscal.
- Nota de entrega en sucursal con efectivo se registra también como venta.
- Cotización con formato oficial: concepto separado de partidas, IVA, 50% de anticipo, vigencia de 5 días hábiles.
- Autorizable desde su propia ficha; indica si la factura está pendiente; PDF re-descargable.

### 3.12 Clientes y rentas
- Expediente con INE (opcional), Constancia Fiscal, domicilio validado contra Maps, teléfono obligatorio y descripción de su QR.
- Rentas ordenadas mostrando primero las que están por finalizar; alerta una semana antes; renovar genera registro nuevo.

### 3.13 Personal y Mi Perfil
- Asistencias (solo Oficina/Admin), adelantables para vacaciones; si alguien falta, recomienda sustituto capacitado y reasigna sus encargos.
- Capacitaciones: grúa, vehículos, preventivos, hidráulicas, mecánicas, eléctricas, regeneración.
- Pago por día, horas extra, nómina semanal por WhatsApp cada sábado.
- Mi Perfil con gráficas de actividad, donas de resultados, capacitaciones e historial completo.

### 3.14 Caja chica y Finanzas
- Caja: ingresos de la empresa, gastos, dinero disponible y dinero entregado en rutas con cuánto debe regresar.
- Finanzas: cotizaciones autorizadas, ventas, gastos fijos y variables, balance, facturas pendientes y comprobantes faltantes.
- Al autorizar una cotización pide comprobante: efectivo → folio de nota o recibo de valores; depósito → referencia bancaria.

---

## 4. Comportamientos automáticos

| Cuándo | Qué hace la aplicación |
|---|---|
| Al abrir cada día | Crea el pendiente de asistencias con todo el equipo |
| Checklist con urgencias | Pendiente + notificación + reporte WhatsApp + opción de cotizar |
| Cotización autorizada | Abre la reparación, pregunta factura y comprobante de pago |
| Refacción recibida | Notifica al técnico que la instalará |
| Reparación terminada | Equipo pasa a "Listo para entregar" y avisa al grupo |
| Renta por vencer | Alerta 7 días antes para generar el nuevo contrato |
| Día 25 | Reagenda preventivos y arma cotizaciones separadas de Akron y Pits |
| Fin de mes | Recuerda enviar el reporte mensual completo |
| Cada sábado | Recuerda enviar el pago semanal del personal |
| Jornada mayor a 8 h | Pide autorización de Oficina y registra horas extra |
| Sin respaldo en 7 días | Recuerda exportar el respaldo |

---

## 5. APIs y servicios externos

### 5.1 Ya integradas (funcionan hoy)

**Google Maps — navegación**
```
https://www.google.com/maps/dir/?api=1&destination={destino}&travelmode=driving
```
Sin llave ni costo. Se usa al iniciar la ruta y en "Cómo llegar" de cada parada.

**Google Maps Embed — ubicaciones**
```
https://www.google.com/maps?q={direccion}&output=embed
```
Muestra el mapa dentro de la app al verificar la ubicación de un equipo.

**WhatsApp Click-to-Chat — contacto directo**
```
https://wa.me/{telefono}?text={mensaje}
```
Se usa en los contactos de proveedores. El mensaje va codificado con `encodeURIComponent`.

**Impresión y PDF**: los reportes se generan con `window.open()` + `window.print()`, usando `@page` tamaño carta y reglas que impiden que los documentos se partan a la mitad.

**Cámara del dispositivo**: `<input type="file" accept="image/*" capture="environment">` abre la cámara directo, sin permisos adicionales.

### 5.2 Recomendadas para el siguiente paso

**WhatsApp Business Cloud API** (Meta) — para enviar los mensajes solos, sin copiar y pegar.
```
POST https://graph.facebook.com/v21.0/{phone-number-id}/messages
Authorization: Bearer {token-permanente}
Content-Type: application/json

{
  "messaging_product": "whatsapp",
  "to": "5216461519843",
  "type": "template",
  "template": {
    "name": "checklist_terminado",
    "language": { "code": "es_MX" },
    "components": [{
      "type": "body",
      "parameters": [
        { "type": "text", "text": "MDT-07" },
        { "type": "text", "text": "Vinícola Santo Tomás" },
        { "type": "text", "text": "2 urgentes" }
      ]
    }]
  }
}
```
Requiere: cuenta de WhatsApp Business, número verificado, y **plantillas aprobadas por Meta** (24–48 h de revisión). Plantillas a registrar: `checklist_terminado`, `servicio_preventivo_dia25`, `recoleccion_autorizada`, `pago_semanal`, `reporte_mensual`, `refaccion_recibida`, `movimiento_caja`. Costo por conversación iniciada por la empresa; las respuestas dentro de 24 h no cuestan extra.

**Google Sheets API v4** — para sincronizar con tu hoja actual (ID `1bCLhMOaTDuR973mFhChA9bZMW1BNDqX_u6FysiDMBGc`).
```
GET  https://sheets.googleapis.com/v4/spreadsheets/{id}/values/INVENTARIO!A:F
PUT  https://sheets.googleapis.com/v4/spreadsheets/{id}/values/INVENTARIO!A2:F100?valueInputOption=USER_ENTERED
Authorization: Bearer {token OAuth2 o cuenta de servicio}
```
Hojas: INVENTARIO, EQUIPOS, COMPRAS_RECEPCIÓN, CHECKLISTS, REFACCIONES_SOLICITADAS, TALLER.

**Google Drive API v3** — respaldo automático del `.json` en la nube.
```
POST https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart
```

**Google Directions API** — optimización real de rutas con tráfico y tiempos.
```
GET https://maps.googleapis.com/maps/api/directions/json
    ?origin=...&destination=...&waypoints=optimize:true|...&key={API_KEY}
```
Hoy la app agrupa por zonas de Ensenada calculando distancias aproximadas; con esta API tendría tiempos reales.

**Firebase / Supabase** — si quieres que varios dispositivos compartan la misma información en tiempo real. Sería el reemplazo natural de la capa local, conservando esta como respaldo cuando no haya señal.

---

## 6. Cómo publicarla

La aplicación funciona abriendo el archivo directamente. Para tenerla en línea:
1. Subir el archivo a un repositorio de GitHub.
2. En Render: **New → Static Site**, sin comando de construcción.
3. Desde el teléfono, "Agregar a pantalla de inicio" para usarla como app.

---

## 7. Usuarios de prueba

| Correo | Rol | Alcance |
|---|---|---|
| israel@sunbrook.com | Admin | Todo, incluida la administración de usuarios |
| oficina@sunbrook.com | Oficina | Todo menos administración |
| taller@sunbrook.com | Técnico | Operación, sin caja, finanzas ni personal |
| chofer@sunbrook.com | Chofer | Ruta, entregas, visitas, rampas y su perfil |

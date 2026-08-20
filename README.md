# Sistema Operativo Sunbrook · v8

Aplicación de operación para **Sunbrook International Development, SA de CV**
Av. Transpeninsular #189 Ejido Chapultepec, 22780 Ensenada, B.C. · Tel. 646 151 9843

Montacargas y rampas de troques: equipos, checklists, reparaciones, servicios preventivos,
rutas, refacciones, almacén, clientes, personal, caja chica y finanzas.
Funciona sin internet y se instala como aplicación en el teléfono.

---

## Contenido del repositorio

| Archivo | Qué es |
|---|---|
| `index.html` | La aplicación completa (todo va dentro: interfaz, lógica, logos y documentos) |
| `templates.html` | Los 21 formatos impresos de referencia |
| `DOCUMENTACION.md` | Funcionalidades, comportamientos automáticos y APIs |
| `server.js` | Servidor sin dependencias |
| `package.json` · `render.yaml` | Configuración de publicación |
| `manifest.json` · `sw.js` | Para instalarla como app y usarla sin señal |

---

## 1 · Subirla a GitHub

**Sin instalar nada (recomendado):**

1. Entra a <https://github.com/new>
2. Nombre: `sunbrook-app` · déjalo **Private** · **no** marques "Add a README"
3. Presiona **Create repository**
4. En la pantalla siguiente toca **uploading an existing file**
5. Descomprime el ZIP y **arrastra los 8 archivos** a la ventana del navegador
6. Escribe `Version 8` y presiona **Commit changes**

**Desde la terminal:**

```bash
cd sunbrook-app
git init
git add .
git commit -m "Sistema Operativo Sunbrook v8"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/sunbrook-app.git
git push -u origin main
```

---

## 2 · Publicarla en Render

1. Entra a <https://render.com> y conecta tu cuenta de GitHub
2. **New → Web Service** y elige el repositorio `sunbrook-app`
3. Llena así:

| Campo | Valor |
|---|---|
| Name | `sunbrook-app` |
| Language | **Node** |
| Branch | `main` |
| Region | Oregon |
| Root Directory | *(vacío)* |
| Build Command | *(vacío — no hay dependencias)* |
| Start Command | `npm start` |
| Instance Type | **Free** |

4. **Create Web Service**. En un par de minutos verás en el log
   *"Sunbrook escuchando en el puerto…"* y tu dirección quedará lista:
   `https://sunbrook-app.onrender.com`

> En el plan gratuito el servicio se duerme tras 15 minutos sin uso y la primera
> visita tarda unos 30 segundos en despertar. Como la información vive en el
> teléfono y la app funciona sin señal, esto no afecta el trabajo en campo.

---

## 3 · Instalarla en los teléfonos

Cada quien abre la dirección en su teléfono y:

- **Android (Chrome):** menú ⋮ → *Agregar a pantalla principal*
- **iPhone (Safari):** botón compartir → *Agregar a pantalla de inicio*

Queda con su ícono, a pantalla completa y funcionando sin señal.

---

## 4 · Primer uso

Entra con tu correo. Los usuarios ya cargados son:

| Correo | Rol | Alcance |
|---|---|---|
| `israel@sunbrook.com` | Admin | Todo, incluida la administración de usuarios |
| `aolmosoropeza5.10@gmail.com` | Técnico | Solo taller (Alejandro) |
| `oficina@sunbrook.com` | Oficina | Todo menos administración |
| `taller@sunbrook.com` | Técnico | Operación de taller |
| `chofer@sunbrook.com` | Chofer | Ruta, entregas, visitas y rampas |

Desde **Admin** puedes agregar más personas, cambiar sus permisos y su rol.

**Antes de empezar en serio:** entra a Admin y presiona **💾 Exportar respaldo**
para tener una copia de arranque. La aplicación te recordará hacerlo cada 7 días.

---

## 5 · Resguardo de la información

La información se guarda en cinco capas al mismo tiempo (almacenamiento local,
respaldo rotativo, copia de emergencia, base interna del dispositivo y archivo
descargable). Si una falla, la aplicación se recupera sola de la siguiente.

- **Exportar:** Admin → *💾 Exportar respaldo* → guarda el `.json` en Drive o correo
- **Restaurar:** Admin → *♻️ Importar respaldo* → combina sin borrar lo que ya existe

> Cada dispositivo guarda su propia información. Si quieres que todos vean lo
> mismo en tiempo real, hay que conectar una base en la nube (ver el apartado 7).

---

## 6 · Conectar WhatsApp

Hoy la aplicación **ya arma todos los mensajes** (checklist terminado, día 25,
recolecciones, pago semanal, reporte mensual) y los copia al portapapeles para
pegarlos en el grupo. Para que se envíen solos, sigue estos pasos.

### 6.1 Crear la cuenta

1. Entra a <https://business.facebook.com> con la cuenta de Facebook de la empresa
2. **Configuración del negocio → Cuentas → Cuentas de WhatsApp → Agregar**
3. Verifica el negocio (piden constancia fiscal y comprobante de domicilio, tarda 1-3 días)

### 6.2 Registrar el número

1. Entra a <https://developers.facebook.com> → **Mis aplicaciones → Crear aplicación**
2. Tipo: **Empresa** · nombre: `Sunbrook`
3. Agrega el producto **WhatsApp**
4. En *Configuración de la API*, agrega el número de la empresa y verifícalo por SMS

> El número **no puede estar activo en WhatsApp normal**. Usa un número aparte
> para la empresa, o primero borra la cuenta de WhatsApp de ese número.

Ahí mismo copia el **Identificador del número de teléfono** (`phone-number-id`).

### 6.3 Generar el token permanente

1. **Configuración del negocio → Usuarios → Usuarios del sistema → Agregar**
2. Nombre: `Sunbrook API` · rol **Administrador**
3. **Generar token** → elige tu aplicación → permisos `whatsapp_business_messaging`
   y `whatsapp_business_management` → **Sin caducidad**
4. Cópialo y guárdalo bien (solo se muestra una vez)

### 6.4 Registrar las plantillas

Meta exige que los mensajes que inicia la empresa usen plantillas aprobadas
(tardan de 1 a 48 horas). En **WhatsApp Manager → Plantillas de mensajes → Crear**,
categoría *Utilidad*, idioma *Español (MX)*:

| Nombre | Texto sugerido |
|---|---|
| `checklist_terminado` | Checklist terminado del equipo {{1}} en {{2}}. Resultado: {{3}}. |
| `servicio_preventivo_dia25` | Recordatorio día 25: hay {{1}} servicios por reagendar. Equipos: {{2}}. |
| `recoleccion_autorizada` | Se autorizó la recolección del equipo {{1}} de {{2}}. Recibe: {{3}}. |
| `pago_semanal` | Pago semanal de {{1}}: {{2}} días trabajados. Total: {{3}}. |
| `reporte_mensual` | Reporte de {{1}}: {{2}} pendientes completados, {{3}} servicios realizados. |
| `refaccion_recibida` | Ya llegó la refacción {{1}} para el equipo {{2}}. Está en {{3}}. |
| `movimiento_caja` | Movimiento en caja chica: {{1}} de {{2}}. Disponible: {{3}}. |

### 6.5 Conectarlo con la aplicación

Como la app corre en el navegador y el token no debe quedar expuesto, se necesita
un intermediario. Crea en Render un **segundo servicio** con este archivo:

```js
// whatsapp.js — servicio aparte en Render
const http = require('http');
const TOKEN = process.env.WA_TOKEN;
const PHONE_ID = process.env.WA_PHONE_ID;
const GRUPO = process.env.WA_DESTINO;   // 5216461519843

http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.end();
  if (req.url !== '/enviar') { res.writeHead(404); return res.end(); }

  let body = '';
  req.on('data', c => body += c);
  req.on('end', async () => {
    try {
      const { plantilla, parametros, destino } = JSON.parse(body);
      const r = await fetch(`https://graph.facebook.com/v21.0/${PHONE_ID}/messages`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: destino || GRUPO,
          type: 'template',
          template: {
            name: plantilla,
            language: { code: 'es_MX' },
            components: [{ type: 'body', parameters: (parametros || []).map(t => ({ type: 'text', text: String(t) })) }]
          }
        })
      });
      const d = await r.json();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(d));
    } catch (e) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: String(e) }));
    }
  });
}).listen(process.env.PORT || 3001);
```

En Render, ese servicio lleva estas variables (**Environment → Add**):

| Variable | Valor |
|---|---|
| `WA_TOKEN` | El token permanente del paso 6.3 |
| `WA_PHONE_ID` | El identificador del paso 6.2 |
| `WA_DESTINO` | `5216461519843` (con 52 y el 1 de México) |

Luego, en la aplicación, entra a **Admin** y pega la dirección de ese servicio
(por ejemplo `https://sunbrook-whatsapp.onrender.com/enviar`) en el campo
*Servicio de WhatsApp*. A partir de ahí los mensajes salen solos.

### Costo

Meta cobra por conversación iniciada por la empresa (alrededor de 0.03 USD en
M�xico). Las respuestas dentro de las 24 horas siguientes no cuestan extra, y las
primeras 1,000 conversaciones al mes son gratis.

---

## 7 · Siguientes pasos posibles

| Qué | Para qué |
|---|---|
| **Google Sheets API** | Sincronizar con tu hoja actual (inventario, equipos, checklists) |
| **Google Drive API** | Que el respaldo suba solo a Drive cada semana |
| **Directions API** | Optimizar rutas con tráfico y tiempos reales |
| **Firebase o Supabase** | Que todos los dispositivos vean la misma información al instante |
| **Gemini** | Ya integrado: pega la clave en Admin para las equivalencias de refacciones |

En `DOCUMENTACION.md` está el detalle técnico de cada una.

---

## Soporte

Si algo falla, exporta el respaldo desde Admin antes de cualquier cosa: así la
información queda a salvo aunque haya que reinstalar.

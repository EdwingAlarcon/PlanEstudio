---
moduleId: 21
title: "Power Pages — Portales Externos"
level: "avanzado"
certification: "PL-400"
estimatedMinutes: 8
slug: "power-pages-portales-externos"
---
### 🎯 Objetivo
Construir portales web externos con Power Pages que permiten a clientes y proveedores acceder a datos de Dataverse de forma segura, con autenticación, formularios de autoservicio y búsqueda.

### 📖 Conceptos Clave
- **Power Pages:** plataforma de Microsoft para construir sitios web externos (sucesor de Power Apps Portals). Permite a usuarios sin cuenta en el tenant corporativo registrarse, autenticarse, y acceder a datos de Dataverse de forma controlada. Incluye un Studio de diseño low-code con componentes drag-and-drop, soporte para Liquid templates, Web API JavaScript, y configuración de autenticación contra múltiples identity providers.
- **Table Permissions:** mecanismo de seguridad exclusivo de Power Pages que controla qué operaciones CRUD puede hacer un usuario del portal sobre cada tabla de Dataverse. Los tipos de acceso son: Global (todos los registros), Contact (solo registros del Contact autenticado), Account (registros de la Account del Contact), Parent (registros relacionados vía lookup), y Self (solo el registro del Contact mismo). Sin Table Permission configurado, el usuario no puede leer ni escribir ningún dato aunque esté autenticado.
- **Web Roles:** roles de seguridad dentro del portal que agrupan usuarios y determinan qué Table Permissions y páginas pueden acceder. Son independientes de los Security Roles de Dataverse. Los roles predeterminados son `Authenticated Users` (usuarios con sesión activa) y `Anonymous Users` (visitantes sin autenticar). Se crean roles adicionales para segmentar por tipo de cliente, nivel de contrato, o región.
- **Contact record:** cada usuario registrado en el portal tiene un registro Contact en Dataverse que actúa como su identidad maestra. El email del usuario es la clave de vinculación. Las Table Permissions de tipo "Contact" filtran datos usando el ID de este Contact como criterio. Al crear un registro desde el portal, se puede auto-poblar el campo de relación con el Contact del usuario autenticado.
- **Liquid templates:** lenguaje de plantillas server-side (basado en Liquid de Shopify) para generar HTML dinámico en las páginas del portal. Permite acceder a objetos del contexto como `user` (el Contact autenticado), `entities` (consultar registros de Dataverse), `page` (metadatos de la página), y `request` (parámetros de URL). Ejemplo: `{% assign casos = entities.incident | where: 'customerid', user.contact.id %}` consulta los casos del usuario.
- **Entity Forms / Basic Forms:** componente de Power Pages que renderiza un formulario de Dataverse en el portal para crear, editar, o leer un registro. Se configura especificando la tabla, el formulario de Dataverse a usar (se recomienda un formulario específico para el portal con menos campos), y el modo (Insert, Edit, ReadOnly). Soporta validaciones, redirección post-submit, y pasos de wizard con múltiples formularios.
- **Entity Lists / Basic Lists:** componente de Power Pages que renderiza una vista de Dataverse como lista en el portal, con filtrado, búsqueda y paginación. Se configura a partir de una Vista de Dataverse existente. Puede incluir acciones por fila (Ver detalle, Editar) y se integra con Entity Forms para el flujo completo de gestión de registros.
- **Web API del portal:** API REST JavaScript disponible en las páginas del portal para operaciones CRUD sobre registros de Dataverse sin recargar la página. Usa la ruta `/api/data/v9.1/[entitySetName]` y requiere el header `__RequestVerificationToken` en todas las operaciones de escritura (POST, PATCH, DELETE) como protección CSRF. Respeta los Table Permissions del usuario autenticado.
- **Content Delivery Network (CDN):** red de distribución de contenido que almacena archivos estáticos del portal (imágenes, CSS, JS) en nodos geográficamente distribuidos. Se activa en el portal con un toggle en la configuración. Reduce la latencia de carga para usuarios alejados del datacenter de Power Platform — especialmente importante para portales con usuarios en múltiples países.
- **Progressive Web App (PWA):** capacidad de Power Pages para hacer que el portal sea instalable como app en dispositivos móviles y soporte uso offline básico. Se habilita configurando el manifest del PWA con icono, colores y nombre, y el service worker para caché offline. Los usuarios pueden instalar el portal desde el navegador como si fuera una app nativa.

### 👨‍💻 Actividades Prácticas Paso a Paso

#### Actividad 21.1: Crear portal base
1. make.powerapps.com → Aplicaciones → Nueva → Portal
2. Nombre: `Portal Clientes SIT`
3. Seleccionar: Blank website (o Customer Self-Service si aplica)
4. Subdominio: `clientes-sit.powerappsportals.com`
5. Abrir Power Pages Studio (nueva interfaz)

#### Actividad 21.2: Configurar autenticación
1. Set up → Identity providers
2. Configurar Azure AD (para empleados del cliente):
    - App Registration en Azure AD con redirect URI: `https://clientes-sit.powerappsportals.com/signin-oidc`
    - En Portal: Identity Provider → Azure AD → Client ID, Client Secret, Authority

3. Configurar Local Authentication (para usuarios externos sin Azure AD):
    - Allow users to register with email
    - Configurar email de confirmación con plantilla personalizada

#### Actividad 21.3: Table Permissions para Oportunidades
1. Security → Table Permissions → New
2. **Permiso: Ver mis oportunidades**
    - Tabla: Oportunidad
    - Tipo de acceso: Contact (el usuario ve solo sus oportunidades)
    - Relación: Oportunidad.sit_contacto → Contact
    - Privilegios: Leer, Crear

3. **Permiso: Ver estados de casos (solo lectura)**
    - Tabla: Caso
    - Tipo de acceso: Contact
    - Relación: Caso.customerid → Contact
    - Privilegios: Leer

4. Asignar permisos al Web Role `Clientes Autenticados`

#### Actividad 21.4: Página con Liquid template personalizado
1. En Power Pages Studio → Nueva página → Contenido personalizado
2. Agregar template Liquid para mostrar saludo personalizado:
   ```liquid
   {% if user %}
     <div class="welcome-banner">
       <h2>Bienvenido, {{ user.fullname }}</h2>
       <p>Tiene {{ user.contact.sit_oportunidades_activas }} oportunidades activas.</p>
     </div>
     
     {% assign mis_casos = entities.incident | 
        where: 'customerid', user.contact.id | 
        order_by: 'createdon', 'desc' | 
        limit: 5 %}
     
     <h3>Mis últimos casos</h3>
     <table class="table">
       <thead>
         <tr><th>Número</th><th>Asunto</th><th>Estado</th></tr>
       </thead>
       <tbody>
         {% for caso in mis_casos %}
         <tr>
           <td>{{ caso.ticketnumber }}</td>
           <td>{{ caso.title }}</td>
           <td><span class="badge badge-{{ caso.statuscode.label | downcase }}">
             {{ caso.statuscode.label }}
           </span></td>
         </tr>
         {% endfor %}
       </tbody>
     </table>
   {% else %}
     <p>Por favor <a href="/SignIn">inicia sesión</a> para ver tu información.</p>
   {% endif %}
   ```

#### Actividad 21.5: Formulario de creación de solicitudes
1. Nueva página → Basic Form
2. Tabla: Solicitud (sit_solicitud)
3. Formulario de Dataverse: `Solicitud Portal` (crear este formulario específico para el portal con menos campos)
4. Modo: Insertar
5. Redirigir a: página de confirmación después de guardar
6. Configurar en la página: entity form component
7. Agregar validación JavaScript en la página:
   ```javascript
   // Validar archivo adjunto requerido antes de enviar
   $(document).ready(function() {
     $('#InsertButton').on('click', function(e) {
       var descripcion = $('#sit_descripcion').val();
       if (descripcion.length < 50) {
         e.preventDefault();
         alert('La descripción debe tener al menos 50 caracteres para procesar su solicitud correctamente.');
         $('#sit_descripcion').focus();
       }
     });
   });
   ```

#### Actividad 21.6: Web API desde JavaScript
```javascript
// Crear un caso directamente desde JavaScript del portal
function crearCasoPortal(asunto, descripcion) {
  var payload = JSON.stringify({
    "title": asunto,
    "description": descripcion,
    "caseorigincode": 3,  // Web
    "customerid_contact@odata.bind": "/contacts(" + _loggedInUserId + ")"
  });
  
  fetch('/api/data/v9.1/incidents', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      '__RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val()
    },
    body: payload
  })
  .then(response => {
    if (response.ok) {
      window.location.href = '/mis-casos?creado=true';
    } else {
      return response.json().then(err => { throw err; });
    }
  })
  .catch(error => {
    console.error('Error creando caso:', error);
    alert('Error al crear el caso. Por favor intente nuevamente.');
  });
}
```

### 💼 Caso Real de Negocio
**Empresa:** Empresa de servicios con 2,000 clientes activos  
**Problema:** Los clientes llamaban por teléfono para saber el estado de sus contratos y casos. 60% de las llamadas eran consultas de estado, no problemas reales.  
**Solución:** Portal Power Pages donde el cliente ve sus contratos, crea casos, descarga facturas y ve el estado en tiempo real. Integrado con Dataverse donde vive toda la información del CRM.  
**Resultado:** Llamadas de soporte reducidas en 55%. NPS (Net Promoter Score) subió de 42 a 68.

### ✅ Buenas Prácticas
- Table Permissions en "Contact" > "Global" — nunca exponer todos los registros a usuarios del portal
- Crear formularios de Dataverse específicos para el portal (menos campos, UX simplificada)
- Usar CDN y compresión de imágenes — los portales externos deben cargar en < 3 segundos
- Habilitar WAF (Web Application Firewall) en producción

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Usuario autenticado no ve sus registros | Table Permission no configurado o mal relacionado | Revisar tipo de acceso (Contact vs Account vs Global) y la relación |
| Liquid template devuelve vacío | La relación de la tabla no tiene fetch correcto | Usar fetchxml en Liquid o verificar nombre de relación |
| Web API retorna 403 | Token de verificación no incluido en la llamada | Siempre incluir `__RequestVerificationToken` en headers de fetch |

### 🧪 Criterios de Validación
- [ ] Portal creado con autenticación Azure AD funcional
- [ ] Usuario autenticado ve solo sus propios casos (Table Permission de tipo Contact)
- [ ] Página con Liquid muestra datos dinámicos del usuario logueado
- [ ] Formulario de creación de solicitud guarda en Dataverse correctamente
- [ ] Validación JavaScript previene envío de formulario sin descripción mínima

---

---
moduleId: 29
title: "Power Pages Avanzado y Azure AD B2C"
level: "avanzado"
certification: "PL-400"
estimatedMinutes: 9
slug: "power-pages-avanzado-y-azure-ad-b2c"
---
### 🎯 Objetivo
Implementar portales externos con autenticación multitenant usando Azure AD B2C para clientes externos, flujos de registro personalizado, integración con APIs externas vía Web API del portal, y optimización de SEO y rendimiento.

### 📖 Conceptos Clave
- **Azure AD B2C:** servicio de identidad de Microsoft Azure para gestionar usuarios externos al tenant corporativo (clientes, proveedores, ciudadanos). Permite que usuarios con cualquier email (no solo cuentas Microsoft corporativas) se registren, inicien sesión, recuperen contraseñas y gestionen su perfil. El tenant de B2C es completamente separado del Azure AD corporativo y tiene su propio portal de administración (`portal.azure.com` → Cambiar directorio → el tenant B2C).
- **User Flows:** flujos de autenticación configurables por interfaz gráfica en B2C para los escenarios más comunes. Tipos disponibles: Sign up and sign in (registro + inicio de sesión combinados), Sign in (solo login para usuarios ya registrados), Password reset (recuperación de contraseña por email), Profile editing (el usuario actualiza su nombre, teléfono, etc.). Cada User Flow configura qué atributos se recopilan en el registro, qué claims se incluyen en el token JWT devuelto, y si se requiere MFA.
- **Custom Policies (IEF — Identity Experience Framework):** sistema de políticas XML avanzadas de B2C para implementar flujos de autenticación que los User Flows no soportan: federar con identity providers externos (SAML 2.0, otros OAuth), lógica condicional (MFA solo para transacciones de alto valor), transformaciones de claims personalizadas (combinar firstName + lastName en displayName), e integración con APIs REST propias para enriquecer el perfil del usuario durante el login. La curva de aprendizaje es alta — el "starter pack" de IEF de Microsoft es el punto de partida.
- **Identity Experience Framework (IEF):** el motor de ejecución de Custom Policies en B2C. Procesa las políticas XML secuencialmente, ejecutando Technical Profiles (unidades de configuración) para: obtener claims de fuentes externas, transformar claims, mostrar páginas de UI al usuario, y emitir tokens. Conceptos clave de IEF: TrustFrameworkBase.xml (base común), TrustFrameworkLocalization.xml (traducciones), TrustFrameworkExtensions.xml (personalizaciones), y SignUpOrSignin.xml (la política raíz que se invoca).
- **Liquid Cache:** mecanismo de caché de Power Pages para objetos consultados con Liquid que se acceden repetidamente en la misma página. La sintaxis `{% cache 'nombre-cache' timeout:3600 %}...{% endcache %}` almacena el resultado de una consulta Liquid durante 3600 segundos (1 hora). Útil para consultas de catálogos o datos que cambian poco: categorías de productos, países, configuraciones del portal — evita consultar Dataverse en cada request.
- **Power Pages Web Templates:** componentes de Liquid reutilizables que se incluyen en múltiples páginas del portal con `{% include 'Nombre Template' %}`. Permiten separar el header, footer, navegación lateral, banners, y layouts comunes en plantillas independientes. Se crean en Portal Management → Web Templates. Equivalente a los componentes de una aplicación web — evita duplicar HTML y Liquid en decenas de páginas.
- **Sitemap (estructura de navegación):** jerarquía de páginas, web links y shortcuts que define la estructura del portal en Power Pages. Cada página del portal tiene una entrada en el sitemap con su URL, título, visibilidad (visible en menú o no), y permisos de acceso por Web Role. La estructura del sitemap determina las URLs del portal (`/inicio`, `/mis-casos`, `/perfil`) y el árbol de navegación que aparece en el menú.
- **Web File:** tipo de componente del portal para almacenar archivos estáticos como CSS personalizados, JavaScript adicional, imágenes, PDFs descargables, y fuentes. Los Web Files se almacenan en Dataverse y son accesibles vía URL pública del portal. Se gestionan en Portal Management → Web Files. Se referencian desde plantillas Liquid con la URL completa o con la función `{{ site.url }}/WebFiles/nombre-archivo.css`.
- **User Flows vs Custom Policies (IEF):** User Flows son el camino preferido cuando el escenario es estándar — registro con email, login con Google/Facebook, reset de contraseña. Son configurables por GUI, sin XML, y Microsoft los mantiene actualizados. Custom Policies son necesarias cuando: se requiere federar con un SAML 2.0 antiguo, enriquecer el perfil consultando una API interna durante el login, implementar MFA condicional según el nivel de riesgo, o combinar múltiples identity providers con lógica de selección.
- **Claims Mapping B2C → Contact:** proceso de vincular el usuario autenticado en B2C con su registro Contact en Dataverse. Al completar el login exitoso en Power Pages, el portal recibe el token JWT de B2C con los claims configurados (email, displayName, objectId). Power Pages busca automáticamente un Contact con el email coincidente. Si existe, lo vincula mediante el registro `externalidentity` con el `objectId` de B2C como clave. Si no existe, crea un Contact nuevo con los claims del token — el mapeo de claims a campos del Contact se configura en la configuración del identity provider del portal.
- **Portal Web API con CSRF:** la Web API JavaScript del portal para operaciones CRUD sobre Dataverse requiere el header `__RequestVerificationToken` en todas las operaciones de escritura (POST, PATCH, DELETE) como protección contra ataques CSRF (Cross-Site Request Forgery). El token se obtiene del input hidden que Power Pages genera en todas las páginas: `$('input[name="__RequestVerificationToken"]').val()`. Sin este token, las peticiones de escritura devuelven HTTP 403.
- **SEO en Power Pages con Liquid:** optimización de motores de búsqueda implementada mediante: meta-tags dinámicos en el `<head>` usando Liquid (`<title>{{ page.title }} — Empresa</title>`, `<meta name="description" content="{{ page.description }}">`), sitemap.xml automático accesible en `/sitemap.xml`, URLs amigables configuradas en el Page slug (sin parámetros de query), y etiquetas Open Graph para compartir en redes sociales (`og:title`, `og:description`, `og:image`). Configurable en la configuración de cada página del portal y mediante Web Templates de layout.

### 👨‍💻 Actividades Prácticas Paso a Paso

#### Actividad 29.1: Configurar Azure AD B2C
1. Azure Portal → Crear recurso → Azure AD B2C
2. Crear nuevo tenant B2C: `sitconsultingb2c.onmicrosoft.com`
3. User Flows → Nuevo flujo → Sign up and sign in
    - Método: Email
    - Atributos a recopilar: Nombre, Apellido, País
    - Claims a retornar: Email, Nombre completo, ObjectId

4. App Registrations en B2C:
    - Nombre: `Power Pages Portal`
    - Redirect URI: `https://clientes-sit.powerappsportals.com/signin-oidc`
    - Permisos: `openid`, `offline_access`

#### Actividad 29.2: Conectar B2C con Power Pages
1. Power Pages Studio → Set up → Identity providers → Azure AD B2C
2. Configurar:
    - Authority: `https://sitconsultingb2c.b2clogin.com/sitconsultingb2c.onmicrosoft.com/B2C_1_SignUpSignIn`
    - Client ID: (de App Registration en B2C)
    - Client Secret
    - Redirect URI: confirmar que coincide

3. Personalizar la experiencia de registro con Liquid en la página de perfil:
   ```liquid
   {% if user %}
     {% assign contact = entities.contact[user.contact.id] %}
     
     {% if contact.sit_onboarding_completo != true %}
       <!-- Mostrar formulario de bienvenida para usuarios nuevos -->
       <div class="onboarding-wizard">
         <h2>Bienvenido {{ user.fullname }}, completa tu perfil</h2>
         <!-- Entity Form de onboarding -->
       </div>
     {% else %}
       <!-- Dashboard normal -->
     {% endif %}
   {% endif %}
   ```

#### Actividad 29.3: Web Template reutilizable
1. Portal Management → Web Templates → Nuevo
2. Nombre: `Layout Base Portal`
3. Contenido:
   ```liquid
   <!DOCTYPE html>
   <html lang="es">
   <head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <title>{{ page.title }} — Portal Clientes SIT</title>
     <meta name="description" content="{{ page.description }}">
     {% include 'Estilos Corporativos' %}
   </head>
   <body>
     {% include 'Header Portal' %}
     
     <main class="container-fluid py-4">
       <div class="row">
         {% if user %}
         <div class="col-md-3">
           {% include 'Navegación Lateral' %}
         </div>
         <div class="col-md-9">
           {{ content }}
         </div>
         {% else %}
         <div class="col-12">
           {{ content }}
         </div>
         {% endif %}
       </div>
     </main>
     
     {% include 'Footer Portal' %}
     {% include 'Scripts Base' %}
   </body>
   </html>
   ```

### 💼 Caso Real de Negocio
**Empresa:** SaaS con clientes de 50 países distintos  
**Problema:** Necesitaban portal de autoservicio para clientes externos sin que esos usuarios tuviesen cuentas en el Azure AD corporativo.  
**Solución:** Azure AD B2C para registro/login de clientes externos. Cada cliente solo ve sus propios datos (Table Permissions). Language switcher con Liquid para soporte de ES/EN/PT.  
**Resultado:** Portal con 3,500 usuarios registrados en primer mes. 0 llamadas de soporte para "cómo inicio sesión".

### ✅ Buenas Prácticas
- B2C para usuarios externos, Azure AD para usuarios internos — nunca mezclar en el mismo portal sin MFA diferenciado
- Web Templates reducen la duplicación de Liquid entre páginas
- Habilitar CDN en portales con usuarios globales — mejora latencia significativamente
- Probar el flujo de registro y login completo con un usuario nuevo en cada despliegue — los Identity Providers son los componentes más frágiles tras una actualización del portal
- Usar User Flows de B2C para escenarios estándar (90% de los casos) y reservar Custom Policies solo para requisitos que el User Flow no puede satisfacer — las Custom Policies tienen una curva de mantenimiento significativamente mayor

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Login con B2C redirige a página de error del portal | Redirect URI en la App Registration de B2C no coincide exactamente con la URL del portal | Verificar que el Redirect URI en B2C es `https://[dominio-portal]/signin-oidc` sin barra final |
| Usuario autenticado con B2C no tiene registros en Contact | El email en el token B2C no coincide con ningún Contact existente | Configurar el claim `email` en el User Flow y activar la creación automática de Contact en el portal (Site Setting: `Authentication/Registration/Enabled = true`) |
| Liquid template `{% assign x = entities.sit_caso %}` retorna vacío después de login con B2C | Table Permission para la tabla no está asignado al Web Role del usuario B2C | Verificar que el Web Role `Authenticated Users` (o un rol personalizado) tiene el Table Permission para `sit_caso` |
| Portal con B2C lanza "AADB2C90273" en el login | La URL de respuesta configurada en el portal no coincide con lo registrado en B2C — diferencia de mayúsculas o barra final | Copiar la URL exacta del portal en el campo Redirect URI del App Registration de B2C |
| Custom Policy falla con "UserJourneyNotFound" | El archivo TrustFrameworkBase.xml no fue subido o tiene errores de validación | Subir los archivos en orden: Base → Localization → Extensions → SignUpOrSignin y usar la herramienta de validación del portal B2C |

### 🧪 Criterios de Validación
- [ ] Usuario externo puede registrarse con email via B2C sin cuenta Azure AD corporativa
- [ ] After login, usuario ve solo sus registros (Table Permissions tipo Contact)
- [ ] Web Template base aplicado en todas las páginas del portal
- [ ] Portal carga en < 3 segundos (medir con Lighthouse)

---

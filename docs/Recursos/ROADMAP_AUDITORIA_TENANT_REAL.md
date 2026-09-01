# Roadmap de auditoria tenant-real para PlanEstudio

Este documento traduce la auditoria de principiante a sprints ejecutables bajo una premisa corregida:
el alumno si tendra acceso a un tenant real de Microsoft y ejecutara ahi los laboratorios del plan.

La aplicacion no necesita conectarse al tenant ni validar automaticamente cada configuracion. Su funcion
es entregar contenido, instrucciones, casos, criterios de aceptacion y evidencias. Por tanto, las brechas
se clasifican por calidad pedagogica y ejecutabilidad manual, no por ausencia de integracion automatica.

## Conclusion corregida

No considerar como bloqueo que PlanEstudio no valide automaticamente el tenant. La pregunta correcta es:

- Si el lab puede ejecutarse manualmente en un tenant real con las instrucciones dadas.
- Si el estudiante sabe que licencia, rol, producto, ambiente y datos necesita antes de empezar.
- Si el lab explica el resultado esperado y la evidencia que debe capturar.
- Si el lab incluye errores frecuentes y como recuperarse sin buscar un tutorial externo.

Bajo esa premisa, PlanEstudio esta bien posicionado para aprendizaje desde cero con tenant real, pero
necesita reforzar la capa de readiness por lab para que un principiante distinga claramente:

1. Falta de acceso a tenant real.
2. Falta de instrucciones ejecutables en tenant.
3. Falta de validacion automatica desde la aplicacion.
4. Falta de criterios o evidencias para comprobar manualmente la ejecucion.

La categoria 3 no es una carencia bloqueante. Las categorias 2 y 4 si son problemas pedagogicos cuando
aplican.

## Practicas ya ejecutables en tenant real

Estas practicas ya tienen una base razonable de ejecucion manual, datos o evidencia:

- Labs basicos SIT: LAB-002, LAB-003, LAB-004, LAB-005 y LAB-009. Tienen secuencia, datos de prueba,
  prerequisitos y evidencia. Requieren reforzar troubleshooting en LAB-002/004/005.
- Labs developer: LAB-019, LAB-022 y LAB-023. Son ejecutables si el estudiante cuenta con herramientas,
  rol y tenant; LAB-023 ya declara prerequisitos tecnicos fuertes.
- Labs job-ready CRM/Power Platform: LAB-071 a LAB-080. Pueden ejecutarse o documentarse con separacion
  real/simulada; varios ya declaran "con tenant" vs "sin tenant".
- Labs D365 CE/Customer Insights/Field Service/Contact Center: LAB-081 a LAB-090. Ejecutables con
  tenant/licencias especificas; la brecha principal es declarar con mas precision rol/licencia/configuracion
  minima y evidencia esperada por producto.
- Labs F&O: LAB-093 a LAB-100. Son practicas hands-on de trial/demo, pero el propio contenido declara
  que no fueron verificadas contra tenant vivo al escribirse. No es un bloqueo automatico; si hay tenant,
  deben auditarse paso a paso contra la UI real.
- Labs RPA: LAB-104 a LAB-112. Ejecutables en Windows con Power Automate Desktop y assets locales; las
  capacidades unattended/hosted/machine groups requieren licencia/configuracion adicional.
- Practicas de experiencia profesional: 18 incidentes, 6 challenges, 2 simulaciones y 6 guiadas. Son
  validas como practica guiada y evidencia de razonamiento; no sustituyen validacion automatica.

## Practicas con instrucciones insuficientes o incompletas

Priorizar revision en:

- LAB-002, LAB-004, LAB-005: agregar errores frecuentes por pantalla, permisos, ambiente equivocado,
  choice/lookup mal configurado, publisher incorrecto y pasos de recuperacion.
- LAB-104 a LAB-112: agregar seccion formal de prerequisitos por lab, errores comunes y verificacion
  manual mas granular.
- LAB-093 a LAB-100: validar contra tenant/demo real y ajustar nombres de menus, pasos, datos Contoso,
  roles y prerequisitos de modulo habilitado.
- LAB-081 a LAB-088: reforzar gates de licencia/rol/configuracion inicial y diferenciar "ejecutable en
  tenant" de "diseno documentado si falta la licencia".

## Practicas que requieren licencias, roles o configuraciones a documentar mejor

- Customer Insights - Data/Journeys: licencia/trial especifico, consentimiento, dominio/canal, fuentes
  de datos, reglas de matching, segmentos y evidencia de activacion.
- Contact Center/Omnichannel: Customer Service/Contact Center, Digital messaging, colas, presencia,
  canal chat, y para voz/SMS proveedor externo.
- Field Service: licencia Field Service, recursos, assets, Incident Types, app movil, perfil offline y
  datos sincronizados.
- F&O: trial/demo Finance/SCM/Commerce/Project Operations, datos Contoso, empresa legal, roles y modulo
  habilitado.
- RPA unattended: Windows, Power Automate Desktop, licencia unattended/hosted/machine groups, runtime,
  credenciales, permisos, resolucion/sesion y monitoreo.
- Plugins/PCF/Code Apps: Visual Studio/.NET/Node/PAC CLI, PRT, permisos Dataverse, solucion no administrada
  y ambiente no productivo.

## Practicas que carecen de criterios/evidencias suficientes

No hay ausencia total de criterios en los 72 labs segun la validacion automatica del contenido, pero si
hay variacion en profundidad:

- Labs basicos: tienen evidencia final, pero algunos necesitan evidencia por ejercicio y capturas esperadas.
- Labs RPA: varios tienen evidencia, pero requieren criterios de aceptacion mas operativos: logs,
  captura de flujo, corrida con dataset valido/corrupto, recuperacion ante error, idempotencia y rollback.
- Labs F&O/D365 avanzados: requieren evidencia por paso de tenant: pantalla exacta, registro creado,
  proceso ejecutado, reporte/metricas visibles, UAT o limitacion documentada.

## Sprint 1 - Readiness manual por lab

Objetivo: hacer visible antes de empezar cada lab que necesita el estudiante.

Cambios:

- Agregar metadata o seccion estandar por lab:
  - Estado de ejecucion: `tenant-real`, `tenant-opcional`, `simulado`, `no-verificado-en-tenant`.
  - Producto/licencia requerida.
  - Rol requerido.
  - Ambiente requerido.
  - Datos requeridos.
  - Evidencia minima.
- Mostrar esos datos en la pagina del lab con un panel "Antes de empezar".
- No bloquear labs por falta de tenant; informar y guiar.

Criterio de cierre:

- 72/72 labs tienen estado de ejecucion y evidencia minima.
- La app diferencia explicitamente ausencia de validacion automatica vs falta de instrucciones.
- `validate:content`, tests y build en verde.

## Sprint 2 - Troubleshooting de labs base y RPA

Objetivo: reducir bloqueos de principiante en los puntos con mayor friccion.

Alcance:

- LAB-002, LAB-004, LAB-005.
- LAB-104 a LAB-112.

Agregar:

- Errores comunes por ejercicio.
- Causa probable.
- Como comprobar el error.
- Como corregirlo.
- Cuando reiniciar vs cuando reparar.
- Evidencia posterior a la correccion.

Criterio de cierre:

- Cada lab del alcance tiene troubleshooting suficiente para completarse sin tutorial externo ante fallos
  comunes.

## Sprint 3 - Auditoria tenant-real de D365 CE, Customer Insights y Field Service

Objetivo: verificar que las instrucciones pueden ejecutarse manualmente en un tenant real.

Alcance:

- LAB-081 a LAB-088.
- LAB-090 como capstone integrador.
- Recursos `D365_TENANT_READINESS.md` y `ENTORNOS_Y_TRIALS.md`.

Agregar/ajustar:

- Licencia/trial exacto por producto.
- Rol minimo.
- Configuracion previa.
- Datos de prueba.
- Resultado esperado por paso.
- Evidencia final.
- Fallos frecuentes por licencia, region, canal o app no instalada.

Criterio de cierre:

- Cada lab distingue "se ejecuto en tenant" de "se diseno por falta de licencia".
- No se afirma validacion real si no se ejecuto.

## Sprint 4 - Auditoria tenant-real de F&O

Objetivo: convertir LAB-093 a LAB-100 en guias verificadas contra trial/demo real o marcar con precision
sus limites.

Alcance:

- LAB-093 a LAB-100.
- Secciones F&O de `ENTORNOS_Y_TRIALS.md`.

Agregar/ajustar:

- Tipo de entorno F&O requerido.
- Datos Contoso o dataset alternativo.
- Empresa legal.
- Rol requerido.
- Rutas de navegacion actualizadas.
- Resultado esperado por pantalla.
- Evidencia minima.
- Errores por modulo no habilitado, permiso insuficiente o trial incompleto.

Criterio de cierre:

- Si se valida en tenant/demo real, documentar fecha y evidencia.
- Si no, marcar "no verificado en tenant vivo" sin presentarlo como defecto de la app.

## Sprint 5 - Duraciones y carga cognitiva

Objetivo: que el estudiante planifique con expectativas realistas.

Cambios:

- Separar `lectura`, `practica guiada`, `setup`, `validacion/evidencia`.
- Ajustar modulos tecnicos de C#, PCF, React/TypeScript, F&O y RPA.
- Mostrar en UI una duracion compuesta cuando aplique.

Criterio de cierre:

- Ningun modulo avanzado sugiere 8-12 minutos cuando el ejercicio real requiere 1-3 horas.

## Sprint 6 - Modo guiado estricto opcional

Objetivo: ayudar al novato sin quitar libertad al usuario avanzado.

Cambios:

- Advertencias cuando se abre un modulo/lab avanzado sin completar prerequisitos.
- CTA para volver al paso recomendado.
- Sin bloqueo duro por defecto.

Criterio de cierre:

- El estudiante puede explorar libremente, pero el modo principiante le dice por que un salto es riesgoso.

## Sprint 7 - Capstones nuevos por ruta laboral

Objetivo: expansion, no correccion.

Crear nuevos proyectos integradores solo si se decide ampliar alcance:

- CRM Functional Consultant.
- D365 Sales.
- Customer Service.
- Customer Insights Data.
- Customer Insights Journeys.
- Field Service.
- RPA.
- Admin/Governance.
- Data Migration.
- Solution Architect.

Criterio de cierre:

- Cada capstone tiene brief, datos, pasos, criterios, evidencia, rubrica, troubleshooting y solucion de
  referencia posterior al intento.

## Orden recomendado

1. Sprint 1.
2. Sprint 2.
3. Sprint 3.
4. Sprint 4.
5. Sprint 5.
6. Sprint 6.
7. Sprint 7 solo si se quiere expansion.

La prioridad inmediata es Sprint 1: readiness manual por lab. Es el que alinea la conclusion pedagogica
con la realidad del curso: el tenant lo ejecuta el alumno; la app debe decirle exactamente como comprobar
que lo hizo bien.

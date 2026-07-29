# Portabilidad y entrega de prácticas

Esta guía explica cómo proteger y compartir tu progreso práctico sin mezclarlo con módulos, quizzes o labs académicos.

## Backup técnico vs paquete de evidencia

Un **backup técnico** sirve para recuperar tu progreso en este navegador u otro dispositivo. Incluye registros, intentos, pistas usadas, evidencias marcadas, autoevaluaciones, notas y revisiones importadas cuando existan.

Un **paquete de evidencia** sirve para que otra persona revise un intento concreto. Incluye la práctica, el intento elegido, tu autoevaluación, evidencias declaradas, reflexión, rúbrica y preguntas para el revisor. No es una certificación profesional.

## Exportar progreso práctico

1. Abre **Mi progreso**.
2. En **Respaldo y portabilidad**, decide si incluir notas.
3. Usa **Exportar progreso práctico**.
4. Guarda el JSON como backup privado.

Antes de compartirlo, revisa que no incluya credenciales, nombres reales de clientes, URLs internas, IDs de tenant, tokens, correos personales ni capturas con datos sensibles.

## Importar progreso práctico

1. Abre **Mi progreso**.
2. Selecciona un archivo `.json`.
3. Revisa la vista previa: versión, cantidad de prácticas, intentos, notas, autoevaluaciones, revisiones y advertencias.
4. Elige **Combinar** o **Reemplazar**.
5. Confirma la acción.

**Combinar** conserva el historial más amplio, une intentos por ID, une evidencias y concatena notas distintas con un separador. **Reemplazar** borra únicamente el progreso práctico local y carga el archivo importado. El progreso académico no se toca.

## Nuevo intento y comparación

Registrar un nuevo intento conserva el anterior. La comparación se basa en autoevaluaciones reales guardadas, no en la cantidad de intentos. Muchos intentos no son algo negativo; son trazabilidad de aprendizaje.

## Revisión externa

Una revisión externa significa que una persona revisó un paquete bajo la rúbrica de la práctica. No significa que seas experto certificado ni reemplaza experiencia laboral. Si recibes observaciones, crea un nuevo intento y compara la evolución.

### Importar revisión externa

1. Abre la práctica y registra o selecciona el intento revisado.
2. Entrega al revisor el **Paquete de evidencia** y, si hace falta, la **Plantilla de revisión**.
3. Cuando recibas el JSON de vuelta, usa **Importar revisión** dentro de **Historial y evidencia**.
4. Revisa la vista previa: práctica, intento, revisor, resultado, puntaje, errores, advertencias, duplicados o conflictos.
5. Confirma la importación solo si el archivo coincide con tu intento y no contiene datos sensibles que no quieras conservar localmente.

PlanEstudio rechaza JSON corrupto, versiones futuras incompatibles, rúbricas incompletas, pesos incorrectos, puntajes que no coinciden con la rúbrica, revisiones de otra práctica, intentos inexistentes y campos peligrosos como `__proto__`. Si llega un archivo con el mismo `reviewId`, la app distingue entre duplicado idéntico y conflicto; reemplaza solo cuando confíes en que el nuevo archivo es la versión correcta del revisor.

Una práctica puede tener varias revisiones externas para el mismo intento. La última revisión queda visible en el intento seleccionado y el historial conserva las anteriores. Si la revisión requiere reentrega, usa **Crear reentrega** para abrir un nuevo intento sin borrar la evidencia anterior.

## Validación sandbox

Validar en sandbox significa que el escenario se probó técnicamente en un tenant controlado. Puede depender de licencias, permisos o configuración empresarial. No uses datos reales de clientes.

## Limitaciones

El progreso vive en `localStorage`: si borras datos del sitio, cambias de navegador o usas modo privado, puedes perderlo. Exporta backups periódicos si estás trabajando en evidencias importantes.

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

## Validación sandbox

Validar en sandbox significa que el escenario se probó técnicamente en un tenant controlado. Puede depender de licencias, permisos o configuración empresarial. No uses datos reales de clientes.

## Limitaciones

El progreso vive en `localStorage`: si borras datos del sitio, cambias de navegador o usas modo privado, puedes perderlo. Exporta backups periódicos si estás trabajando en evidencias importantes.

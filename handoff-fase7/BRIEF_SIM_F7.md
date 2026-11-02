# Prueba simulada como alumno — Fase 7: IA, D365 y RPA (2026-11-01)

Usa el mismo protocolo y formato de informe que `BRIEF_SIM_F4_6.md` (en esta carpeta; léelo). Las personas cambian:

- **Sofía (IA):** maker de 29 años que terminó el Nivel Básico. Sabe poco de Git, tiene GitHub Free, VS Code, GitHub
  Copilot Free, Node LTS y un ambiente Developer administrado (desde el 15-11-2026 solo hay uno por usuario). Los módulos
  de IA son transversales: no debe necesitar Intermedio/Avanzado. Abandona tras 15 minutos perdida.
- **Diego (D365):** consultor funcional de 31 años, 2 años en Power Platform (terminó Básico e Intermedio), nunca usó
  Dynamics 365. **No tiene** trial de D365 activa ni tenant con apps de Dynamics 365; solo un ambiente Developer. Puede
  activar una trial de 30 días si el módulo se lo pide, pero solo una por app. Tiene que poder completar cada
  microlección (o su variante en papel) y saber con la rúbrica cuándo su decisión "está bien". Abandona si una tarea no
  tiene criterio claro de terminado.
- **Camila (RPA):** analista administrativa de 27 años, Windows 11, sabe Excel bien y terminó el Nivel Básico. Nunca usó
  Power Automate for desktop. Sin licencias de pago (Premium/Process). Puede instalar PAD. Abandona tras 20 minutos en un paso.

Código: ejecuta lo que se pueda (Node/`node --test`, `npx tsc --noEmit`, actionlint si está en
`scratchpad\f7-m49-m50\` o `f7-m51-m52\`, PowerShell). Para RPA no puedes ejecutar PAD: revisa los pasos contra los
sandboxes reales (`app-elearning\src\app\rpa-sandbox\`, lee sus componentes para ver campos, ids y textos) y verifica
los nombres de acción de PAD en Microsoft Learn.

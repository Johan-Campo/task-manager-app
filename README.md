# TaskFlow — Sistema de Gestión de Tareas

**Demo en producción:** [https://task-manager-app-five-omega.vercel.app](https://task-manager-app-five-omega.vercel.app)

Aplicación web para gestionar las tareas internas de un proyecto de software, desde la búsqueda del cliente hasta la entrega final.

## Tecnologías utilizadas

| Tecnología | Versión | Rol |
|---|---|---|
| React | 19 | Framework UI |
| Vite | 6 | Bundler y servidor de desarrollo |
| Zustand | 5 | Estado global + persistencia en LocalStorage |
| Tailwind CSS | 4 | Estilos (sin archivo de configuración, vía plugin de Vite) |
| framer-motion | 12 | Animaciones de modales, toasts y cards |
| recharts | 3 | Gráficas del dashboard (barras y dona) |
| @dnd-kit/core | 6 | Drag-and-drop en el tablero Kanban |
| lucide-react | — | Íconos |

El proyecto fue desarrollado en JavaScript (sin TypeScript) y utiliza LocalStorage como único mecanismo de persistencia, sin backend.

## Instrucciones para ejecutar

```bash
npm install
npm run dev
```

Abrir [http://localhost:5173](http://localhost:5173). La aplicación carga con datos de prueba en el primer arranque.

## Funcionalidades completadas

Todos los requisitos funcionales fueron implementados:

1. **Crear tarea** — formulario con nombre, responsable, prioridad, estado inicial y descripción, con validación de campos requeridos
2. **Visualizar tareas** — vista de cards con filtrado y grilla responsive
3. **Cambiar estado** — dropdown personalizado por card y drag-and-drop en el Kanban
4. **Filtrar** — por estado y por prioridad, combinables
5. **Mensaje automático** — toast animado que aparece cada vez que una tarea cambia de estado, mostrando el estado anterior y el nuevo
6. **Vista gerencial** — Dashboard con tarjetas de resumen (total, prioridad alta, en progreso, entregadas), gráfica de barras por estado, gráfica de dona por prioridad, alerta de tareas de alta prioridad pendientes, y tablero Kanban completo
7. **UX** — animaciones sutiles, diseño responsive (móvil y escritorio), confirmación antes de eliminar, datos de prueba precargados

## Arquitectura

El proyecto sigue una estructura modular basada en componentes reutilizables.

- `components/`: componentes reutilizables de la interfaz.
- `pages/`: vistas principales.
- `store/`: estado global con Zustand.
- `utils/`: funciones auxiliares.
- Persistencia mediante LocalStorage.

## Uso de inteligencia artificial

Durante el desarrollo de esta prueba utilicé Trae como entorno de desarrollo con Claude Code (Anthropic) como asistente de programación. La IA fue utilizada como una herramienta de apoyo para acelerar tareas repetitivas, explorar alternativas de implementación, resolver dudas puntuales y aumentar la productividad durante el desarrollo. Todas las decisiones de diseño y la integración final del proyecto fueron revisadas y validadas por mí mismo.

**Qué hizo la IA:**
- Generó la estructura base del proyecto (scaffolding con Vite + Zustand + Tailwind 4)
- Asistió en la implementación de los componentes React: `TaskCard`, `TaskForm`, `TaskFilters`, `KanbanBoard`, `Dashboard`, `StatusToast`, `ConfirmDialog`, `StatusMenu`
- Propuso y codificó el sistema de diseño (paleta de colores, gradientes, tipografía)
- Implementó las animaciones con framer-motion y la integración de recharts
- Aplicó el diseño responsive y corrigió bugs de comportamiento en móvil (DnD vs scroll)
- Generó el favicon SVG (usando Claude Design)

## Desafíos enfrentados

- **Tailwind CSS 4**: configuración completamente diferente a v3 — sin `tailwind.config.js`, tokens personalizados vía `@theme {}` en CSS, plugin de Vite en lugar de PostCSS. lo que implicó una curva de aprendizaje durante el desarrollo.
- **DnD en móvil**: `PointerSensor` capturaba el touch a los 5px y bloqueaba el scroll horizontal del Kanban. La solución fue separar `MouseSensor` y `TouchSensor` con `delay: 250ms`, para que un toque rápido haga scroll y un press sostenido inicie el drag.
- **Botón eliminar en táctil**: el patrón `opacity-0 group-hover:opacity-100` no funciona en dispositivos táctiles (no hay hover). Se resolvió con `opacity-100 sm:opacity-0 sm:group-hover:opacity-100`.
- **Git tracking**: `node_modules` y carpetas de tooling fueron rastreadas antes de agregar las entradas al `.gitignore` y debieron removerse explícitamente con `git rm --cached`.

## Qué mejoraría con más tiempo

- **Edición de tareas**: actualmente solo se puede cambiar el estado después de crear una tarea; no hay edición de nombre, descripción, prioridad o responsable
- **Búsqueda por texto**: filtro libre sobre nombre, descripción y owner
- **Fechas límite**: campo de deadline por tarea con indicador visual de urgencia
- **Tests**: unitarios para el store de Zustand (lógica de filtros, seedData, updateStatus) y de integración para los flujos principales
- **Accesibilidad**: el Kanban DnD requiere soporte de teclado (`KeyboardSensor`) para ser accesible

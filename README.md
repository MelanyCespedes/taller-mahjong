# Mahjong Multijugador en Tiempo Real

**Equipo:**
- Matiw Rivera Cascante
- Isaac Alvarado Mata
- Melany Céspedes Sánchez
- Maria Sanabria Ramirez
- Harold Ávila Hernandez

---

Aplicación web de juego de memoria estilo Mahjong para múltiples jugadores simultáneos, con sincronización en tiempo real mediante WebSockets.

**Demo en vivo:**
- Frontend: https://taller-mahjong.vercel.app
- Backend: https://taller-mahjong-production.up.railway.app

---

## Descripción

El sistema implementa un juego de memoria donde los jugadores deben encontrar pares de fichas Mahjong. Cada jugador se conecta desde su navegador, ingresa su nombre y comienza a interactuar con el tablero compartido. Todos los jugadores ven el mismo estado del juego en tiempo real: qué fichas están volteadas, quién las está seleccionando, los puntajes actualizados y el historial de puntuación en un gráfico en vivo.

El problema que resuelve es permitir sesiones de juego cooperativas/competitivas sin recargas de página ni polling, usando una sola conexión persistente por cliente.

**Flujo de alto nivel:**
1. El cliente se conecta al servidor vía Socket.io.
2. El jugador ingresa su nombre en el Lobby y emite `player:join`.
3. El servidor actualiza el estado y hace broadcast a todos los clientes con `game:state`.
4. Al seleccionar una ficha, el cliente emite `tile:select`.
5. El servidor evalúa la selección, resuelve si hay par (con un delay de 1 segundo para efecto visual) y emite `game:state` + `match:result`.
6. El frontend re-renderiza reactivamente según el nuevo estado.

---

## Arquitectura del sistema

```
Cliente (React)
    │
    │  WebSocket (Socket.io)
    │
    ▼
Servidor (Node.js / Express)
    │
    ├── socket.ts   → manejo de eventos de socket
    │
    └── game.ts     → lógica pura del juego (funciones inmutables)
                        Estado en memoria (GameState)
                        Broadcast a todos los clientes
```

**Tecnologías:**

| Capa | Tecnología |
|------|-----------|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS v4 |
| Comunicación | Socket.io v4 (cliente y servidor) |
| Gráficos | Recharts |
| Animaciones | Motion (Framer Motion) |
| Backend | Node.js, Express 4, TypeScript |
| Build backend | tsc → `dist/` |
| Deploy frontend | Vercel |
| Deploy backend | Railway |

---

## Estructura del proyecto

```
taller-mahjong/
├── client/                    # Aplicación React
│   └── src/
│       ├── App.tsx            # Componente raíz, orquesta el layout
│       ├── types.ts           # Contratos de tipos (espejo de server/types.ts)
│       ├── hooks/
│       │   ├── useSocket.ts   # Lógica de conexión, estado del juego, historial local
│       │   └── useSounds.ts   # Efectos de sonido con Web Audio API
│       └── components/
│           ├── Lobby.tsx      # Pantalla de entrada con nombre de jugador
│           ├── Board.tsx      # Grid de fichas del tablero
│           ├── Tile.tsx       # Ficha individual con animación 3D flip y color de jugador
│           ├── Scoreboard.tsx # Clasificación de jugadores en tiempo real
│           ├── LiveChart.tsx  # Gráfico de trayectoria de puntajes (Recharts)
│           └── Victory.tsx    # Pantalla de victoria con animaciones y botón de reinicio
│
└── server/                    # Servidor Node.js
    └── src/
        ├── index.ts           # Entry point: Express + HTTP server + CORS
        ├── socket.ts          # Registro de eventos Socket.io y estado global
        ├── game.ts            # Lógica del juego (funciones puras e inmutables)
        └── types.ts           # Interfaces: Tile, Player, GameState, ScoreSnapshot
```

---

## Distribución del equipo

El repositorio no contiene atribuciones explícitas por archivo, por lo que se describe por área funcional:

| Área | Responsabilidad |
|------|----------------|
| **Arquitectura base** | Configuración de Express, Socket.io, CORS, estructura de carpetas, `tsconfig`, `vite.config.ts`, deploy en Railway y Vercel |
| **Lógica del juego** | `server/src/game.ts`: creación de partida, shuffle, selección de fichas, verificación de pares, puntaje, detección de fin de juego |
| **Socket.io** | `server/src/socket.ts` y `client/src/hooks/useSocket.ts`: manejo de eventos, sincronización de estado, guardado de historial en `localStorage` |
| **Frontend lógico** | `App.tsx`, `Board.tsx`, `Tile.tsx`: renderizado reactivo, control de clicks, estado de fichas bloqueadas/emparejadas |
| **UI + Visual** | `Lobby.tsx`, `Scoreboard.tsx`, `LiveChart.tsx`, `index.css`: estética cyberpunk con Tailwind, animaciones 3D de fichas, gráfico en tiempo real |

---

## Funcionalidades principales

- **Juego en tiempo real**: múltiples jugadores comparten el mismo tablero de 30 fichas (15 pares) con sincronización instantánea.
- **Bloqueo de fichas**: una ficha seleccionada por un jugador queda bloqueada (no clickeable) para los demás hasta que se resuelva el par.
- **Sistema de puntaje**: cada par encontrado suma 1 punto al jugador que lo completó. Los puntajes se actualizan en tiempo real en el `Scoreboard`.
- **Historial de puntajes**: cada verificación de par genera un `ScoreSnapshot` con timestamp, visualizado en el `LiveChart` como líneas por jugador.
- **Pantalla de victoria**: al terminar la partida se muestra una pantalla animada con el campeón, clasificación final y botón de reinicio.
- **Reinicio de partida**: cualquier jugador puede reiniciar el juego desde la pantalla de victoria; el servidor emite `game:restart` y genera un nuevo estado limpio.
- **Colores por jugador**: cada jugador tiene un color único asignado, visible en las fichas que emparejó y en el `Scoreboard`.
- **Feedback de sonido**: el hook `useSounds` usa la Web Audio API para reproducir tonos distintos al voltear una ficha, encontrar un par, fallar un intento y al ganar (fanfarria de 4 notas).
- **Límite de sala**: el servidor rechaza conexiones cuando ya hay 5 jugadores activos, emitiendo `game:full`. El Lobby muestra un mensaje de sala llena.
- **Reconexión por nombre**: si un jugador se desconecta y vuelve con el mismo nombre, el servidor restaura su sesión y puntaje en lugar de crear un jugador nuevo.
- **Historial local**: el hook `useSocket` persiste un registro de cada partida completada (`fecha`, `duración`, `jugadores y puntajes`) en `localStorage` bajo la clave `mahjong:history`.
- **Animación 3D de fichas**: las fichas tienen efecto flip CSS 3D (`rotateY`) al voltearse.

---

## Instalación y ejecución local

### Requisitos previos
- Node.js >= 18
- npm

### Backend

```bash
cd server
npm install
npm run build    # Compila TypeScript → dist/
npm start        # Inicia en http://localhost:3000
```

Para desarrollo con recarga automática:
```bash
npm run dev      # Usa nodemon + ts-node
```

### Frontend

```bash
cd client
npm install
npm run dev      # Inicia en http://localhost:5173
```

Para producción:
```bash
npm run build    # Genera dist/
npm run preview  # Sirve el build localmente
```

---

## Variables de entorno

### Frontend (`client/`)

| Variable | Descripción | Valor por defecto |
|----------|-------------|------------------|
| `VITE_SERVER_URL` | URL del servidor Socket.io | `http://localhost:3000` |

Crear un archivo `client/.env`:
```
VITE_SERVER_URL=https://taller-mahjong-production.up.railway.app
```

### Backend (`server/`)

| Variable | Descripción | Valor en código |
|----------|-------------|----------------|
| `PORT` | Puerto del servidor HTTP | Hardcodeado en `3000` (ver Limitaciones) |

---

## Despliegue

### Frontend → Vercel

1. Conectar el repositorio en [vercel.com](https://vercel.com).
2. Configurar el **Root Directory** como `client/`.
3. Agregar la variable de entorno `VITE_SERVER_URL` apuntando al backend de Railway.
4. Vercel detecta automáticamente Vite y ejecuta `npm run build`.

### Backend → Railway

1. Conectar el repositorio en [railway.app](https://railway.app).
2. Configurar el **Root Directory** como `server/`.
3. Railway usa `railway.json` para el build (`npm run build`) y start (`npm start`).
4. Railway inyecta automáticamente la variable `PORT`; actualmente el servidor ignora esta variable (ver Limitaciones).

---

## Decisiones técnicas relevantes

- **Socket.io sobre WebSocket nativo**: simplifica el manejo de reconexión automática, eventos con nombre, y broadcast a todos los clientes con `io.emit()`.
- **Lógica del juego como funciones puras**: `game.ts` no tiene efectos secundarios ni referencias al socket. Recibe un estado y retorna uno nuevo, lo que facilita el testing y el razonamiento sobre el flujo de datos.
- **Estado global en memoria**: `gameState` vive como variable de módulo en `socket.ts`. Es simple y suficiente para una sola sala de juego, pero no persiste entre reinicios del servidor.
- **TypeScript en ambos lados**: los tipos `Tile`, `Player`, `GameState`, `ScoreSnapshot` están definidos tanto en `server/src/types.ts` como en `client/src/types.ts` con contratos idénticos, documentado explícitamente en el cliente.
- **Separación cliente/servidor**: permite desplegar cada parte de forma independiente en servicios distintos (Vercel y Railway), y facilita escalar o reemplazar el backend sin tocar el frontend.
- **React.memo en Tile**: el componente `Tile` está envuelto en `memo()` para evitar re-renders innecesarios cuando el estado de otras fichas cambia.

---

## Limitaciones y problemas conocidos

- **PORT hardcodeado**: `server/src/index.ts` usa `const PORT = 3000` en lugar de `process.env.PORT || 3000`. Railway inyecta `PORT` dinámicamente, por lo que el servidor puede no arrancar correctamente en producción si Railway asigna un puerto distinto.

- **Una sola sala de juego**: el estado del juego es global y único para todos los jugadores conectados. No existe soporte para múltiples salas o partidas simultáneas separadas.


- **Control de acceso básico**: la sala tiene límite de 5 jugadores, pero no hay autenticación; cualquier usuario con la URL puede unirse mientras haya espacio.

---

## Conclusión

El sistema implementa correctamente un juego de memoria multijugador en tiempo real con arquitectura cliente-servidor desacoplada. La lógica del juego está bien separada de la capa de red, el frontend sincroniza reactivamente el estado y el despliegue en Vercel + Railway es funcional.

El proyecto está en un estado **funcional y completo** para su propósito académico: juego en tiempo real, sincronización de estado, feedback visual y sonoro, pantalla de victoria, reinicio de partida y reconexión por nombre. Las principales áreas de mejora para una versión productiva serían: soporte de múltiples salas, persistencia de estado en base de datos, y uso correcto de la variable `PORT`.

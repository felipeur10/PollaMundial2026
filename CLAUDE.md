Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

Tradeoff: These guidelines bias toward caution over speed. For trivial tasks, use judgment.

1. Think Before Coding
Don't assume. Don't hide confusion. Surface tradeoffs.

Before implementing:

State your assumptions explicitly. If uncertain, ask.
If multiple interpretations exist, present them - don't pick silently.
If a simpler approach exists, say so. Push back when warranted.
If something is unclear, stop. Name what's confusing. Ask.
2. Simplicity First
Minimum code that solves the problem. Nothing speculative.

No features beyond what was asked.
No abstractions for single-use code.
No "flexibility" or "configurability" that wasn't requested.
No error handling for impossible scenarios.
If you write 200 lines and it could be 50, rewrite it.
Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

3. Surgical Changes
Touch only what you must. Clean up only your own mess.

When editing existing code:

Don't "improve" adjacent code, comments, or formatting.
Don't refactor things that aren't broken.
Match existing style, even if you'd do it differently.
If you notice unrelated dead code, mention it - don't delete it.
When your changes create orphans:

Remove imports/variables/functions that YOUR changes made unused.
Don't remove pre-existing dead code unless asked.
The test: Every changed line should trace directly to the user's request.

4. Goal-Driven Execution
Define success criteria. Loop until verified.

Transform tasks into verifiable goals:

"Add validation" → "Write tests for invalid inputs, then make them pass"
"Fix the bug" → "Write a test that reproduces it, then make it pass"
"Refactor X" → "Ensure tests pass before and after"
For multi-step tasks, state a brief plan:

1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

# CLAUDE.md — Polla Mundial 2026 🏆

> Archivo de contexto del proyecto. Claude lo lee automáticamente al inicio de cada sesión.
> Desarrollado en Bogotá, Colombia. MacBook Pro. Junio 2026.

---

## 1. ¿Qué es este proyecto?

Una **PWA (Progressive Web App)** de betting pool (polla) para el Mundial FIFA 2026. Es una app privada para un grupo cerrado de amigos en Bogotá. Los participantes hacen sus pronósticos de partidos, se calcula un ranking en tiempo real con base en resultados oficiales publicados por el Admin, y compiten durante todo el torneo.

**El torneo:** FIFA World Cup 2026 — 48 equipos, 12 grupos, co-sede USA/Canadá/México. Del 11 de junio al 19 de julio de 2026. 104 partidos totales (72 de grupos + 32 eliminatorios).

---

## 2. Stack Técnico

| Tecnología | Uso |
|---|---|
| **React + Vite** | Framework frontend |
| **Firebase Auth** | Autenticación con Google |
| **Firestore** | Base de datos en tiempo real |
| **Tailwind CSS** | Estilos |
| **React Router DOM** | Navegación SPA |
| **Lucide React** | Iconos |
| **Vercel** | Deploy (pendiente) |

---

## 3. Estructura de Archivos

```
src/
├── components/
│   ├── admin/
│   │   ├── AdminPanel.jsx         ← Panel del admin: setea equipos knockout + publica resultados
│   │   └── AdminResults.jsx       ← Subcomponente para ingresar scores oficiales
│   ├── auth/
│   │   └── ProtectedRoute.jsx     ← Solo el email del admin puede entrar a /admin
│   ├── leaderboard/
│   │   └── leaderboard.jsx        ← Ranking visual con medallas, puntos, bonos y botón 👁
│   └── matches/
│       ├── PredictionScreen.jsx   ← Vista principal de pronósticos (modo edición Y modo lectura)
│       ├── MatchCard.jsx          ← Card individual de partido con inputs y bloqueo por tiempo
│       ├── GroupTable.jsx         ← Tabla de posiciones calculada en tiempo real
│       └── ThirdPlacesTable.jsx   ← Tabla de mejores terceros
├── hooks/
│   ├── useAuth.js                 ← Estado de autenticación Google
│   ├── useFirestore.js            ← CRUD contra Firestore (guardar/leer predicciones)
│   ├── useLocalStorage.js         ← Persistencia local antes de sincronizar
│   ├── useOfficialFixture.js      ← Escucha en tiempo real los equipos knockout del Admin
│   ├── useOfficialResults.js      ← Escucha en tiempo real los resultados oficiales del Admin
│   └── useRanking.js              ← Motor matemático de puntos (ex: userRanking.js)
├── services/
│   ├── firebase.js                ← Configuración Firebase + loginWithGoogle + logout
│   └── scoringEngine.js          ← (Verificar si hay duplicación con useRanking.js)
├── utils/
│   ├── fixture.js                 ← 72 partidos fase de grupos (datos FIJOS)
│   ├── fixture.json               ← Copia JSON del fixture (para referencia/seed)
│   ├── knockoutFixture.js         ← 32 partidos eliminatorios (estructura fija, equipos del Admin)
│   ├── groupLogic.js              ← calculateGroupTable() — calcula posiciones por grupo
│   ├── thirdPlacesLogic.js        ← getBestThirdPlaces() — elige los 8 mejores terceros
│   └── KnockoutFixture.js         ← (Verificar duplicación con knockoutFixture.js)
├── App.jsx                        ← Router principal + componente Home inline
├── main.jsx                       ← Entrada de la app
└── index.css                      ← Estilos globales Tailwind
```

---

## 4. Rutas de la App

```
/                    → Home (Landing + Login Google)
/predicciones        → PredictionScreen en modo EDICIÓN (usuario autenticado)
/predicciones/:uid   → PredictionScreen en modo LECTURA (ver pronósticos de otro usuario)
/ranking             → Leaderboard con ranking general
/admin               → AdminPanel (solo email del admin — ProtectedRoute)
*                    → Redirige a Home
```

**Nota sobre `/predicciones/:uid`:** Esta ruta es el "modo lectura". Se accede desde el botón 👁 en el leaderboard. Carga las predicciones de otro usuario desde Firestore usando `getUserPredictions(uid)` y renderiza todo en modo solo-lectura (sin inputs editables, sin botón de guardar, header azul en lugar de negro).

---

## 5. Lógica de Negocio y Puntos

### Partidos individuales
| Resultado | Puntos |
|---|---|
| Marcador exacto (ej: predijo 2-1, fue 2-1) | **+5 pts** |
| Solo acertó ganador o empate | **+2 pts** |
| Falló completamente | 0 pts |

### Bonos
| Bono | Condición | Puntos |
|---|---|---|
| **Bono de Grupo** | Acertar el 1° Y 2° lugar exactos de un grupo (orden importa) | **+3 pts** por grupo |
| **Bono Mejores Terceros** | Acertar los 8 equipos que clasifican como mejores terceros (sin importar orden) | **+3 pts** (una sola vez) |

### Muerte Súbita (Fase Eliminatoria)
- Los equipos en los partidos knockout **no se conocen de antemano**.
- El **Admin los define manualmente** desde el AdminPanel, publicándolos en Firestore bajo `/officialFixture/{matchId}`.
- `PredictionScreen.jsx` los lee en tiempo real con `useOfficialFixture()` y sobreescribe los placeholders del `knockoutFixture.js`.
- Los partidos de empate en eliminatorias tienen un campo `advances` para indicar quién clasifica en penales.

---

## 6. Estructura de Datos en Firestore

### ⚠️ MUY IMPORTANTE — Estructura corregida

La estructura correcta es **un documento por usuario**, NO un documento por partido. Este fue el bug arquitectural más crítico del proyecto.

```
/predictions/{userId}
  ├── userName: "Felipe García"
  ├── userPhoto: "https://lh3.googleusercontent.com/..."
  ├── updatedAt: Timestamp
  └── predictions: {
        "m01": { homeScore: 2, awayScore: 1, winner: "home", advances: "home" },
        "m02": { homeScore: 0, awayScore: 0, winner: "draw", advances: null },
        ...
      }

/officialResults/{matchId}
  ├── homeScore: 2
  ├── awayScore: 1
  └── winner: "home"

/officialFixture/{matchId}
  ├── home: "México"
  └── away: "Argentina"
```

**Por qué este diseño:** `useRanking.js` hace un `onSnapshot` sobre la colección `/predictions` y espera un documento por usuario con el objeto `predictions` anidado. Si se guarda un doc por partido (como estaba antes), el motor de puntos no puede calcular correctamente y `userName`/`userPhoto` nunca se guardan.

---

## 7. Flujo de Datos Principal

```
Usuario hace pronóstico
        ↓
MatchCard.jsx (input local)
        ↓
handleSavePrediction() → useLocalStorage ('mis_predicciones_2026')
        ↓
Usuario presiona "ENVIAR PRONÓSTICOS"
        ↓
saveAllPredictions(userId, predictions, user)  ← useFirestore.js
        ↓
Firestore: /predictions/{userId}  ←── estructura un doc por usuario
        ↓
useRanking.js escucha onSnapshot en /predictions
        ↓
Calcula puntos de TODOS los usuarios vs officialResults
        ↓
Leaderboard.jsx muestra el ranking actualizado
```

---

## 8. Archivos del Fixture

### `fixture.js` — Fase de Grupos
- **72 partidos** fijos (m01 a m72)
- Equipos, grupos y fechas son datos reales y confirmados
- Fechas en **UTC con sufijo Z** — el bloqueo de mercado en `MatchCard` funciona para cualquier zona horaria
- En Bogotá (COT = UTC-5): restar 5 horas. Ej: `19:00Z` = `2:00 PM` hora Bogotá
- **Este archivo nunca cambia** — los 48 equipos están confirmados desde el sorteo del 5 de diciembre de 2025 y los playoffs del 31 de marzo de 2026

### `knockoutFixture.js` — Fase Eliminatoria
- **32 partidos** (m73 a m104) con estructura: Ronda de 32 → Octavos → Cuartos → Semis → 3° lugar → Final
- Los campos `home` y `away` son **placeholders** (`'1° Grupo A'`, `'Ganador M73'`, etc.)
- El Admin los actualiza desde el panel — `PredictionScreen` los sobreescribe en tiempo real
- **Este archivo tampoco cambia** — solo define IDs, fases y fechas

### Los 12 Grupos Confirmados

| Grupo | Equipos |
|---|---|
| A | México, Corea del Sur, Rep. Checa, Sudáfrica |
| B | Canadá, Suiza, Bosnia-Herz., Catar |
| C | Brasil, Marruecos, Haití, Escocia |
| D | Estados Unidos, Paraguay, Australia, Turquía |
| E | Alemania, Curazao, Costa de Marfil, Ecuador |
| F | Países Bajos, Japón, Suecia, Túnez |
| G | Bélgica, Egipto, Irán, Nueva Zelanda |
| H | España, Cabo Verde, Arabia Saudita, Uruguay |
| I | Francia, Senegal, Noruega, Irak |
| J | Argentina, Argelia, Austria, Jordania |
| K | Portugal, Congo DR, Uzbekistán, Colombia |
| L | Inglaterra, Croacia, Ghana, Panamá |

### ⚠️ Regla crítica sobre nombres
Los nombres de equipos deben ser **exactamente iguales** (mismo string) en:
- `fixture.js`
- `knockoutFixture.js` (cuando el Admin los setee)
- Los resultados oficiales que publica el Admin en Firestore

El motor de puntos en `useRanking.js` compara strings directamente. Una diferencia de mayúsculas, tildes o abreviaciones rompe el cálculo. Por ejemplo: `'Rep. Checa'` ≠ `'Republica Checa'` ≠ `'Czechia'`.

---

## 9. Componentes Clave — Notas de Implementación

### `PredictionScreen.jsx`
- Acepta prop `readOnly` (boolean, default `false`)
- En modo lectura: lee el `uid` de `useParams()`, carga datos con `getUserPredictions(uid)`, header azul, banner informativo, sin botón de envío
- En modo edición: usa `useLocalStorage`, tiene indicador "Sin guardar" (`isDirty`), Toast nativo en lugar de `alert()`
- El botón flotante cambia de color según `isDirty`: verde si hay cambios, gris si está sincronizado

### `MatchCard.jsx`
- Acepta prop `readOnly` (boolean, default `false`)
- `isLocked = isExpired || readOnly` — un solo flag controla todos los `disabled`
- Si `readOnly && !savedPrediction` → muestra placeholder "Sin pronóstico" (no inputs vacíos)
- El badge de estado tiene 3 variantes: "Solo lectura" (azul), "Mercado Cerrado" (rojo), "Abierto" (verde)
- La lógica de penales (campo `advances`) solo aparece en partidos knockout con empate

### `leaderboard.jsx`
- El botón 👁 navega a `/predicciones/${player.id}`
- Badge "Tú" resalta al usuario autenticado con borde verde
- Muestra bonos del jugador si `player.bonuses > 0`
- Avatar fallback: `ui-avatars.com` con el nombre del jugador si no hay foto

### `useFirestore.js`
- `saveAllPredictions(userId, predictions, user)` — guarda TODO el objeto predictions de una vez. Requiere pasar el objeto `user` para guardar `userName` y `userPhoto`
- `getUserPredictions(userId)` — lee las predicciones de un usuario específico (modo lectura)
- Antes tenía una estructura incorrecta (un doc por partido) que rompía `useRanking.js`

---

## 10. Bugs Corregidos — No Volver a Tocar

| # | Archivo | Bug original | Fix aplicado |
|---|---|---|---|
| 1 | `useFirestore.js` | Guardaba un documento por partido en lugar de uno por usuario | Estructura cambiada a `/predictions/{userId}` con objeto `predictions` anidado |
| 2 | `useFirestore.js` | No existía `getUserPredictions()` para el modo lectura | Función añadida |
| 3 | `useFirestore.js` | `saveAllPredictions` no recibía el objeto `user` | Añadido tercer parámetro `user` para guardar `userName` y `userPhoto` |
| 4 | `PredictionScreen.jsx` | Llamaba `saveAllPredictions(user.uid, userPredictions)` sin pasar `user` | Actualizado a `saveAllPredictions(user.uid, userPredictions, user)` |
| 5 | `userRanking.js` | `pld === 6` para detectar grupo terminado — incorrecto, cada equipo juega 3 partidos | Cambiar a `pld === 3` |
| 6 | `userRanking.js` | `Object.keys(officialResults).length >= 72` para detectar fin de grupos — frágil | Filtrar por `phase === 'grupos'` antes de contar |
| 7 | `MatchCard.jsx` | No tenía prop `readOnly`, todos los `disabled` usaban solo `isExpired` | Añadida prop `readOnly`, `isLocked = isExpired \|\| readOnly` |
| 8 | `App.jsx` | No existía ruta `/predicciones/:uid` para modo lectura | Añadida con prop `readOnly` |
| 9 | `fixture.js` | Solo tenía 2-3 partidos de ejemplo con IDs duplicados (`m1`) | Reemplazado con los 72 partidos reales completos |

---

## 11. useRanking.js — Correcciones Pendientes

Este archivo tiene dos bugs que aún deben corregirse:

```javascript
// ❌ BUG 1: pld === 6 es incorrecto. Cada equipo juega 3 partidos de grupos.
const isGroupFinished = realTable.every(t => t.pld === 6);
// ✅ FIX:
const isGroupFinished = realTable.every(t => t.pld === 3);

// ❌ BUG 2: Contar todos los resultados para detectar fin de grupos es frágil
//    porque incluiría también resultados de knockout
const allThirdsFinished = Object.keys(officialResults).length >= 72;
// ✅ FIX:
const groupMatchIds = Object.keys(officialResults).filter(id => {
  const match = fixture.find(m => m.id === id);
  return match?.phase === 'grupos';
});
const allThirdsFinished = groupMatchIds.length >= 72;
```

---

## 12. Participantes y Autenticación

### Estado actual
- Solo el admin (Felipe) está registrado como usuario de prueba
- El login es abierto: cualquier persona con el link puede entrar con Google

### Plan para beta privada
Implementar lista blanca de emails en `useAuth.js` o `ProtectedRoute.jsx`:

```javascript
const ALLOWED_EMAILS = [
  'felipe@gmail.com',
  'amigo1@gmail.com',
  'amigo2@gmail.com',
  // ... etc
];

// En useAuth.js, después del login:
if (!ALLOWED_EMAILS.includes(user.email)) {
  await logout();
  throw new Error('No estás en la lista de participantes.');
}
```

La lista puede vivir en Firestore (`/config/allowedEmails`) para poder añadir participantes sin redeploy.

### Detección del Admin
Actualmente se hace con `user?.email?.includes('felipe')` en `Home.jsx`. Para producción considerar mover esto a Firestore o a una variable de entorno.

---

## 13. Variables de Entorno

El archivo `.env` (no commitear) debe tener la configuración de Firebase:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

En Vercel, estas variables se configuran en **Settings → Environment Variables** antes del primer deploy.

---

## 14. Deploy en Vercel

### Pasos para el deploy inicial
```bash
# 1. Instalar Vercel CLI (si no está)
npm i -g vercel

# 2. Desde la raíz del proyecto
vercel

# 3. Configurar:
#    - Framework: Vite
#    - Build command: npm run build
#    - Output directory: dist
#    - Root directory: ./

# 4. Añadir variables de entorno en el dashboard de Vercel
```

### Configuración de Firebase para producción
En Firebase Console → Authentication → Authorized domains, añadir el dominio de Vercel (ej: `polla-2026.vercel.app`).

### `vercel.json` requerido para React Router
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```
Sin este archivo, las rutas como `/predicciones` o `/ranking` dan 404 al recargar la página.

---

## 15. Estado del Proyecto al Día de Hoy

### ✅ Completado
- Autenticación con Google (login/logout)
- Fase de grupos completa: 72 partidos reales del Mundial 2026
- Sistema de pronósticos con persistencia en localStorage y sync a Firestore
- Motor de puntos (marcador exacto, ganador/empate, bono de grupo, bono mejores terceros)
- Bloqueo de mercado por tiempo (partido pasado = no se puede editar)
- Tabla de posiciones calculada en tiempo real por grupo
- Tabla de mejores terceros
- Ranking general con medallas, puntos y bonos
- AdminPanel para publicar resultados y setear equipos knockout
- Modo lectura de predicciones de otros usuarios (`/predicciones/:uid`)
- Toast nativo (reemplaza alert() del navegador)
- Indicador "Sin guardar" en PredictionScreen
- Badge "Tú" en el leaderboard
- Estructura de Firestore corregida (un doc por usuario)
- fixture.js completo con los 72 partidos reales
- knockoutFixture.js completo con los 32 partidos eliminatorios


### 🟡 Pendiente — Antes de invitar participantes
- [ ] Implementar lista blanca de emails (para beta privada)
- [ ] Añadir dominio de Vercel en Firebase Authorized Domains
- [ ] Decidir si la lista de emails vive en código o en Firestore

### 🟢 Pendiente — Mejoras de UX (no bloqueantes)
- [ ] Skeleton loaders mientras carga el ranking
- [ ] Pull-to-refresh en mobile
- [ ] Notificación push cuando el Admin publica un resultado (requiere service worker)
- [ ] Página de detalle de partido con comparación de predicciones vs resultado real

---

## 16. Comandos Útiles

```bash
# Desarrollo local
npm run dev

# Build de producción
npm run build

# Preview del build
npm run preview

# Deploy a Vercel
vercel --prod
```

---

## 17. Decisiones de Diseño Importantes

1. **Un documento por usuario en Firestore** — no por partido. Más eficiente, menos lecturas, y es lo que necesita el motor de puntos.

2. **Fechas en UTC en el fixture** — permite que el bloqueo de mercado funcione correctamente para usuarios en cualquier zona horaria. En Bogotá (UTC-5), restar 5 horas.

3. **localStorage como buffer** — el usuario puede hacer pronósticos offline y sincronizar cuando quiera. El botón "ENVIAR" es el acto explícito de commit a la nube.

4. **knockoutFixture con placeholders** — los equipos de eliminatorias los define el Admin, no están hardcodeados. Esto es intencional: no se saben hasta que termina la fase de grupos.

5. **Nombres de equipos en español** — decisión estética para la audiencia colombiana. La consecuencia es que deben ser 100% consistentes entre fixture, knockoutFixture, resultados del admin y cualquier comparación de strings en el motor de puntos.

6. **readOnly como prop en PredictionScreen** — el mismo componente sirve para edición y lectura. Evita duplicar lógica y mantiene el código DRY. El modo se detecta por la prop `readOnly` y por la presencia del parámetro `uid` en la URL.

## Cambios recientes

### Privacidad de pronósticos en modo lectura (jun 2026)
- **Archivos:** `src/components/matches/PredictionScreen.jsx`, `src/components/matches/MatchCard.jsx`
- **Problema:** Los participantes podían ver los pronósticos de otros jugadores antes de que se jugara el partido (trampa).
- **Solución:** Se agregó la función `getPredictionForView()` en `PredictionScreen.jsx` que filtra `savedPrediction` según `isMatchStarted(match)`. En modo lectura (`readOnly=true`), si el partido no ha comenzado, se pasa `null` al `MatchCard`.
- **Comportamiento:** `MatchCard` muestra 🔒 *"Disponible tras el pitazo inicial"* para partidos no iniciados, y *"Sin pronóstico registrado"* si el partido ya se jugó pero el usuario no apostó.
- **Regla:** El pronóstico se revela cuando `new Date() > new Date(match.date)` (al inicio del partido, no al final).

---

*Última actualización: junio 03 2026 — Sesión de desarrollo Bogotá HQ*



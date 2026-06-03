// KnockoutFixture.js — Fase Eliminatoria Mundial 2026
// 32 partidos: Ronda de 32 → Octavos → Cuartos → Semis → Final
//
// ⚡ IMPORTANTE: Los campos `home` y `away` son solo placeholders.
//    El Admin los actualiza manualmente desde el Panel de Administración
//    publicándolos en Firestore bajo la colección /officialFixture/{matchId}.
//    PredictionScreen.jsx los sobrescribe automáticamente con:
//    home: officialData[match.id]?.home || match.home
//
// Fechas en UTC (Z). Bogotá = UTC-5: restar 5h para hora local.

export const knockoutFixture = [

  // ══════════════════════════════════════════════════════════════════════════
  // RONDA DE 32  (Jun 28 – Jul 3)
  // ══════════════════════════════════════════════════════════════════════════

  // Domingo 28 de Junio
  { id: 'm73', phase: 'Ronda de 32', home: '2° Grupo A',  away: '2° Grupo B',            date: '2026-06-28T19:00:00Z' },

  // Lunes 29 de Junio
  // ✅ FIX m74: corregido — 1°E vs Mejor 3° (A/B/C/D/F), no 1°C vs 2°F
  { id: 'm74', phase: 'Ronda de 32', home: '1° Grupo E',  away: 'Mejor 3° (A/B/C/D/F)',  date: '2026-06-29T17:00:00Z' },
  // ✅ FIX m75: corregido — 1°F vs 2°C, no 1°E vs Mejor 3°
  { id: 'm75', phase: 'Ronda de 32', home: '1° Grupo F',  away: '2° Grupo C',            date: '2026-06-29T20:30:00Z' },
  // ✅ FIX m76: corregido — 1°C vs 2°F (era 1°F vs 2°C en tu archivo)
  { id: 'm76', phase: 'Ronda de 32', home: '1° Grupo C',  away: '2° Grupo F',            date: '2026-06-30T01:00:00Z' },

  // Martes 30 de Junio
  { id: 'm77', phase: 'Ronda de 32', home: '1° Grupo I',  away: 'Mejor 3° (C/D/F/G/H)', date: '2026-06-30T21:00:00Z' },
  { id: 'm78', phase: 'Ronda de 32', home: '2° Grupo E',  away: '2° Grupo I',            date: '2026-06-30T17:00:00Z' },
  { id: 'm79', phase: 'Ronda de 32', home: '1° Grupo A',  away: 'Mejor 3° (C/E/F/H/I)', date: '2026-07-01T01:00:00Z' },

  // Miércoles 1 de Julio
  { id: 'm80', phase: 'Ronda de 32', home: '1° Grupo L',  away: 'Mejor 3° (E/H/I/J/K)', date: '2026-07-01T16:00:00Z' },
  { id: 'm81', phase: 'Ronda de 32', home: '1° Grupo D',  away: 'Mejor 3° (B/E/F/I/J)', date: '2026-07-02T00:00:00Z' },
  { id: 'm82', phase: 'Ronda de 32', home: '1° Grupo G',  away: 'Mejor 3° (A/E/H/I/J)', date: '2026-07-01T20:00:00Z' },

  // Jueves 2 de Julio
  { id: 'm83', phase: 'Ronda de 32', home: '2° Grupo K',  away: '2° Grupo L',            date: '2026-07-02T23:00:00Z' },
  { id: 'm84', phase: 'Ronda de 32', home: '1° Grupo H',  away: '2° Grupo J',            date: '2026-07-02T19:00:00Z' },
  { id: 'm85', phase: 'Ronda de 32', home: '1° Grupo B',  away: 'Mejor 3° (E/F/G/I/J)', date: '2026-07-03T03:00:00Z' },

  // Viernes 3 de Julio
  { id: 'm86', phase: 'Ronda de 32', home: '1° Grupo J',  away: '2° Grupo H',            date: '2026-07-03T22:00:00Z' },
  { id: 'm87', phase: 'Ronda de 32', home: '1° Grupo K',  away: 'Mejor 3° (D/E/I/J/L)', date: '2026-07-04T01:30:00Z' },
  { id: 'm88', phase: 'Ronda de 32', home: '2° Grupo D',  away: '2° Grupo G',            date: '2026-07-03T18:00:00Z' },

  // ══════════════════════════════════════════════════════════════════════════
  // OCTAVOS DE FINAL  (Jul 4 – Jul 7)
  // ══════════════════════════════════════════════════════════════════════════

  // Sábado 4 de Julio
  { id: 'm89', phase: 'Octavos de Final', home: 'Ganador M74', away: 'Ganador M77', date: '2026-07-04T21:00:00Z' },
  { id: 'm90', phase: 'Octavos de Final', home: 'Ganador M73', away: 'Ganador M75', date: '2026-07-04T17:00:00Z' },

  // Domingo 5 de Julio
  { id: 'm91', phase: 'Octavos de Final', home: 'Ganador M76', away: 'Ganador M78', date: '2026-07-05T20:00:00Z' },
  { id: 'm92', phase: 'Octavos de Final', home: 'Ganador M79', away: 'Ganador M80', date: '2026-07-06T00:00:00Z' },

  // Lunes 6 de Julio
  { id: 'm93', phase: 'Octavos de Final', home: 'Ganador M83', away: 'Ganador M84', date: '2026-07-06T18:00:00Z' },
  { id: 'm94', phase: 'Octavos de Final', home: 'Ganador M81', away: 'Ganador M82', date: '2026-07-06T22:00:00Z' },

  // Martes 7 de Julio
  { id: 'm95', phase: 'Octavos de Final', home: 'Ganador M86', away: 'Ganador M88', date: '2026-07-07T18:00:00Z' },
  { id: 'm96', phase: 'Octavos de Final', home: 'Ganador M85', away: 'Ganador M87', date: '2026-07-07T22:00:00Z' },

  // ══════════════════════════════════════════════════════════════════════════
  // CUARTOS DE FINAL  (Jul 9 – Jul 11)
  // ══════════════════════════════════════════════════════════════════════════

  // Jueves 9 de Julio
  { id: 'm97',  phase: 'Cuartos de Final', home: 'Ganador M89', away: 'Ganador M90', date: '2026-07-09T20:00:00Z' },

  // Viernes 10 de Julio
  { id: 'm98',  phase: 'Cuartos de Final', home: 'Ganador M93', away: 'Ganador M94', date: '2026-07-10T17:00:00Z' },
  { id: 'm99',  phase: 'Cuartos de Final', home: 'Ganador M91', away: 'Ganador M92', date: '2026-07-10T21:00:00Z' },

  // Sábado 11 de Julio
  { id: 'm100', phase: 'Cuartos de Final', home: 'Ganador M95', away: 'Ganador M96', date: '2026-07-11T20:00:00Z' },

  // ══════════════════════════════════════════════════════════════════════════
  // SEMIFINALES  (Jul 14 – Jul 15)
  // ══════════════════════════════════════════════════════════════════════════

  // Martes 14 de Julio
  { id: 'm101', phase: 'Semifinal', home: 'Ganador M97',  away: 'Ganador M98',  date: '2026-07-14T20:00:00Z' },

  // Miércoles 15 de Julio
  { id: 'm102', phase: 'Semifinal', home: 'Ganador M99',  away: 'Ganador M100', date: '2026-07-15T20:00:00Z' },

  // ══════════════════════════════════════════════════════════════════════════
  // TERCER LUGAR  (Jul 18)
  // ══════════════════════════════════════════════════════════════════════════

  { id: 'm103', phase: 'Tercer Lugar', home: 'Perdedor M101', away: 'Perdedor M102', date: '2026-07-18T19:00:00Z' },

  // ══════════════════════════════════════════════════════════════════════════
  // FINAL  (Jul 19)  — MetLife Stadium, East Rutherford, NJ
  // ══════════════════════════════════════════════════════════════════════════

  { id: 'm104', phase: 'Final', home: 'Ganador M101', away: 'Ganador M102', date: '2026-07-19T19:00:00Z' },
];
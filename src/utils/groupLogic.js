// src/utils/groupLogic.js

export const calculateGroupTable = (groupName, matches, predictions) => {
  // 1. Filtramos solo los partidos de ese grupo (A, B, C...)
  const groupMatches = matches.filter(m => m.group === groupName);
  
  const table = {};

  // Inicializamos a los equipos del grupo
  groupMatches.forEach(m => {
    if (!table[m.home]) table[m.home] = { name: m.home, pts: 0, gd: 0, gf: 0, p: 0 };
    if (!table[m.away]) table[m.away] = { name: m.away, pts: 0, gd: 0, gf: 0, p: 0 };
  });

  // 2. Procesamos cada partido con el pronóstico del usuario
  groupMatches.forEach(match => {
    const pred = predictions[match.id];
    if (pred && pred.homeScore !== "" && pred.awayScore !== "") {
      const h = Number(pred.homeScore);
      const a = Number(pred.awayScore);

      // Partidos Jugados
      table[match.home].p += 1;
      table[match.away].p += 1;

      // Goles a Favor
      table[match.home].gf += h;
      table[match.away].gf += a;

      // Diferencia de Gol
      table[match.home].gd += (h - a);
      table[match.away].gd += (a - h);

      // Puntos
      if (h > a) table[match.home].pts += 3;
      else if (h < a) table[match.away].pts += 3;
      else {
        table[match.home].pts += 1;
        table[match.away].pts += 1;
      }
    }
  });

  // 3. Ordenamos según reglas FIFA
  return Object.values(table).sort((a, b) => {
    if (b.pts !== a.pts) return b.pts - a.pts; // 1. Puntos
    if (b.gd !== a.gd) return b.gd - a.gd;     // 2. Diferencia de Gol
    return b.gf - a.gf;                         // 3. Goles a Favor
  });
};
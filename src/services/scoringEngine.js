export const calculateMatchPoints = (pred, real, match) => {
  // 1. Acierto exacto: 3 puntos
  if (pred.predA === real.scoreA && pred.predB === real.scoreB) {
    // En eliminatorias, el cruce de equipos debe ser el original de su predicción
    if (match.phase === 'groups' || (match.teamA === pred.teamA && match.teamB === pred.teamB)) {
      return 3;
    }
  }

  // 2. Acierto de Tendencia o Avance: 1 punto
  if (match.phase === 'groups') {
    return pred.predWinner === real.realWinner ? 1 : 0;
  } else {
    // Lógica para eliminación: ¿Avanzó el equipo correcto?
    const realAdvances = real.scoreA > real.scoreB ? 'teamA' : 
                         real.scoreB > real.scoreA ? 'teamB' : real.realAdvances;
    
    const userAdvances = pred.predA > pred.predB ? 'teamA' : 
                         pred.predB > pred.predA ? 'teamB' : pred.predAdvances;

    return userAdvances === realAdvances ? 1 : 0;
  }
};
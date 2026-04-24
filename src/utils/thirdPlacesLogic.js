// src/utils/thirdPlacesLogic.js
import { calculateGroupTable } from './groupLogic';

export const getBestThirdPlaces = (groups, fixture, userPredictions) => {
  const allThirds = [];

  groups.forEach(groupLetter => {
    const table = calculateGroupTable(groupLetter, fixture, userPredictions);
    if (table.length >= 3) {
      // Tomamos al que quedó de 3ero en su grupo
      allThirds.push({
        ...table[2],
        originGroup: groupLetter
      });
    }
  });

  // Ordenamos los 12 terceros para saber quiénes son los 8 mejores
  return allThirds.sort((a, b) => {
    if (b.pts !== a.pts) return b.pts - a.pts;
    if (b.gd !== a.gd) return b.gd - a.gd;
    return b.gf - a.gf;
  });
};
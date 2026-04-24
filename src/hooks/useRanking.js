import { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { fixture } from '../utils/fixture';
import { calculateGroupTable } from '../utils/groupLogic';
import { getBestThirdPlaces } from '../utils/thirdPlacesLogic';

const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

export const useRanking = (officialResults) => {
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "predictions"), (snapshot) => {
      const allUsersPoints = [];

      snapshot.forEach(doc => {
        const userData = doc.data();
        const userPredictions = userData.predictions || {};
        let totalPoints = 0;
        let bonusCount = 0;

        // --- LÓGICA A: PUNTOS POR PARTIDOS INDIVIDUALES ---
        Object.keys(officialResults).forEach(matchId => {
          const pred = userPredictions[matchId];
          const real = officialResults[matchId];

          if (pred && real) {
            const isExact = pred.homeScore === real.homeScore && pred.awayScore === real.awayScore;
            
            const realWinner = real.homeScore > real.awayScore ? 'home' : real.homeScore < real.awayScore ? 'away' : 'draw';
            const predWinner = pred.homeScore > pred.awayScore ? 'home' : pred.homeScore < pred.awayScore ? 'away' : 'draw';

            if (isExact) {
              totalPoints += 5;
            } else if (realWinner === predWinner) {
              totalPoints += 2;
            }
          }
        });

        // --- LÓGICA B: BONO POR CLASIFICADOS (1° Y 2°) ---
        groups.forEach(groupLetter => {
          const userTable = calculateGroupTable(groupLetter, fixture, userPredictions);
          const realTable = calculateGroupTable(groupLetter, fixture, officialResults);

          // ✅ FIX #1: cada equipo juega 3 partidos de grupos, no 6
          const isGroupFinished = realTable.every(t => t.pld === 3);

          if (isGroupFinished && realTable.length >= 2 && userTable.length >= 2) {
            const firstOk = userTable[0].name === realTable[0].name;
            const secondOk = userTable[1].name === realTable[1].name;

            if (firstOk && secondOk) {
              totalPoints += 3;
              bonusCount++;
            }
          }
        });

        // --- LÓGICA C: BONO POR MEJORES TERCEROS ---
        const realBestThirds = getBestThirdPlaces(groups, fixture, officialResults).map(t => t.name);
        const userBestThirds = getBestThirdPlaces(groups, fixture, userPredictions).map(t => t.name);

        // ✅ FIX #2: filtrar solo partidos de fase de grupos para no contaminar con knockout
        const groupMatchIds = Object.keys(officialResults).filter(id => {
          const match = fixture.find(m => m.id === id);
          return match?.phase === 'grupos';
        });
        const allThirdsFinished = groupMatchIds.length >= 72;

        if (allThirdsFinished && realBestThirds.length === 8) {
          const correctThirds = realBestThirds.filter(name => userBestThirds.includes(name));
          if (correctThirds.length === 8) {
            totalPoints += 3;
            bonusCount++;
          }
        }

        allUsersPoints.push({
          id: doc.id,
          name: userData.userName || "Anónimo",
          photo: userData.userPhoto,
          points: totalPoints,
          bonuses: bonusCount
        });
      });

      const sortedRanking = allUsersPoints.sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        return a.name.localeCompare(b.name);
      });

      setRanking(sortedRanking);
    });

    return () => unsubscribe();
  }, [officialResults]);

  return ranking;
};
// src/components/Reglamento.jsx

import { Trophy, Target, Star, Zap, Users, Award } from 'lucide-react';

const Section = ({ icon: Icon, title, color, children }) => (
  <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
    <div className="flex items-center gap-3 mb-4">
      <div className={`p-2 rounded-xl ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
      <h2 className="text-lg font-bold text-white">{title}</h2>
    </div>
    {children}
  </div>
);

const PointRow = ({ label, points, highlight }) => (
  <div className={`flex items-center justify-between py-3 px-4 rounded-xl mb-2 ${highlight ? 'bg-yellow-500/10 border border-yellow-500/30' : 'bg-gray-700/50'}`}>
    <span className="text-gray-200 text-sm">{label}</span>
    <span className={`font-bold text-base ${highlight ? 'text-yellow-400' : 'text-white'}`}>
      {points}
    </span>
  </div>
);

export default function Reglamento() {
  return (
    <div className="min-h-screen bg-gray-900 text-white pb-24">

      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-5 mb-6">
        <div className="max-w-lg mx-auto">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Trophy size={24} className="text-yellow-400" />
            Reglamento
          </h1>
          <p className="text-gray-400 text-sm mt-1">Cómo funciona la Polla Mundial 2026</p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 space-y-4">

        {/* Puntos por partido */}
        <Section icon={Target} title="Puntos por partido" color="bg-blue-600">
          <PointRow label="⚽ Marcador exacto (ej: predijiste 2-1, fue 2-1)" points="+5 pts" highlight />
          <PointRow label="✅ Acertaste el ganador o el empate" points="+2 pts" />
          <PointRow label="❌ Resultado incorrecto" points="0 pts" />
          <p className="text-gray-400 text-xs mt-3 px-1">
            El marcador exacto incluye haber acertado también el ganador, pero solo se suman los 5 puntos, no se acumulan.
          </p>
        </Section>

        {/* Bonos */}
        <Section icon={Star} title="Bonos especiales" color="bg-yellow-500">
          <div className="space-y-3">

            {/* Bono grupo */}
            <div className="bg-gray-700/50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-semibold text-sm">Bono de Grupo</span>
                <span className="text-yellow-400 font-bold">+3 pts</span>
              </div>
              <p className="text-gray-300 text-xs leading-relaxed">
                Acertar el <strong className="text-white">1° y 2° lugar exactos</strong> de un grupo al terminar la fase de grupos.
                El orden importa: si predijiste Argentina 1° y Colombia 2°, tiene que quedar exactamente así.
              </p>
              <div className="mt-3 flex gap-2">
                <div className="flex-1 bg-green-500/10 border border-green-500/30 rounded-lg p-2 text-center">
                  <div className="text-green-400 text-xs font-semibold">Ejemplo ✓</div>
                  <div className="text-white text-xs mt-1">1° Argentina<br/>2° Colombia</div>
                </div>
                <div className="flex-1 bg-red-500/10 border border-red-500/30 rounded-lg p-2 text-center">
                  <div className="text-red-400 text-xs font-semibold">Ejemplo ✗</div>
                  <div className="text-white text-xs mt-1">1° Colombia<br/>2° Argentina</div>
                </div>
              </div>
            </div>

            {/* Bono mejores terceros */}
            <div className="bg-gray-700/50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-semibold text-sm">Bono Mejores Terceros</span>
                <span className="text-yellow-400 font-bold">+3 pts</span>
              </div>
              <p className="text-gray-300 text-xs leading-relaxed">
                Acertar los <strong className="text-white">8 equipos</strong> que clasifican como mejores terceros de entre los 12 grupos.
                El orden entre ellos no importa — solo que los 8 sean los correctos.
              </p>
              <div className="mt-2 text-xs text-gray-400 bg-gray-800 rounded-lg p-2">
                Este bono se otorga una sola vez cuando terminan los 72 partidos de grupos.
              </div>
            </div>
          </div>
        </Section>

        {/* Fase eliminatoria */}
        <Section icon={Zap} title="Fase eliminatoria" color="bg-red-600">
          <p className="text-gray-300 text-sm leading-relaxed mb-3">
            A partir de los octavos de final, el sistema de puntos es el mismo (+5 exacto, +2 ganador), pero con una diferencia clave:
          </p>
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-3">
            <p className="text-red-300 text-sm font-semibold mb-1">⚡ Equipos definidos en vivo</p>
            <p className="text-gray-300 text-xs leading-relaxed">
              Los equipos de cada partido eliminatorio se revelan cuando el Admin los publica tras terminar la fase de grupos.
              Hasta ese momento, los partidos aparecen con placeholders como "1° Grupo A" o "Ganador M73".
            </p>
          </div>
          <div className="bg-gray-700/50 rounded-xl p-4">
            <p className="text-white text-sm font-semibold mb-1">Penales y prórroga</p>
            <p className="text-gray-300 text-xs leading-relaxed">
              En partidos de eliminatorias que terminen empatados, también deberás predecir quién clasifica en penales.
              Acertar eso suma puntos extra al resultado.
            </p>
          </div>
        </Section>

        {/* Resumen de puntos */}
        <Section icon={Award} title="Resumen de puntos" color="bg-purple-600">
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Marcador exacto', pts: '5 pts', color: 'bg-blue-500/20 border-blue-500/40' },
              { label: 'Ganador / empate', pts: '2 pts', color: 'bg-teal-500/20 border-teal-500/40' },
              { label: 'Bono de grupo', pts: '3 pts', color: 'bg-yellow-500/20 border-yellow-500/40' },
              { label: 'Bono 3ros', pts: '3 pts', color: 'bg-yellow-500/20 border-yellow-500/40' },
            ].map(({ label, pts, color }) => (
              <div key={label} className={`rounded-xl p-3 border text-center ${color}`}>
                <div className="text-white font-bold text-lg">{pts}</div>
                <div className="text-gray-300 text-xs mt-1">{label}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 bg-gray-700/50 rounded-xl p-3 text-center">
            <p className="text-gray-400 text-xs">
              El ranking se actualiza en tiempo real cada vez que el Admin publica un resultado oficial.
            </p>
          </div>
        </Section>

        {/* Participantes */}
        <Section icon={Users} title="Participantes" color="bg-green-600">
          <p className="text-gray-300 text-sm leading-relaxed">
            La polla es privada — solo pueden participar quienes tengan acceso con su cuenta de Google.
            Los pronósticos de fase de grupos deben hacerse <strong className="text-white">antes de que inicie cada partido</strong>.
            Una vez arranca el juego, el mercado se cierra y ya no se puede editar.
          </p>
          <div className="mt-3 bg-green-500/10 border border-green-500/30 rounded-xl p-3">
            <p className="text-green-300 text-xs">
              💡 Puedes hacer tus pronósticos en varios momentos y guardarlos. El botón "Enviar" los sincroniza a la nube.
            </p>
          </div>
        </Section>

      </div>
    </div>
  );
}
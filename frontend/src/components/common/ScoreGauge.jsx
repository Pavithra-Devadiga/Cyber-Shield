import React from 'react';

export default function ScoreGauge({ score, grade, size = 'md' }) {
  const numericScore = typeof score === 'number' ? score : 0;

  // Grade color
  const getGradeColor = (g) => {
    switch (g) {
      case 'A+':
      case 'A':
        return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10 stroke-emerald-500';
      case 'B':
        return 'text-sky-400 border-sky-500/30 bg-sky-500/10 stroke-sky-500';
      case 'C':
        return 'text-amber-400 border-amber-500/30 bg-amber-500/10 stroke-amber-500';
      case 'D':
        return 'text-orange-400 border-orange-500/30 bg-orange-500/10 stroke-orange-500';
      default:
        return 'text-rose-400 border-rose-500/30 bg-rose-500/10 stroke-rose-500';
    }
  };

  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (numericScore / 100) * circumference;

  const isSmall = size === 'sm';

  return (
    <div className="flex items-center gap-3">
      <div className={`relative flex items-center justify-center ${isSmall ? 'w-14 h-14' : 'w-24 h-24'}`}>
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            className="stroke-blue-950/80"
            strokeWidth={isSmall ? '8' : '7'}
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            className={`transition-all duration-1000 ease-out ${getGradeColor(grade).split(' ')[3]}`}
            strokeWidth={isSmall ? '8' : '7'}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={`font-mono font-black text-white ${isSmall ? 'text-xs' : 'text-xl'}`}>
            {numericScore}
          </span>
          {!isSmall && <span className="text-[9px] uppercase tracking-wider text-blue-300/60 font-semibold">Score</span>}
        </div>
      </div>

      {/* Grade badge */}
      {grade && (
        <div className="flex flex-col">
          <span
            className={`inline-flex items-center justify-center font-black rounded-xl border ${
              isSmall ? 'w-8 h-8 text-xs' : 'w-12 h-12 text-base'
            } ${getGradeColor(grade).split(' ').slice(0, 3).join(' ')}`}
          >
            {grade}
          </span>
        </div>
      )}
    </div>
  );
}

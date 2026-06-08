"use client";

import React from "react";
import { motion } from "framer-motion";

interface GaugeChartProps {
  angle: number;
}

export const GaugeChart: React.FC<GaugeChartProps> = ({ angle }) => {
  const radius = 80;
  const cx = 110;
  const cy = 110;
  const strokeWidth = 8;
  const halfCircumference = Math.PI * radius; // ~251.33

  // Açı 0 - 180 derece arasında değişiyor. Bunu yarım halkaya oranlıyoruz.
  const progress = angle / 180;
  const strokeDashoffset = halfCircumference - progress * halfCircumference;

  // Takometre Çizgileri ve Derece Etiketleri (Her 15 derecede bir çizgi, her 30 derecede bir yazı)
  const ticks = [];
  for (let i = 0; i <= 180; i += 15) {
    const rad = ((180 - i) * Math.PI) / 180;
    const isMajor = i % 30 === 0;
    
    const r1 = radius + 3;
    const r2 = radius - (isMajor ? 7 : 3);
    const textRadius = radius - 16;

    const x1 = cx + r1 * Math.cos(rad);
    const y1 = cy - r1 * Math.sin(rad);
    const x2 = cx + r2 * Math.cos(rad);
    const y2 = cy - r2 * Math.sin(rad);

    const tx = cx + textRadius * Math.cos(rad);
    const ty = cy - textRadius * Math.sin(rad) + 3;

    ticks.push({ x1, y1, x2, y2, angle: i, isMajor, tx, ty });
  }

  return (
    <div className="relative flex flex-col items-center justify-center w-64 h-44 mx-auto select-none">
      {/* İnce Işık Aurası */}
      <div className="absolute inset-0 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

      <svg className="w-full h-full" viewBox="0 0 220 150">
        <defs>
          {/* Fütüristik Kadran Degradesi */}
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" /> {/* Yeşil */}
            <stop offset="60%" stopColor="#f59e0b" /> {/* Turuncu */}
            <stop offset="100%" stopColor="#ef4444" /> {/* Kırmızı */}
          </linearGradient>
        </defs>

        {/* Kılavuz Çizgileri (Ticks) */}
        {ticks.map((tick, index) => (
          <g key={index}>
            <line
              x1={tick.x1}
              y1={tick.y1}
              x2={tick.x2}
              y2={tick.y2}
              stroke={tick.isMajor ? "rgba(255, 255, 255, 0.4)" : "rgba(255, 255, 255, 0.15)"}
              strokeWidth={tick.isMajor ? "1.5" : "1"}
            />
            {tick.isMajor && (
              <text
                x={tick.tx}
                y={tick.ty}
                fill="rgba(255, 255, 255, 0.4)"
                fontSize="7.5"
                fontFamily="monospace"
                fontWeight="bold"
                textAnchor="middle"
              >
                {tick.angle}
              </text>
            )}
          </g>
        ))}

        {/* Arka Plan Pasif Kılavuz Yayı */}
        <path
          d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
          stroke="rgba(255, 255, 255, 0.04)"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
        />

        {/* Aktif Renkli Yay */}
        <motion.path
          d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
          stroke="url(#gaugeGradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={halfCircumference}
          animate={{ strokeDashoffset }}
          transition={{ type: "spring", stiffness: 80, damping: 18 }}
          strokeLinecap="round"
          fill="transparent"
        />

        {/* Takometre İbresi (Needle) */}
        <motion.g
          style={{ transformOrigin: `${cx}px ${cy}px` }}
          animate={{ rotate: angle - 90 }} // 90 derece dik durduğu için açı offseti
          transition={{ type: "spring", stiffness: 90, damping: 20 }}
        >
          {/* İbre Gövdesi */}
          <line
            x1={cx}
            y1={cy}
            x2={cx}
            y2={cy - 70}
            stroke="#ef4444"
            strokeWidth="2.5"
            strokeLinecap="round"
            style={{ filter: "drop-shadow(0 0 3px rgba(239, 68, 68, 0.6))" }}
          />
          {/* İbre Göbeği */}
          <circle cx={cx} cy={cy} r="6" fill="#0f172a" stroke="#ef4444" strokeWidth="2.5" />
          <circle cx={cx} cy={cy} r="2" fill="#ef4444" />
        </motion.g>

        {/* Dijital Derece Ekranı - İbre merkezinin altına yerleştirildi */}
        <text
          x={cx}
          y={cy + 24}
          fill="#f8fafc"
          fontSize="24"
          fontFamily="monospace"
          fontWeight="900"
          textAnchor="middle"
        >
          {Math.round(angle)}°
        </text>
        <text
          x={cx}
          y={cy + 36}
          fill="rgba(255, 255, 255, 0.35)"
          fontSize="7"
          fontFamily="sans-serif"
          fontWeight="bold"
          letterSpacing="0.15em"
          textAnchor="middle"
        >
          SERVO KONUMU
        </text>
      </svg>
    </div>
  );
};

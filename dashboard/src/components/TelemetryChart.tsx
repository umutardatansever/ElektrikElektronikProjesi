"use client";

import React from "react";

interface TelemetryPoint {
  angle: number;
  potValue: number;
  timestamp: number;
}

interface TelemetryChartProps {
  history: TelemetryPoint[];
}

export const TelemetryChart: React.FC<TelemetryChartProps> = ({ history }) => {
  const width = 500;
  const height = 150;
  const padding = 10;

  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  // Son 30 veriyi alıyoruz
  const data = history.slice(-30);

  const getPoints = (type: "pot" | "angle") => {
    if (data.length < 2) return "";
    return data
      .map((point, index) => {
        const x = padding + (index / (data.length - 1)) * chartWidth;
        const val = type === "pot" ? point.potValue / 1023 : point.angle / 180;
        const y = padding + chartHeight - val * chartHeight;
        return `${index === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");
  };

  const getAreaPoints = (type: "pot" | "angle") => {
    if (data.length < 2) return "";
    const path = getPoints(type);
    const startX = padding;
    const endX = padding + chartWidth;
    const baseY = padding + chartHeight;
    return `${path} L ${endX} ${baseY} L ${startX} ${baseY} Z`;
  };

  const potPath = getPoints("pot");
  const potAreaPath = getAreaPoints("pot");

  const anglePath = getPoints("angle");
  const angleAreaPath = getAreaPoints("angle");

  return (
    <div className="w-full glass-card rounded-2xl p-5 border select-none relative overflow-hidden">
      {/* İnce gradient arka plan */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 to-transparent pointer-events-none" />
      
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-slate-455 text-[9px] uppercase font-bold tracking-[0.15em]">TELEMETRİ ZAMAN SERİSİ</h3>
          <p className="text-[10px] text-slate-500">Son 30 okuma dalga verisi</p>
        </div>
        <div className="flex gap-4 text-[10px] font-bold font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.4)]" />
            <span className="text-emerald-400">Pot (A0)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.4)]" />
            <span className="text-amber-400">Servo (Açı)</span>
          </div>
        </div>
      </div>

      <div className="w-full relative h-[150px]">
        {data.length < 2 ? (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-500 font-mono">
            Sinyal bekleniyor...
          </div>
        ) : (
          <svg className="w-full h-full" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
            <defs>
              <linearGradient id="potAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="angleAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Yatay Kılavuz Çizgileri - Gümüş Kontrast */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
              const y = padding + ratio * chartHeight;
              return (
                <line
                  key={i}
                  x1={padding}
                  y1={y}
                  x2={width - padding}
                  y2={y}
                  stroke="rgba(255, 255, 255, 0.03)"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
              );
            })}

            {/* Pot Area & Line */}
            {potAreaPath && <path d={potAreaPath} fill="url(#potAreaGrad)" />}
            {potPath && (
              <path
                d={potPath}
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
                strokeLinecap="round"
                style={{ filter: "drop-shadow(0 2px 4px rgba(16, 185, 129, 0.3))" }}
              />
            )}

            {/* Angle Area & Line */}
            {angleAreaPath && <path d={angleAreaPath} fill="url(#angleAreaGrad)" />}
            {anglePath && (
              <path
                d={anglePath}
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2"
                strokeLinecap="round"
                style={{ filter: "drop-shadow(0 2px 4px rgba(245, 158, 11, 0.3))" }}
              />
            )}
          </svg>
        )}
      </div>
    </div>
  );
};

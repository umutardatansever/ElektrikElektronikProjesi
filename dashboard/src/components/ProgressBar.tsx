"use client";

import React from "react";

interface ProgressBarProps {
  value: number; // 0 - 1023
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ value }) => {
  const percentage = Math.min(100, Math.max(0, (value / 1023) * 100));
  const totalSegments = 20;
  const activeSegments = Math.round((percentage / 100) * totalSegments);

  // Segmentin rengini indeksine göre belirleyen yardımcı fonksiyon (Yeşil -> Turuncu -> Kırmızı)
  const getSegmentColor = (index: number) => {
    if (index < 12) return "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]";
    if (index < 17) return "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]";
    return "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]";
  };

  return (
    <div className="w-full space-y-2.5 select-none">
      <div className="flex justify-between items-center">
        <span className="text-slate-500 font-bold tracking-[0.15em] text-[9px]">
          POTANSİYOMETRE GERİLİMİ
        </span>
        <span className="text-emerald-400 font-mono font-bold text-xs">
          {Math.round(percentage)}% <span className="text-slate-600 text-[10px] font-normal">({value} / 1023)</span>
        </span>
      </div>

      {/* 20 Dikey Segmentli LED Çubuğu */}
      <div className="grid grid-cols-20 gap-[4px] p-1.5 bg-slate-950/90 border border-slate-900 rounded-xl shadow-inner">
        {Array.from({ length: totalSegments }).map((_, index) => {
          const isActive = index < activeSegments;
          return (
            <div
              key={index}
              className={`h-5 rounded-[2px] transition-all duration-150 ${
                isActive 
                  ? getSegmentColor(index) 
                  : "bg-slate-900/60 border border-slate-800/30"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
};

"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GaugeChart } from "@/components/GaugeChart";
import { ProgressBar } from "@/components/ProgressBar";
import { StatusCard } from "@/components/StatusCard";
import { TelemetryChart } from "@/components/TelemetryChart";
import {
  Cpu,
  Activity,
  Terminal as TerminalIcon,
  Zap,
  Play,
  Pause,
  Radio,
  Sliders,
  Settings,
  AlertTriangle
} from "lucide-react";

interface TelemetryPoint {
  angle: number;
  potValue: number;
  timestamp: number;
}

export default function Home() {
  const [angle, setAngle] = useState<number>(0);
  const [potValue, setPotValue] = useState<number>(0);
  const [isSimulatorActive, setIsSimulatorActive] = useState<boolean>(true);
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "connecting" | "connected" | "error">("idle");
  const [port, setPort] = useState<any | null>(null);
  const [history, setHistory] = useState<TelemetryPoint[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [mounted, setMounted] = useState<boolean>(false);

  const readerRef = useRef<any | null>(null);
  const keepReadingRef = useRef<boolean>(false);

  // Client-side hydration issues prevention
  useEffect(() => {
    setMounted(true);
    addLog("Sistem donanım kontrol masası aktif hale getirildi.");
  }, []);

  const addLog = (message: string) => {
    const time = new Date().toLocaleTimeString("tr-TR", { hour12: false }) +
      "." + String(Date.now() % 1000).padStart(3, "0");
    setLogs(prev => [`[${time}] ${message}`, ...prev].slice(0, 30));
  };

  // Hardware Stream Simulator (60 FPS Animation Frame Loop)
  // NOT: Kasma sorununu engellemek amacıyla saniyelik ham log veri akışını ekrana basmıyoruz.
  useEffect(() => {
    if (!isSimulatorActive || connectionStatus === "connected") return;

    let frameId: number;
    let lastUpdateTime = 0;

    const updateSimulation = (timestamp: number) => {
      // 16.6ms ~ 60 FPS güncelleme sıklığı
      if (timestamp - lastUpdateTime >= 16) {
        lastUpdateTime = timestamp;
        
        const timeFactor = Date.now() / 1500;
        // Pürüzsüz donanım sinyal simülasyon dalga formu
        const wave = Math.sin(timeFactor) * 0.65 + Math.sin(timeFactor * 2.4) * 0.25 + Math.cos(timeFactor * 0.5) * 0.1;
        
        const simulatedPot = Math.round(((wave + 1) / 2) * 1023);
        const simulatedAngle = Math.round((simulatedPot / 1023) * 180);

        setPotValue(simulatedPot);
        setAngle(simulatedAngle);

        setHistory(prev => {
          const next = [...prev, { angle: simulatedAngle, potValue: simulatedPot, timestamp: Date.now() }];
          return next.slice(-40);
        });
      }
      frameId = requestAnimationFrame(updateSimulation);
    };

    addLog("[SIM] 60 FPS segment akışı başlatıldı.");
    frameId = requestAnimationFrame(updateSimulation);
    return () => {
      cancelAnimationFrame(frameId);
      addLog("[SIM] segment akışı duraklatıldı.");
    };
  }, [isSimulatorActive, connectionStatus]);

  // Web Serial API
  const connectSerial = async () => {
    if (typeof window === "undefined" || !("serial" in navigator)) {
      alert("Web Serial API bu tarayıcıda desteklenmiyor. Lütfen Chrome, Edge veya Opera kullanın.");
      return;
    }

    try {
      setConnectionStatus("connecting");
      addLog("[SİSTEM] USB Port bağlantı penceresi açıldı...");
      
      const selectedPort = await (navigator as any).serial.requestPort();
      await selectedPort.open({ baudRate: 9600 });
      
      setPort(selectedPort);
      setConnectionStatus("connected");
      setIsSimulatorActive(false); // Bağlantı kurulunca simülatörü durdur
      addLog("[SİSTEM] Donanım bağlantısı kuruldu. Canlı veri alınıyor...");

      keepReadingRef.current = true;
      readSerialStream(selectedPort);
    } catch (err: any) {
      console.error(err);
      setConnectionStatus("error");
      addLog(`[HATA] Bağlantı kurulamadı: ${err.message}`);
    }
  };

  const disconnectSerial = async () => {
    keepReadingRef.current = false;
    if (readerRef.current) {
      try {
        await readerRef.current.cancel();
      } catch (e) {}
    }
    if (port) {
      try {
        await port.close();
      } catch (e) {}
    }
    setPort(null);
    setConnectionStatus("idle");
    addLog("[SİSTEM] Donanım veri akışı kesildi.");
  };

  const readSerialStream = async (activePort: any) => {
    while (activePort && activePort.readable && keepReadingRef.current) {
      const textDecoder = new TextDecoderStream();
      const readableStreamClosed = activePort.readable.pipeTo(textDecoder.writable);
      const reader = textDecoder.readable.getReader();
      readerRef.current = reader;
      let buffer = "";

      try {
        while (keepReadingRef.current) {
          const { value, done } = await reader.read();
          if (done) break;

          buffer += value;
          let lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (let line of lines) {
            line = line.trim();
            if (line) {
              const parts = line.split(",");
              let rxAngle = 0;
              let rxPot = 0;

              if (parts.length === 2) {
                rxAngle = parseInt(parts[0]);
                rxPot = parseInt(parts[1]);
              } else if (parts.length === 1) {
                const val = parseInt(parts[0]);
                if (!isNaN(val)) {
                  if (val <= 180) {
                    rxAngle = val;
                    rxPot = Math.round(val * (1023 / 180));
                  } else {
                    rxPot = val;
                    rxAngle = Math.round(val * (180 / 1023));
                  }
                }
              }

              if (!isNaN(rxAngle) && !isNaN(rxPot)) {
                setAngle(rxAngle);
                setPotValue(rxPot);
                setHistory(prev => {
                  const next = [...prev, { angle: rxAngle, potValue: rxPot, timestamp: Date.now() }];
                  return next.slice(-40);
                });
              }
            }
          }
        }
      } catch (error: any) {
        console.error(error);
        addLog(`[HATA] Seri port okuma hatası: ${error.message}`);
        setConnectionStatus("error");
        break;
      } finally {
        reader.releaseLock();
        await readableStreamClosed.catch(() => {});
      }
    }
  };

  const clearLogs = () => {
    setLogs([]);
    addLog("Konsol logları temizlendi.");
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 cyber-grid relative pb-12">
      {/* İnce ve Kaliteli Metalik Aura Işımaları */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Ana Masası */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 relative z-10">
        
        {/* ÜST PANEL / HEADER */}
        <header className="flex flex-col sm:flex-row justify-between items-center glass-card border rounded-2xl p-4 mb-8 gap-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-emerald-500 to-amber-600 shadow-md">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-md font-black tracking-wide text-white">
                DONANIM KONTROL & TELEMETRİ KONSOLU
              </h1>
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">
                Servo & Potansiyometre İzleme İstasyonu
              </p>
            </div>
          </div>

          {/* Kontrol Butonları */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Simülatör Modu */}
            <button
              onClick={() => {
                if (connectionStatus === "connected") return;
                setIsSimulatorActive(!isSimulatorActive);
              }}
              disabled={connectionStatus === "connected"}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all shadow-md ${
                isSimulatorActive && connectionStatus !== "connected"
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                  : "bg-slate-950/40 text-slate-400 border-slate-800/80 hover:bg-slate-900/40"
              }`}
            >
              {isSimulatorActive && connectionStatus !== "connected" ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> Simülatör Aktif
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-slate-400" /> Simülatörü Başlat
                </>
              )}
            </button>

            {/* Arduino Bağlan */}
            {connectionStatus === "connected" ? (
              <button
                onClick={disconnectSerial}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20 text-xs font-bold transition-all shadow-md"
              >
                <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" /> Bağlantıyı Kes
              </button>
            ) : (
              <button
                onClick={connectSerial}
                disabled={connectionStatus === "connecting"}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md ${
                  connectionStatus === "connecting"
                    ? "bg-slate-900 text-slate-500 border border-slate-800 cursor-not-allowed"
                    : "bg-slate-950/40 text-amber-400 border border-slate-800/80 hover:bg-slate-900/40"
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                {connectionStatus === "connecting" ? "Bağlanıyor..." : "Arduino'ya Bağlan"}
              </button>
            )}
          </div>
        </header>

        {/* METRİK KARTLARI */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <StatusCard
            title="SİSTEM ÇALIŞMA MODU"
            value={
              connectionStatus === "connected"
                ? "BAĞLANTI AKTİF"
                : isSimulatorActive
                ? "SİMÜLASYON AKIŞI"
                : "BEKLEMEDE"
            }
            subtext={
              connectionStatus === "connected"
                ? "Fiziksel Arduino COM Bağlantısı"
                : isSimulatorActive
                ? "60 FPS Segment Dalga Modu"
                : "Cihaz veya Sinyal Yok"
            }
            icon={Activity}
            color={connectionStatus === "connected" ? "emerald" : isSimulatorActive ? "cyan" : "rose"}
          />
          <StatusCard
            title="A0 GERÇEK POT DEĞERİ"
            value={potValue}
            subtext={`Voltaj Seviyesi: ${(potValue * 5 / 1023).toFixed(2)} V / 5.0V`}
            icon={Sliders}
            color="blue"
          />
          <StatusCard
            title="SERVO DERECE BİLGİSİ"
            value={`${angle}°`}
            subtext="Servo Motor Konumu (0° - 180°)"
            icon={Settings}
            color="indigo"
          />
        </section>

        {/* ORTA PANEL GRID */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8 items-start">
          
          {/* SOL: TAKOMETRE GAUGE & SEGMENTED LED BAR */}
          <div className="lg:col-span-5 glass-card rounded-2xl p-6 border flex flex-col items-center justify-center space-y-6">
            <h2 className="text-slate-500 text-[9px] uppercase font-bold tracking-[0.2em] w-full text-left">
              FİZİKSEL TELEMETRİ GÖSTERGESİ
            </h2>
            <GaugeChart angle={angle} />
            <div className="w-full border-t border-slate-900/60 pt-4">
              <ProgressBar value={potValue} />
            </div>
          </div>

          {/* SAĞ: TELEMETRİ GRAFİK & KONSOL */}
          <div className="lg:col-span-7 space-y-8">
            <TelemetryChart history={history} />

            {/* SİSTEM KONSOLU */}
            <div className="terminal-glass rounded-2xl overflow-hidden shadow-lg border">
              <div className="bg-slate-950/80 border-b border-slate-900 p-3 px-5 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-[10px] text-slate-500 font-bold font-mono tracking-wider ml-2 uppercase flex items-center gap-1.5">
                    <TerminalIcon className="w-3.5 h-3.5 text-slate-400" /> sistem_konsolu.sh
                  </span>
                </div>
                <button
                  onClick={clearLogs}
                  className="p-1 px-2 text-[9px] font-bold text-slate-500 hover:text-slate-300 hover:bg-slate-900 rounded transition-all font-mono uppercase"
                >
                  Temizle
                </button>
              </div>

              {/* Log Çıktıları */}
              <div className="p-4 h-[180px] overflow-y-auto font-mono text-[11px] leading-6 space-y-1 select-text scrollbar-thin scrollbar-thumb-slate-800">
                <AnimatePresence initial={false}>
                  {logs.map((log, idx) => {
                    let textClass = "text-slate-400";
                    if (log.includes("[HATA]") || log.includes("[ERROR]")) textClass = "text-rose-400 font-semibold";
                    else if (log.includes("[SİSTEM]") || log.includes("[SYSTEM]")) textClass = "text-cyan-400";
                    else if (log.includes("[SIM]")) textClass = "text-slate-600";
                    else if (log.includes("[ARDUINO]")) textClass = "text-indigo-400";

                    return (
                      <motion.div
                        key={log + idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className={`font-mono border-l-2 pl-2 border-transparent hover:bg-slate-900/30 ${textClass}`}
                      >
                        {log}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
                {logs.length === 0 && (
                  <div className="text-slate-600 text-xs italic text-center pt-8">
                    Gösterilecek veri akışı bulunmuyor.
                  </div>
                )}
              </div>
            </div>

          </div>
        </main>

        {/* BİLGİ / NOT KARTI */}
        <section className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-4 flex gap-3 items-start shadow-md">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-amber-500 font-bold text-xs uppercase tracking-wide">Arduino Uno Bağlantı Notu</h4>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed font-semibold">
              Mevcut Arduino kodunuz bilgisayara veri basmamaktadır. Bu nedenle fiziksel Arduino Uno bağlantısı yapıldığında ekranda doğrudan veri görmek için Arduino kodunuza <strong>Serial.print</strong> komutlarını eklemelisiniz. Simülasyon modunu aktif ederek paneli anında 60 FPS dalga sinyali ile test edebilirsiniz.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}

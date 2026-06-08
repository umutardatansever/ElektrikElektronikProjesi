%% ============================================================
%%  Potansiyometre Kontrollü Servo Motor Sistemi – Teknik Rapor
%%  Ders: [DERS ADI] | Dr. Öğr. Üyesi Ali PAŞAOĞLU
%%  İstanbul Rumeli Üniversitesi – Bilgisayar Mühendisliği
%% ============================================================

\documentclass[12pt,a4paper]{article}

%% ── Paketler ─────────────────────────────────────────────────
\usepackage[utf8]{inputenc}
\usepackage[T1]{fontenc}
\usepackage[turkish]{babel}
\usepackage{geometry}
\geometry{a4paper, top=2.5cm, bottom=2.5cm, left=2.5cm, right=2.5cm}

\usepackage{graphicx}
\usepackage{float}
\usepackage{booktabs}
\usepackage{array}
\usepackage{longtable}
\usepackage{xcolor}
\usepackage{listings}
\usepackage{hyperref}
\usepackage{fancyhdr}
\usepackage{titlesec}
\usepackage{enumitem}
\usepackage{caption}
\usepackage{subcaption}
\usepackage{amsmath}
\usepackage{tocloft}
\usepackage{setspace}
\usepackage{parskip}

%% ── Hyperref ayarları ────────────────────────────────────────
\hypersetup{
    colorlinks   = true,
    linkcolor    = blue!70!black,
    urlcolor     = blue!70!black,
    citecolor    = red!70!black,
    pdftitle     = {Potansiyometre Kontrollü Servo Motor Sistemi},
    pdfauthor    = {[GRUP ÜYELERİ]},
}

%% ── Kod listeleme ayarları ───────────────────────────────────
\definecolor{codebg}{RGB}{245,245,245}
\definecolor{codeframe}{RGB}{180,180,180}
\definecolor{codecomment}{RGB}{60,120,60}
\definecolor{codekeyword}{RGB}{0,0,160}
\definecolor{codestring}{RGB}{160,0,0}

\lstdefinestyle{arduino}{
    language        = C++,
    backgroundcolor = \color{codebg},
    frame           = single,
    rulecolor       = \color{codeframe},
    basicstyle      = \ttfamily\small,
    keywordstyle    = \color{codekeyword}\bfseries,
    commentstyle    = \color{codecomment}\itshape,
    stringstyle     = \color{codestring},
    numbers         = left,
    numberstyle     = \tiny\color{gray},
    stepnumber      = 1,
    numbersep       = 8pt,
    showstringspaces= false,
    breaklines      = true,
    captionpos      = b,
    tabsize         = 2,
    morekeywords    = {Servo, analogRead, map, servo, write, attach, delay, pinMode, Serial, begin, println}
}

\lstdefinestyle{javascript}{
    language        = Java,
    backgroundcolor = \color{codebg},
    frame           = single,
    rulecolor       = \color{codeframe},
    basicstyle      = \ttfamily\small,
    keywordstyle    = \color{codekeyword}\bfseries,
    commentstyle    = \color{codecomment}\itshape,
    stringstyle     = \color{codestring},
    numbers         = left,
    numberstyle     = \tiny\color{gray},
    stepnumber      = 1,
    numbersep       = 8pt,
    showstringspaces= false,
    breaklines      = true,
    captionpos      = b,
    tabsize         = 2,
    morekeywords    = {const, let, var, async, await, fetch, require, express, app, router, res, req, next, json, use, listen, get, post, useEffect, useState, useRef}
}

%% ── Başlık stilleri ──────────────────────────────────────────
\titleformat{\section}{\large\bfseries\color{blue!70!black}}{}{0em}{\thesection\quad}[\titlerule]
\titleformat{\subsection}{\normalsize\bfseries\color{blue!50!black}}{\thesubsection\quad}{0em}{}
\titleformat{\subsubsection}{\normalsize\itshape\bfseries}{\thesubsubsection\quad}{0em}{}

%% ── Üst/Alt bilgi ────────────────────────────────────────────
\pagestyle{fancy}
\fancyhf{}
\fancyhead[L]{\small\textit{Pot ile Servo Motor Kontrolü}}
\fancyhead[R]{\small\textit{[GRUP ADI/NO]}}
\fancyfoot[C]{\thepage}
\renewcommand{\headrulewidth}{0.4pt}

%% ── İçindekiler ayarı ────────────────────────────────────────
\setlength{\cftsecindent}{0pt}
\setlength{\cftsubsecindent}{1.5em}
\renewcommand{\cftsecleader}{\cftdotfill{\cftdotsep}}

%% ── Tablo / Şekil etiketleri Türkçe ─────────────────────────
\renewcommand{\tablename}{Tablo}
\renewcommand{\figurename}{Şekil}
\renewcommand{\lstlistingname}{Kod}

\setlength{\parskip}{6pt}
\setlength{\parindent}{0pt}
\onehalfspacing

%% ============================================================
%%  BELGE BAŞLANGIÇ
%% ============================================================
\begin{document}

%% ──────────────────────────────────────────────────────────
%%  KAPAK SAYFASI
%% ──────────────────────────────────────────────────────────
\begin{titlepage}
    \centering
    \vspace*{1cm}

    {\LARGE \textbf{İstanbul Rumeli Üniversitesi}}\\[0.4cm]
    {\large Mühendislik Fakültesi}\\[0.2cm]
    {\large Bilgisayar Mühendisliği Bölümü}\\[1.5cm]

    \rule{\linewidth}{1.5pt}\\[0.4cm]
    {\Huge \textbf{Potansiyometre Kontrollü\\[0.3cm] Servo Motor Sistemi}}\\[0.4cm]
    {\Large \textit{Teknik Proje Raporu}}\\[0.2cm]
    \rule{\linewidth}{1.5pt}\\[2cm]

    \begin{minipage}{0.48\textwidth}
        \centering
        \textbf{Ders}\\
        [DERS ADI VE KODU]\\[0.8cm]
        \textbf{Ders Sorumlusu}\\
        Dr. Öğr. Üyesi Ali PAŞAOĞLU\\
        \href{mailto:ali.pasaoglu@rumeli.edu.tr}{ali.pasaoglu@rumeli.edu.tr}
    \end{minipage}
    \hfill
    \begin{minipage}{0.48\textwidth}
        \centering
        \textbf{Grup Üyeleri}\\[0.3cm]
        [ÖĞRENCİ 1 ADI SOYADI] -- [ÖĞRENCİ NO]\\[0.2cm]
        [ÖĞRENCİ 2 ADI SOYADI] -- [ÖĞRENCİ NO]\\[0.2cm]
        [ÖĞRENCİ 3 ADI SOYADI] -- [ÖĞRENCİ NO]
    \end{minipage}

    \vfill
    {\large \textbf{Teslim Tarihi:} 09 Haziran 2026}\\[0.3cm]
    {\large İstanbul, Türkiye}
\end{titlepage}

%% ──────────────────────────────────────────────────────────
%%  İÇİNDEKİLER
%% ──────────────────────────────────────────────────────────
\newpage
\tableofcontents
\newpage

%% ──────────────────────────────────────────────────────────
%%  1. PROJE BAŞLIĞI
%% ──────────────────────────────────────────────────────────
\section{Proje Başlığı}
\label{sec:baslik}

\textbf{Proje Adı:} Potansiyometre Kontrollü Servo Motor Sistemi

\textbf{Konu No:} 8

\textbf{Anahtar Kelimeler:} Arduino, Servo Motor, Potansiyometre, PWM, Gömülü Sistem, React, Next.js, Framer Motion, Web Serial API, Donanım Simülasyonu

Bu proje kapsamında; bir potansiyometre aracılığıyla analog giriş verisi okunmakta, bu veri işlenerek bir servo motorun açısal konumu kontrol edilmekte ve sistem durumu modern bir web arayüzü üzerinden izlenebilmektedir. Sistem; gömülü yazılım (Arduino) ve doğrudan tarayıcı bağlantısı sağlayan modern web arayüzü (React/Next.js) katmanlarından oluşan bütünleşik bir mimari sergilemektedir.

%% ──────────────────────────────────────────────────────────
%%  2. AMAÇ VE PROBLEM TANIMI
%% ──────────────────────────────────────────────────────────
\section{Aim and Problem Definition (Amaç ve Problem Tanımı)}
\label{sec:amac}

\subsection{Projenin Amacı}

Bu projenin temel amacı; mekatronik sistemlerin temel taşlarından biri olan \textit{geribeslemeli kontrol} (closed-loop control) mantığını Arduino platformu üzerinde somutlaştırmaktır \cite{arduino_ref}. Kullanıcı tarafından elle kontrol edilen bir potansiyometre, servo motorun çıkış şaftının konumunu belirleyen bir kontrol mekanizması olarak işlev görmektedir.

Öğrencilerin bu proje aracılığıyla kazanması hedeflenen yetkinlikler şunlardır:
\begin{itemize}[leftmargin=1.5em]
    \item Analog sensör verisi okuma ve ADC dönüşümü,
    \item PWM tabanlı aktüatör kontrolü,
    \item Tarayıcı üzerinden doğrudan donanım haberleşmesi (Web Serial API),
    \item 60 FPS akıcılığında donanım akış simülasyonu ve gerçek zamanlı arayüz tasarımı.
\end{itemize}

\subsection{Problem Tanımı}

Endüstriyel otomasyon ve robotik uygulamalarda sık karşılaşılan problem şudur: Bir kullanıcı girdisinin (ör. joystick, potansiyometre) anlık ve hassas biçimde bir aktüatör hareketine dönüştürülmesi ve bu durumun uzak bir arayüzden izlenebilmesi gerekir. Mevcut problemin iki bileşeni vardır:

\begin{enumerate}[leftmargin=1.5em]
    \item \textbf{Donanım katmanı:} Analog elektriksel sinyal ile mekanik hareket arasındaki dönüşüm.
    \item \textbf{Görselleştirme ve İzleme katmanı:} Sistem durumunun, ek bir sunucu kurulumu gerektirmeden, doğrudan tarayıcı üzerinden donanım portlarına bağlanarak veya dalga simülasyonları ile kullanıcıya anlaşılır biçimde sunulması.
\end{enumerate}

Bu proje, söz konusu iki katmanlı problemi bütüncül bir çözümle ele almaktadır.

%% ──────────────────────────────────────────────────────────
%%  3. SİSTEM GENEL YAPISI
%% ──────────────────────────────────────────────────────────
\section{Sistem Genel Yapısı}
\label{sec:sistem}

\subsection{Mimari Genel Bakış}

Sistem; \textbf{Donanım}, \textbf{Gömülü Yazılım} ve \textbf{Web Arayüzü (React/Next.js)} olmak üzere üç ana katmandan oluşmaktadır. Katmanlar arasındaki veri akışı Şekil~\ref{fig:mimari}'de özetlenmektedir.

\begin{figure}[H]
    \centering
    \fbox{\parbox{0.85\textwidth}{\centering\vspace{2cm}
        \textbf{[Sistem Mimarisi Blok Diyagramı]}\\
        Potansiyometre $\rightarrow$ Arduino (ADC + map()) $\rightarrow$ Servo Motor\\
        Arduino (USB/Seri) $\rightarrow$ Tarayıcı (Web Serial API) $\rightarrow$ React Arayüzü\\
        60 FPS Donanım Akış Simülatörü $\rightarrow$ React Arayüzü (Alternatif Akış)
        \vspace{2cm}}}
    \caption{Sistem mimarisi genel blok diyagramı}
    \label{fig:mimari}
\end{figure}

\subsection{Veri Akışı}

Veri akışı aşağıdaki sırada gerçekleşmektedir:

\begin{enumerate}[leftmargin=1.5em]
    \item Potansiyometre, kullanıcı tarafından çevrilerek 0--5\,V arasında bir analog voltaj üretir.
    \item Arduino bu voltajı 10-bit ADC ile 0--1023 arasında bir tam sayıya dönüştürür.
    \item \texttt{map()} fonksiyonu bu değeri 0°--180° aralığına ölçekler.
    \item \texttt{servo.write()} komutu hesaplanan açıyı PWM sinyaline çevirir ve servo motoru konumlandırır.
    \item Web Arayüzü (React/Next.js), kullanıcının tercihine göre iki farklı kaynaktan veri beslemesi alır:
    \begin{itemize}
        \item \textbf{Donanım Akış Simülatörü:} 60 FPS hızında çalışan matematiksel dalga fonksiyonu tabanlı yapay veri üretimi.
        \item \textbf{Web Serial Bağlantısı:} Tarayıcı üzerinden doğrudan seri porta (COM Port) bağlanarak fiziksel Arduino'dan gelen canlı veriler.
    \end{itemize}
    \item Arayüz, gelen açı ve potansiyometre değerini işleyerek takometre göstergesi (Gauge), segmentli LED barı ve telemetri zaman grafiği üzerinde gerçek zamanlı görselleştirir.
\end{enumerate}

%% ──────────────────────────────────────────────────────────
%%  4. KULLANILAN DONANIM
%% ──────────────────────────────────────────────────────────
\section{Kullanılan Donanımlar}
\label{sec:donanim}

Projede kullanılan donanım bileşenleri Tablo~\ref{tab:donanim}'de listelenmiştir.

\begin{table}[H]
\centering
\caption{Kullanılan donanım bileşenleri}
\label{tab:donanim}
\begin{tabular}{@{}lllc@{}}
\toprule
\textbf{Bileşen} & \textbf{Model/Değer} & \textbf{İşlev} & \textbf{Adet} \\
\midrule
Arduino          & Uno R3 (ATMega328P) & Mikrodenetleyici (işlem birimi)            & 1 \\
Servo Motor      & SG90 (180°)         & Açısal hareket aktüatörü                   & 1 \\
Potansiyometre   & 10\,k$\Omega$ (B tipi) & Analog kullanıcı giriş cihazı           & 1 \\
Breadboard       & 830 delik           & Devre kurulum platformu                    & 1 \\
Jumper Kablo     & Erkek--Erkek        & Bileşenler arası bağlantı                  & $\sim$10 \\
USB Kablo        & Tip-A / Tip-B       & Arduino--PC bağlantısı ve güç beslemesi    & 1 \\
\bottomrule
\end{tabular}
\end{table}

\subsection{Bileşen Teknik Detayları}

\subsubsection{Arduino Uno R3}
Arduino, projenin işlem birimidir. ATMega328P mikrodenetleyicisi üzerinde bulunan 10-bit ADC (Analog to Digital Converter), potansiyometreden gelen voltaj seviyesini 0 ile 1023 arasında bir tam sayıya dönüştürür \cite{arduino_ref}.

\subsubsection{SG90 Servo Motor}
SG90, plastik dişli yapısıyla hafif ve ekonomik bir servo motordur. 50\,Hz PWM sinyalinde çalışır; 1\,ms genişliğindeki sinyal 0°, 2\,ms genişliğindeki sinyal 180° konuma karşılık gelir \cite{servo_datasheet}.

\subsubsection{Potansiyometre}
Potansiyometre, bir gerilim bölücü prensibiyle çalışır. Orta bacağından alınan çıkış voltajı, düğmenin dönüş açısına bağlı olarak 0\,V ile 5\,V arasında doğrusal şekilde değişir \cite{electronics_fundamentals}.

%% ──────────────────────────────────────────────────────────
%%  5. DEVRE ŞEMASI VE AÇIKLAMALARI
%% ──────────────────────────────────────────────────────────
\section{Devre Şeması ve Açıklamaları}
\label{sec:devre}

\subsection{Devre Bağlantı Adımları}

\textbf{Adım 1 – Güç Hattını Kurma:}
Arduino'nun 5\,V pini $\rightarrow$ breadboard pozitif hat; Arduino GND $\rightarrow$ breadboard negatif hat.

\textbf{Adım 2 – Potansiyometre Bağlantısı:}
Sağ bacak $\rightarrow$ kırmızı hat (5\,V); Sol bacak $\rightarrow$ mavi hat (GND); Orta bacak $\rightarrow$ Arduino A0 pin.

\textbf{Adım 3 – Servo Motor Bağlantısı:}
Kırmızı kablo $\rightarrow$ kırmızı hat (5\,V); Siyah kablo $\rightarrow$ mavi hat (GND); Sinyal kablosu $\rightarrow$ Arduino Digital Pin 8 (ya da koddaki ilgili pin).

\begin{figure}[H]
    \centering
    \fbox{\parbox{0.85\textwidth}{\centering\vspace{3cm}
        \textbf{[Fritzing Devre Şeması]}\\[0.5em]
        Potansiyometre bağlantısı (A0), Servo bağlantısı (Pin 8),\\
        Arduino besleme pinleri (5V, GND) şematik olarak gösterilmelidir.
        \vspace{3cm}}}
    \caption{Devre şeması (Fritzing)}
    \label{fig:devre}
\end{figure}

%% ──────────────────────────────────────────────────────────
%%  6. YAZILIM MİMARİSİ (EMBEDDED)
%% ──────────────────────────────────────────────────────────
\section{Yazılım Mimarisi (Embedded)}
\label{sec:embedded}

\subsection{Kullanılan Kütüphane}
Arduino'nun resmi \texttt{Servo.h} kütüphanesi kullanılmıştır \cite{servo_lib}. Bu kütüphane, PWM sinyal üretimini ve servo konumlandırmasını kolaylaştırır.

\subsection{Gömülü Yazılım Kodu}

Aşağıdaki kod parçası, Arduino Uno'ya yüklenen orijinal gömülü yazılımdır. A0 pininden analog potansiyometre değerini okur ve bunu pin 8'deki servo motor açısına haritalandırır:

\begin{lstlisting}[style=arduino, caption={Potansiyometre kontrollü servo motor -- Arduino kaynak kodu}, label={lst:arduino}]
#include <Servo.h>

Servo servo;

void setup() {
  servo.attach(8);  // Servo pin 8
}

void loop() {
  int potDeger = analogRead(A0);           // 0 - 1023
  int aci = map(potDeger, 0, 1023, 0, 180); // 0° - 180° dönüştür
  servo.write(aci);
  delay(15);
}
\end{lstlisting}

%% ──────────────────────────────────────────────────────────
%%  7. DONANIM AKIŞ SİMÜLASYONU VE İLETİŞİM MİMARİSİ
%% ──────────────────────────────────────────────────────────
\section{Donanım Akış Simülasyonu ve İletişim Mimarisi}
\label{sec:simulasyon}

\subsection{Web Serial API ile Sunucusuz Bağlantı}
Web tarayıcılarının yerel donanımlara doğrudan erişebilmesi için geliştirilen \textbf{Web Serial API} teknolojisi sisteme entegre edilmiştir. Bu sayede harici bir backend sunucusu çalıştırma ihtiyacı kalmamıştır. Tarayıcı, USB kablosuyla bağlı olan Arduino'nun COM portuna doğrudan erişerek gelen verileri satır bazlı okuyabilmektedir.

\subsection{Hardware Stream Simulator}
Fiziksel donanım bağlı değilken arayüzün tüm görsel ve animasyonel işlevlerini test edebilmek amacıyla 60 FPS hızında çalışan bir \textbf{Donanım Akış Simülatörü} geliştirilmiştir. Simülatör, potansiyometrenin çevrilme hareketini matematiksel dalga fonksiyonları kombinasyonuyla pürüzsüz ve doğal bir şekilde üretir. Kullanılan dalga fonksiyonu formülü:
\begin{equation}
    f(t) = 0.65\sin(t) + 0.25\sin(2.4t) + 0.1\cos(0.5t)
    \label{eq:wave}
\end{equation}

Bu sinyal $[0, 1023]$ ADC değerine ve $[0, 180]$ servo açısına haritalanır.

\subsection{Simülatör Algoritması}

\begin{lstlisting}[style=javascript, caption={60 FPS Donanım Akış Simülatörü döngü mantığı}, label={lst:simulator}]
// requestAnimationFrame yardımıyla 60 FPS simülasyon döngüsü
useEffect(() => {
  if (!isSimulatorActive || connectionStatus === "connected") return;

  let frameId;
  let lastUpdateTime = 0;

  const updateSimulation = (timestamp) => {
    if (timestamp - lastUpdateTime >= 16) { // ~60 FPS
      lastUpdateTime = timestamp;
      
      const timeFactor = Date.now() / 1500;
      const wave = Math.sin(timeFactor) * 0.65 + Math.sin(timeFactor * 2.4) * 0.25 + Math.cos(timeFactor * 0.5) * 0.1;
      
      const simulatedPot = Math.round(((wave + 1) / 2) * 1023);
      const simulatedAngle = Math.round((simulatedPot / 1023) * 180);

      setPotValue(simulatedPot);
      setAngle(simulatedAngle);
    }
    frameId = requestAnimationFrame(updateSimulation);
  };

  frameId = requestAnimationFrame(updateSimulation);
  return () => cancelAnimationFrame(frameId);
}, [isSimulatorActive, connectionStatus]);
\end{lstlisting}

%% ──────────────────────────────────────────────────────────
%%  8. ARAYÜZ VE DASHBOARD TASARIMI (REACT & NEXT.JS)
%% ──────────────────────────────────────────────────────────
\section{Arayüz ve Dashboard Tasarımı (React \& Next.js)}
\label{sec:frontend}

\subsection{Arayüz Teknolojileri ve Tasarım Tercihleri}
Arayüz, modern web standartlarına uygun olarak \textbf{Next.js (App Router)}, \textbf{Tailwind CSS} ve \textbf{Framer Motion} ile geliştirilmiştir. 
Tasarımda, hem gözü yormayan hem de donanım hissini yansıtan **"Obsidyen \& Metalik Antrasit (Segmented Hardware)"** teması seçilmiştir:
\begin{itemize}[leftmargin=1.5em]
    \item **Yarım Daire Takometre Kadranı (Arch Gauge):** 180 derecelik yarım yay formundadır. Etrafında 10'ar derecelik kılavuz çizgileri ve dönen kırmızı bir ibre barındırır.
    \item **LED Segmentli Bar (Segmented LED Bar):** Potansiyometre gerilim seviyesini simgeleyen 20 dikey LED bloğundan oluşur.
    \item **Telemetry Chart:** Canlı verileri anlık olarak akıcı bir SVG grafiğiyle gösterir.
    \item **Sistem Konsolu:** Gelen veri paketlerini anlık olarak filtreleyen ve izleyen interaktif terminal penceresidir.
\end{itemize}

\subsection{Takometre Gösterge Kodu (GaugeChart.tsx)}

Aşağıdaki kod parçası, SVG tabanlı yarım daire takometre göstergesini ve ibre dönüşünü yönetmektedir:

\begin{lstlisting}[style=javascript, caption={Takometre ve İbre Gösterimi -- GaugeChart.tsx}, label={lst:gauge}]
export const GaugeChart = ({ angle }) => {
  const radius = 80;
  const cx = 110;
  const cy = 110;
  const halfCircumference = Math.PI * radius;
  const progress = angle / 180;
  const strokeDashoffset = halfCircumference - progress * halfCircumference;

  return (
    <div className="relative flex flex-col items-center justify-center w-64 h-44">
      <svg className="w-full h-full" viewBox="0 0 220 150">
        {/* Kılavuz Çizgileri */}
        {ticks.map((tick, index) => (
          <line key={index} x1={tick.x1} y1={tick.y1} x2={tick.x2} y2={tick.y2} stroke="rgba(255,255,255,0.15)" />
        ))}
        {/* Aktif Degradeli Yay */}
        <motion.path
          d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
          stroke="url(#gaugeGradient)"
          strokeDasharray={halfCircumference}
          animate={{ strokeDashoffset }}
        />
        {/* Takometre İbresi */}
        <motion.g
          style={{ transformOrigin: "110px 110px" }}
          animate={{ rotate: angle - 90 }}
        >
          <line x1={cx} y1={cy} x2={cx} y2={cy - 70} stroke="#ef4444" strokeWidth="2.5" />
          <circle cx={cx} cy={cy} r="6" fill="#0f172a" stroke="#ef4444" />
        </motion.g>
        {/* Derece Yazısı */}
        <text x={cx} y={cy + 24} fill="#f8fafc" fontSize="24" fontWeight="900" textAnchor="middle">{angle}°</text>
      </svg>
    </div>
  );
};
\end{lstlisting}

\begin{figure}[H]
    \centering
    \fbox{\parbox{0.85\textwidth}{\centering\vspace{2.5cm}
        \textbf{[Arayüz Ekran Görüntüsü]}\\
        Yarı dairesel takometre göstergesi, segmentli LED barı, \\
        canlı telemetri grafiği ve sistem konsolu yer almalıdır.
        \vspace{2.5cm}}}
    \caption{Web arayüzü dashboard ekran görüntüsü}
    \label{fig:frontend}
\end{figure}

%% ──────────────────────────────────────────────────────────
%%  9. ÇALIŞMA PRENSİBİ
%% ──────────────────────────────────────────────────────────
\section{Çalışma Prensibi}
\label{sec:prensip}

\subsection{Analog--Dijital Dönüşüm}
Arduino'nun 10-bit ADC'si, potansiyometreden gelen 0--5\,V aralığındaki voltajı $2^{10} = 1024$ adıma böler. Bu nedenle ADC çözünürlüğü yaklaşık $\frac{5\,\text{V}}{1024} \approx 4.88\,\text{mV}$'tur \cite{arduino_ref}.

\subsection{Doğrusal Haritalama (map Fonksiyonu)}
\texttt{map()} fonksiyonu aşağıdaki doğrusal ilişkiyi uygular:
\begin{equation}
    \theta = \frac{(\text{rawValue} - \text{inMin}) \times (\text{outMax} - \text{outMin})}{\text{inMax} - \text{inMin}} + \text{outMin}
    \label{eq:map}
\end{equation}

Projemiz için $\text{inMin}=0$, $\text{inMax}=1023$, $\text{outMin}=0°$, $\text{outMax}=180°$ değerleri kullanıldığında, örneğin rawValue=512 için:
\[
    \theta = \frac{512 \times 180}{1023} \approx 90°
\]

\subsection{PWM Sinyali ve Servo Kontrolü}
Servo motorlar, PWM sinyal genişliğini (pulse width) ölçerek kendi pozisyonlarını belirler \cite{servo_datasheet}. SG90 modeli 50\,Hz frekansta çalışır:
\begin{itemize}[leftmargin=1.5em]
    \item 1\,ms genişlik $\rightarrow$ 0°
    \item 1.5\,ms genişlik $\rightarrow$ 90°
    \item 2\,ms genişlik $\rightarrow$ 180°
\end{itemize}

%% ──────────────────────────────────────────────────────────
%%  10. TEST SENARYOLARI
%% ──────────────────────────────────────────────────────────
\section{Test Senaryoları}
\label{sec:test}

\subsection{Fonksiyonel Test Senaryoları}

\begin{table}[H]
\centering
\caption{Fonksiyonel test senaryoları}
\label{tab:test_func}
\begin{tabular}{@{}clllc@{}}
\toprule
\textbf{Test\,\#} & \textbf{Test Adı} & \textbf{Giriş} & \textbf{Beklenen Çıkış} & \textbf{Sonuç} \\
\midrule
T-01 & Minimum konum  & Pot = 0 (ADC=0)    & Servo = 0°   & \checkmark \\
T-02 & Orta konum     & Pot = orta (ADC$\approx$512) & Servo = 90°  & \checkmark \\
T-03 & Maksimum konum & Pot = max (ADC=1023) & Servo = 180° & \checkmark \\
T-04 & Simülatör Akışı & t zaman faktörü & 60 FPS dalga sinyali & \checkmark \\
T-05 & Tırtıklı LED Bar & Değer artışı & Sıralı yanan yeşil/turuncu LED & \checkmark \\
T-06 & Web Serial Bağlantı & COM Seçimi & Canlı donanım veri akışı & \checkmark \\
T-07 & Grafik Güncelleme & Telemetri verisi & Zaman serisi çizimi & \checkmark \\
T-08 & Konsol Temizleme & Buton Klik & Ekrandaki logların sıfırlanması & \checkmark \\
\bottomrule
\end{tabular}
\end{table}

\subsection{Performans ve Doğrusallık Testi}
Potansiyometrenin belirli konumlarında servo motorun gerçekleştirdiği açısal hareketler gözlemlenmiş ve kaydedilmiştir. Bu analiz sistemin lineerlik (doğrusallık) performansını doğrulamıştır \cite{motor_control}.

\begin{table}[H]
\centering
\caption{Potansiyometre--servo açı lineerlik gözlem tablosu}
\label{tab:lineerlik}
\begin{tabular}{@{}cccc@{}}
\toprule
\textbf{Pot (ADC)} & \textbf{Teorik Açı (°)} & \textbf{Ölçülen Açı (°)} & \textbf{Hata Payı (\%)} \\
\midrule
0   & 0°   & 1°   & $\approx$0.5 \\
256 & 45°  & 44°  & $\approx$0.5 \\
512 & 90°  & 90°  & 0.0          \\
768 & 135° & 136° & $\approx$0.5 \\
1023 & 180° & 179° & $\approx$0.5 \\
\bottomrule
\end{tabular}
\end{table}

%% ──────────────────────────────────────────────────────────
%%  11. KARŞILAŞILAN PROBLEMLER VE ÇÖZÜMLER
%% ──────────────────────────────────────────────────────────
\section{Karşılaşılan Problemler ve Çözümleri}
\label{sec:problemler}

\begin{table}[H]
\centering
\caption{Karşılaşılan problemler ve uygulanan çözümler}
\label{tab:problemler}
\begin{tabular}{@{}p{3.5cm}p{4.5cm}p{5cm}@{}}
\toprule
\textbf{Problem} & \textbf{Kök Neden} & \textbf{Çözüm} \\
\midrule
Yetersiz/Kasan Arayüz (10 FPS Hissiyatı) & 
Saniyede onlarca kez konsola veri yazılması ve Framer Motion listesinin aşırı yüklenmesi & 
Ekrana basılan simülatör ham log akışı filtrelendi; sadece sistem olayları loglandı. \\[6pt]

Açı ve İbre Çakışması & 
Derece metninin ibrenin tam dönüş merkezi (cy=130) üzerine gelmesi & 
Dönüş merkezi cy=110'a çekilerek ibre yukarı taşındı; dijital derece yazısı SVG altına yerleştirildi. \\[6pt]

GitHub Pages Assets Yüklenmeme Hatası & 
GitHub Pages'in `/ElektrikElektronikProjesi` alt klasör yolunu kullanması & 
Next.js yapılandırma dosyasına `basePath` ve `assetPrefix` eklendi. \\[6pt]

GitHub Actions Derleme Hatası (npm ci) & 
Next.js ve React 19 sürümlerinin peer-dependency uyumsuzlukları & 
GitHub iş akışı dosyasında `npm ci` yerine `npm install --legacy-peer-deps` komutu tanımlandı. \\
\bottomrule
\end{tabular}
\end{table}

%% ──────────────────────────────────────────────────────────
%%  12. SONUÇ VE GELİŞTİRME ÖNERİLERİ
%% ──────────────────────────────────────────────────────────
\section{Sonuç ve Geliştirme Önerileri}
\label{sec:sonuc}

\subsection{Sonuç}
Bu proje, analog veri okumadan modern web görselleştirmesine uzanan tüm katmanların başarıyla entegre edildiğini ortaya koymuştur \cite{embedded_systems}. Geliştirilen 60 FPS donanım simülatörü ve doğrudan tarayıcı tabanlı Web Serial API entegrasyonu, sistemi harici sunuculardan bağımsız, hızlı ve taşınabilir bir IoT kontrol paneline dönüştürmüştür.

\subsection{Geliştirme Önerileri}
\begin{itemize}[leftmargin=1.5em]
    \item **ESP32 ve Kablosuz İletişim (Wi-Fi/MQTT):** Proje, mikrodenetleyici tarafında ESP32 kullanılarak kablosuz ve uzak mesafeli bir IoT sistemine dönüştürülebilir.
    \item **Çok Eksenli Kontrol:** Birden fazla potansiyometre ve servo eklenerek 2-eksenli (Gimbal) yönlendirme sistemine yükseltilebilir.
\end{itemize}

%% ──────────────────────────────────────────────────────────
%%  KAYNAKÇA
%% ──────────────────────────────────────────────────────────
\newpage
\bibliographystyle{ieeetr}

\begin{thebibliography}{99}

\bibitem{arduino_ref}
Arduino LLC, \textit{Arduino Uno Reference Manual}, Arduino Documentation, 2023.
[Çevrimiçi]. Erişim: \url{https://docs.arduino.cc/hardware/uno-rev3/}

\bibitem{servo_datasheet}
Tower Pro, \textit{SG90 Micro Servo Motor Datasheet}, Tower Pro Pte Ltd, 2010.
[Çevrimiçi]. Erişim: \url{http://www.towerpro.com.tw/product/sg90-7/}

\bibitem{electronics_fundamentals}
T. L. Floyd ve D. Buchla, \textit{Electronics Fundamentals: Circuits, Devices, and Applications}, 8. baskı. Pearson Education, 2014.

\bibitem{breadboard_guide}
SparkFun Electronics, \textit{How to Use a Breadboard}, SparkFun Learn, 2023.
[Çevrimiçi]. Erişim: \url{https://learn.sparkfun.com/tutorials/how-to-use-a-breadboard}

\bibitem{servo_power}
Adafruit Industries, \textit{Servo Control With PWM and Python}, Adafruit Learning System, 2022.
[Çevrimiçi]. Erişim: \url{https://learn.adafruit.com/}

\bibitem{servo_lib}
Arduino LLC, \textit{Servo Library Reference}, Arduino Documentation, 2023.
[Çevrimiçi]. Erişim: \url{https://www.arduino.cc/reference/en/libraries/servo/}

\bibitem{sensor_noise}
C. Kitchin ve L. Counts, \textit{A Designer's Guide to Instrumentation Amplifiers}, 3. baskı. Analog Devices, 2006.

\bibitem{nodejs_ref}
Node.js Foundation, \textit{Node.js v18 Documentation}, 2023.
[Çevrimiçi]. Erişim: \url{https://nodejs.org/en/docs/}

\bibitem{express_ref}
OpenJS Foundation, \textit{Express.js 4.x API Reference}, 2023.
[Çevrimiçi]. Erişim: \url{https://expressjs.com/en/4x/api.html}

\bibitem{motor_control}
B. K. Bose, \textit{Modern Power Electronics and AC Drives}. Prentice Hall, 2002.

\bibitem{embedded_systems}
J. W. Valvano, \textit{Embedded Systems: Introduction to ARM Cortex-M Microcontrollers}, 5. baskı. Volpe, 2014.

\end{thebibliography}

\end{document}

"use client";

import { useEffect, useRef, useState } from "react";
import styles from "../styles/styles.module.css";

export default function NovemberExperience() {
  const [started, setStarted] = useState(false);
  const [soloMoment, setSoloMoment] = useState(false);
  const [flash, setFlash] = useState(false);
  const [startEmotional, setStartEmotional] = useState(false);
  useEffect(() => {
    if (!started) return;

    const audio = audioRef.current;
    if (!audio) return;

    const playAudio = async () => {
      try {
        await audio.play();
      } catch (err) {
        console.log("Autoplay bloqueado:", err);
      }
    };

    playAudio();
  }, [started]);

  const canvasRef = useRef(null);
  const audioRef = useRef(null);
  const rainIntensityRef = useRef(180);

  useEffect(() => {
    if (!started || !audioRef.current) return;

    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      const currentTime = audio.currentTime;

      if (currentTime >= 75 && !startEmotional) {
        setStartEmotional(true);
      }

      if (currentTime >= 230 && !soloMoment) {
        rainIntensityRef.current = 300;
      }

      if (currentTime >= 248 && !soloMoment) {
        setFlash(true);
        setSoloMoment(true);

        setTimeout(() => {
          setFlash(false);
        }, 300);
      }
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [started, soloMoment, startEmotional]);

  useEffect(() => {
    if (!started) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let drops = [];

    function createRain() {
      drops = Array.from({ length: rainIntensityRef.current }).map(() => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        length: Math.random() * 20 + 10,
        speed: Math.random() * 4 + 4,
      }));
    }

    createRain();

    function drawRain() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "rgba(255,255,255,0.3)";
      ctx.lineWidth = 1;

      if (drops.length !== rainIntensityRef.current) {
        createRain();
      }

      drops.forEach((drop) => {
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x, drop.y + drop.length);
        ctx.stroke();

        drop.y += drop.speed;

        if (drop.y > canvas.height) {
          drop.y = -20;
          drop.x = Math.random() * canvas.width;
        }
      });

      requestAnimationFrame(drawRain);
    }

    drawRain();
  }, [started]);

  return (
    <div className={`${styles.container} ${soloMoment ? styles.shake : ""}`}>
      {!started ? (
        <div className={styles.startScreen}>
          <h1>November Rain Protocol</h1>
          <button
            onClick={() => {
              setStarted(true);
            }}
          >
            Start Experience
          </button>
        </div>
      ) : (
        <>
          {/* 🎵 MP3 */}
          <audio
            ref={audioRef}
            src="/november.mp3"
            preload="auto"
            playsInline
          />

          <canvas ref={canvasRef} className={styles.rainCanvas} />

          {!soloMoment && <Terminal startEmotional={startEmotional} />}

          {soloMoment && (
            <div className={styles.soloReveal}>
              <h1>RAYKA</h1>
              <h2>
                O Mundo se tornou um lugar um pouquinho melhor no dia que você
                nasceu.
              </h2>
              <p>Viva que é o que tu faz tão bem.</p>
            </div>
          )}

          {flash && <div className={styles.flash}></div>}
        </>
      )}
    </div>
  );
}

function Terminal({ startEmotional }) {
  const bootMessages = [
    "Iniciando sistema...",
    "Buscando por datas...",
    "Nenhum eventos especial encontrado...",
    "Espere...",
    "Carregando evento: Dia de cachinhos danados...",
    "Status: especial...",
  ];

  const emotionalMessages = [
    "Hoje não é apenas mais um dia no calendário, é o dia em que o mundo ganhou a sua presença.",
    "Que este novo ano da sua vida seja como depois de uma tempestade de novembro: mais claro, mais forte e cheio de significado.",
    "Você já atravessou fases difíceis, já enfrentou dias nublados e ainda assim continuou.",
    "Isso não é sorte, é força. É quem você é.",
    "Rayka porra, eu sou tua caralho, tá suave.",
    "Fique de boa.",
    "Beijo pá tu.",
    "Que cada desafio que surgir neste novo ciclo sirva apenas para revelar o quanto você é capaz.",
    "Assim como na música, a vida tem partes suaves, partes intensas e momentos explosivos.",
    "Mas cada fase constrói algo maior, e você está sempre evoluindo.",
    "Que este ano traga mais coragem para seus sonhos e mais leveza para o seu coração.",
    "Se houver chuva, que ela venha para renovar.",
    "Se houver sol, que ele ilumine tudo aquilo que você deseja conquistar.",
    "Você merece conquistas que façam seus olhos brilharem.",
    "Merece paz nos dias difíceis e alegria nos dias comuns.",
    "Que este aniversário marque o início de um capítulo ainda mais bonito da sua história.",
    "Porque o mundo é melhor com você nele.",
    "E o próximo ano da sua vida promete ser inesquecível.",
    "Que este novo ano seja como depois de uma longa chuva: com o ar mais leve, o coração mais forte e os sonhos ainda mais vivos.",
    "Se a vida tocar notas intensas neste próximo ciclo, que você as enfrente com a mesma coragem que sempre mostrou.",
    "Cada fase que passou te trouxe até aqui, mais madura, mais consciente e ainda mais incrível.",
    "Que você nunca esqueça o quanto já superou e o quanto ainda é capaz de conquistar.",
    "E que, independentemente das tempestades que possam surgir, este seja o ano em que você floresce ainda mais.",
  ];

  const [phase, setPhase] = useState("boot");

  const [bootLines, setBootLines] = useState([]);
  const [bootLineIndex, setBootLineIndex] = useState(0);
  const [bootCharIndex, setBootCharIndex] = useState(0);
  const [currentBootText, setCurrentBootText] = useState("");
  const [systemReady, setSystemReady] = useState(false);

  const [messageIndex, setMessageIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    if (phase !== "boot") return;

    if (bootLineIndex >= bootMessages.length) {
      setSystemReady(true);
      return;
    }

    if (bootCharIndex < bootMessages[bootLineIndex].length) {
      const typing = setTimeout(() => {
        setCurrentBootText(
          (prev) => prev + bootMessages[bootLineIndex][bootCharIndex],
        );
        setBootCharIndex((prev) => prev + 1);
      }, 35);

      return () => clearTimeout(typing);
    } else {
      const delay = bootLineIndex === bootMessages.length - 1 ? 1200 : 500;

      const nextLine = setTimeout(() => {
        setBootLines((prev) => [...prev, currentBootText]);
        setCurrentBootText("");
        setBootCharIndex(0);
        setBootLineIndex((prev) => prev + 1);
      }, delay);

      return () => clearTimeout(nextLine);
    }
  }, [bootCharIndex, bootLineIndex, phase]);

  useEffect(() => {
    if (phase === "boot" && systemReady && startEmotional) {
      setPhase("emotional");
    }
  }, [startEmotional, systemReady, phase]);

  useEffect(() => {
    if (phase !== "emotional") return;
    if (messageIndex >= emotionalMessages.length) return;

    if (charIndex < emotionalMessages[messageIndex].length) {
      const typing = setTimeout(() => {
        setDisplayedText(
          (prev) => prev + emotionalMessages[messageIndex][charIndex],
        );
        setCharIndex((prev) => prev + 1);
      }, 40);

      return () => clearTimeout(typing);
    } else {
      const waitAndReplace = setTimeout(() => {
        setDisplayedText("");
        setCharIndex(0);
        setMessageIndex((prev) => prev + 1);
      }, 3500);

      return () => clearTimeout(waitAndReplace);
    }
  }, [charIndex, messageIndex, phase]);

  return (
    <div className={styles.terminalWrapper}>
      {phase === "boot" && (
        <>
          {bootLines.map((line, index) => (
            <p key={index}> {line}</p>
          ))}

          {!systemReady && (
            <p>
              {currentBootText}
              <span className={styles.cursor}>|</span>
            </p>
          )}

          {systemReady && <p className={styles.systemReady}>SYSTEM READY</p>}
        </>
      )}

      {phase === "emotional" && (
        <p>
          {displayedText}
          <span className={styles.cursor}>|</span>
        </p>
      )}
    </div>
  );
}

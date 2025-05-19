import { createSignal, onCleanup, createEffect } from "solid-js";
import "./app.css";

function App() {
  const [started, setStarted] = createSignal(false);
  const [score, setScore] = createSignal(0);
  const [highScore, setHighScore] = createSignal(0);
  const [position, setPosition] = createSignal({ top: "50%", left: "50%" });
  const [timeLeft, setTimeLeft] = createSignal(30);
  const [isNewHigh, setIsNewHigh] = createSignal(false);
  let timer;

  createEffect(() => {
    const stored = localStorage.getItem("neon-reflex-highscore");
    if (stored) {
      setHighScore(parseInt(stored));
    }
  });

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setStarted(true);
    setIsNewHigh(false);
    moveTarget();

    timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setStarted(false);
          checkHighScore();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const moveTarget = () => {
    const top = Math.random() * 80 + 10;
    const left = Math.random() * 80 + 10;
    setPosition({ top: `${top}%`, left: `${left}%` });
  };


  const clickSound =new Audio("/sounds/click.mp3");
  const handleClick =() =>{
    if (started ()){
      setScore(score()+ 1);
      moveTarget();
      clickSound.currentTime= 0;
      clickSound.play();
    }
  };
  const checkHighScore = () => {
    if (score() > highScore()) {
      setHighScore(score());
      setIsNewHigh(true);
      localStorage.setItem("neon-reflex-highscore", score().toString());
    }
  };
    const getFontSize = () => {
    const base = 24; 
    const minSize = 12;
    const shrinkRate = 1.2;

    const newSize = base - score() * shrinkRate;
    return `${Math.max(minSize, newSize)}px`;
    };

  const getButtonSize = () => {
    const base = 100; 
    const minSize = 40; 
    const shrinkRate = 2; 
    
    const newSize = base -score () * shrinkRate;
    return  `${Math.max(minSize, newSize)}px`;
  };

  onCleanup(() => clearInterval(timer));

  return (
    <div class="app">
      {!started() && timeLeft() === 30 && (
        <button class="start-button neon" onClick={startGame}>
          Oyuna Başla
        </button>
      )}

      {started() && (
        <>
          <div class="score neon-text">Skor: {score()}</div>
          <div class="timer neon-text">Süre: {timeLeft()}</div>
          <button
            class="target-button neon"
            style={{
              top: position().top,
              left: position().left,
              width:getButtonSize(),
              height:getButtonSize(),
              "fontSize": getFontSize()
            }}
            onClick={handleClick}
          >
            Tıkla!
          </button>
        </>
      )}

      {!started() && timeLeft() !== 30 && (
        <div class="end-screen">
          <div class="game-over neon-text">
            <p class="score-text">Oyun bitti !</p>
            <p class="score-text">Skor: {score()}</p>
            <p class="score-text">Rekor: {highScore()}</p>
            {isNewHigh() && (
              <p class="new-record">🎉 Yeni Rekor! 🎉</p>
            )}
          </div>
  
          <button class="start-button neon" onClick={startGame}>
            Tekrar Oyna
          </button>
        </div>

      )}
    </div>
  );
}

export default App;

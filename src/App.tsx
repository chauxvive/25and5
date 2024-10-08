import { useState, useEffect } from 'react';
import './App.css';
import bellSound from './assets/bell.mp3'; // Adjust path to your MP3 file

function CountdownTimer() {
  const [focusTimeLength, setFocusTimeLength] = useState(25 * 60); // Adjustable length
  const [breakTimeLength, setBreakTimeLength] = useState(5 * 60);  // Adjustable length
  const [focusTimeLeft, setFocusTimeLeft] = useState(focusTimeLength);
  const [breakTimeLeft, setBreakTimeLeft] = useState(breakTimeLength);
  const [isFocusRunning, setIsFocusRunning] = useState(false);
  const [isBreakRunning, setIsBreakRunning] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);

  // Focus Timer useEffect
  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;

    if (isFocusRunning && focusTimeLeft > 0) {
      intervalId = setInterval(() => {
        setFocusTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            // When focus time hits zero
            setIsFocusRunning(false);
            setIsBreakRunning(true);
            setSessionCount((prevCount) => prevCount + 1);
            
            // Play sound
            const beep = document.getElementById('beep') as HTMLAudioElement;
            if (beep) {
              beep.currentTime = 0; // Reset the sound to the beginning
              beep.play();
            }
            return 0; // Reset focus time left to 0
          }
          return prevTime - 1; // Decrement time left
        });
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [isFocusRunning, focusTimeLeft]);

  // Break Timer useEffect
  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;

    if (isBreakRunning && breakTimeLeft > 0) {
      intervalId = setInterval(() => {
        setBreakTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            // When break time hits zero
            setIsBreakRunning(false);
            setFocusTimeLeft(focusTimeLength); // Reset focus time
            setIsFocusRunning(true); // Start focus timer

            // Play sound
            const beep = document.getElementById('beep') as HTMLAudioElement;
            if (beep) {
              beep.currentTime = 0; // Reset the sound to the beginning
              beep.play();
            }
            return 0; // Reset break time left to 0
          }
          return prevTime - 1; // Decrement time left
        });
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [isBreakRunning, breakTimeLeft]);

  const toggleTimer = () => {
    if (isFocusRunning || isBreakRunning) {
      setIsFocusRunning(false);
      setIsBreakRunning(false);
    } else {
      setFocusTimeLeft(focusTimeLength);
      setBreakTimeLeft(breakTimeLength);
      setIsFocusRunning(true);
      setIsBreakRunning(false);
    }
  };

  const resetTimers = () => {
    setIsFocusRunning(false);
    setIsBreakRunning(false);
    setFocusTimeLength(25 * 60);
    setBreakTimeLength(5 * 60);
    setFocusTimeLeft(25 * 60); 
    setBreakTimeLeft(5 * 60);
    
    const beep = document.getElementById('beep') as HTMLAudioElement;
    if (beep) {
      beep.pause();
      beep.currentTime = 0; // Reset the sound
    }
  };

  const increaseBreakTime = () => {
    if (!isFocusRunning && !isBreakRunning && breakTimeLength < 60 * 60) {
      setBreakTimeLength((prev) => prev + 60);
    }
  };

  const decreaseBreakTime = () => {
    if (!isFocusRunning && !isBreakRunning && breakTimeLength > 60) {
      setBreakTimeLength((prev) => prev - 60);
    }
  };

  const increaseFocusTime = () => {
    if (!isFocusRunning && !isBreakRunning && focusTimeLength < 60 * 60) {
      setFocusTimeLength((prev) => prev + 60);
    }
  };

  const decreaseFocusTime = () => {
    if (!isFocusRunning && !isBreakRunning && focusTimeLength > 60) {
      setFocusTimeLength((prev) => prev - 60);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <>
      <div>
        <h3>Number of sessions today:</h3>
        <h1>{sessionCount}</h1>
      </div>

      <div id="timer-label">
        {isFocusRunning || (!isFocusRunning && !isBreakRunning) ? "Session" : "Break"}
      </div>

      <div>
        <h3 id="session-label">Focus Time</h3>
        <h1 id="time-left">{formatTime(focusTimeLeft)}</h1>
        {focusTimeLeft === 0 && <h2>Take a break</h2>}
      </div>

      <div>
        <h3 id="break-label">Break Time</h3>
        <h1>{formatTime(breakTimeLeft)}</h1>
        {breakTimeLeft === 0 && <h2>Break Time's up!</h2>}
      </div>

      <div className="focus-controls">
        <button id="session-decrement" onClick={decreaseFocusTime} disabled={isFocusRunning || isBreakRunning}>-</button>
        <span id="session-length">{Math.floor(focusTimeLength / 60)}</span>
        <button id="session-increment" onClick={increaseFocusTime} disabled={isFocusRunning || isBreakRunning}>+</button>
      </div>

      <div className="break-controls">
        <button id="break-decrement" onClick={decreaseBreakTime} disabled={isFocusRunning || isBreakRunning}>-</button>
        <span id="break-length">{Math.floor(breakTimeLength / 60)}</span>
        <button id="break-increment" onClick={increaseBreakTime} disabled={isFocusRunning || isBreakRunning}>+</button>
      </div>

      <div id="start_stop" className="controls">
        <button onClick={toggleTimer}>
          {isFocusRunning || isBreakRunning ? 'Stop' : 'Start'}
        </button>
        <button id="reset" onClick={resetTimers}>Reset</button>
      </div>

      {/* Audio Element */}
      <audio id="beep" src={bellSound} />
    </>
  );
}

export default CountdownTimer;

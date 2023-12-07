document.addEventListener('DOMContentLoaded', function () {
  // Constants
  const breakDecrement = document.getElementById('break-decrement');
  const breakIncrement = document.getElementById('break-increment');
  const sessionDecrement = document.getElementById('session-decrement');
  const sessionIncrement = document.getElementById('session-increment');
  const breakLengthElement = document.getElementById('break-length');
  const sessionLengthElement = document.getElementById('session-length');
  const timerLabelElement = document.getElementById('timer-label');
  const timeLeftElement = document.getElementById('time-left');
  const startStopButton = document.getElementById('start_stop');
  const resetButton = document.getElementById('reset');
  const beep = document.getElementById('beep');

  // Initial values
  let breakLength = 5;
  let sessionLength = 25;
  let isSession = true;
  let isRunning = false;
  let timer;
  let secondsLeft = sessionLength * 60; // This is the variable that will store the remaining seconds

  // Functions
  const updateDisplay = () => {
    breakLengthElement.textContent = breakLength;
    sessionLengthElement.textContent = sessionLength;
    timeLeftElement.textContent = formatTime(secondsLeft); // Use the secondsLeft variable for the display
    timerLabelElement.textContent = isSession ? 'Session' : 'Break';
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    isRunning = !isRunning;
    if (isRunning) {
      timer = setInterval(() => {
        if (secondsLeft === 0) { // Check if the secondsLeft variable is zero
          clearInterval(timer);
          beep.play();
          isSession = !isSession; // Switch between session and break
          secondsLeft = isSession ? sessionLength * 60 : breakLength * 60; // Reset the secondsLeft variable based on the current mode
          updateDisplay();
          toggleTimer(); // Restart the timer
        } else {
          secondsLeft--; // Decrement the secondsLeft variable by one
          updateDisplay();
        }
      }, 1000);
    } else {
      clearInterval(timer);
    }
  };

  const reset = () => {
    clearInterval(timer);
    isRunning = false;
    isSession = true;
    sessionLength = 25;
    breakLength = 5;
    secondsLeft = sessionLength * 60; // Reset the secondsLeft variable
    updateDisplay();
    beep.pause();
    beep.currentTime = 0;
  };

  // Event listeners
  breakDecrement.addEventListener('click', () => {
    if (breakLength > 1) {
      breakLength--;
      if (!isSession) { // If the current mode is break, update the secondsLeft variable
        secondsLeft = breakLength * 60;
      }
      updateDisplay();
    }
  });

  breakIncrement.addEventListener('click', () => {
    if (breakLength < 60) {
      breakLength++;
      if (!isSession) { // If the current mode is break, update the secondsLeft variable
        secondsLeft = breakLength * 60;
      }
      updateDisplay();
    }
  });

  sessionDecrement.addEventListener('click', () => {
    if (sessionLength > 1) {
      sessionLength--;
      if (isSession) { // If the current mode is session, update the secondsLeft variable
        secondsLeft = sessionLength * 60;
      }
      updateDisplay();
    }
  });

  sessionIncrement.addEventListener('click', () => {
    if (sessionLength < 60) {
      sessionLength++;
      if (isSession) { // If the current mode is session, update the secondsLeft variable
        secondsLeft = sessionLength * 60;
      }
      updateDisplay();
    }
  });

  startStopButton.addEventListener('click', toggleTimer);

  resetButton.addEventListener('click', reset);


  beep.addEventListener('loadeddata', function () {
    if (beep.duration < 1) {
      alert('Please choose an audio file that is 1 second or longer.');
    }
  });

  // Initial display update
  updateDisplay();
});

const timerDisplay = {
    hours: document.getElementById('hours'),
    minutes: document.getElementById('minutes'),
    seconds: document.getElementById('seconds'),
    milliseconds: document.getElementById('milliseconds'),
    sign: document.getElementById('sign'),
    container: document.getElementById('time-container'),
}

function updateTimerDisplay() {
    const value = timer.value;
    if(value < 0) {
        show(timerDisplay.sign);
    } else {
        hide(timerDisplay.sign);
    }
    const hours = timer.hours();
    const minutes =  timer.minutes();
    const seconds = timer.seconds();
    const milliseconds = timer.milliseconds();

    if(timerDisplay?.hours) {
        timerDisplay.hours.textContent = ( hours < 10 ? '0' : '' ) + hours;
    }
    if(timerDisplay?.minutes) {
        timerDisplay.minutes.textContent = ( minutes < 10 ? '0' : '' ) + minutes;
    }
    if(timerDisplay?.seconds) {
        timerDisplay.seconds.textContent = ( seconds < 10 ? '0' : '' ) + seconds;
    }
    if(timerDisplay?.milliseconds) {
        timerDisplay.milliseconds.textContent = ( milliseconds < 100 ? '0' : '' ) + ( milliseconds < 10 ? '0' : '') + milliseconds ;
    }
}

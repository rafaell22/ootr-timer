//@ts-check
import Timer from './classes/Timer.js';
import TIMER_STATES from './TIMER_STATES.js';
import { hide, show } from './domUtils.js';
import { getStartTime } from './settings.js';

const timer = new Timer();
const timerDisplay = {
    hours: document.getElementById('hours'),
    minutes: document.getElementById('minutes'),
    seconds: document.getElementById('seconds'),
    milliseconds: document.getElementById('milliseconds'),
}

const timerButtons = {
    start : document.getElementById('btnStart'),
    pause : document.getElementById('btnPause'),
    reset : document.getElementById('btnReset'),
}

/**
 * @param {number} value
 */
const updateTimerDisplay = function(value) {
    const minutes =  Math.floor(Math.abs(value) / 1000 / 60) % 60;
    const seconds = Math.floor(Math.abs(value) / 1000) % 60;
    const milliseconds = Math.floor(Math.abs(value) % 1000);

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

let animationFrame;
/**
 * @param {number} timestamp
 */
const update = (timestamp) => {
    timer.update(timestamp);
    updateTimerDisplay(timer.value);
    animationFrame = requestAnimationFrame(update);
};

/**
 * @param {number} timerStartValue
 */
function startTimer(timerStartValue) {
    if(timer.is(TIMER_STATES.PAUSED)) {
        timer['resume']();
    } else {
        timer['start']();
        timer.value = timerStartValue;
    }

    animationFrame = requestAnimationFrame(update);

    hide(timerButtons.start);
    hide(timerButtons.reset);
    show(timerButtons.pause);
    hide(timerButtons.racetime);
}

function pauseTimer() {
    timer['pause']();

    cancelAnimationFrame(animationFrame);
    show(timerButtons.start);
    show(timerButtons.reset);
    hide(timerButtons.pause);
}

function resetTimer() {
    timer['reset']();
    updateTimerDisplay(0);

    show(timerButtons.start);
    hide(timerButtons.reset);
    hide(timerButtons.pause);
    show(timerButtons.racetime);
}

timerButtons.start?.addEventListener('click', () => {
    startTimer(getStartTime());
});

timerButtons.pause?.addEventListener('click', pauseTimer);

timerButtons.reset?.addEventListener('click', resetTimer);

//@ts-check
import Timer from './classes/Timer.js';
import TIMER_STATES from './TIMER_STATES.js';
import { hide, show } from './domUtils.js';

const timer = new Timer();
const timerDisplay = {
    hours: document.getElementById('hours'),
    minutes: document.getElementById('minutes'),
    seconds: document.getElementById('seconds'),
    milliseconds: document.getElementById('milliseconds'),
    sign: document.getElementById('sign'),
    container: document.getElementById('time-container'),
}

const timerButtons = {
    start : document.getElementById('btnStart'),
    pause : document.getElementById('btnPause'),
    reset : document.getElementById('btnReset'),
}

function updateTimerDisplay() {
    const value = timer.value;
    if(value < 0) {
        show(timerDisplay.sign);
    } else {
        hide(timerDisplay.sign);
    }
    const hours = Math.floor(Math.abs(value) / 1000 / 60 / 60) % 60;
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
    updateTimerDisplay();
    animationFrame = requestAnimationFrame(update);
};

export function startTimer() {
    if(timer.is(TIMER_STATES.PAUSED)) {
        timer['resume']();
    } else {
        timer['start']();
    }

    animationFrame = requestAnimationFrame(update);

    if(!timerButtons.start?.classList.contains('hidden')) {
        hide(timerButtons.start);
        hide(timerButtons.reset);
        show(timerButtons.pause);
        hide(timerButtons.racetime);
    }
}

function pauseTimer() {
    timer['pause']();

    cancelAnimationFrame(animationFrame);

    if(!timerButtons.pause.classList.contains('hidden')) {
        show(timerButtons.start);
        show(timerButtons.reset);
        hide(timerButtons.pause);
    }
}

function resetTimer() {
    timer['reset']();
    updateTimerDisplay();

    if(!timerButtons.reset?.classList.contains('hidden')) {
        show(timerButtons.start);
        hide(timerButtons.reset);
        hide(timerButtons.pause);
        show(timerButtons.racetime);
    }
}

/**
 * @param {number} timerValue
 */
export function setTimer(timerValue) {
    timer.value = timerValue;
    updateTimerDisplay()
}

/*
 * @param {number|null|undefined} startTimerValue
 */
export function initTimerEvents({ start }) {
    if(start) {
        setTimer(start);
    }

    timerButtons.start?.addEventListener('click', startTimer);

    timerButtons.pause?.addEventListener('click', pauseTimer);

    timerButtons.reset?.addEventListener('click', resetTimer);

    timerDisplay.container?.addEventListener('mouseup', checkForLongClick);
    timerDisplay.container?.addEventListener('mousedown', checkForLongClick);
    timerDisplay.container?.addEventListener('touchstart', checkForLongClick);
    timerDisplay.container?.addEventListener('touchend', checkForLongClick);

    timerDisplay.container?.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    })
}

let timeOfClick = 0;
const longClickThreshold = 1000;
function checkForLongClick(e) {
    console.log('event: ', e.target);
    e.stopPropagation();
    e.stopImmediatePropagation();
    e.preventDefault();
    if(timeOfClick === 0) {
        timeOfClick = performance.now();;
        return;
    }

    const timeOfRelease = performance.now();
    console.log('timeOfClick: ', timeOfClick)
    console.log('timeOfRelease: ', timeOfRelease)
    console.log(timeOfRelease - timeOfClick)
    console.log(longClickThreshold)
    console.log((timeOfRelease - timeOfClick) > longClickThreshold)
    if((timeOfRelease - timeOfClick) > longClickThreshold) {
        resetTimer();
    } else {
        console.log(timer.state)
        console.log(timer.can('start'))
        console.log(timer.can('pause'))
        console.log(timer.can('resume'))
        if(
            timer.can('start') ||
            timer.can('resume')
        ) {
            startTimer();
            return;
        }

        if(
            timer.can('pause')
        ) {
            pauseTimer();
            return;
        }
    }
    timeOfClick = 0;
}

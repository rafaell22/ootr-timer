//@ts-check
import Timer from './classes/Timer.js';
import TIMER_STATES from './TIMER_STATES.js';
import { hide, show } from './domUtils.js';

const timer = new Timer();

const timerButtons = {
    start : document.getElementById('btnStart'),
    pause : document.getElementById('btnPause'),
    reset : document.getElementById('btnReset'),
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

    if(!timerButtons.pause?.classList.contains('hidden')) {
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

let isMouseDown = true;
let wasLastActionReset = false;
let longClickTimer;
const LONG_CLICK_THRESHOLD = 1000;
function checkForLongClick(e) {
    e.stopPropagation();
    e.stopImmediatePropagation();
    e.preventDefault();

    if(wasLastActionReset) {
        wasLastActionReset = false;
        return;
    }

    if(isMouseDown) {
        longClickTimer = setTimeout(() => {
            resetTimer();
            isMouseDown = true;
            wasLastActionReset = true;
        }, LONG_CLICK_THRESHOLD);
        isMouseDown = false;
        return;
    }

    clearTimeout(longClickTimer);

    if(
        timer.can('start') ||
        timer.can('resume')
    ) {
        startTimer();
    } else if(
        timer.can('pause')
    ) {
        pauseTimer();
    }
    isMouseDown = true;
}

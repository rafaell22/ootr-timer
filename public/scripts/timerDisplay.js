//@ts-check
import { hide, show } from './domUtils.js';

const timerDisplay = {
    hours: document.getElementById('hours'),
    minutes: document.getElementById('minutes'),
    seconds: document.getElementById('seconds'),
    milliseconds: document.getElementById('milliseconds'),
    sign: document.getElementById('sign'),
    container: document.getElementById('time-container'),
}

let timerRef;
/*
 * @param {object} options
 * @param {Timer} options.timer
 */
export function initTimerDisplay({ timer }) {
    timerRef = timer;

    timerDisplay.container?.addEventListener('mouseup', startOrPauseTimer);
    timerDisplay.container?.addEventListener('mousedown', checkForLongClick);
    timerDisplay.container?.addEventListener('touchstart', startOrPauseTimer);
    timerDisplay.container?.addEventListener('touchend', checkForLongClick);

    timerDisplay.container?.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });

    timerRef.subscribe('update', updateTimerDisplay);
    timerRef.subscribe('reset', updateTimerDisplay);
}

function updateTimerDisplay() {
    const value = timerRef.value;
    if(value < 0) {
        show(timerDisplay.sign);
    } else {
        hide(timerDisplay.sign);
    }
    const hours = timerRef.hours();
    const minutes =  timerRef.minutes();
    const seconds = timerRef.seconds();
    const milliseconds = timerRef.milliseconds();

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

let longClickTimer;
let wasLastActionReset = false;
function startOrPauseTimer(e) {
    e.stopPropagation();
    e.stopImmediatePropagation();
    e.preventDefault( )

    if(wasLastActionReset) {
        wasLastActionReset = false;
        return;
    };

    clearTimeout(longClickTimer);
    if(
        timerRef.can('start')
    ) {
        timerRef.start();
    } else if(
        timerRef.can('resume')
    ) {
        timerRef.resume()
    } else if(
        timerRef.can('pause')
    ) {
        timerRef.pause();
    }
}

const LONG_CLICK_THRESHOLD = 1000;
function checkForLongClick(e) {
    e.stopPropagation();
    e.stopImmediatePropagation();
    e.preventDefault();

    if(wasLastActionReset) {
        wasLastActionReset = false;
        return;
    }

    longClickTimer = setTimeout(() => {
        timerRef.reset();
        wasLastActionReset = true;
    }, LONG_CLICK_THRESHOLD);
    return;
}

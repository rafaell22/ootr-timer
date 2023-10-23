//@ts-check
import { hide, show } from './domUtils.js';

const timerButtons = {
    start : document.getElementById('btnStart'),
    pause : document.getElementById('btnPause'),
    reset : document.getElementById('btnReset'),
}

let timerRef;
/*
 * @param {Timer} timer
 */
export function initTimerButtons({ timer }) {
    timerRef = timer;

    timerButtons.start?.addEventListener('click', startTimer);

    timerButtons.pause?.addEventListener('click', pauseTimer);

    timerButtons.reset?.addEventListener('click', resetTimer);

    timerRef.subscribe('start', () => {
        if(!timerButtons.start?.classList.contains('hidden')) {
            hide(timerButtons.start);
            hide(timerButtons.reset);
            show(timerButtons.pause);
            hide(timerButtons.racetime);
        }
    });
    timerRef.subscribe('pause', () => {
        if(!timerButtons.pause?.classList.contains('hidden')) {
            show(timerButtons.start);
            show(timerButtons.reset);
            hide(timerButtons.pause);
        }
    });
    timerRef.subscribe('resume', () => {
        if(!timerButtons.start?.classList.contains('hidden')) {
            hide(timerButtons.start);
            hide(timerButtons.reset);
            show(timerButtons.pause);
            hide(timerButtons.racetime);
        }
    });
    timerRef.subscribe('reset', () => {
        if(!timerButtons.reset?.classList.contains('hidden')) {
            show(timerButtons.start);
            hide(timerButtons.reset);
            hide(timerButtons.pause);
            show(timerButtons.racetime);
        }
    });
}

export function startTimer() {
    if(timerRef.can('resume')) {
        timerRef['resume']();
    } else {
        timerRef['start']();
    }
}

function pauseTimer() {
    timerRef['pause']();
}

function resetTimer() {
    timerRef['reset']();
}


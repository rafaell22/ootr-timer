// @ts-check
import { show, hide } from './domUtils.js';
import { setTimer } from './timer.js';

const timerSettings = {
    dialog: document.getElementById('settings-dialog'),
    customStartTime : document.getElementById('ckCustomStartTime'),
    timerStartValue : document.getElementById('txtTimerStart'),
}

const dialogOverlay = document.getElementById('dialog-overlay');
dialogOverlay?.addEventListener('click', function closeRacetimeDialog() {
    hide(dialogOverlay);
    hide(timerSettings.dialog);
});

export function initSettings() {
    timerSettings.customStartTime?.addEventListener('change', function toggleCustomStartTimeInput() {
        if(timerSettings.customStartTime?.['checked']) {
            show(timerSettings.timerStartValue?.parentElement)
        } else {
            hide(timerSettings.timerStartValue?.parentElement);
        }
    });
}


export function getStartTime() {
    const startValue = +(timerSettings.timerStartValue?.['value'] ?? 0);
    if(isNaN(startValue)) {
       return 0;
    }

    return startValue
}

export function getStartTimeInMilliseconds() {
    return getStartTime() * 1000;
}

/**
 * @param {number} startTime - start time in milliseconds
 */
export function setStartTime(startTime) {
    if(timerSettings.timerStartValue) {
        timerSettings.timerStartValue['value'] = startTime / 1000;
        show(timerSettings.timerStartValue?.parentElement);
    }
    if(timerSettings.customStartTime) {
        timerSettings.customStartTime['checked'] = true;
    }
    
    setTimer(startTime);
}

export function showSettings() {
    show(dialogOverlay);
    show(timerSettings.dialog);
}


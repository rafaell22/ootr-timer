// @ts-check
import { show, hide } from './domUtils.js';

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

timerSettings.customStartTime?.addEventListener('change', function toggleCustomStartTimeInput() {
    console.log('here?')
    if(timerSettings.customStartTime?.['checked']) {
        show(timerSettings.timerStartValue?.parentElement)
    } else {
        hide(timerSettings.timerStartValue?.parentElement);
    }
});

export function getStartTime() {
    const startValue = +(timerSettings.timerStartValue?.['value'] ?? 0);
    if(isNaN(startValue)) {
       return 0;
    }

    return startValue
}

export function showSettings() {
    show(dialogOverlay);
    show(timerSettings.dialog);
}


// @ts-check
import { show, hide } from './domUtils.js';
import { setPageColors } from './pageColors.js';
import Timer from './classes/Timer.js';
import { toggleAudio } from './audio.js';

const timerSettings = {
    dialog: document.getElementById('settings-dialog'),
    customStartTime : document.getElementById('ckCustomStartTime'),
    timerStartValue : document.getElementById('txtTimerStart'),
};

const audioSettings = {
    countdownAudioEnabled: document.getElementById('ckCountDownAudioEnabled'),
}

const colorSettings = {
    primary: document.getElementById('primaryColor'),
    secondary: document.getElementById('secondaryColor'),
    highlights: document.getElementById('highlightsColor'),
    shadows: document.getElementById('shadowsColor'),
    background: document.getElementById('backgroundColor'),
};

const dialogOverlay = document.getElementById('dialog-overlay');
dialogOverlay?.addEventListener('click', function closeRacetimeDialog() {
    hide(dialogOverlay);
    hide(timerSettings.dialog);
});

let timerRef;
/**
 * @param {object} options
 * @param {Timer} options.timer
 */
export function initSettings({ timer }) {
    timerRef = timer;
    timerSettings.customStartTime?.addEventListener('change', function toggleCustomStartTimeInput() {
        if(timerSettings.customStartTime?.['checked']) {
            show(timerSettings.timerStartValue?.parentElement)
        } else {
            hide(timerSettings.timerStartValue?.parentElement);
        }
    });

    timerSettings.timerStartValue?.addEventListener('change', function() {
        const startTime = ( timerSettings.timerStartValue?.['value'] ?? 0 ) * 1000;
        setStartTime(startTime);
    });

    colorSettings.primary?.addEventListener('change', function changePrimaryColor() {
        setPageColors({
            primary: colorSettings.primary?.['value'],
            secondary: colorSettings.secondary?.['value'],
            highlights: colorSettings.highlights?.['value'],
            shadows: colorSettings.shadows?.['value'],
            background: colorSettings.background?.['value'],
        });
    });

    colorSettings.primary?.addEventListener('change', changeColor);
    colorSettings.secondary?.addEventListener('change', changeColor);
    colorSettings.highlights?.addEventListener('change', changeColor);
    colorSettings.shadows?.addEventListener('change', changeColor);
    colorSettings.background?.addEventListener('change', changeColor);

    audioSettings.countdownAudioEnabled?.addEventListener('change', toggleCountdownAudio)
}

function toggleCountdownAudio() {
    toggleAudio();
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

    timerRef.setTimer(startTime);
}

export function showSettings() {
    show(dialogOverlay);
    show(timerSettings.dialog);
}

const DEFAULT_COLORS = {
    primary: '#0d9263',
    secondary: '#d4ce46',
    highlights: '#4aba91',
    shadows: '#0e5135',
    background: '#494b4b',
};

/**
 * @param {object} colors
 * @param {string|null} colors.primary
 * @param {string|null} colors.secondary
 * @param {string|null} colors.highlights
 * @param {string|null} colors.shadows
 * @param {string|null} colors.background
 */
export function updateColorSettings(colors) {
    const primaryColor = colors.primary ?? DEFAULT_COLORS.primary;
    const secondaryColor = colors.secondary ?? DEFAULT_COLORS.secondary;
    const highlightsColor = colors.highlights ?? DEFAULT_COLORS.highlights;
    const shadowsColor = colors.shadows ?? DEFAULT_COLORS.shadows;
    const backgroundColor = colors.background ?? DEFAULT_COLORS.background;

    if(colorSettings.primary) {
        colorSettings.primary['value'] = primaryColor;
    }
    if(colorSettings.secondary) {
        colorSettings.secondary['value'] = secondaryColor;
    }
    if(colorSettings.highlights) {
        colorSettings.highlights['value'] = highlightsColor;
    }
    if(colorSettings.shadows) {
        colorSettings.shadows['value'] = shadowsColor;
    }
    if(colorSettings.background) {
        colorSettings.background['value'] = backgroundColor;
    }

    setPageColors({
        primary: primaryColor,
        secondary: secondaryColor,
        highlights: highlightsColor,
        shadows: shadowsColor,
        background: backgroundColor,
    });
}

function changeColor() {
    updateColorSettings({
        primary: colorSettings.primary?.['value'],
        secondary: colorSettings.secondary?.['value'],
        highlights: colorSettings.highlights?.['value'],
        shadows: colorSettings.shadows?.['value'],
        background: colorSettings.background?.['value'],
    });
}



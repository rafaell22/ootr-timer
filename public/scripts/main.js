// @ts-check
import Timer from './classes/Timer.js';
import TIMER_STATES from './TIMER_STATES.js';
import Race from './classes/Race.js';
import tinyduration from './tinyduration.js';

console.log(tinyduration)

const elReferences = {};
elReferences.timerDisplay = {
    hours : document.getElementById('hours'),
    minutes : document.getElementById('minutes'),
    seconds : document.getElementById('seconds'),
    milliseconds : document.getElementById('milliseconds'),
};

elReferences.timerButtons = {
    start : document.getElementById('btnStart'),
    pause : document.getElementById('btnPause'),
    reset : document.getElementById('btnReset'),
    racetime : document.getElementById('btnJoin'),
}

elReferences.timerSettings = {
    customStartTime : document.getElementById('ckCustomStartTime'),
    timerStartValue : document.getElementById('txtTimerStart'),
}

elReferences.audio = document.querySelector('audio');
elReferences.dialogOverlay = document.getElementById('dialog-overlay');
elReferences.loader = document.getElementById('loader');
elReferences.racetime = {
    dialog: document.getElementById('racetimeDialog'),
    selectRace: document.getElementById('selectRace'),
    selectCategory: document.getElementById('selectCategory'),
    selectButton: document.getElementById('btnSelectRace'),
}

let countdownAudio;
let animationFrame;
const timer = new Timer();

/**
 * @param {HTMLElement} el
 */
const hide = function(el) {
    el.classList.add('hidden');
}

/**
 * @param {HTMLElement} el
 */
const show = function(el) {
    el.classList.remove('hidden');
}

/**
 * @param {number} value
 */
const updateTimerDisplay = function(value) {
    const minutes =  Math.floor(Math.abs(value) / 1000 / 60) % 60;
    const seconds = Math.floor(Math.abs(value) / 1000) % 60;
    const milliseconds = Math.floor(Math.abs(value) % 1000);

    elReferences.timerDisplay.minutes.textContent = ( minutes < 10 ? '0' : '' ) + minutes;
    elReferences.timerDisplay.seconds.textContent = ( seconds < 10 ? '0' : '' ) + seconds;
    elReferences.timerDisplay.milliseconds.textContent = ( milliseconds < 100 ? '0' : '' ) + ( milliseconds < 10 ? '0' : '') + milliseconds ;
}

/**
 * @param {number} timestamp
 */
const update = (timestamp) => {
    timer.update(timestamp);
    updateTimerDisplay(timer.value);
    animationFrame = requestAnimationFrame(update);
};

elReferences.timerButtons.start?.addEventListener('click', () => {
    if(timer.is(TIMER_STATES.PAUSED)) {
        timer['resume']();
    } else {
        timer['start']();
        if(
            elReferences.timerSettings.customTimerStart?.['checked'] &&
            elReferences.timerSettings.timerStartValue?.['value'] !== ''
        ) {
            timer.value = parseInt(elReferences.timerSettings.timerStartValue['value'], 10) * 1000;
        }
    }

    animationFrame = requestAnimationFrame(update);

    hide(elReferences.timerButtons.start);
    hide(elReferences.timerButtons.reset);
    show(elReferences.timerButtons.pause);
    hide(elReferences.timerButtons.racetime);
});

elReferences.timerButtons.pause?.addEventListener('click', () => {
    timer['pause']();

    cancelAnimationFrame(animationFrame);
    show(elReferences.timerButtons.start);
    show(elReferences.timerButtons.reset);
    hide(elReferences.timerButtons.pause);
});

elReferences.timerButtons.reset?.addEventListener('click', () => {
    timer['reset']();
    updateTimerDisplay(0);

    show(elReferences.timerButtons.start);
    hide(elReferences.timerButtons.reset);
    hide(elReferences.timerButtons.pause);
    show(elReferences.timerButtons.racetime);
});

elReferences.dialogOverlay.addEventListener('click', () => {
    console.log('overlay!')
    console.log(elReferences.dialogOverlay);
    hide(elReferences.racetime.dialog);
    hide(elReferences.dialogOverlay);
});

let races;
let categories;
elReferences.timerButtons.racetime?.addEventListener('click', async () => {
    show(elReferences.loader);
    try {
        categories = await Race.loadCategories();
        categories.sort((a, b) => {
            return a.name.localeCompare(b.name);            
        })

        elReferences.racetime.selectCategory.innerHTML = '';
        for(const category of categories) {
            const option = document.createElement('option');
            option.value = category.slug;
            option.textContent = category.name;
            elReferences.racetime.selectCategory.appendChild(option);
        }

        elReferences.racetime.selectCategory.onchange = async (event) => {
            show(elReferences.loader);
            const category = event.target['value'];
            try {
                races = await Race.loadRacesByCategory(category);
                console.log('races: ', races);
                elReferences.racetime.selectRace.innerHTML = '';
                for(const race of races) {
                    const option = document.createElement('option');
                    option.value = race.name;
                    option.textContent = race.info;
                    elReferences.racetime.selectRace.appendChild(option);
                }
                show(elReferences.racetime.selectRace);
                show(elReferences.racetime.selectButton);
            } catch(errorGettingRacesList) {
                console.log('ERROR');
                console.log(errorGettingRacesList);
            } finally {
                hide(elReferences.loader);
            }
        }

        show(elReferences.dialogOverlay);
        show(elReferences.racetime.dialog);
        show(elReferences.racetime.selectCategory);
    } catch(errorGettingRacesList) {
        console.log('ERROR');
        console.log(errorGettingRacesList.stack);
    } finally {
        hide(elReferences.loader);
    }
});

elReferences.timerSettings.customTimerStart?.addEventListener('change', () => {
    if(elReferences.timerSettings.customTimerStart['checked']) {
        elReferences.timerSettings.timerStartValue?.parentElement?.classList.remove('hidden');
    } else {
        elReferences.timerSettings.timerStartValue.parentElement.classList.add('hidden');
    }
});

elReferences.racetime.selectButton?.addEventListener('click', async () => {
    const raceSlug = elReferences.racetime.selectRace['value'];
    try {
        const raceDetailsResult = await Race.loadRaceDetails(raceSlug);
        console.log('raceDetailsResult: ', raceDetailsResult);
    } catch(errorGettingRacesDetails) {

    }
})

/*
 *const start = function() {
 *    if(isCountdown) {
 *      if(!countdownAudio) {
 *        const AudioContext = window.AudioContext || window.webkitAudioContext;
 *        const audioContext = new AudioContext();
 *        const track = audioContext.createMediaElementSource(elAudio);
 *                    track.connect(audioContext.destination);
 *                  }
 *                }
 *
 *                elButtonStart.classList.add('hidden');
 *                elButtonPause.classList.remove('hidden');
 *                elButtonReset.classList.remove('hidden');
 *
 *                animationFrame = requestAnimationFrame(step);
 *            };
 *
 *            elButtonStart.addEventListener('click', start);
 *            elButtonPause.addEventListener('click', pause);
 *
 */

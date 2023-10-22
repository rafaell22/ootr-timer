// @ts-check
import Timer from './classes/Timer.js';

import { initSettings, updateColorSettings } from './settings.js';
import { initTimerEvents } from './timer.js';
import { initRacetimeEvents } from './racetime.js';
import { initFooter } from './footer.js'
import { setViewMode } from './viewMode.js';

const timer = new Timer();

const urlSearchParamsAsText = window.location.search;
const urlSearchParams = new URLSearchParams(urlSearchParamsAsText);

updateColorSettings({
    primary: urlSearchParams.get('primary'),
    secondary: urlSearchParams.get('secondary'),
    highlights: urlSearchParams.get('highlights'),
    shadows: urlSearchParams.get('shadows'),
    background: urlSearchParams.get('background'),
});
initSettings();
initTimerEvents({
    start: urlSearchParams.get('start'),
});
initRacetimeEvents({
    category: urlSearchParams.get('category'),
    race: urlSearchParams.get('race'),
});
initFooter();

setViewMode(urlSearchParams.get('bare') === 'true' ? true : false);

const elReferences = {};
elReferences.audio = document.querySelector('audio');



let countdownAudio;

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

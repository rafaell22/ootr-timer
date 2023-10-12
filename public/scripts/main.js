// @ts-check
import Timer from './classes/Timer.js';
import TIMER_STATES from './TIMER_STATES.js';

const elMinutes = document.getElementById('minutes');
const elSeconds = document.getElementById('seconds');
const elMilli = document.getElementById('milliseconds');

const btnStart = document.getElementById('btnStart');
const btnPause = document.getElementById('btnPause');
const btnReset = document.getElementById('btnReset');
const btnJoin = document.getElementById('btnJoin');

const elAudio = document.querySelector('audio');

const ckCustomStartTime = document.getElementById('ckCustomStartTime');
const inTimerStart = document.getElementById('txtTimerStart');

let countdownAudio;
let animationFrame;
const timer = new Timer();

/**
 * @param {number} value
 */
const updateTimerDisplay = function(value) {
    const minutes =  Math.floor(Math.abs(value) / 1000 / 60) % 60;
    const seconds = Math.floor(Math.abs(value) / 1000) % 60;
    const milliseconds = Math.floor(Math.abs(value) % 1000);

    elMinutes.textContent = ( minutes < 10 ? '0' : '' ) + minutes;
    elSeconds.textContent = ( seconds < 10 ? '0' : '' ) + seconds;
    elMilli.textContent = ( milliseconds < 100 ? '0' : '' ) + ( milliseconds < 10 ? '0' : '') + milliseconds ;
}

/**
 * @param {number} timestamp
 */
const update = (timestamp) => {
    timer.update(timestamp);
    updateTimerDisplay(timer.value);
    animationFrame = requestAnimationFrame(update);
};

btnStart?.addEventListener('click', () => {
    if(timer.is(TIMER_STATES.PAUSED)) {
        timer['resume']();
    } else {
        timer['start']();
        if(
            ckCustomStartTime?.checked &&
            inTimerStart?.value !== ''
        ) {
            timer.value = parseInt(inTimerStart.value, 10) * 1000;
        }
    }

    animationFrame = requestAnimationFrame(update);

    btnStart?.classList.add('hidden');
    btnReset?.classList.add('hidden');
    btnPause?.classList.remove('hidden');
    btnJoin?.classList.add('hidden');
});

btnPause?.addEventListener('click', () => {
    timer['pause']();

    cancelAnimationFrame(animationFrame);
    btnStart?.classList.remove('hidden');
    btnReset?.classList.remove('hidden');
    btnPause?.classList.add('hidden');
});

btnReset?.addEventListener('click', () => {
    timer['reset']();
    updateTimerDisplay(0);

    btnStart?.classList.remove('hidden');
    btnReset?.classList.add('hidden');
    btnPause?.classList.add('hidden');
    btnJoin?.classList.remove('hidden');
});

btnJoin?.addEventListener('click', async () => {
    console.log('Racetime!')
    let races;
    try {
        console.log('before')
        races = await fetch('http://localhost:8080/ootr', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        console.log('after')
        console.log('races: ', await races.json())
    } catch(errorGettingRacesList) {
        console.log('ERROR');
        console.log(errorGettingRacesList.stack);
    }
});

ckCustomStartTime?.addEventListener('change', () => {
    if(ckCustomStartTime.checked) {
        inTimerStart?.parentElement?.classList.remove('hidden');
    } else {
        inTimerStart.parentElement.classList.add('hidden');
    }
});

/*
 *(async function() {
 *  const result = await fetch('https://racetime.gg/races/data', {
 *      // mode: 'no-cors',
 *      method: 'GET',
 *      headers: {
 *          'Content-Type': 'application/json',
 *      }
 *  });
 *    console.log(result)
 *  const jsonResult = await result.json();
 *  console.log('races: ', jsonResult);
 *})()
 */

/**
function reqListener() {
    console.log('loaded')
  console.log(this.responseText);
}

const req = new XMLHttpRequest();
req.addEventListener("load", reqListener);
req.addEventListener('error', (error) => {
    console.log('error: ', Object.keys(error.loaded));
    console.log(req.status)
})
req.open("GET", 'https://racetime.gg/races/data');
req.send();
console.log(req)
*/

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

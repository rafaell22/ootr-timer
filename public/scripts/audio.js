// @ts-check

/*
 * *
 * *
 *const elReferences = {};
 *elReferences.audio = document.querySelector('audio');
 *
 *
 */

let countdownAudio;
let isAudioEnabled = false;
let timerRef;
const elAudio = document.querySelector('audio');

export function toggleAudio() {
    isAudioEnabled = !isAudioEnabled;
}

export function initAudio(timer) {
    const AudioContext = window.AudioContext;
    const audioContext = new AudioContext();
    const track = audioContext.createMediaElementSource(elAudio);
    track.connect(audioContext.destination);

    timerRef = timer;

    timerRef.subscribe('start', () => {
        console.log('isAudioEnabled', isAudioEnabled);
        console.log('timerRef.value', timerRef.value);
        if(
            isAudioEnabled &&
            timerRef.value < 0
        ) {
            const subscriptionId = timerRef.subscribe('update', () => {
                if (
                    timerRef.value > -3000
                ) {
                    elAudio.play();
                }

                timerRef.unsubscribe(subscriptionId);
            });
            console.log(subscriptionId);
        }
    });
}

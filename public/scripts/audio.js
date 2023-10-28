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

    const startSubscriptionId = timerRef.subscribe('start', () => {
        if(
            isAudioEnabled &&
            timerRef.value < 0
        ) {
            const updateSubscriptionId = timerRef.subscribe('update', () => {
                if (
                    timerRef.value > -3000
                ) {
                    elAudio.play();
                    timerRef.unsubscribe('update', updateSubscriptionId);
                }

                timerRef.unsubscribe('start', startSubscriptionId);
            });
        }
    });
}

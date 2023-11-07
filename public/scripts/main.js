// @ts-check
import Timer from './classes/Timer.js';

import { initSettings, updateColorSettings } from './settings.js';
import { initTimerButtons } from './timerButtons.js';
import { initTimerDisplay } from './timerDisplay.js';
import { initRacetimeEvents } from './racetime.js';
import { initFooter } from './footer.js'
import { initResizeEvent } from './resize.js';
import { setViewMode } from './viewMode.js';
import { initAudio } from './audio.js';

const timer = new Timer();

const urlSearchParamsAsText = window.location.search;
const urlSearchParams = new URLSearchParams(urlSearchParamsAsText);

initSettings({ timer });
initTimerDisplay({ timer });
initTimerButtons({ timer });
initFooter();
initRacetimeEvents({
    category: urlSearchParams.get('category'),
    race: urlSearchParams.get('race'),
    timer,
});
initResizeEvent();


updateColorSettings({
    primary: urlSearchParams.get('primary'),
    secondary: urlSearchParams.get('secondary'),
    highlights: urlSearchParams.get('highlights'),
    shadows: urlSearchParams.get('shadows'),
    background: urlSearchParams.get('background'),
});

setViewMode(urlSearchParams.get('bare') === 'true' ? true : false);

initAudio(timer);

if(urlSearchParams.get('start')) {
    let startTime = 0;
    try {
        startTime = parseInt(urlSearchParams.get('start'));
        timer.setTimer(startTime);
    } catch(errorParsingStartTime) {
        console.error('Invalid start time!');
    }
}

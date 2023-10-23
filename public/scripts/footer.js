// @ts-check
import { showSettings, getStartTimeInMilliseconds } from './settings.js';
import { getSelectedCategory, getSelectedRace } from './racetime.js';
import { getPageColors } from './pageColors.js';

const footer = {
    settings: document.getElementById('settings'),
    openWindow: document.getElementById('open-window'),
}

export function initFooter() {
    footer.settings?.addEventListener('click', showSettings);

    footer.openWindow?.addEventListener('click', function openInNewWindow() {
        const selectedCategory = getSelectedCategory();
        const selectedRace = getSelectedRace();

        // get colors
        const pageColors = getPageColors();

        // get start timer
        const startTime = getStartTimeInMilliseconds();

        const urlParams = new URLSearchParams();
        urlParams.append('bare', 'true');
        if(selectedCategory) {
            urlParams.append('category', selectedCategory.slug);
        }

        if(selectedRace) {
            urlParams.append('race', selectedRace.name.split('/')[1]);
        }

        urlParams.append('primary', pageColors.primary);
        urlParams.append('secondary', pageColors.secondary);
        urlParams.append('highlights', pageColors.highlights);
        urlParams.append('shadows', pageColors.shadows);
        urlParams.append('background', pageColors.background);
        urlParams.append('start',  startTime.toString());

        const timerUrl = new URL(`http://localhost:8080/timer/?${urlParams.toString()}`);

        const width = 550;
        const height = 150;
        window.open(
            timerUrl.toString(),
            'RaceTimer',
            `toolbar=0,location=0,locationbar=0,status=0,menubar=0,scrollbars=0,resizable=0,width=${width},height=${height}`);
    });
}




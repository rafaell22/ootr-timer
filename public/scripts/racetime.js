// @ts-check
import { show, hide } from './domUtils.js';
import Race from './classes/Race.js';
import { setStartTime } from './settings.js';
import tinyduration from './tinyduration.js';
import { startTimer } from './timer.js';

const dialogOverlay = document.getElementById('dialog-overlay');
const racetime = {
    dialog: document.getElementById('racetime-dialog'),
    selectRace: document.getElementById('selectRace'),
    selectCategory: document.getElementById('selectCategory'),
    selectButton: document.getElementById('btnSelectRace'),
}
const loader = document.getElementById('loader');
const racetimeButton = document.getElementById('btnJoin');

dialogOverlay?.addEventListener('click', function closeRacetimeDialog() {
    hide(racetime.dialog);
    hide(dialogOverlay);
});

const raceInformation = {
    raceName: document.getElementById('race-name'),
    raceCategory: document.getElementById('race-category'),
};

let races;
let categories;
let selectedCategory;
let selectedRace;

/**
 * @param {object} initialValues
 * @param {string} initialValues.category
 * @param {string} initialValues.race
 */
export function initRacetimeEvents({ category, race }) {
    console.log(category, race);
    if(category && race) {
        selectedCategory = { slug: category };
        selectedRace = { name: category + '/' + race };
        checkForRaceStart();
    }

    racetimeButton?.addEventListener('click', async function openRacetimeDialog() {
        show(loader);
        try {
            categories = await Race.loadCategories();
            categories.sort((a, b) => {
                return a.name.localeCompare(b.name);
            })

            if(racetime.selectCategory) {
                racetime.selectCategory.innerHTML = `
                    <option disabled selected>Select category...</option>
                `;
            }

            for(const category of categories) {
                const option = document.createElement('option');
                option.value = category.slug;
                option.textContent = category.name;
                racetime.selectCategory?.appendChild(option);
            }

            show(dialogOverlay);
            show(racetime.dialog);
            show(racetime.selectCategory);
        } catch(errorGettingRacesList) {
            console.error('ERROR');
            console.error(errorGettingRacesList.stack);
        } finally {
            hide(loader);
        }
    });

    racetime.selectCategory?.addEventListener('change', async function loadRaces(event) {
        show(loader);
        const categorySlug = event.target?.['value'];
        selectedCategory = categories.find(category => category.slug === categorySlug);
        try {
            races = await Race.loadRacesByCategory(categorySlug);
            if(racetime.selectRace) {
                racetime.selectRace.innerHTML = `
                    <option disabled selected>Select race...</option>
                `;
            }
            for(const race of races) {
                const option = document.createElement('option');
                option.value = race.name;
                option.textContent = race.info;
                racetime.selectRace?.appendChild(option);
            }
            show(racetime.selectRace);
            show(racetime.selectButton);
        } catch(errorGettingRacesList) {
            console.error('ERROR');
            console.error(errorGettingRacesList);
        } finally {
            hide(loader);
        }
    });

    racetime.selectButton?.addEventListener('click', async function selectRace() {
        show(loader);
        hide(dialogOverlay);
        hide(racetime.dialog);
        const raceSlug = racetime.selectRace?.['value'];
        selectedRace = races.find(race => race.name === raceSlug);
        try {
            await checkForRaceStart();
            if(raceInformation?.raceCategory) {
                raceInformation.raceCategory.textContent = selectedCategory.name;
            }
            if(raceInformation?.raceName) {
                raceInformation.raceName.textContent = selectedRace.info;
            }

        } catch(errorGettingRacesDetails) {
            console.error('ERROR!');
            console.error(errorGettingRacesDetails);
        } finally {
            hide(loader);
        }
    });

    async function checkForRaceStart() {
        try {
            const raceSlug = selectedRace.name;
            const raceDetailsResult = await Race.loadRaceDetails(raceSlug);
            const startDelay = tinyduration.parse(raceDetailsResult.start_delay);
            const startDelayInSeconds = startDelay.seconds + startDelay.minutes * 60  + startDelay.hours * 60 * 60;
            let raceTime = 0;
            if(!raceDetailsResult.started_at) {
                raceTime = -startDelayInSeconds * 1000;
                setStartTime(raceTime);
                setTimeout(checkForRaceStart, startDelayInSeconds * 1000 / 3);
            } else {
                const startTime = new Date(raceDetailsResult.started_at).getTime();
                const currentTime = new Date(raceDetailsResult.date_exact).getTime();
                raceTime = currentTime - startTime;
                setStartTime(raceTime);
                startTimer();
            }
        } catch(errorGettingRacesDetails) {
            console.error('ERROR!');
            console.error(errorGettingRacesDetails);
        }
    }
}

export function getSelectedCategory() {
    return selectedCategory;
}

export function getSelectedRace() {
    return selectedRace;
}

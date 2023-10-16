// @ts-check
import { show, hide } from './domUtils.js';
import Race from './classes/Race.js';
import tinyduration from './tinyduration.js';

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

const raceInformation = {};
/**
 * @param {boolean} isBareView
 */
export function setViewMode(isBareView) {
    if(!isBareView) {
        raceInformation.raceName = document.getElementById('race-name');
        raceInformation.raceCategory = document.getElementById('race-category');
        hide(racetimeButton);
        return;
    }

    window.resizeTo(450, 450);
}

let races;
let categories;
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

let selectedCategory;
racetime.selectCategory?.addEventListener('change', async function loadRaces(event) {
    show(loader);
    const categorySlug = event.target?.['value'];
    selectedCategory = categories.find(category => category.slug === categorySlug);
    console.log('selectCategory: ', selectedCategory);
    try {
        races = await Race.loadRacesByCategory(categorySlug);
        console.log('races: ', races);
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

let selectedRace;
racetime.selectButton?.addEventListener('click', async function selectRace() {
    show(loader);
    hide(dialogOverlay);
    hide(racetime.dialog);
    const raceSlug = racetime.selectRace?.['value'];
    selectedRace = races.find(race => race.name === raceSlug);
    try {
        const raceDetailsResult = await Race.loadRaceDetails(raceSlug);
        console.log('raceDetailsResult: ', raceDetailsResult);
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


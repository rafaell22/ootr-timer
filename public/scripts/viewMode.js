// @ts-check

import { hide, show } from './domUtils.js';

/**
 * @param {boolean} isBareView
 */
export function setViewMode(isBareView) {
    if(isBareView) {
        const elementsToHide = document.querySelectorAll('.full-view');
        console.log('hide: ', elementsToHide)
        elementsToHide.forEach(element => {
            hide(element);
        });


        const elementsToShow = document.querySelectorAll('.bare-view');
        console.log('show: ', elementsToShow)
        elementsToShow.forEach(element => {
            show(element);
        });

        document.getElementById('timer')?.classList.add('center-x-y');
        return;
    }

    window.resizeTo(550, 150);
}

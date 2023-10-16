// @ts-check
/**
 * @param {HTMLElement|null|undefined} el
 */
export function hide(el) {
    if(!el) { return }
    el.classList.add('hidden');
}

/**
 * @param {HTMLElement|null|undefined} el
 */
export function show(el) {
    if(!el) { return }
    el.classList.remove('hidden');
}



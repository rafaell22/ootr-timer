// @ts-check
const DEFAULT_COLORS = {
    primary: '#0d9263',
    secondary: '#d4ce46',
    highlights: '#4aba91',
    shadows: '#0e5135',
    background: '#494b4b',
};

/**
 * @param {object} colors
 * @param {string|null} colors.primary
 * @param {string|null} colors.secondary
 * @param {string|null} colors.highlights
 * @param {string|null} colors.shadows
 * @param {string|null} colors.background
 */
export function setPageColors(colors) {
    const primaryColor = colors.primary ?? DEFAULT_COLORS.primary;
    const secondaryColor = colors.secondary ?? DEFAULT_COLORS.secondary;
    const highlightsColor = colors.highlights ?? DEFAULT_COLORS.highlights;
    const shadowsColor = colors.shadows ?? DEFAULT_COLORS.shadows;
    const backgroundColor = colors.background ?? DEFAULT_COLORS.background;

    document.documentElement.style.setProperty('--primary-color', primaryColor);
    document.documentElement.style.setProperty('--secondary-color', secondaryColor);
    document.documentElement.style.setProperty('--highlights-color', highlightsColor);
    document.documentElement.style.setProperty('--shadows-color', shadowsColor);
    document.documentElement.style.setProperty('--background-color', backgroundColor);
}

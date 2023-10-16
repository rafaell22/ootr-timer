// @ts-check
import { showSettings } from './settings.js';
const footer = {
    settings: document.getElementById('settings'),
    openWindow: document.getElementById('open-window'),
}

console.log(footer)
footer.settings?.addEventListener('click', showSettings);

footer.openWindow?.addEventListener('click', function openInNewWindow() {
    const width = 400;
    const height = 400;
    window.open(`http://localhost:8080/timer/?bare=true`, 'timer', `toolbar=0,location=0,status=0,menubar=0,scrollbars=0,resizable=0,width=${width},height=${height}`);
});



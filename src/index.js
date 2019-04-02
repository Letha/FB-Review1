import {initialization as initReact} from './modules/js/react/initialization'
import {initialization as initYmaps} from './modules/js/ymaps/initialization'

document.addEventListener("DOMContentLoaded", initialization);

function initialization() {
	initReact();
	initYmaps();
}
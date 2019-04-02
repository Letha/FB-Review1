import {onPlacemarkAdd} from './placemarksCollectionEvents'

export let map = null;
export let polyline = null;
export let mainRoutePlacemarksCollection = null;


export function initialization() {

	ymaps.ready(afterYMapsReady);

	function afterYMapsReady() {

		document.getElementById('Map').textContent = '';
		map = new ymaps.Map("Map", {center: [55.76, 37.64], zoom: 7});

		mainRoutePlacemarksCollection = new ymaps.GeoObjectCollection();
		mainRoutePlacemarksCollection.events.add('add', onPlacemarkAdd);

		polyline = new ymaps.Polyline([]);
		map.geoObjects.add(polyline);
	}
}

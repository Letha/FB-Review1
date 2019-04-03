import {polyline} from '../ymaps/initialization'
import {mainRoutePlacemarksCollection} from '../ymaps/initialization'


// en: labels - LabelsList react component state's "labels" array (or another similar array)
// ru: labels - массив "labels" состояния (state) react-компонента "LabelsList" (или иной подобный массив) 

export function renderMainRoute(labels) {

	mainRoutePlacemarksCollection.removeAll();
	for(let i = 0; i < labels.length; i++) {
		mainRoutePlacemarksCollection.add(labels[i].placemark);
	}

	renderPolyline();
}

export function renderPolyline() {

	let orderedPlacemarksCoordinates = [];
	mainRoutePlacemarksCollection.each( (el, i) => {orderedPlacemarksCoordinates[i] = el.geometry.getCoordinates();} );

	if(orderedPlacemarksCoordinates.length) {
		polyline.geometry.setCoordinates(orderedPlacemarksCoordinates);
	}
}

import {updatePlacemarkAddress} from './address'
import {renderPolyline} from './renderRoute'

export function onPlacemarkDrag(event) {
	renderPolyline();
}

export function onPlacemarkDragEnd(event) {

	let targetPlacemark = event.get('target');
	let updatedCoordinates = targetPlacemark.geometry.getCoordinates();

	targetPlacemark.properties.set('balloonContent', 'поиск...');
	updatePlacemarkAddress(targetPlacemark, updatedCoordinates);

	renderPolyline();
}

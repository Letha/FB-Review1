import {mainRoutePlacemarksCollection} from '../ymaps/initialization'

import {onPlacemarkDrag, onPlacemarkDragEnd} from './placemarksEvents'
import {updatePlacemarkAddress} from './address'


// localMap - a map to set a placemark (ymaps map)
// order - a number of a placemark's order (number)
// name - a placemark's name (string)
// coordinates - a placemark's coordinates (ymaps array)

export function setPlacemarkToMainRoute(localMap, order, name, coordinates) {

	if(localMap) {

		if(!coordinates) {
			coordinates = localMap.getCenter();
		}

		let placemark = new ymaps.Placemark(coordinates,
			{balloonContentHeader: name, balloonContent: 'поиск...'},
			{preset: 'islands#violetDotIconWithCaption', draggable: true});

		placemark.events.add('dragend', onPlacemarkDragEnd);
		placemark.events.add('drag', onPlacemarkDrag);
		updatePlacemarkAddress(placemark, placemark.geometry.getCoordinates());

		mainRoutePlacemarksCollection.add(placemark);
		localMap.geoObjects.add(mainRoutePlacemarksCollection);
		
		return placemark;
	};
}


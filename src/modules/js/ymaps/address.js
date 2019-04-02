
// placemark (ymaps placemark)
// coordinates (ymaps coordinates)

export function updatePlacemarkAddress(placemark, coordinates) {

	let geocoder = ymaps.geocode(coordinates);

	geocoder.then(function(res) {
		let firstGeoObject = res.geoObjects.get(0);

		placemark.properties.set('balloonContent', firstGeoObject.getAddressLine());
	});
}

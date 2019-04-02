export function onPlacemarkAdd(event) {
	event.get('child').properties.set('iconCaption', String(event.get('index') + 1) );
}

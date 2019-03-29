import React from 'react'
import ReactDOM from 'react-dom'

import styleLabelFrame from './modules/css/labelFrame.css'
import styleLabelInput from './modules/css/labelInput.css'
import styleLabelList from './modules/css/labelList.css'

let map = null;
let polyline = null;
let mainRoutePlacemarksCollection = null;


// инициализация

document.addEventListener("DOMContentLoaded", init);

function init() {

	let DOMContainer = document.getElementById('ReactLabelsFrame');

	ReactDOM.render(<LabelsList />, DOMContainer);
	ymaps.ready(afterYMapsReady);

	function afterYMapsReady() {

		map = new ymaps.Map("Map", {center: [55.76, 37.64], zoom: 7});

		mainRoutePlacemarksCollection = new ymaps.GeoObjectCollection();
		mainRoutePlacemarksCollection.events.add('add', onPlacemarkAdd);

		polyline = new ymaps.Polyline([]);
		map.geoObjects.add(polyline);
	}
}


// функции для работы с DOM

function closestElement(element, className) {

	if(element && className && (typeof className === 'string')) {
		let searchedElement = null;
		let currentElement = element;
		
		while(!searchedElement && currentElement !== document.body) {
			searchedElement = (currentElement.className.indexOf(className) !== -1) && currentElement;
			currentElement = currentElement.parentElement;
		};

		if(searchedElement) {
			return searchedElement;
		} else {
			return null;
		};
	};
}


// функции для вывода предупреждений

function showInputWarning(type) {

	let div = document.createElement('div');
	let note = document.createElement('p');

	div.className = 'inputWarning';
	div.className += ' ' + styleLabelInput.warning;

	if(type === 'empty') {
		div.textContent = 'Поле не заполнено';
	} else if(type === 'overflow') {
		div.textContent = 'Не более 99 меток';
	};

	div = document.body.appendChild(div);			

	setTimeout(() => div.parentElement.removeChild(div), 2500);	
}

// функции для работы с Яндекс.Карты JS API 

function setPlacemarkToMainRoute(localMap, order, name, coordinates) {

	if(localMap) {

		if(!coordinates) {
			coordinates = localMap.getCenter();
		};

		let placemark = new ymaps.Placemark(coordinates,
			{balloonContentHeader: name, balloonContent: 'поиск...'},
			{preset: 'islands#violetDotIconWithCaption', draggable: true});

		placemark.events.add('dragend', onPlacemarkDragEnd);
		placemark.events.add('drag', onPlacemarkDrag);
		updateAddress(placemark, placemark.geometry.getCoordinates());

		mainRoutePlacemarksCollection.add(placemark);
		localMap.geoObjects.add(mainRoutePlacemarksCollection);
		
		return placemark;
	};
}

function onPlacemarkAdd(event) {
	event.get('child').properties.set('iconCaption', String(event.get('index') + 1) );
}

function onPlacemarkSet(event) {
	event.get('child').properties.set('iconCaption', String(event.get('index') + 1) );
}

function renderMainRoute(labels) {

	mainRoutePlacemarksCollection.removeAll();
	for(let i = 0; i < labels.length; i++) {
		mainRoutePlacemarksCollection.add(labels[i].placemark);
	};

	renderPolyline();
}

function renderPolyline() {

	let orderedPlacemarksCoordinates = [];
	mainRoutePlacemarksCollection.each( (el, i) => {orderedPlacemarksCoordinates[i] = el.geometry.getCoordinates();} );

	if(orderedPlacemarksCoordinates.length) {
		polyline.geometry.setCoordinates(orderedPlacemarksCoordinates);
	}
}

function updateAddress(placemark, coordinates) {

	let geocoder = ymaps.geocode(coordinates);

	geocoder.then(function(res) {
		let firstGeoObject = res.geoObjects.get(0);

		placemark.properties.set('balloonContent', firstGeoObject.getAddressLine());
	});
}

function onPlacemarkDrag() {
	renderPolyline();
}

function onPlacemarkDragEnd(event) {

	let targetPlacemark = event.get('target');
	let updatedCoordinates = targetPlacemark.geometry.getCoordinates();

	targetPlacemark.properties.set('balloonContent', 'поиск...');
	updateAddress(targetPlacemark, updatedCoordinates);

	renderPolyline();
}


// React классы

class LabelsList extends React.Component {

	constructor(props) {

		super(props);

		// "label" - это представление "placemark" в отображаемом списке.
		// В "state" массив "labels" упорядочен в соответствии с рисуемым маршрутом (от этого зависит логика программы).

		this.state = {createdLabelsQuantity: 0, labels: []};

		this.dragElement = null;
	
		this.onSubmit = this.onSubmit.bind(this);
		this.onRemoveButtonClick = this.onRemoveButtonClick.bind(this); 
		
		this.onListItemMouseDown = this.onListItemMouseDown.bind(this);
		this.onListItemMouseMove = this.onListItemMouseMove.bind(this);
		this.onListItemDragEnd = this.onListItemDragEnd.bind(this);
	}


	// events

	onSubmit(event) {

		event.preventDefault();

		let labelName = event.target.elements['inputLabelName'].value;
		event.target.elements['inputLabelName'].value = '';
		event.target.elements['inputLabelName'].value = null;

		if(labelName === '') {

			if(document.getElementsByClassName('inputWarning').length === 0) {
				showInputWarning('empty');
			};

		} else if(this.state.labels.length >= 99) {
	
			if(document.getElementsByClassName('inputWarning').length === 0) {
				showInputWarning('overflow');
			};

		} else {

			let labelKey = this.state.createdLabelsQuantity;
			let labelOrder = this.state.labels.length + 1;
			let placemarkCoordinates = map.getCenter();

			let placemark = setPlacemarkToMainRoute(map, labelOrder, labelName, placemarkCoordinates);			
			this.setState((state, props) => {
				state.createdLabelsQuantity = ++state.createdLabelsQuantity;
				state.labels.push( {key: labelKey, order: labelOrder, name: labelName, placemark: placemark} );
				
				return state;
			});

			renderPolyline();
		};
	}

	onListItemMouseDown(event) {

		if(event.button === 0) {

			let elementAtPoint = document.elementFromPoint(event.clientX, event.clientY);
			let choosenLabelElement = closestElement(elementAtPoint, 'labelDescriptor');

			if(choosenLabelElement) {
				this.dragElement = choosenLabelElement;
				document.addEventListener('mousemove', this.onListItemMouseMove);
			};
		};
	}

	onListItemMouseMove(event) {
			
		document.addEventListener('mouseup', this.onListItemDragEnd);
		document.addEventListener('mouseleave', this.onListItemDragEnd);

		let elementAtPoint = document.elementFromPoint(event.clientX, event.clientY);
		let overLabelElement = closestElement(elementAtPoint, 'labelDescriptor');

		if(overLabelElement) {
				
			let choosenLabelOrder = Number(this.dragElement.dataset.labelOrder);
			let overLabelOrder = Number(overLabelElement.dataset.labelOrder);
				
			if(overLabelOrder!==this.overElementOrder) {

				this.setState((state, props) => {
					
					let choosenLabelRecord = state.labels[choosenLabelOrder - 1]; 
					
					if(choosenLabelOrder < overLabelOrder) {

						state.labels.splice(choosenLabelOrder - 1, 1);
				  		state.labels.splice( (overLabelOrder-1 < 0 ? 0 : overLabelOrder-1), 0, choosenLabelRecord);

				  	} else if(choosenLabelOrder > overLabelOrder) {

				  		state.labels.splice(choosenLabelOrder - 1, 1);
				  		state.labels.splice( (overLabelOrder - 1 < 0 ? +0 : overLabelOrder-1) , 0, choosenLabelRecord);
				  	};

				  	state.labels.forEach((el, i) => {el.order = i + 1;});
 
				 	return state;
				});

				renderMainRoute(this.state.labels);
				this.updatePlacemarks();
			}; 
		};
	}

	onListItemDragEnd(event) {

		this.dragElement = null;

		document.removeEventListener('mousemove', this.onListItemMouseMove);
		document.removeEventListener('mouseleave', this.onListItemDragEnd);
		document.removeEventListener('mouseup', this.onListItemDragEnd);
	}

	onRemoveButtonClick(event) {

		if(event.target.name === 'removeButton') {

			event.preventDefault();

			let labelId = event.target.parentElement.dataset.labelId;
			let labelOrder = event.target.parentElement.dataset.labelOrder;
			let placemark = this.state.labels[labelOrder-1].placemark;

			this.setState((state, props) => {

				state.labels.splice(labelOrder-1, 1);

				for(let i = labelOrder - 1; i < state.labels.length; i++) {

					let newOrder = --state.labels[i].order;
					state.labels[i].placemark.properties.set('iconCaption', String(newOrder));
				};

				return state;
			});

			mainRoutePlacemarksCollection.remove(placemark);
			renderPolyline();
		};
	}


	// вспомогательные методы

	updatePlacemarks() {

		this.setState((state, props) => {

			for(let i = 0; i < state.labels.length; i++) {
				state.labels[i].placemark = mainRoutePlacemarksCollection.get(i);
			};

			return state;
		});
	}

	
	// методы для render

	getListOfItems() {

		let listOfItems = [];

		for(let i = 0; i < this.state.labels.length; i++) {

			listOfItems[i] = <ListItem

			key={this.state.labels[i].key}
			order={this.state.labels[i].order}
			name={this.state.labels[i].name}

			labelId={this.state.labels[i].key}
				
			onMouseDown={this.onListItemMouseDown}
			onRemoveButtonClick={this.onRemoveButtonClick} />;
		};

		return listOfItems;
	}

	render() { return(
	
		<form className={styleLabelFrame.container} onSubmit={this.onSubmit}>

			<button type='submit' className={styleLabelInput.button}>Создать точку маршрута</button>
			<input name='inputLabelName' className={styleLabelInput.textInput} type='text' placeholder='название точки'></input>
		
			<div className={styleLabelList.listFrame}>

				{this.getListOfItems()}
			</div>
  		</form>   
	);}
}

class ListItem extends React.Component {
	
	constructor(props) {
		super(props);
	}

	onDragStart(event) {
  		event.preventDefault();
	};

	render() { return(

		<div className={styleLabelList.listItem + ' labelDescriptor'} onDragStart={this.onDragStart}
			data-label-id={this.props.labelId} data-label-order={this.props.order}>

			<div className={styleLabelList.listItemOrderSign} onMouseDown={this.props.onMouseDown}> {this.props.order} </div>
			<div className={styleLabelList.listItemName} onMouseDown={this.props.onMouseDown}> <p> {this.props.name} </p> </div>
			<button name='removeButton' className={styleLabelList.listItemRemoveButton} onClick={this.props.onRemoveButtonClick}></button>
		</div>
	);}
}

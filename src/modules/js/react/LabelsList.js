import React from 'react'
import ReactDOM from 'react-dom'


import ListItem from './ListItem.js'
import {map} from '../ymaps/initialization'
import {mainRoutePlacemarksCollection} from '../ymaps/initialization'

import {closestElement} from '../DOM/innerWork/search'
import {showInputWarning} from '../DOM/view/warnings'

import {setPlacemarkToMainRoute} from '../ymaps/addingPlacemarks'
import {renderPolyline} from '../ymaps/renderRoute'
import {renderMainRoute} from '../ymaps/renderRoute'


import styleLabelFrame from '../../css/labelFrame.css'
import styleLabelInput from '../../css/labelInput.css'
import styleLabelList from '../../css/labelList.css'


export default class LabelsList extends React.Component {

	constructor(props) {

		super(props);
		
		// en: The "label" is the representation of "placemark" in the displayed list.
		//     In the "state" - the "labels" array is ordered accordingly to a drawn route (the logic of programm depends on that).
		// ----
		// ru: "label" - это представление "placemark" в отображаемом списке.
		//     В "state" массив "labels" упорядочен в соответствии с рисуемым маршрутом (с этим связана логика программы).

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

		if(map === null) {

			if(document.getElementsByClassName('inputWarning').length === 0) {
				showInputWarning('waitingForMap');
			};

		} else if(labelName === '') {

			if(document.getElementsByClassName('inputWarning').length === 0) {
				showInputWarning('emptyInput');
			};

		} else if(this.state.labels.length >= 99) {
	
			if(document.getElementsByClassName('inputWarning').length === 0) {
				showInputWarning('listOverflow');
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
				
			if(overLabelOrder !== this.overElementOrder) {

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


	// en: accessory methods
	// ru: вспомогательные методы

	updatePlacemarks() {

		this.setState((state, props) => {

			for(let i = 0; i < state.labels.length; i++) {
				state.labels[i].placemark = mainRoutePlacemarksCollection.get(i);
			};

			return state;
		});
	}

	
	// render

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
			<input name='inputLabelName' className={styleLabelInput.textInput} type='text'
				placeholder='название точки' maxLength='100'></input>
		
			<div className={styleLabelList.listFrame}>

				{this.getListOfItems()}
			</div>
  		</form>   
	);}
}

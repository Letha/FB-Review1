import React from 'react'
import ReactDOM from 'react-dom'

import styleLabelList from '../../css/labelList.css'

export default class ListItem extends React.Component {
	
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

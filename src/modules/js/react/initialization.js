import React from 'react'
import ReactDOM from 'react-dom'

import LabelsList from './LabelsList'


export function initialization() {
	ReactDOM.render(<LabelsList />, document.getElementById('ReactLabelsFrame') );
}

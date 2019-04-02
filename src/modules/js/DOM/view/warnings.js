import styleLabelInput from '../../../css/labelInput.css'

// en:	show warning depending of recieved type
//	type (string):
//	  - "waitingForMap" is about waiting for map is loaded;
//	  - "emptyInput" is about empty input;
//	  - "listOverflow" is about trying to add more than 99 labels.
// ----
// ru:	показать предупреждение в зависимости от полученного type
// 	type (строка):
//	  - "waitingForMap" значит ожидание загрузки карты;
//	  - "emptyInput" значит пустое поле ввода;
//	  - "listOverflow" значит попытку создать более 99-и меток.

export function showInputWarning(type) {

	let div = document.createElement('div');
	let note = document.createElement('p');

	div.className = 'inputWarning';
	div.className += ' ' + styleLabelInput.warning; console.log(type);

	if(type === 'waitingForMap') {
		div.textContent = 'Карта не готова...';
	} else if(type === 'emptyInput') {
		div.textContent = 'Поле не заполнено';
	} else if(type === 'listOverflow') {
		div.textContent = 'Не более 99 меток';
	};

	div = document.body.appendChild(div);			

	setTimeout(() => div.parentElement.removeChild(div), 2500);	
}

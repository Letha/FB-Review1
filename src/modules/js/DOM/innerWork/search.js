
// en:	search for and return nearest upper DOM-element which has recieved class name (starts from recieved element and includes it)
//	element - an initial DOM element for start to search from (DOM element)
//	className - a class name of desired DOM element (string)
// ----
// ru: поиск и возврат ближайшего DOM-элемента, имеющего полученное имя класса (начиная с полученного элемента, включая его)
//	element - начальный DOM-элемент для поиска (DOM-элемент)
//	className - имя класса искомого DOM-элемента (строка)

export function closestElement(element, className) {

	if(element && className && (typeof className === 'string')) {
		let searchedElement = null;
		let currentElement = element;
		
		while(!searchedElement && currentElement !== document.body) {
			searchedElement = (currentElement.className.indexOf(className) !== -1) && currentElement;
			currentElement = currentElement.parentElement;
		}

		if(searchedElement) {
			return searchedElement;
		} else {
			return null;
		}
	}
}

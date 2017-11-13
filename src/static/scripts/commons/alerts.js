var MyProject = window.MyProject || {}
MyProject.Alerts = MyProject.Alerts || {};

function Alerts(){}

/*
	MyProject.Alerts.create({
		id: alertID,
		type: 'error',
		message: 'Ocorreu um erro',
		method: append|prepend|after|before,
		element: document.querySelector('#form')
	});
*/

Alerts.prototype = {
	create: function(o){
		if( typeof o === 'object') {
			var $el = document.createElement('div');
			$el.className = 'alerts ' + o.type || 'error';
			if(o.id) $el.id = o.id;
			$el.innerHTML = o.message || 'Ocorreu um erro';

			switch(o.method){
				case "append":
			    	o.element.appendChild($el);
                    break;
                case "after":
                    o.element.parentNode.insertBefore($el, o.element.nextSibling);
                    break;
                case "before":
                	console.log(o.element, o.element.parentNode)
                    o.element.parentNode.insertBefore($el, o.element);
                    break;
                default:
                    o.element.appendChild($el);
                    break
            }
		}

		return false;
	},

	remove: function(o){
		if( typeof o === 'object' && document.querySelector(o.id)) {
			document.querySelector(o.id).remove();
		}
	}
}

MyProject.Alerts = new Alerts({});

(function List(_AJAX, _ALERTS){
	var _private = {
		btnRemove: document.querySelectorAll('.btnRemove'),
		$tableList: document.querySelector('#tableList')
	};

    function List(){
    	this.trNumbers = _private.btnRemove.length;
        this._init();
    }

    List.prototype = {
    	buildTrLine: function () {
    		if (this.trNumbers === 0) {
	    		var tr = document.createElement('tr');
	    		var td = document.createElement('td');

	    		td.setAttribute('colspan', 6);
	    		td.setAttribute('align', 'center');
	    		td.innerText = 'Nenhum usuário cadastrado.';

	    		tr.appendChild(td);
	    		_private.$tableList.childNodes[3].appendChild(tr);
    		}
    	},

    	buttonStatus: function ($el, status) {
            if (status === 'disabled') {
                $el.setAttribute('disabled', true);
            } else {
                $el.removeAttribute('disabled');
            }
        },

    	removeUser: function ($el) {
    		var _this = this;
    		var getActionAttr = $el.getAttribute('href');
    		var getParentTr = $el.parentNode.parentNode;

    		if (document.querySelector('#alertsForm'))
                _ALERTS.remove({id: '#alertsForm'})

    		_this.buttonStatus($el, 'disabled');

    		var req = new _AJAX({
                method  : 'GET',
                URI     : getActionAttr,
                success : function(resp) {
                    if(resp.success) {
                        _ALERTS.create({
                            id: 'alertsForm',
                            type: 'success',
                            message: resp.success.message,
                            method: 'before',
                            element: _private.$tableList
                        });

                        getParentTr.remove();
                    } else {
                        _ALERTS.create({
                            id: 'alertsForm',
                            type: 'error',
                            message: resp.error.message,
                            method: 'before',
                            element: _private.$tableList
                        });
                    }

                    _this.buttonStatus($el, 'enabled');
                    _this.trNumbers = _this.trNumbers - 1;
                    _this.buildTrLine();
                }
            });
    	},

    	_installEvents: function () {
    		var i;
    		var _this = this;

    		if(_private.btnRemove) {
	    		for(i = 0; i < _private.btnRemove.length; i++) {
	    			_private.btnRemove[i].addEventListener('click', function(e) {
	    				e.preventDefault();
	    				_this.removeUser(this);
	    			});
	    		}
	    	}
    	},

    	_init: function () {
    		this._installEvents();
    	}
    }

    return new List();
})(MyProject.Ajax, MyProject.Alerts);

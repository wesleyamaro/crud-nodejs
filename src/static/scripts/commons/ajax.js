var MyProject = window.MyProject || {};
MyProject.Ajax = MyProject.Ajax || {};

function Ajax(o){
	if (typeof o === 'object') {
		this.obj = o;
		this._init();
	}
}

Ajax.prototype = {
	teste: function () {
		var _this = this;
		var xhr = new XMLHttpRequest();
		xhr.timeout = this.obj.timeout || 3000;
		
		xhr.open(this.obj.method || 'GET', this.obj.URI || 'https://private-da937a-izitest1.apiary-mock.com/fields', this.obj.async || true);
		this.obj.data ? xhr.send(this.obj.data) : xhr.send();

		xhr.onprogress = this.obj.onProgress;

		xhr.onload = function() {
			if (xhr.status == 200) {
				if(_this.obj.success){
					_this.obj.success(JSON.parse(xhr.responseText));
				}
			} else {
				if(_this.obj.error){
					_this.obj.error('Houve um problema ao fazer a requisição. Verifique se a URL informada está correta');
				}
			}
		};

		xhr.ontimeout = function() {
			if(_this.obj.error){
				_this.obj.error('Ocorreu um timeout na conexão, tente novamente.');
			}
		}
	},

	_init: function () {
		this.teste();
	}
}

MyProject.Ajax = Ajax;

var MyProject = window.MyProject || {};
MyProject.ImagePreview = MyProject.ImagePreview || {};

function ImagePreview(o) {
	if(typeof o === 'object') {
		this.obj = o;
		this._init();
	}
}

ImagePreview.prototype = {
	render: function () {
		var _this = this;

		if (this.obj.element.files && this.obj.element.files[0]) {
	        var reader = new FileReader();

	        reader.onload = function (e) {
	            _this.obj.renderElement.src = e.target.result;
	            _this.obj.renderElement.style.width = _this.obj.width;
	            _this.obj.renderElement.style.maxHeight = _this.obj.height;
	        };

	        reader.readAsDataURL(this.obj.element.files[0]);
	    } else if(this.obj.element.files && !this.obj.element.files[0]) {
	    	_this.obj.renderElement.remove();
	    }
	},

	_init: function() {
		this.render();
	}
}

MyProject.ImagePreview = ImagePreview;

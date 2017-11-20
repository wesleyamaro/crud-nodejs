var MyProject = window.MyProject || {};
MyProject.InputHelper = MyProject.InputHelper || {};

function InputHelper() {}

InputHelper.prototype = {
	validNumbersOnKeypress: function ($el) {
        $el.addEventListener('keypress', function(e) {
            var keycode = e.which;
		    if (!(e.shiftKey == false && (keycode == 46 || keycode == 8 || keycode == 37 || keycode == 39 || (keycode >= 48 && keycode <= 57)))) {
		        e.preventDefault();
		    }

		    return false;
        })
	}
};

MyProject.InputHelper = new InputHelper();

(function Register(_AJAX, _GMAPS, _ALERTS, _IMAGEPREVIEW){
    var _private = {
        $myForm: document.querySelector('#myForm'),
        $fileUp: document.querySelector('#uplImage'),
        $inputPhone: document.querySelector('#txtPhone'),
        $inputCPF: document.querySelector('#txtCPF'),
        $inputSubmit: document.querySelector('#btnSave')
    };

    function Register(){
        this._init();
    }

    Register.prototype = {
        buttonStatus: function($el, status) {
            if (status === 'disabled') {
                $el.setAttribute('disabled', true);
            } else {
                $el.removeAttribute('disabled');
            }
        },

        uploadPreview: function($el) {
            if( !document.querySelector('#renderPreview') ) {
                var renderPreview = document.createElement('img');
                renderPreview.id = 'renderPreview',
                _private.$myForm.insertBefore(renderPreview, $el.nextSibling);
            }
            
            var preview = new _IMAGEPREVIEW({
                element: $el,
                renderElement: document.querySelector('#renderPreview'),
                renderWidth: '100%',
                renderHeight: '400px'
            });
        },

        registerSubmit: function($el) {
            var _this = this;
            var data = new FormData($el);

            this.buttonStatus(_private.$inputSubmit, 'disabled');

            if (document.querySelector('#alertsForm'))
                _ALERTS.remove({id: '#alertsForm'})

            var req = new _AJAX({
                method  : 'POST',
                URI     : $el.getAttribute('action'),
                data    : data,
                success : function(resp) {
                    if(resp.success) {
                        _ALERTS.create({
                            id: 'alertsForm',
                            type: 'success',
                            message: resp.success.message,
                            method: 'append',
                            element: _private.$myForm
                        });

                        if( document.querySelector('#renderPreview') ) {
                            document.querySelector('#renderPreview').remove();
                        }

                        _private.$myForm.reset();
                    } else {
                        _ALERTS.create({
                            id: 'alertsForm',
                            type: 'error',
                            message: resp.error.message,
                            method: 'append',
                            element: _private.$myForm
                        });
                    }

                    _this.buttonStatus(_private.$inputSubmit, 'enabled');
                }
            });
        }, 

        validNumbersOnKeypress: function (e) {
            var keycode = e.which;
            if (!(e.shiftKey == false && (keycode == 46 || keycode == 8 || keycode == 37 || keycode == 39 || (keycode >= 48 && keycode <= 57)))) {
                e.preventDefault();
            }
        },

        _installEvents: function() {
            var _this = this;

            _private.$myForm.addEventListener('submit', function(e) {
                e.preventDefault();
                _this.registerSubmit(this);
            });

            _private.$fileUp.addEventListener('change', function(){
                _this.uploadPreview(this);
            });

            _private.$inputPhone.maxLength = 11;
            _private.$inputPhone.minLength = 10;
            _private.$inputPhone.addEventListener('keypress', function(e) {
                _this.validNumbersOnKeypress(e);
            });

            _private.$inputCPF.maxLength = 11;
            _private.$inputCPF.minLength = 11;
            _private.$inputCPF.addEventListener('keypress', function(e) {
                _this.validNumbersOnKeypress(e);
            });
            
            var google = new _GMAPS({ inputFormID: 'txtAddress', divMapID: 'map' });

            _ALERTS.remove({id: '#alertsForm'})
        },

        _init: function() {
            this._installEvents();
        }
    }

    return new Register();
})(MyProject.Ajax, MyProject.GoogleMapsAPI, MyProject.Alerts, MyProject.ImagePreview);

function Validator(options) {
    //Ham check dk
    var selectorRules = {};
    function validate(inputElement, rule) {
        var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
        var errorMessage;

        var ruleArr = selectorRules[rule.selector];
        for(var i = 0; i < ruleArr.length; i++)
        {
            errorMessage = ruleArr[i](inputElement.value);
            if(errorMessage) break;
        }
        if (errorMessage) {
            errorElement.innerText = errorMessage;
            inputElement.parentElement.classList.add('invalid');
        } else {
            errorElement.innerText = '';
            inputElement.parentElement.classList.remove('invalid');
        }
        return !errorMessage;
    }
    //Ham lay element cua form
    var formElement = document.querySelector(options.form);
    if (formElement) {
        // Check submit
        formElement.onsubmit = function(e){
            e.preventDefault();
            var isFormValid = true;
            options.rules.forEach(function (rule) {
                var inputElement = formElement.querySelector(rule.selector);
                var isValid = validate(inputElement,rule);
                if(!isValid){
                    isFormValid = false;
                }
            })
            if(isFormValid){
                if(typeof options.onSubmit === 'function'){
                    var enableInputs = formElement.querySelectorAll('[name]');
                    var formValues = Array.from(enableInputs).reduce(function(values,input){
                        return (values[input.name] = input.value) && values;
                    },{})
                    options.onSubmit(formValues);
                }
                // truong hop submit voi hanh vi mac dinh
                else{
                    formElement.submit();
                }
            }
        }
        
        options.rules.forEach(function (rule) {
            //Luu rule de su dung nhieu lan
            if(Array.isArray(selectorRules[rule.selector])){
                selectorRules[rule.selector].push(rule.test);
            }else{
                selectorRules[rule.selector] = [rule.test];
            }
            var inputElement = formElement.querySelector(rule.selector);
            if (inputElement) {
                inputElement.onblur = function () {
                    validate(inputElement,rule);
                }
                // Xử lý khi nhập
                inputElement.oninput = function(){
                    var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
                    errorElement.innerText = '';
                    inputElement.parentElement.classList.remove('invalid');
                }
            }
            
        })
    }
}
//định nghĩa các rule.
Validator.isRequired = function (selector,message) {
    return {
        selector: selector,
        test: function (value) {
            return value.trim() ? undefined : message || 'Please enter this field';
        }
    }
}
Validator.isEmail = function (selector,message) {
    return {
        selector: selector,
        test: function (value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : message || 'This field is not an email';
        }
    }
}
Validator.minLength = function (selector,min,message) {
    return {
        selector: selector,
        test: function (value) {
            return value.length >= min ? undefined : message || `Please enter at least ${min} characters`;
        }
    }
}
Validator.isConfirmed = function (selector, getConfirmValue,message){
    return{
        selector: selector,
        test: function (value){
            return value === getConfirmValue() ? undefined : message || 'Input value is incorrect';
        }
    }
}
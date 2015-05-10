/** 
* Copyright 2005-2011 massimocorner.com
* @author      Massimo Foti (massimo@massimocorner.com)
* @version     2.0.6, 2011-10-10
* @require     tmt_core.js
* @require     tmt_form.js
*/

if(typeof(tmt) == "undefined"){
	alert("Error: tmt.core JavaScript library missing");
}

if(typeof(tmt.form) == "undefined"){
	alert("Error: tmt.form JavaScript library missing");
}

tmt.validator = {};
tmt.validator.DEFAULT_DATE_PATTERN = "YYYY-MM-DD";
tmt.validator.DEFAULT_CALLBACK = "tmt.validator.defaultCallback";
tmt.validator.DEFAULT_CALLBACK_MULTISECTION = "tmt.validator.multiSectionDefaultCallback";

/**
* Initialize the library
*/
tmt.validator.init = function(){
	var formNodes = tmt.filterNodesByAttributeValue("tmt:validate", "true", document.getElementsByTagName("form"));
	for(var i=0; i<formNodes.length; i++){
		formNodes[i].tmt_validator = true;
		tmt.validator.filters.init(formNodes[i].elements);
		// Set the form node's onsubmit event 
		// We use a gigantic hack to preserve exiting calls attached to the onsubmit event (most likely validation routines)
		if(typeof formNodes[i].onsubmit != "function"){
			formNodes[i].onsubmit = function(){
				return tmt.validator.validateForm(this);
			}
		}
		else{
			// Store a reference to the old function
			formNodes[i].tmt_oldSubmit = formNodes[i].onsubmit;
			formNodes[i].onsubmit = function(){
				// If the existing function return true, validate the form
				if(this.tmt_oldSubmit()){
					return tmt.validator.validateForm(this);
				}
				return false;
			}
		}
	}
}

/**
* Validate a form 
* Accepts either an id (string) or a DOM node reference
*/
tmt.validator.validateForm = function(form){
	var formNode = tmt.get(form);
	formNode.tmt_validator = true;
	var formValidator = tmt.validator.formValidatorFactory(formNode);
	var activeValidators = tmt.validator.executeValidators(formValidator.validators);
	// Forward errors to the callback
	eval(formValidator.callback + "(formNode, activeValidators)");	
	if(activeValidators.length == 0){
		// Everything is fine, disable form submission to avoid multiple submits
		formValidator.blockSubmit();
	}
	return activeValidators.length == 0; 
}

/**
* Validate an array of form fields
* Array's elements can contain either an id (string) or a DOM node reference
* Second argument is an optional callback
* Returns true if no field contains errors, false otherwise
*/
tmt.validator.validateFields = function(fieldsArray, callback){
	if(fieldsArray.length == 0){
		return true;
	}
	// If no callback, use form's callback
	if(!callback){
		callback = tmt.validator.getCallback(tmt.get(fieldsArray[0]).form);
	}
	// Get the form node out of the first field
	var formNode = tmt.get(fieldsArray[0]).form;
	var validators = [];
	for(var i = 0; i < fieldsArray.length; i++){
		var fieldNode = tmt.get(fieldsArray[i]);
		if(tmt.form.isFormField(fieldNode)){
			validators.push(tmt.validator.fieldValidatorFactory(fieldNode));
		}
	}
	// Store all the field validators that contains errors
	var activeValidators = tmt.validator.executeValidators(validators);
	// Forward errors to the callback
	eval(callback + "(formNode, activeValidators)");
	return activeValidators.length == 0;
}

/**
* Validate all the fields contained inside a given start node
* Start node can be either an id (string) or a DOM node reference
* Second argument is an optional callback
* Returns true if no field contains errors, false otherwise
*/
tmt.validator.validateChildFields = function(startNode, callback){
	var fieldsArray = tmt.form.getChildFields(startNode);
	return tmt.validator.validateFields(fieldsArray, callback);
}

/**
* Validate a form field
* Accepts either an id (string) or a DOM node reference and an optional callback
* Returns true if the field contains no errors, false otherwise
*/
tmt.validator.validateField = function(field, callback){
	var fieldNode = tmt.get(field);
	if(!tmt.form.isFormField(fieldNode)){
		return false;
	}
	if(!callback){
		callback = "tmt.validator.defaultFieldCallback";
	}
	var fieldType = fieldNode.type.toLowerCase();
	// Skip fieldsets
	if(fieldNode.tagName.toLowerCase() == "fieldset"){
		return;
	}
	var validator = tmt.validator.fieldValidatorFactory(fieldNode);
	var haveError = validator.validate();
	
	if(haveError){
		eval(callback + "(fieldNode, validator)");
	}
	else{
		eval(callback + "(fieldNode, null)");
	}
	return haveError;
}

// Execute multiple validators. Returns an array of validators containing errors
// Returns and empty array if no errors
tmt.validator.executeValidators = function(validators){
	var validatedFields = {};
	// Store all the field validators that contains errors
	var activeValidators = [];
	// Validate all the fields
	for(var i=0; i<validators.length; i++){
		if(validators[i].validate){
			if(validatedFields[validators[i].name]){
				// Already validated checkbox or radio, skip it
				continue;
			}
			if(validators[i].validate()){
				activeValidators[activeValidators.length] = validators[i];
			}
			// Keep track of validated fields
			validatedFields[validators[i].name] = true;
		}
	}
	return activeValidators;
}

/* Object factories */

// Create a form validator
tmt.validator.formValidatorFactory = function(formNode){
	var obj = {};
	// Store all the field validators inside an array
	obj.validators = [];
	obj.callback = tmt.validator.getCallback(formNode);
	for(var i = 0; i < formNode.elements.length; i++){
		if(tmt.form.isFormField(formNode.elements[i])){
			obj.validators.push(tmt.validator.fieldValidatorFactory(formNode.elements[i]));
		}
	}
	// Retrieve all the submit buttons
	obj.buttons = tmt.form.getSubmitNodes(formNode);
	// Define a method that can block multiple submits
	obj.blockSubmit = function(){
		// Check to see if have to disable submit buttons
		if(!formNode.getAttribute("tmt:blocksubmit") && !(formNode.getAttribute("tmt:blocksubmit") == "false")){
			// Disable each submit button
			for(var i=0; i<obj.buttons.length; i++){
				if(obj.buttons[i].getAttribute("tmt:waitmessage")){
					obj.buttons[i].value = obj.buttons[i].getAttribute("tmt:waitmessage");
				}
				obj.buttons[i].disabled = true;
			}
		}
	}
	
	return obj;
}

// Generate a field validator
tmt.validator.fieldValidatorFactory = function(fieldNode){
	var fieldType = fieldNode.type.toLowerCase();
	var validator = {};
	// Skip fieldsets
	if(fieldNode.tagName.toLowerCase() == "fieldset"){
		return validator;
	}
	// Handle different kind of fields
	switch(fieldType){
		case "select-multiple":
			validator = tmt.validator.selectValidatorFactory(fieldNode);
			break;
		case "select-one":
			validator = tmt.validator.selectValidatorFactory(fieldNode);
			break;
		case "radio":
			validator = tmt.validator.radioValidatorFactory(tmt.form.getFieldGroup(fieldNode));
			break;
		case "checkbox":
			validator = tmt.validator.boxValidatorFactory(tmt.form.getFieldGroup(fieldNode));
			break;
		// Skip reset
		case "reset":
			return validator;
			break;
		// Skip buttons
		case "button":
			return validator;
			break;
		// default handles all the text fields
		default:
			validator = tmt.validator.textValidatorFactory(fieldNode);
			break;
	}
	return validator;
}

// Create an abstract field validator, to be extended/decorated for specific needs
tmt.validator.abstractValidatorFactory = function(fieldNode){
	var obj = {};
	obj.message = "";
	obj.name = "";
	if(fieldNode.name){
		obj.name = fieldNode.name;
	}
	else if(fieldNode.id){
		obj.name = fieldNode.id;
	}
	obj.errorClass = "";
	if(fieldNode.getAttribute("tmt:message")){
		obj.message = fieldNode.getAttribute("tmt:message");
	}
	if(fieldNode.getAttribute("tmt:errorclass")){
		obj.errorClass = fieldNode.getAttribute("tmt:errorclass");
	}
	obj.flagInvalid = function(){
		// Append the CSS class to the existing one
		if(obj.errorClass){
			tmt.addClass(fieldNode, obj.errorClass);
		}
		// Set the title attribute in order to show a tootip
		fieldNode.setAttribute("title", obj.message);
	}
	obj.flagValid = function(){
		// Remove the CSS class
		if(obj.errorClass){
			tmt.removeClass(fieldNode, obj.errorClass);
		}
		fieldNode.removeAttribute("title");
	}
	obj.validate = function(){
		// If the field contains error, flag it as invalid and return false
		// Be careful, this method contains multiple exit points!!!
		if(fieldNode.disabled){
			// Disabled fields are always valid
			obj.flagValid();
			return false;
		}
		if(!obj.isValid()){
			obj.flagInvalid();
			return true;
		}
		else{
			obj.flagValid();
			return false;
		}
	}
	
	return obj;
}

// Create a validator for text and texarea fields
tmt.validator.textValidatorFactory = function(fieldNode){
	var obj = tmt.validator.abstractValidatorFactory(fieldNode);
	obj.type = "text";
	// Put focus and cursor inside the field
	obj.getFocus = function(){
		// This try block is required to solve an obscure issue with IE and hidden fields
		try{
			fieldNode.focus();
			fieldNode.select();
		}
		catch(exception){
		}
	}
	// Check if the field is empty
	obj.isEmpty = function(){
		return fieldNode.value == "";
	}
	// Check if the field is required
	obj.isRequired = function(){
		var requiredAtt = fieldNode.getAttribute("tmt:required");
		if(requiredAtt){
			// Plain vanilla validation, true/false
			if((requiredAtt == "true") || (requiredAtt == "false")){
				return eval(requiredAtt);
			}
			// It's a conditional validation. Invoke the relevant function
			return(eval(requiredAtt + "(fieldNode)"));
		}
		return false;
	}
	// Check if the field satisfy the rules associated with it
	// Be careful, this method contains multiple exit points!!!
	obj.isValid = function(){
		if(obj.isEmpty()){
			if(obj.isRequired()){
				return false;
			}
			else{
				return true;
			}
		}
		else{
			// It's empty. Loop over all the available rules
			for(var rule in tmt.validator.rules){
				// Check if the current rule is required for the field
				if(fieldNode.getAttribute("tmt:" + rule)){
					// Invoke the rule
					if(!eval("tmt.validator.rules." + rule + "(fieldNode)")){
						return false;
					}
				}
			}
		}
		return true;
	}
	
	return obj;
}

// Create a validator for <select> fields
tmt.validator.selectValidatorFactory = function(selectNode){
	var obj = tmt.validator.abstractValidatorFactory(selectNode);
	obj.type = "select";
	var invalidIndex;
	if(selectNode.getAttribute("tmt:invalidindex")){
		invalidIndex = selectNode.getAttribute("tmt:invalidindex");
	}
	var invalidValue;
	if(selectNode.getAttribute("tmt:invalidvalue") != null){
		invalidValue = selectNode.getAttribute("tmt:invalidvalue");
	}
	// Check if the field satisfy the rules associated with it
	// Be careful, this method contains multiple exit points!!!
	obj.isValid = function(){
		// Whenever a "size" attribute is available, the browser reports -1 as selectedIndex
		// Fix this weirdness
		if(selectNode.selectedIndex == -1){
			selectNode.selectedIndex = 0;
		}
		// Check for index
		if(selectNode.selectedIndex == invalidIndex){
			return false;
		}
		// Check for value
		if(tmt.form.getValue(selectNode) == invalidValue){
			return false;
		}
		// Loop over all the available rules
		for(var rule in tmt.validator.rules){
			// Check if the current rule is required for the field
			if(selectNode.getAttribute("tmt:" + rule)){
				// Invoke the rule
				if(!eval("tmt.validator.rules." + rule + "(selectNode)")){
					return false;
				}
			}
		}
		return true;
	}
	
	return obj;
}

// Create generic validator for grouped fields (radio and checkboxes)
tmt.validator.groupValidatorFactory = function(buttonGroup){
	var obj = {};
	obj.name = buttonGroup[0].name;
	obj.message = "";
	obj.errorClass = "";
	// Since fields from the same group can have conflicting attribute values, the last one win
	for(var i=0; i<buttonGroup.length; i++){
		if(buttonGroup[i].getAttribute("tmt:message")){
			obj.message = buttonGroup[i].getAttribute("tmt:message");
		}
		if(buttonGroup[i].getAttribute("tmt:errorclass")){
			obj.errorClass = buttonGroup[i].getAttribute("tmt:errorclass");
		}
	}
	obj.flagInvalid = function(){
		// Append the CSS class to the existing one
		if(obj.errorClass){
			for(var i=0; i<buttonGroup.length; i++){
				tmt.addClass(buttonGroup[i], obj.errorClass);
				buttonGroup[i].setAttribute("title", obj.message);
			}
		}
	}
	obj.flagValid = function(){
		// Remove the CSS class
		if(obj.errorClass){
			for(var i=0; i<buttonGroup.length; i++){
				tmt.removeClass(buttonGroup[i], obj.errorClass);
				buttonGroup[i].removeAttribute("title");
			}
		}
	}
	obj.validate = function(){
		//var errorMsg = "";
		// If the field group contains error, flag it as invalid and return false
		if(obj.isValid()){
			obj.flagValid();
			return false;
		}
		else{
			obj.flagInvalid();
			return true;
		}
	}
	
	return obj;
}

// Create a checkbox validator (out of a group of boxes sharing the same name)
tmt.validator.boxValidatorFactory = function(boxGroup){
	var obj = tmt.validator.groupValidatorFactory(boxGroup);
	obj.type = "checkbox";
	var minchecked = 0;
	var maxchecked = boxGroup.length;
	// Since checkboxes from the same group can have conflicting attribute values, the last one win
	for(var i=0; i<boxGroup.length; i++){
		if(boxGroup[i].getAttribute("tmt:minchecked")){
			minchecked = boxGroup[i].getAttribute("tmt:minchecked");
		}
		if(boxGroup[i].getAttribute("tmt:maxchecked")){
			maxchecked = boxGroup[i].getAttribute("tmt:maxchecked");
		}
	}
	// Check if the boxes validate
	obj.isValid = function(){
		var checkCounter = 0;
		for(var i=0; i<boxGroup.length; i++){
		    // For each checked box, increase the counter
			if(boxGroup[i].checked){
				checkCounter++;
			}
		}
		return (checkCounter >=  minchecked) && (checkCounter <= maxchecked);
	}
	
	return obj;
}

// Create a radio validator (out of a group of radios sharing the same name)
tmt.validator.radioValidatorFactory = function(radioGroup){
	var obj = tmt.validator.groupValidatorFactory(radioGroup);
	obj.type = "radio";
	obj.isRequired = function(){
		var requiredFlag = false;
		// Since radios from the same group can have conflicting attribute values, the last one win
		for(var i=0; i<radioGroup.length; i++){
			if(radioGroup[i].disabled == false){
				if(radioGroup[i].getAttribute("tmt:required")){
					requiredFlag = radioGroup[i].getAttribute("tmt:required");
				}
			}
		}
		return requiredFlag;
	}
	
	// Check if the radio validate
	obj.isValid = function(){
		if(obj.isRequired()){
			for(var i=0; i<radioGroup.length; i++){
				// As soon as one is checked, we are fine
				if(radioGroup[i].checked){
					return true;
				}
			}
			return false;
		}
		// It's not required, fine anyway
		else{
			return true;
		}
	}
	return obj;
}

// This object stores all the validation rules
// Every rule is stored as a method that accepts the field node as argument and return a boolean
tmt.validator.rules = {};

tmt.validator.rules.datepattern = function(fieldNode){
	var datObj = tmt.validator.dateStrToObj(fieldNode.value, fieldNode.getAttribute("tmt:datepattern"));
	if(datObj){
		return true;
	}
	return false;
}

tmt.validator.rules.maxdate = function(fieldNode){
	var pattern = tmt.validator.DEFAULT_DATE_PATTERN;
	if(fieldNode.getAttribute("tmt:datepattern")){
		pattern = fieldNode.getAttribute("tmt:datepattern");
	}
	var valueDate = tmt.validator.dateStrToObj(fieldNode.value, pattern);
	var maxDate = tmt.validator.dateStrToObj(fieldNode.getAttribute("tmt:maxdate"), pattern);
	if(valueDate && maxDate){
		return valueDate <= maxDate;
	}
	return false;
}

tmt.validator.rules.mindate = function(fieldNode){
	var pattern = tmt.validator.DEFAULT_DATE_PATTERN;
	if(fieldNode.getAttribute("tmt:datepattern")){
		pattern = fieldNode.getAttribute("tmt:datepattern");
	}
	var valueDate = tmt.validator.dateStrToObj(fieldNode.value, pattern);	
	var minDate = tmt.validator.dateStrToObj(fieldNode.getAttribute("tmt:mindate"), pattern);
	if(valueDate && minDate){
		return valueDate >= minDate;
	}
	return false;
}

tmt.validator.rules.equalto = function(fieldNode){
	var twinNode = document.getElementById(fieldNode.getAttribute("tmt:equalto"));
	return twinNode.value == fieldNode.value;
}

tmt.validator.rules.maxlength = function(fieldNode){
	if(fieldNode.value.length > fieldNode.getAttribute("tmt:maxlength")){
		return false;
	}
	return true;
}

tmt.validator.rules.maxnumber = function(fieldNode){
	if(parseFloat(fieldNode.value) > fieldNode.getAttribute("tmt:maxnumber")){
		return false;
	}
	return true;
}

tmt.validator.rules.minlength = function(fieldNode){
	if(fieldNode.value.length < fieldNode.getAttribute("tmt:minlength")){
		return false;
	}
	return true;
}

tmt.validator.rules.minnumber = function(fieldNode){
	if(parseFloat(fieldNode.value) < fieldNode.getAttribute("tmt:minnumber")){
		return false;
	}
	return true;
}

tmt.validator.rules.pattern = function(fieldNode){
	var reg = tmt.validator.patterns[fieldNode.getAttribute("tmt:pattern")];
	if(reg){
		return reg.test(fieldNode.value);
	}
	else{
		// If the pattern is missing, skip it
		return true;
	}
}

// This object stores all the RegExp patterns for strings
tmt.validator.patterns = {};
tmt.validator.patterns.email = new RegExp("^[\\w\\.=-]+@[\\w\\.-]+\\.[\\w\\.-]{2,4}$");
tmt.validator.patterns.lettersonly = new RegExp("^[a-zA-Z]*$");
tmt.validator.patterns.alphanumeric = new RegExp("^\\w*$");
tmt.validator.patterns.integer = new RegExp("^-?\\d\\d*$");
tmt.validator.patterns.positiveinteger = new RegExp("^\\d\\d*$");
tmt.validator.patterns.number = new RegExp("^-?(\\d\\d*\\.\\d*$)|(^-?\\d\\d*$)|(^-?\\.\\d\\d*$)");
tmt.validator.patterns.filepath_pdf = new RegExp("[\\w_]*\\.([pP][dD][fF])$");
tmt.validator.patterns.filepath_jpg_gif = new RegExp("[\\w_]*\\.([gG][iI][fF])|([jJ][pP][eE]?[gG])$");
tmt.validator.patterns.filepath_jpg = new RegExp("[\\w_]*\\.([jJ][pP][eE]?[gG])$");
tmt.validator.patterns.filepath_zip = new RegExp("[\\w_]*\\.([zZ][iI][pP])$");
tmt.validator.patterns.filepath = new RegExp("[\\w_]*\\.\\w{3}$");

// This objects stores all the info required for date validation
tmt.validator.datePatterns = {};

// Create an object that stores date validation's info
tmt.validator.createDatePattern = function(rex, year, month, day, separator){
	var infoObj = {};
	infoObj.rex = new RegExp(rex);
	infoObj.y = year;
	infoObj.m = month;
	infoObj.d = day;
	infoObj.s = separator;
	return infoObj;
}

tmt.validator.datePatterns["YYYY-MM-DD"] = tmt.validator.createDatePattern("^\([0-9]{4}\)\\-\([0-1][0-9]\)\\-\([0-3][0-9]\)$", 0, 1, 2, "-");
tmt.validator.datePatterns["YYYY-M-D"] = tmt.validator.createDatePattern("^\([0-9]{4}\)\\-\([0-1]?[0-9]\)\\-\([0-3]?[0-9]\)$", 0, 1, 2, "-");
tmt.validator.datePatterns["MM.DD.YYYY"] = tmt.validator.createDatePattern("^\([0-1][0-9]\)\\.\([0-3][0-9]\)\\.\([0-9]{4}\)$", 2, 0, 1, ".");
tmt.validator.datePatterns["M.D.YYYY"] = tmt.validator.createDatePattern("^\([0-1]?[0-9]\)\\.\([0-3]?[0-9]\)\\.\([0-9]{4}\)$", 2, 0, 1, ".");
tmt.validator.datePatterns["MM/DD/YYYY"] = tmt.validator.createDatePattern("^\([0-1][0-9]\)\/\([0-3][0-9]\)\/\([0-9]{4}\)$", 2, 0, 1, "/");
tmt.validator.datePatterns["M/D/YYYY"] = tmt.validator.createDatePattern("^\([0-1]?[0-9]\)\/\([0-3]?[0-9]\)\/\([0-9]{4}\)$", 2, 0, 1, "/");
tmt.validator.datePatterns["MM-DD-YYYY"] = tmt.validator.createDatePattern("^\([0-21][0-9]\)\\-\([0-3][0-9]\)\\-\([0-9]{4}\)$", 2, 0, 1, "-");
tmt.validator.datePatterns["M-D-YYYY"] = tmt.validator.createDatePattern("^\([0-1]?[0-9]\)\\-\([0-3]?[0-9]\)\\-\([0-9]{4}\)$", 2, 0, 1, "-");
tmt.validator.datePatterns["DD.MM.YYYY"] = tmt.validator.createDatePattern("^\([0-3][0-9]\)\\.\([0-1][0-9]\)\\.\([0-9]{4}\)$", 2, 1, 0, ".");
tmt.validator.datePatterns["D.M.YYYY"] = tmt.validator.createDatePattern("^\([0-3]?[0-9]\)\\.\([0-1]?[0-9]\)\\.\([0-9]{4}\)$", 2, 1, 0, ".");
tmt.validator.datePatterns["DD/MM/YYYY"] = tmt.validator.createDatePattern("^\([0-3][0-9]\)\/\([0-1][0-9]\)\/\([0-9]{4}\)$", 2, 1, 0, "/");
tmt.validator.datePatterns["D/M/YYYY"] = tmt.validator.createDatePattern("^\([0-3]?[0-9]\)\/\([0-1]?[0-9]\)\/\([0-9]{4}\)$", 2, 1, 0, "/");
tmt.validator.datePatterns["DD-MM-YYYY"] = tmt.validator.createDatePattern("^\([0-3][0-9]\)\\-\([0-1][0-9]\)\\-\([0-9]{4}\)$", 2, 1, 0, "-");
tmt.validator.datePatterns["D-M-YYYY"] = tmt.validator.createDatePattern("^\([0-3]?[0-9]\)\\-\([0-1]?[0-9]\)\\-\([0-9]{4}\)$", 2, 1, 0, "-");

// This object stores all the info required for filters
tmt.validator.filters = {};

/**
* Initialize filters
*/
tmt.validator.filters.init = function(fields){
	for(var i=0; i<fields.length; i++){
		if(fields[i].getAttribute("tmt:filters")){
			// Call the filters on the onkeyup and onblur events
			tmt.addEvent(fields[i], "keydown", function(){tmt.validator.filterField(this);});
			tmt.addEvent(fields[i], "blur", function(){tmt.validator.filterField(this);});
		}
	}
}

// Create an object that stores filters's info
tmt.validator.createFilter = function(rex, replaceStr){
	var infoObj = {};
	infoObj.rex = new RegExp(rex, "g");
	infoObj.str = replaceStr;
	return infoObj;
}

tmt.validator.filters.ltrim = tmt.validator.createFilter ("^(\\s*)(\\b[\\w\\W]*)$", "$2");
tmt.validator.filters.rtrim = tmt.validator.createFilter ("^([\\w\\W]*)(\\b\\s*)$", "$1");
tmt.validator.filters.nospaces = tmt.validator.createFilter ("\\s*", "");
tmt.validator.filters.nocommas = tmt.validator.createFilter (",", "");
tmt.validator.filters.nodots = tmt.validator.createFilter ("\\.", "");
tmt.validator.filters.noquotes = tmt.validator.createFilter ("'", "");
tmt.validator.filters.nodoublequotes = tmt.validator.createFilter ('"', "");
tmt.validator.filters.nohtml = tmt.validator.createFilter ("<[^>]*>", "");
tmt.validator.filters.alphanumericonly = tmt.validator.createFilter ("[^\\w]", "");
tmt.validator.filters.numbersonly = tmt.validator.createFilter ("[^\\d]", "");
tmt.validator.filters.lettersonly = tmt.validator.createFilter ("[^a-zA-Z]", "");
tmt.validator.filters.commastodots = tmt.validator.createFilter (",", ".");
tmt.validator.filters.dotstocommas = tmt.validator.createFilter ("\\.", ",");
tmt.validator.filters.numberscommas = tmt.validator.createFilter ("[^\\d,]", "");
tmt.validator.filters.numbersdots = tmt.validator.createFilter ("[^\\d\\.]", "");

// Clean up the field based on filter's info
tmt.validator.filterField = function(fieldNode){
	var filtersArray = fieldNode.getAttribute("tmt:filters").split(",");
	// Skip arrow keys in Safari and IE
	if(window.event){
		var code = window.event.keyCode;
		if((code == 37) || (code == 38) || (code == 39) || (code == 40)){
			return;
		}
	}
	for(var i=0; i<filtersArray.length; i++){
		var filtObj = tmt.validator.filters[filtersArray[i]];
		// Be sure we have the filter's data, then clean up
		if(filtObj){
			fieldNode.value = fieldNode.value.replace(filtObj.rex, filtObj.str)
		}
		// We handle demoroziner as a special case
		if(filtersArray[i] == "demoronizer"){
			fieldNode.value = tmt.form.stringDemoronizer(fieldNode.value);
		}
	}
}

/* Helper functions */

// Create a Date object out of a string, based on a given RegExp pattern
tmt.validator.dateStrToObj = function(dateStr, datePattern){
	var globalObj = tmt.validator.datePatterns[datePattern];
	if(globalObj){
		// Split the date into 3 different bits using the separator
		var dateBits = dateStr.split(globalObj.s);
		// First try to create a new date out of the bits
		var testDate = new Date(dateBits[globalObj.y], (dateBits[globalObj.m]-1), dateBits[globalObj.d]);
		// Make sure values match after conversion
		var isDate = (testDate.getFullYear() == dateBits[globalObj.y])
				 && (testDate.getMonth() == dateBits[globalObj.m]-1)
				 && (testDate.getDate() == dateBits[globalObj.d]);
		// If it's a date and it matches the RegExp, it's a go
		if(isDate && globalObj.rex.test(dateStr)){
			return testDate;
		}
		return null;
	}
	return null;
}

// Get the relevant callback out of a form node
// Second argument is optional
tmt.validator.getCallback = function(formNode){
	if(formNode.getAttribute("tmt:callback")){
		return formNode.getAttribute("tmt:callback");
	}
	return tmt.validator.DEFAULT_CALLBACK;	
}

/* Callbacks for error display */
 
/**
* Default form callback. Display error messages inside alert
*/
tmt.validator.defaultCallback = function(formNode, validators){
	var errorMsg = "";
	var focusGiven = false;
	for(var i=0; i<validators.length; i++){
		// Append to the global error string
		errorMsg += validators[i].message + "\n";
		// Give focus to the first invalid text/textarea field
		if(!focusGiven && (validators[i].getFocus)){
			validators[i].getFocus();
			focusGiven = true;
		}
	}
	if(errorMsg != ""){
		// We have errors, alert them
		alert(errorMsg);
	}
}

/**
* Additional form callback. Display errors inside a box above the form
*/
tmt.validator.errorBoxCallback = function(formNode, validators){
	// Clean-up any existing box
	if(validators.length == 0){
		tmt.form.removeDisplayBox(formNode);
		return;
	}
	var focusGiven = false;
	var htmlStr = "<ul>";
	// Create a <ul> for each error
	for(var i=0;i<validators.length;i++){
		htmlStr += "<li><em>" + validators[i].name + ": </em> "+ validators[i].message + "</li>";
		// Give focus to the first invalid text/textarea field
		if(!focusGiven && (validators[i].getFocus)){
			validators[i].getFocus();
			focusGiven = true;
		}
	}
	htmlStr += "</ul>";
	tmt.form.displayErrorMessage(formNode, htmlStr);
}

/**
* Default form callback
* To be used for multi-section forms, with tabs, accordions or the like
*/
tmt.validator.multiSectionDefaultCallback = function(formNode, hasErrors, sectionResults){
	var errorMsg = "";
	for(var i=0;i<sectionResults.length;i++){
		// This section has no errors, skip it
		if(sectionResults[i].validators.length == 0){
			continue;
		}
		var validators = sectionResults[i].validators;
		for(var k=0;k<validators.length;k++){
			errorMsg += validators[k].message + "\n";
		}
	}
	if(errorMsg != ""){
		// We have errors, alert them
		alert(errorMsg);
	}
}

/**
* Additional form callback
* To be used for multi-section forms, with tabs, accordions or the like
*/
tmt.validator.multiSectionBoxCallback = function(formNode, hasErrors, sectionResults){
	// No errors, just clean up
	if(!hasErrors){
		tmt.form.removeDisplayBox(formNode);
		return;
	}
	var htmlStr = "<ul>";
	// Generate nested XHTML lists for each panel
	for(var i=0;i<sectionResults.length;i++){
		// This section has no errors, skip it
		if(sectionResults[i].validators.length == 0){
			continue;
		}
		htmlStr += "<li><strong>" + sectionResults[i].label + "</strong>";
		var validators = sectionResults[i].validators;
		htmlStr += "<ul>";
		for(var k=0;k<validators.length;k++){
			htmlStr += "<li><em>" + validators[k].name + ": </em> "+ validators[k].message + "</li>";
		}
		htmlStr += "</ul></li>";
	}
	htmlStr += "</ul>";
	tmt.form.displayErrorMessage(formNode, htmlStr);
}

/**
* Default field callback. Display error message inside alert
*/
tmt.validator.defaultFieldCallback = function(fieldNode, validator){
	if(validator){
		tmt.validator.defaultCallback(fieldNode.form, [validator]);
	}
}

/**
* Additional field callback. Display error inside a box above the form
*/
tmt.validator.errorBoxFieldCallback = function(fieldNode, validator){
	if(validator){
		tmt.validator.errorBoxCallback(fieldNode.form, [validator]);
	}
	else{
		tmt.validator.errorBoxCallback(fieldNode.form, []);
	}
}

tmt.addEvent(window, "load", tmt.validator.init);

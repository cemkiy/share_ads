/** 
* Copyright 2006-2011 massimocorner.com
* License: http://www.massimocorner.com/license.htm
* @author      Massimo Foti (massimo@massimocorner.com)
* @version     0.6.0, 2011-05-25
* @require     tmt_core.js
*/

if(typeof(tmt) == "undefined"){
	alert("Error: tmt.core JavaScript library missing");
}

tmt.form = {};

// Constants
tmt.form.MESSAGE_CLASS = "tmtFormMessage";
tmt.form.ERROR_MESSAGE_CLASS = "tmtFormErrorMessage";

/**
* Check a set of form fields (radio or checkboxes)
*/
tmt.form.checkFields = function(){
	tmt.setNodeAttribute(arguments, "checked", true);
}

/**
* Uncheck a set of form fields (radio or checkboxes)
*/
tmt.form.uncheckFields = function(){
	tmt.setNodeAttribute(arguments, "checked", false);
}

/**
* Toggle the checked attribute on a set of form fields. If it's true it set it to false and viceversa
*/
tmt.form.toggleCheckFields = function(){
	for(var i=0; i<arguments.length; i++){
		var fieldNode = tmt.get(arguments[i]);
		if(fieldNode){
			fieldNode.checked ? fieldNode.checked = false : fieldNode.checked = true;
		}
	}
}

/**
* Programmatically select options inside a <select> tag
* The first argument can be a DOM node, the id or the name of the <select>
* In case of multiple tags sharing the same name the first fund in the document will be used
* The second argument can be a simple value or a comma-delimited list (for select-multiple)
*/
tmt.form.checkSelect = function(theNode, values){
	// Split in case we got a comma-separated list (for select-multiple)
	var valueArray = values.split(",");
	var selectNode = tmt.get(theNode);
	// If what we get is a name, use the first node matching the name
	if(selectNode == null){
		selectNode = document.getElementsByName(theNode)[0];
	}
	for(var i=0; i<selectNode.options.length; i++){
		for(var j=0; j<valueArray.length; j++){
			if(valueArray[j] == tmt.form.getOptionNodeValue(selectNode.options[i])){
				selectNode.options[i].selected = true;
			}
		}
	}
}

/**
* Programmatically de-select options inside a <select> tag
* The first argument can be a DOM node, the id or the name of the <select>
* In case of multiple tags sharing the same name the first fund in the document will be used
*/
tmt.form.resetSelect = function(theNode){
	var selectNode = tmt.get(theNode);
	// If what we get is a name, use the first node matching the name
	if(selectNode == null){
		selectNode = document.getElementsByName(theNode)[0];
	}
	for(var i=0; i<selectNode.options.length; i++){
		selectNode.options[i].selected = false;
	}
}

/**
* Programmatically select all options inside a select-multiple
* The first argument can be a DOM node, the id or the name of the <select>
* In case of multiple tags sharing the same name the first fund in the document will be used
*/
tmt.form.selectAll = function(theNode){
	var selectNode = tmt.get(theNode);
	// If what we get is a name, use the first node matching the name
	if(selectNode == null){
		selectNode = document.getElementsByName(theNode)[0];
	}
	var fieldType = selectNode.type.toLowerCase();	
	if(fieldType == "select-multiple"){
		// Select all entries
		for(var i=0; i<selectNode.options.length; i++){
			selectNode.options[i].selected = true;
		}
	}
}

/**
* Programmatically check radio buttons or checkboxes based on their values
* The first argument is the name of the group
* The second argument can be a simple value or a comma-delimited list (for checkboxes)
*/
tmt.form.checkGroup = function(groupName, values){
	// Split in case we got a comma-separated list (for checkboxes)
	var valueArray = values.split(",");
	var groupNodes = document.getElementsByName(groupName);
	for(var i=0; i<groupNodes.length; i++){
		for(var j=0; j<valueArray.length; j++){
			if(groupNodes[i].value == valueArray[j]){
				groupNodes[i].checked = true;
			}
		}
	}
}

/**
* Uncheck a whole group of radio buttons or checkboxes
*/
tmt.form.resetGroup = function(groupName){
	var groupNodes = document.getElementsByName(groupName);
	for(var i=0; i<groupNodes.length; i++){
		groupNodes[i].checked = false;
	}
}

/**
* Disable a set of form fields
*/
tmt.form.disableFields = function(){
	tmt.setNodeAttribute(arguments, "disabled", true);
}

/**
* Enable a set of form fields
*/
tmt.form.enableFields = function(){
	tmt.setNodeAttribute(arguments, "disabled", false);
}

/**
* Toggle the disabled attribute on a set of form fields. If it's true it set it to false and viceversa
*/
tmt.form.toggleEnableFields = function(){
	for(var i=0; i<arguments.length; i++){
		var fieldNode = tmt.get(arguments[i]);
		if(fieldNode){
			fieldNode.disabled ? fieldNode.disabled = false : fieldNode.disabled = true;
		}
	}
}

/**
* Returns the container form node of a given node. Returns false if the node isn't contained inside a form
*/
tmt.form.getParentForm = function(startNode){
	var parentObj = startNode.parentNode;
	while(parentObj){
		if(parentObj.tagName.toLowerCase() == "body"){
			return false;
		}
		if(parentObj.tagName.toLowerCase() == "form"){
			return parentObj;
		}
		else{
			parentObj = parentObj.parentNode;
			continue;
		}
	}
	// The field is outside of a form
	return false; 
}

/**
* Given an option node, return its value. If no value is available, returns its text
*/
tmt.form.getOptionNodeValue = function(optionNode){
	// Special case for IE
	if(window.ActiveXObject){
		if(optionNode.attributes["value"].specified){
			return optionNode.value;
		}
	}
	else {
		if(optionNode.hasAttribute("value")){
			return optionNode.value;
		}
	}
	return optionNode.text;
}

// Private helper function, undocumented
// Check if a given node is a form field
tmt.form.isFormField = function(fieldNode){
	//var fieldType = fieldNode.type.toLowerCase();
	if(!fieldNode.type){
		return false;
	}
	// Skip "reset" and "button"
	if((fieldNode.type.toLowerCase() == "fieldset") || (fieldNode.type.toLowerCase() == "reset") || (fieldNode.type.toLowerCase() == "button")){
		return false;
	}
	return true
}

/**
* Returns an array, containing all the form fields contained inside a given start node
* Returns an empty array if no fields are available
*/
tmt.form.getChildFields = function(startNode){
	var childFields = [];
	var childNodes = tmt.getAllNodes(startNode);
	for(var i=0; i<childNodes.length; i++){
		if(tmt.form.isFormField(childNodes[i])){
			childFields.push(childNodes[i]);
		}
	}
	return childFields;
}

/**
* Returns an array of submit button nodes contained inside a given node
*/
tmt.form.getSubmitNodes = function(startNode){
	var inputNodes = startNode.getElementsByTagName("input");
	return tmt.filterNodesByAttributeValue("type", "submit", inputNodes);
}

/**
* Given a form field, return all fields contained inside the same form that share the same name
* Handy to retrieve a whole set of radio/checkboxes
*/
tmt.form.getFieldGroup = function(fieldNode){
	var boxes = [];
	if(fieldNode.name){
		boxes = tmt.getNodesByAttributeValue("name", fieldNode.name, fieldNode.form);
	}
	return boxes;
}

/**
* Returns the value of a given form field
* Accepts either ids (strings) or DOM node references
* If getGroupValue argument is set to true (default to false) and fieldNode is either a radio or a checkbox; returns the value of the whole group of fields
* In order to make getGroupValue work as expected checkboxes and radio must have a "name" attribute
*/
tmt.form.getValue = function(field, getGroupValue){
	var retValue = "";
	var fieldNode = tmt.get(field);
	var fieldType = fieldNode.type.toLowerCase();	
	// Handle different kind of fields
	switch(fieldType){
		case "select-multiple":
			for(var j = 0; j < fieldNode.options.length; j++){
				if(fieldNode.options[j].selected){
					if(retValue == ""){
						retValue = tmt.form.getOptionNodeValue(fieldNode.options[j]);
					}
					else{
						retValue += ",";
						retValue += tmt.form.getOptionNodeValue(fieldNode.options[j]);
					}
				}
			}
			break;
		case "select-one":
			for(var k = 0; k < fieldNode.options.length; k++){
				if(fieldNode.options[k].selected){
					retValue = tmt.form.getOptionNodeValue(fieldNode.options[k])
					break;
				}
			}
			break;
		// Radio and checkboxes get handled the same way
		case "radio":
		case "checkbox":
			if(!getGroupValue || !fieldNode.name){
				// Get only the value of this specific box, not its whole group
				if(fieldNode.checked){
					retValue = fieldNode.value;
				}
			}
			else{
				// Collect the value out of the whole group
				var boxes = tmt.form.getFieldGroup(fieldNode);
				retValue = tmt.form.getGroupValue(boxes);
			}
			break;
		// Skip reset
		case "reset":
			break;
		// Skip buttons
		case "button":
			break;
		// default handles all the text fields
		default:
			// TinyMCE and IE 
			if(window.ActiveXObject && fieldNode.id && (typeof(tinyMCE) != "undefined") && tinyMCE.get(fieldNode.id)){
				retValue = tinyMCE.get(fieldNode.id).getContent();
			}
			// Plain vanilla text field
			else{
				retValue = fieldNode.value;
			}
			break;
	}
	return retValue;
}

// Helper, private function, undocumented
// Collect values out of a group of checkboxes/radio
// Don't use for other kind of fields!
tmt.form.getGroupValue = function(boxes){
	var values = [];
	for(var i = 0; i < boxes.length; i++){
		if(boxes[i].checked){
			values.push(boxes[i].value);
		}	
	}
	return values.toString();
}

/**
* Assembles field name/value pairs from a given form, returns an object
*/
tmt.form.hashForm = function(formNode, demoronize){
	var valueObj = {};
	for(var i = 0; i < formNode.elements.length; i++){
		var fieldNode = formNode.elements[i];
		// Skip fieldsets and field without name attribute
		if(!fieldNode || !fieldNode.name || fieldNode.tagName.toLowerCase() == "fieldset"){
			continue;
		}
		var fieldName = fieldNode.name;
		valueObj[fieldName] = tmt.form.getValue(fieldNode, true);
	}
	return valueObj;
}

/**
* Assembles field name/value pairs from a given form, returns an encoded string
*/
tmt.form.serializeForm = function(formNode, demoronize){
	return tmt.hashToEncodeURI(tmt.form.hashForm(formNode, demoronize));
}

/**
* Reset the values of each element in a given form to blank
*/
tmt.form.clearForm = function(formNode){
	tmt.form.clearFields(formNode.elements);
}

/**
* Reset the values of a given array/nodeList of form fields
*/
tmt.form.clearFields = function(fieldNodes){
	for(var i = 0; i < fieldNodes.length; i++){
		tmt.form.clearField(fieldNodes[i]);
	}
}

/**
* Reset the value of a given form field
*/
tmt.form.clearField = function(fieldNode){
	// Skip fieldsets
	if(!fieldNode || fieldNode.tagName.toLowerCase() == "fieldset"){
		return;
	}
	var fieldType = fieldNode.type.toLowerCase();	
	// Handle different kind of fields
	switch(fieldType){
		case "select-multiple":
		case "select-one":
			fieldNode.selectedIndex = -1;
			break;
		// Radio and checkboxes get handled the same way
		case "radio":
		case "checkbox":
			fieldNode.checked = false;
			break;
		// Skip reset
		case "reset":
			break;
		// Skip buttons
		case "button":
			break;
		// default handles all the text fields
		default:
			fieldNode.value = "";
			break;
	}
}

tmt.form.MSG_BOX_ID = "tmtFormMessageBox";

// Private helper function, undocumented
// Generate an id that will identify the box who belongs to the given form
tmt.form.generateBoxId = function(formNode){
	var errorId = tmt.form.MSG_BOX_ID
	if(formNode.getAttribute("id")){
		errorId += formNode.getAttribute("id");
	}
	else if(formNode.getAttribute("name")){
		errorId += formNode.getAttribute("name");
	}
	return errorId;
}

/**
* Display a message a message associated with a given form node
*/
tmt.form.displayMessage = function(formNode, html){
	tmt.form.displayBox(formNode, html, tmt.form.MESSAGE_CLASS);
}

/**
* Display a message an error message associated with a given form node
*/
tmt.form.displayErrorMessage = function(formNode, html){
	tmt.form.displayBox(formNode, html, tmt.form.ERROR_MESSAGE_CLASS);
}

/**
* Display a box with a message associated with a given form node
* Overwrite this method if you want to change the way tmt.form.displayMessage and tmt.form.displayErrorMessage behaves
*/
tmt.form.displayBox = function(formNode, html, cssClass){
	if(!cssClass){
		cssClass = tmt.form.MESSAGE_CLASS;
	}
	// Create a <div> that will act as an error display
	var displayNode = document.createElement("div");
	// Create an id that will identify the box who belongs to this specific form and assign it to the <div>
	var errorId = tmt.form.generateBoxId(formNode);
	displayNode.setAttribute("id", errorId);
	displayNode.className = cssClass;
	displayNode.innerHTML = html;		
	var oldDisplay = tmt.get(errorId);
	// If an error display is already there, we replace it, if not, we create one from scratch 
	if(oldDisplay){
		formNode.parentNode.replaceChild(displayNode, oldDisplay);
	}
	else{
		formNode.parentNode.insertBefore(displayNode, formNode);
	}
}

/**
* Remove a message box (if any) associated with a given form node
*/
tmt.form.removeDisplayBox = function(formNode){
	var errorId = tmt.form.generateBoxId(formNode);
	var oldDisplay = tmt.get(errorId);
	// If an error display is already there, get rid of it
	if(oldDisplay){
		oldDisplay.parentNode.removeChild(oldDisplay);
	}
}

/**
* Replace MS Word's non-ISO characters with plausible substitutes
*/
tmt.form.stringDemoronizer = function(str){
	str = str.replace(new RegExp(String.fromCharCode(710), "g"), "^");
	str = str.replace(new RegExp(String.fromCharCode(732), "g"), "~");
	// Evil "smarty" quotes
	str = str.replace(new RegExp(String.fromCharCode(8216), "g"), "'");
	str = str.replace(new RegExp(String.fromCharCode(8217), "g"), "'");
	str = str.replace(new RegExp(String.fromCharCode(8220), "g"), '"');
	str = str.replace(new RegExp(String.fromCharCode(8221), "g"), '"');
	// More garbage
	str = str.replace(new RegExp(String.fromCharCode(8211), "g"), "-");
	str = str.replace(new RegExp(String.fromCharCode(8212), "g"), "--");
	str = str.replace(new RegExp(String.fromCharCode(8218), "g"), ",");
	str = str.replace(new RegExp(String.fromCharCode(8222), "g"), ",,");
	str = str.replace(new RegExp(String.fromCharCode(8226), "g"), "*");
	str = str.replace(new RegExp(String.fromCharCode(8230), "g"), "...");
	str = str.replace(new RegExp(String.fromCharCode(8364), "g"), "€");
	return str;
}
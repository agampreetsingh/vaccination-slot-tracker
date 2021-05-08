function addClassValues(element, classValues){
    var existingClassValues = element.getAttribute("class");
    var newClassValues = existingClassValues + " " + classValues;
    return newClassValues;
}

function removeClassValue(element, classValue){
    var existingClassValues = element.getAttribute("class");
    var valueAfterRemoving = existingClassValues.replace(" "+classValue+" ","");
    return valueAfterRemoving;
}
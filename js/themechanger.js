var pageNavbar = document.getElementById("page-navbar");
var page = document.getElementsByTagName("body")[0];
var lightThemeButton = document.getElementById("lightThemeButton");
var darkThemeButton = document.getElementById("darkThemeButton");
var dataTable = document.getElementById("table");

function addClassValues(element, classValues){
    var existingClassValues = element.getAttribute("class");
    var newClassValues = existingClassValues + " " + classValues;
    return newClassValues;
}

function removeClassValue(element, classValue){
    var existingClassValues = element.getAttribute("class");
    console.log("dadasfafasda "+existingClassValues);
    var valueAfterRemoving = existingClassValues.replace(" "+classValue,"");
    return valueAfterRemoving;
}

function replaceClassValues(element, valueToChange, changedValue){
    var removedValue =  removeClassValue(element,valueToChange)
    console.log("dsadasad"+removedValue)
    element.setAttribute("class",removedValue);

    var newValue = addClassValues(element, changedValue);
    console.log(newValue);
    element.setAttribute("class", newValue);
}


function enableLightTheme(){
    lightThemeButton.setAttribute("style","pointer-events:none");
    darkThemeButton.setAttribute("style","pointer-events:auto");
    replaceClassValues(pageNavbar,"bg-warning", "bg-primary");
    replaceClassValues(page, "bg-dark", " ");
    replaceClassValues(page, "text-light", " ");
    replaceClassValues(dataTable, "table-dark"," ");
    replaceClassValues(dataTable, "text-white"," ")

}

function enableDarkTheme(){
    darkThemeButton.setAttribute("style","pointer-events:none");
    lightThemeButton.setAttribute("style","pointer-events:auto");
    replaceClassValues(pageNavbar,"bg-primary", "bg-warning");
    replaceClassValues(page," ", "bg-dark");
    replaceClassValues(page, " ", "text-light");
    replaceClassValues(dataTable, " " , "table-dark");
    replaceClassValues(dataTable, " ", "text-white")

}
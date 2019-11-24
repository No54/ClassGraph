/*jshint esversion:6*/
import "fileDisplay.js";

function init(){
    var pathStr = document.getElementById("filesPath").nodeValue;
    fileDisplay(pathStr);
}
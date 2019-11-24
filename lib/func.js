/*jshint esversion:6*/
//import "fileDisplay.js";

function init(){
    var pathStr = document.getElementById("filesPath").value;
    console.log(pathStr);
    fileFinder(pathStr,function(){
        console.log("done");
        console.log(fileSet);
    });
   
}
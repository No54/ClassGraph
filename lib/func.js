/*jshint esversion:6*/

function init() {

    fileSet = [];
    classSet = [];


    var colorSet = [
        'rgb( 255,0,0)', //赤 
        'rgb(255,128,0)', //橙 
        'rgb(255,255,0)', //黄 
        'rgb(0,255,0)', //绿 
        'rgb(0,255,128)', //草绿
        'rgb(0,255,255)', //青 
        'rgb(0,0,255)', //蓝 
        'rgb(128,0,255)', //紫
        'rgb(255,0,255)'  //品红
    ];

    var pathStr = document.getElementById("filesPath").value;
    console.log(pathStr);
    fileFinder(pathStr, function () {

        console.log("done");
        console.log(fileSet);

        var classMap = [];

        //get classSet
        for (let csFile of fileSet) {
            let content = getFileContent(csFile);
            //console.log(content);

            let curNameSpace = "";

            let namespaceReg = /\bnamespace\b[ ]+\b[0-9a-zA-Z_\.]+\b/;
            let namespaceTest = content.match(namespaceReg);
            if (namespaceTest) {
                //console.log(namespaceTest);
                curNameSpace = namespaceTest[0].split(" ")[1];
            }

            let lineSet = content.split("\r\n");
            for (let singleLine of lineSet) {
                //console.log(singleLine);

                let classReg = /\bclass\b[ ]+\b[0-9a-zA-Z_\.]+\b/;
                let classTest = singleLine.match(classReg);
                if (classTest) {
                    //console.log(classTest);
                    classSet.push(curNameSpace + "." + classTest[0].split(" ")[1]);
                    classMap.push({
                        className: curNameSpace + "." + classTest[0].split(" ")[1],
                        path: csFile
                    });
                }

            }
            //console.log(classSet);
        }

        var nodesSet = [];
        for (var singleClass of unique(classSet)) {
            nodesSet.push({
                id: singleClass,
                label: singleClass
            });
        }
        var nodes = new vis.DataSet(nodesSet);

        var edgesSet = [];
        //get edges
        for (let classObj of classMap) {
            let content = getFileContent(classObj.path);

            for (let className of classSet) {
                if (content.indexOf(className) >= 0) {
                    edgesSet.push({
                        from: className,
                        to: classObj.className,
                        arrows: {
                            to: {
                                enabled: true,
                                type: 'arrow'
                            }
                        }
                    });
                }
            }
        }
        var edges = new vis.DataSet(edgesSet);

        // create a network
        var container = document.getElementById('visNetWorkDiv');
        var data = {
            nodes: nodes,
            edges: edges
        };
        var options = {};
        var network = new vis.Network(container, data, options);

    });
}

function unique(arr) {
    return Array.from(new Set(arr));
}
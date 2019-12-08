/*jshint esversion:6*/
var network;

function init() {

    fileSet = []; //文件集合
    classSet = []; //类集合
    namespaceSet = []; //命名空间集合

    var colorSet = [
        'rgb(255,0,0)', //赤 
        'rgb(255,128,0)', //橙 
        'rgb(255,255,0)', //黄 
        'rgb(0,255,0)', //绿 
        'rgb(0,255,128)', //草绿
        'rgb(0,255,255)', //青 
        'rgb(0,0,255)', //蓝 
        'rgb(128,0,255)', //紫
        'rgb(255,0,255)', //品红

        'rgb(255,64,0)', //一种红 
        'rgb(255,192,0)', //土黄  
        'rgb(255,0,64)', //一种红
        'rgb(255,0,192)', //藕荷色 
        'rgb(64,255,0)', //柠绿
        'rgb(192,255,0)', //柠黄 
        'rgb(0,255,64)', //一种绿
        'rgb(0,255,192)', //一种浅绿 
        'rgb(0,64,255)', //一种蓝
        'rgb(0,192,255)', //一种天蓝色 
        'rgb(64,0,255)', //一种蓝
        'rgb(192,0,255)', //浅紫 
    ];

    var pathStr = document.getElementById("filesPath").value;
    //console.log(pathStr);
    fileFinder(pathStr, function () {

        //console.log("done");
        //console.log(fileSet); 
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
                    namespaceSet.push(curNameSpace); //填入命名空间
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
        for (let singleClass of unique(classSet)) {

            namespaceSet = unique(namespaceSet);
            let color = 'rgb(0,0,0)';
            for (let ns of namespaceSet) {
                if (singleClass.indexOf(ns) == 0) {
                    let idx = namespaceSet.indexOf(ns) % colorSet.length;
                    color = colorSet[idx];
                }
            }

            nodesSet.push({
                id: singleClass,
                label: singleClass,
                color: color
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

        var options = {

            //   "physics": {
            //       enabled:false 
            //   }

        };
        network = new vis.Network(container, data, options);

    });
}

function unique(arr) {
    return Array.from(new Set(arr));
}

function cPhy() { 
    network.setOptions({
        "edges": {
            "smooth": false
        },
        "physics": {
            enabled: false
        }
    });
}
var fs = require('fs');

function fileFinder(folder, callback) {
    fs.readdir(folder, function (err, files) {
        var count = 0;
        var checkEnd = function () {
            ++count == files.length && callback();
        };

        files.forEach(function (file) {
            var fullPath = folder.replace(/\\/g,'/') + '/' + file;

            fs.stat(fullPath, function (err, stats) {
                if (stats.isDirectory()) {
                    return fileFinder(fullPath, checkEnd);
                } else {

                    console.log(fullPath);

                    if(fullPath.endsWith(".cs"))
                    {
                        fileSet.push(fullPath);
                    }
                    /*not use ignore files*/
                    // if (file[0] == '.') {

                    // } else {
                    //     fileList.push(fullPath);
                    // }
                    checkEnd();
                }
            });
        });

        //为空时直接回调
        files.length === 0 && callback();
    });
}

// var fileList  = [];
// var timeStart = new Date();

// fileFinder('D:/github/oncedoc', function(filePath) {
//   console.log('done', new Date() - timeStart);
//   console.log(fileList);
// });


function getFileContent(inFile)
{
    return fs.readFileSync(inFile, 'utf-8');
}
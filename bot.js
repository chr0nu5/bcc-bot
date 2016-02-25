var execSync = require('child_process').execSync;
var fs = require('fs');
var latex = require("latex");

//create the PDF folder for cached files
var dir = 'mkdir -p ./pdf';
var child = execSync(dir, (err, stdout, stderr) => {
    if (err) {
        console.log(err);
    }
});

function convertToLaTeX(array) {
    var tmpFile = `./pdf/${Date.now()}.pdf`,
        ws = fs.createWriteStream(tmpFile);
    ws.on('finish', function() {
        console.log('done');
    });
    var converted = latex(array).pipe(ws);
    return tmpFile;
}

var latexArray = [
    "\\documentclass{article}",
    "\\title{This is my first document}",
    "\\author{Yossi Gil}",
    "\\date{Hayom yom shishi}",
    "\\begin{document}",
    "Hello!",
    "\\end{document}",
]

var pdf = convertToLaTeX(latexArray);

console.log(pdf);

var SlackBot = require('slackbots');
var execSync = require('child_process').execSync;
var fs = require('fs');
var latex = require("latex");
var config = require('./config.json');

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

var alan = new SlackBot({
    token: config.SLACK_BOT_TOKEN,
    name: 'Alan Turing'
});

alan.on('start', function() {
    // define existing username instead of 'user_name'
    //alan.postMessageToUser('chr0nu5', 'meow!');
    //alan.postMessage('D0PBTRA0N','me');
});

alan.on('message', function(data) {
    // all ingoing events https://api.slack.com/rtm
    if (data.type === "message") {
        var regex = data.text.match(/\[(.*?)\]/i);
        if (regex && regex[1]) {
            var command = regex[1];
            var content = data.text.replace('[' + command + ']', '').trim();
            alan.postMessage(data.user, 'Command `' + command + '` received.', {
                "as_user": true
            });

            //process LaTeX documents
            if (command === "latex") {
                content = content.split("\n");
                content.shift();
                content.pop();
                var pdf = convertToLaTeX(content);
                console.log(pdf);
            }
        }
    }
});

/*
[latex]
```
\documentclass{article}
\title{This is my first document}
\author{Yossi Gil}
\date{Hayom yom shishi}
\begin{document}
Hello!
\end{document}
```
*/

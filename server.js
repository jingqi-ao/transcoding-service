// Transcoder-server
//
//      Dedicated server for .3gp to .wav transcoding
//      Use HTTPS to encrypt the user's voice file

var https = require('https');

var express = require('express');
var app = express();

var formidable = require('formidable');

var fs = require('fs-extra');

var findRemoveSync = require('find-remove');

var port = null;
if(process.env.TRANSCODING_SERVER_PORT) {
    console.log("process.env.TRANSCODING_SERVER_PORT is: " + process.env.TRANSCODING_SERVER_PORT);
    port = process.env.TRANSCODING_SERVER_PORT;
} else {
    port = 8443;
    console.log("process.env.TRANSCODING_SERVER_PORT is NOT set. Use default port: " + port);
}

var Transcoder = require("./modules/Transcoder.js");
var transcoder = Transcoder();

// Create the temporary folder
var TEMP_FOLDER_FULL_PATH = '/tmp/transcoding-service';
if (!fs.existsSync(TEMP_FOLDER_FULL_PATH)){
    console.log("Creating folder: " + TEMP_FOLDER_FULL_PATH);
    fs.mkdirSync(TEMP_FOLDER_FULL_PATH);
} else {
    console.log("Emptying folder: " + TEMP_FOLDER_FULL_PATH);
    fs.emptyDir(TEMP_FOLDER_FULL_PATH);
}

// Setup HTTPS server
var options = {
    key: fs.readFileSync('certs/server.key'),
    cert: fs.readFileSync('certs/server.crt')
};

https.createServer(options, app).listen(port, function () {
    console.log('Transcoding server is running at: ' + port);
});

// POST /api/v1/transcode
// Expect body:
// {
//     audio: FILE
// }

app.post('/api/v1/transcode', function (req, res) {

    var form = new formidable.IncomingForm();
    form.encoding = 'binary';
    form.uploadDir = TEMP_FOLDER_FULL_PATH;

    form.parse(req, function(err, fields, files) {

        if(err) {

            console.log("error");
            console.log(err);

            res.status(500).end();

            return;
        }

        console.log("fields");
        console.log(fields);

        // From 3GPP file to .wav file
        var file = files.audio;

        console.log(typeof file);

        var threeGPPFileFullPath = file.path;
        var wavFileFullPath = file.path + '.wav';

        // Transcaode .3gpp file to .wav file
        transcoder.threeGPPtoWav(threeGPPFileFullPath, wavFileFullPath);

        // Read .wav file
        var wavFileBuffer = fs.readFileSync(wavFileFullPath);

        //fs.writeFileSync('/tmp/transcoding-service/onServer.wav', wavFileBuffer, 'binary');

        console.log("check output");
        console.log(typeof wavFileBuffer);
        console.log(wavFileBuffer.length);

        res.status(200).send(wavFileBuffer);

    }); // form.parse()

});

// Cleanup job (delete file that is older than 1 hour)
function periodicCleanup() {
    console.log("Start cleaning up: " +  TEMP_FOLDER_FULL_PATH);
    var result = findRemoveSync(TEMP_FOLDER_FULL_PATH, {age: {seconds: 3600}});
    console.log("Cleanup result");
    console.log(result);
}

// Run clean up job every 15 mins
setInterval(
    function(){
        periodicCleanup();
    }, 
    15*60*1000
);

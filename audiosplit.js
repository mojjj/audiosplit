/*
config file format

CronosEpic.mp3
00:00 Meraki
03:11 Czar
06:40 Cronos
10:01 Hiraeth
12:59 Voyager
16:18 Argonaut
20:00 Oblivion
23:26 Lords Of Arkhmar
26:35 Shadow King
29:46 Lords Of Arkhmar
33:10 Hyde
36:14 Devils Advocate
39:40 Cronos Chamber Mix
 */


const fs = require('fs');
let splitterConfig = {
    audioFileName: '',
    data: [],
};

const configfilename = process.argv[2];
console.log('reading file config from', configfilename);

const lines = require('fs').readFileSync(configfilename, 'utf-8').split('\n');

lines.forEach(function (line) {
    if (line !== '') {
        if (line.includes('.mp3')) {
            splitterConfig.audioFileName = line.trim();
        } else {
            const startTime = line.split(/ (.+)/)[0].trim();
            const title = line.split(/ (.+)/)[1].trim();
            splitterConfig.data.push({startTime, name: title, trackLength: ''});
        }
    }
});


for (let i = 0; i < splitterConfig.data.length; i++) {
    if (i + 1 > splitterConfig.data.length - 1) {
        splitterConfig.data[i].trackLength = '9001';
    } else {
        splitterConfig.data[i].trackLength = calcLength(splitterConfig.data[i].startTime, splitterConfig.data[i + 1].startTime);
    }
}

//console.dir(splitterConfig);
let splitterCmd = '';
splitterConfig.data.forEach(function (track) {
    splitterCmd = 'avconv -i ' + splitterConfig.audioFileName + ' -ss ' + track.startTime + ' -t ' + track.trackLength + ' ' + track.name;
    console.log(splitterCmd);

    let exec = require('child_process').exec, child;
    child = exec(splitterCmd,
        function (error, stdout, stderr) {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if (error !== null) {
                console.log('exec error: ' + error);
            }
        });
    child();
});

function calcLength(start, end) {
    let trackLength = timeToSeconds(end) - timeToSeconds(start);
    return trackLength;
}

function timeToSeconds(time) {
    let sArr = time.split(':');
    let ts = {hour: 0, minute: 0, second: 0};

    switch (sArr.length) {
        case 3:
            ts.hour = parseInt(sArr[0], 10);
            ts.minute = parseInt(sArr[1], 10);
            ts.second = parseInt(sArr[2], 10);
            break;
        case 2:
            ts.minute = parseInt(sArr[0], 10);
            ts.second = parseInt(sArr[1], 10);
            break;
        case 1:
            ts.second = parseInt(sArr[0], 10);
            break;
        default:
            console.log('wrong format?');
    }
    return toSeconds(ts).toString();
}

function toSeconds(time) {
    return time.hour * 60 * 60 + time.minute * 60 + time.second
}

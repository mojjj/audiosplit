const fs = require('fs');
const shell = require('shelljs');

if (process.argv.length < 3) {
    console.log('missing config file parameter');
    console.log('usage: node audiosplit sampleConfig.txt');
    process.exit(1);
}

let splitterConfig = {
    audioFileName: '',
    data: [],
};

// read config file
const configFileName = process.argv[2];
console.log('reading file config from', configFileName);
const lines = fs.readFileSync(configFileName, 'utf-8').split('\n');
lines.forEach(function (line, idx) {
    if (line !== '') {
        if (line.includes('.mp3')) {
            splitterConfig.audioFileName = line.trim();
        } else {
            const startTime = line.split(/ (.+)/)[0].trim();
            const title = idx + '_' + line.split(/ (.+)/)[1].trim().replace(/ /gi, '_') + '.mp3';
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
shell.exec('mkdir -p output');

splitterConfig.data.forEach(function (track) {
    splitterCmd = 'avconv -i ' + splitterConfig.audioFileName + ' -ss ' + track.startTime + ' -t ' + track.trackLength + ' -y output/' + track.name;
    console.log(splitterCmd);

    let child = shell.exec(splitterCmd, {async: true});
    if (child.exitCode !== 0) {
        console.log('something went wrong for ', splitterCmd);
        console.log(child.stderr);
    }
});

function calcLength(start, end) {
    return timeToSeconds(end) - timeToSeconds(start);
}

function timeToSeconds(tString) {
    let timeArr = tString.split(':');
    let ts = {hour: 0, minute: 0, second: 0};
    switch (timeArr.length) {
        case 3:
            ts.hour = parseInt(timeArr[0], 10);
            ts.minute = parseInt(timeArr[1], 10);
            ts.second = parseInt(timeArr[2], 10);
            break;
        case 2:
            ts.minute = parseInt(timeArr[0], 10);
            ts.second = parseInt(timeArr[1], 10);
            break;
        case 1:
            ts.second = parseInt(timeArr[0], 10);
            break;
        default:
            console.log('wrong format (required HH:mm:ss)? given: ', tString);
    }
    return toSeconds(ts).toString();
}

function toSeconds(ts) {
    return ts.hour * 60 * 60 + ts.minute * 60 + ts.second
}

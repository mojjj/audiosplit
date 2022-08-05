# audiosplit
batch split large audiofiles by config file definition with ffmpeg

preconditions (software):
* nodejs 14.x.x
* npm: 6.x.x
* ffmpeg 4.2.7 (tested on Ubuntu 20.04 LTS)

preconditions (data):
* a (large) audiofile.
* a config file for the source audio file and the split times. a default config file is added in the basedir (sampleConfig.txt)

preparation:
* npm install

usage: (the file 'audiosplit.js, the config-file and the audio-file are in the base folder)
* execute the following command in your favorite terminal
* node audiosplit sampleConfig.txt


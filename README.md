# audiosplit
batch split large audiofiles by config file definition

preconditions (software):
* nodejs 8.12.0
* npm: 6.4.1
* avconv (from ffmpeg version 2.8.15-0 on Ubuntu 16.04)

preconditions (data):
* a (large) audiofile.
* a config file for the source audio file and the split times. a default config file is added in the basedir (sampleConfig.txt)

preparation:
* npm install

usage: (the file 'audiosplit.js, the config-file and the audio-file are in the same folder)
* execute the following command in your favorite terminal
* node audiosplit sampleConfig.txt


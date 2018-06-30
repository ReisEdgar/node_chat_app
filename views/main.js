'use strict';

// On this codelab, you will be streaming only video (video: true).
const hdConstraints = 

	{
    video: true,
};


// Video element where stream will be placed.
const localVideo = document.querySelector('video');

// Handles success by adding the MediaStream to the video element.
function gotLocalMediaStream(mediaStream) {
  localVideo.srcObject = mediaStream;
}

// Handles error by logging a message to the console with the error message.
function handleLocalMediaStreamError(error) {
  console.log('navigator.getUserMedia error: ', error);
}

// Initializes media stream.
navigator.mediaDevices.getUserMedia(hdConstraints)
  .then(gotLocalMediaStream).catch(handleLocalMediaStreamError);

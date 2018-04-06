let theStream;
var btnGrabVideo = document.querySelector("[data-grab-video]");
var btnTakePhoto = document.querySelector("[data-take-photo]");

btnGrabVideo.addEventListener("click", grabVideo);
btnTakePhoto.addEventListener("click", prepareTakePhoto);

function gotMedia(mediaStream) {
  theStream = mediaStream;
  let video = document.querySelector("video");

  video.srcObject = mediaStream;
  video.onloadedmetadata = function() {
    video.play();
  };
  return mediaStream;
}

function stream(str) {
  console.log("stream", str);
}

function grabVideo(event) {
  /*
	navigator.mediaDevices.enumerateDevices()
		.then(function(devices) {
			return devices.filter(device => device.kind === 'videoinput')
		})
		.then(function(videoInput) {
			const debugElement = document.querySelector('[data-debug-text]')
			debugElement.textContent = JSON.stringify(videoInput)
			console.log(videoInput)
		})
	*/

  navigator.mediaDevices
    .getUserMedia({
      video: true
    })
    .then(gotMedia)
    .then(stream)
    .catch(error => console.error("getUserMedia() error:", error));
}

function prepareTakePhoto() {
  if (!("ImageCapture" in window)) {
    alert("Unfortunately your browser does not support taking a photo.");
    return;
  }

  if (!theStream) {
    alert("Grab the video stream first, please.");
    return;
  }

  const mediaStreamTrack = theStream.getVideoTracks()[0];
  const theImageCapturer = new ImageCapture(mediaStreamTrack);
  takePhoto(theImageCapturer);
}

function takePhoto(imageCaptureObj) {
  console.log("imageCaptureObj test", imageCaptureObj);

  imageCaptureObj
    .takePhoto()
    .then(blob => {
      console.log("getting blob...");
      let theImageTag = document.getElementById("imageTag");
      theImageTag.src = URL.createObjectURL(blob);
      console.log("Tesseract", Tesseract);

      Tesseract.recognize(blob)
        .catch(err => console.error("err", err))
        .then(result => console.log("tesseract result", result))
        .finally(resultOrError =>
          console.log("tesseract finally", resultOrError)
        );
    })
    .catch(err => alert("Error taking photo: " + err));
}

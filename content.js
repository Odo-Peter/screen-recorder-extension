function videoId(date) {
  //Untititled-2023-11-23-15:55:34
  return `Untititled-${date.getFullYear()}-${date.getMonth()}-${date.getDay()}-${date.getHours()}_${date.getMinutes()}_${date.getSeconds()}`;
}

var recorder = null;

function onAccessApproved(stream) {
  recorder = new MediaRecorder(stream);
  recorder.start();

  recorder.onstop = function () {
    stream.getTracks().forEach(function (track) {
      if (track.readyState === 'live') {
        track.stop();
      }
    });
  };

  // const reader  = new FileReader()
  recorder.ondataavailable = function (e) {
    let recordedBlob = e.data;
    let url = URL.createObjectURL(recordedBlob);
    let id = videoId(new Date());
    let a = document.createElement('a');
    a.href = url;
    a.download = `${id}.webm`;

    let redirectUrl = document.createElement('a');
    redirectUrl.href = 'http://localhost:3000/video_uploads';

    document.body.appendChild(a);
    document.body.appendChild(redirectUrl);

    a.click();
    redirectUrl.click();

    document.body.removeChild(a);
    document.body.removeChild(redirectUrl);

    URL.revokeObjectURL(url);
  };
}

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.action === 'request_recording') {
    console.log('requesting recording');
    sendResponse(`processed: ${message.action}`);
    let captureStream;
    try {
      captureStream = await navigator.mediaDevices.getDisplayMedia({
        audio: true,
        video: true,
      });
      onAccessApproved(captureStream);
    } catch (error) {
      console.error(error);
    }
  }
});

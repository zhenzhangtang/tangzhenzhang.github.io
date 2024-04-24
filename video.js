var myVideo = document.getElementById("video");

function playPause() {
  if (myVideo.paused) myVideo.play();
  else myVideo.pause();
}

function showBiger() {
  myVideo.width = 660;
}

function showSmaller() {
  myVideo.width = 420;
}

function backNoraml() {
  myVideo.width = 500;
}

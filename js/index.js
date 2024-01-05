document.addEventListener('DOMContentLoaded', () => {
  //Querying for the buttons from the html file
  const startVideoButton = document.querySelector('#start-record-btn');

  // adding event listeners
  startVideoButton.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: 'request_recording' },
        function (response) {
          if (!chrome.runtime.lastError) {
            console.log(response);
          } else {
            console.log(chrome.runtime.lastError, 'error line 16');
          }
        }
      );
    });
  });
});

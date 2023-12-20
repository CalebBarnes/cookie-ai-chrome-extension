console.log("Background!!123123");
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // console.log(request.html); // This is your HTML
  console.log("request");
  console.log(request);
});

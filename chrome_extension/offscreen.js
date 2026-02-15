    // This URL must point to the public site
    const _URL = 'https://daetrace1.web.app/signInWithPopup.html';
    const iframe = document.createElement('iframe');
iframe.src = _URL;
document.documentElement.appendChild(iframe);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.target !== 'offscreen') return false;
    console.log("hello offscreen");
    
    // Listen for the message from the hosted iframe
    function handleIframeMessage({ data }) {
        try {
            // Check if data is the auth result you expect
            const authResult = JSON.parse(data);
            window.removeEventListener('message', handleIframeMessage);
            sendResponse(authResult);
        } catch (e) { /* ignore non-JSON messages from Firebase internal */ }
    }

    window.addEventListener('message', handleIframeMessage);

    // Tell the hosted page to start the popup
    iframe.contentWindow.postMessage({ initAuth: true }, new URL(_URL).origin);
    
    return true; // Keep message channel open
});
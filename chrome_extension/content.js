
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', checkIfBlocked);
} else {
  checkIfBlocked();
}
function checkIfBlocked() {

    const currentDomain = window.location.hostname;


    try {

    chrome.runtime.sendMessage({ type: 'isDomainBlocked', domain: currentDomain }, (response) => {
    if (chrome.runtime.lastError) {
        console.error("Error:", chrome.runtime.lastError);
        return;
    }
    if (response && response.blocked) {
        // Replace entire page with blocked content
        document.documentElement.innerHTML = `
        <title>Blocked</title>
        <style>
            div {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                margin: 50px;
            }
            h1 {
                font-size: 24px;
                color: #8f0909;
            }
            p {
                font-size: 16px;
                color: #000000;
            }
        </style>
    </head>
    <body>
        <div>
            <h1>Blocked</h1>
            <p>This site is blocked during your session...</p>
            <p> ;-;</p>
        </div>
    </body>
        `;
    }
    });
    } catch (error) {
        console.error("Error checking block status:", error);
    }
}
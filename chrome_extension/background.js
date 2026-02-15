

// Import the functions you need from the SDKs you need from firebase cdn
import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js'
import { getAuth, signInAnonymously, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js'
import { getFirestore } from 'https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js'


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCG5rGAtx0reT03xXM7Q9_epwd3HkLJEOE",
  authDomain: "daetrace1.firebaseapp.com",
  projectId: "daetrace1",
  storageBucket: "daetrace1.firebasestorage.app",
  messagingSenderId: "359895119451",
  appId: "1:359895119451:web:4e03b950c4bae8f1a8f17e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let activeTab = null;
let startTime = null;

let userId = "";
let authToken = "";


onAuthStateChanged(auth, (user) => {
  if (user) {
    userId = user.uid;
    console.log("Signed in as:", userId);
  }
});


// Helper to get domain from URL
function getDomain(url) {
  try {
    return new URL(url).hostname;
  } catch (e) {
    return null;
  }
}

// Called when a tab becomes active
function handleTabChange(tabId) {
  // Get the tab info
  chrome.tabs.get(tabId, (tab) => {
    if (chrome.runtime.lastError) return;

    // End previous session
    if (activeTab && startTime) {
      const duration = Math.floor((Date.now() - startTime) / 1000);
      const domain = getDomain(activeTab.url);
      console.log("Session ended:", {
        userId: userId,
        domain: domain,
        url: activeTab.url,
        startTime: startTime,
        endTime: Date.now(),
        category: "Productive",
        durationSeconds: duration,
      });
    }

    // Start new session
    activeTab = tab;
    startTime = Date.now();
    const domain = getDomain(activeTab.url);

    console.log("Session started:", {
       userId: userId,
       domain: domain,
       url: activeTab.url,
       startTime: startTime,
       endTime: Date.now(),
       category: "Productive",
       durationSeconds: duration,
    });
  });
}

// Listen for tab switches
chrome.tabs.onActivated.addListener((activeInfo) => {
  handleTabChange(activeInfo.tabId);
});

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.active) {
    handleTabChange(tabId);
  }
});

// Optional: detect when Chrome goes idle
chrome.idle.onStateChanged.addListener((state) => {
  console.log("Idle state changed:", state);
});

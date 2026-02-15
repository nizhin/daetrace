
// Import the functions you need from the SDKs you need from firebase cdn
import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js'
import { getFirestore, addDoc, getDoc, collection, query, where, getDocs } from 'https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js'

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


let userEmail = "";

chrome.identity.getProfileUserInfo({ accountStatus: 'ANY' }, (userInfo) => {
  if (userInfo.email) {
    console.log("Chrome User Email:", userInfo.email);
    console.log("Chrome User ID:", userInfo.id);
    userEmail = userInfo.email;
  } else {
    console.log("User is not signed into Chrome or hasn't granted permission.");
  }
});

// Initialize Firebaseimport { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js'
// import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js'

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// --- Tab Tracking Logic ---
let activeTab = null;
let startTime = null;
let currentSessionId = null;

// Helper to get domain from URL
function getDomain(url) {
  try {
    return new URL(url).hostname;
  } catch (e) {
    return null;
  }
}
async function findUserByEmail(email) {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      return userDoc.id;
    }
    return null;
  } catch (error) {
    console.error("Failed to find user:", error);
    return null;
  }
}
async function saveEntry(entryData) {
  try {
    const userId = await findUserByEmail(userEmail);
    if (!userId) {
        console.error("User not found in db, can;t save entry");
        return null;
    }
    const docRef = await addDoc(collection(db, "users", userId, "entries"), entryData);
    console.log("Entry saved:", docRef.id, entryData);
    return docRef.id;
  } catch (error) {
    console.error("Failed to save entry:", error);
    return null;
  }
}
  
// duration in seconds
async function startSession(intendedDuration = 0, name = "") {
  try {
    const userId = await findUserByEmail(userEmail);
    if (!userId) {
        console.error("User not found in db, can't start session");
        return null;
    }
    let now = Date.now();
    let end = new Date(now.getSeconds() + intendedDuration);
    const sessionData = {
      name: name,
      timeStart: now,
      timeEnd: end,
      intendedDuration: intendedDuration,
      actualDuration: 0,
      realEnd: null
    };
    const docRef = await addDoc(collection(db, "users", userId, "sessions"), sessionData);
    currentSessionId = docRef.id;
    // console.log("Session started:", currentSessionId);
    return currentSessionId;
  } catch (error) {
    console.error("Failed to start session:", error);
    return null;
  }
}
async function endSession() {
    if (!currentSessionId || !userEmail) return;
    const userId = await findUserByEmail(userEmail);
    if (!userId) {
        console.error("User not found in db, can't end session");
        return null;
    }
    
    try {
        const sessionRef = doc(db, "users", userId, "sessions", currentSessionId);
        const sessionSnap = await getDoc(sessionRef);
        
        if (!sessionSnap.exists()) {
            console.error("Session not found");
            return null;
        }
        
        const sessionData = sessionSnap.data();
        await updateDoc(sessionRef, {
            realEnd: Date.now(),
            actualDuration: Math.floor((Date.now() - sessionData.timeStart) / 1000)
        });
        // console.log("Session ended:", currentSessionId);
        currentSessionId = null;
    } catch (error) {
        console.error("Failed to end session:", error);
    }
}

function handleTabChange(tabId) {
  chrome.tabs.get(tabId, async (tab) => {
    if (chrome.runtime.lastError || !tab) return;

    // End previous entry and save to Firestore
    if (activeTab && startTime && userEmail) {
      const endTime = Date.now();
      const duration = Math.floor((endTime - startTime) / 1000);
      const domain = getDomain(activeTab.url);
      
      const entryData = {
        userId: userEmail,
        domain: domain,
        url: activeTab.url,
        startTime: startTime,
        endTime: endTime,
        durationSeconds: duration,
        date: startTime,
        sessionId: currentSessionId ?? null
      };
      if (duration > 0) {
        // console.log("Entry ended:", entryData);
        await saveEntry(entryData);
      } else {
        console.log("entry too short to log")
      }
      
    }

    // Start new entry
    activeTab = tab;
    startTime = Date.now();
    // console.log("Entry started:", { userEmail, url: activeTab.url });
  });
}

chrome.tabs.onActivated.addListener((info) => handleTabChange(info.tabId));
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.active) {
    handleTabChange(tabId);
  }
});

// Handle idle state
chrome.idle.onStateChanged.addListener((state) => {
  console.log("Idle state changed:", state);
  if (state === "idle" || state === "locked") {
    // End current entry when user goes idle
    if (activeTab && startTime && userEmail) {
      handleTabChange(-1); // Force save current entry
    }
  }
});

// Handle messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'startSession') {
    startSession(message.duration, message.name)
      .then((sessionId) => {
        sendResponse({ success: !!sessionId, sessionId: sessionId });
      })
      .catch((error) => {
        console.error("Failed to start session:", error);
        sendResponse({ success: false, error: error.message });
      });
    return true; // Keep channel open for async response
  }
  
  if (message.type === 'endSession') {
    endSession()
      .then(() => {
        sendResponse({ success: true });
      })
      .catch((error) => {
        console.error("Failed to end session:", error);
        sendResponse({ success: false, error: error.message });
      });
    return true; // Keep channel open for async response
  }
  
  if (message.type === 'getSessionStatus') {
    sendResponse({ 
      hasActiveSession: !!currentSessionId,
      sessionId: currentSessionId 
    });
  }
});

console.log("Background script loaded");
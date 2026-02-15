
import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js'
import { getFirestore, addDoc, getDoc, updateDoc, doc, collection, query, where, getDocs } from 'https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js'


// https://firebase.google.com/docs/web/setup#available-libraries

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
    refreshBlockedDomains();
  } else {
    console.log("User is not signed into Chrome or hasn't granted permission.");
  }
});

// Initialize Firebaseimport { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js'
// import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js'

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// Tab Tracking Logic
let activeTab = null;
let startTime = null;
let currentSessionId = null;
let blocked_domains = [];

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
async function refreshBlockedDomains() {
  try {
    const userId = await findUserByEmail(userEmail);
    if (!userId) {
      console.error("User not found, can't refresh blocked domains");
      return [];
    }
    const domainsRef = collection(db, "users", userId, "domains");
    const q = query(domainsRef, where("category", "==", "not_productive"));
    const querySnapshot = await getDocs(q);

    const domains = [];
    querySnapshot.forEach((doc) => {
      domains.push(doc.data().name);
    });

    blocked_domains = domains;
    console.log("Blocked domains refreshed:", blocked_domains);
    return blocked_domains;
  } catch (error) {
    console.error("Failed to refresh blocked domains:", error);
    return [];
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
    // refresh the domain list at the start of a sessio, makes sense to do it here
    await refreshBlockedDomains();

    const userId = await findUserByEmail(userEmail);
    if (!userId) {
        console.error("User not found in db, can't start session");
        return null;
    }

    let now = Date.now();
    let end = now + (intendedDuration * 1000);

    const sessionData = {
      name: name,
      timeStart: now,
      timeEnd: end,
      intendedDuration: intendedDuration, // time in seconds
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
    saveCurrentEntry();
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
        const now = Date.now();
        await updateDoc(sessionRef, {
            realEnd: now,
            actualDuration: Math.floor((now - sessionData.timeStart) / 1000) // time in seconds
        });
        // console.log("Session ended:", currentSessionId);
        currentSessionId = null;
    } catch (error) {
        console.error("Failed to end session:", error);
    }
}

function handleTabChange(tabId) {
    if (tabId === undefined || tabId === null || tabId < 0) {
        console.log("Skipping invalid tab ID:", tabId);
    return;
  }

  chrome.tabs.get(tabId, async (tab) => {
    if (chrome.runtime.lastError || !tab) return;

    // End previous entry and save to Firestore
    if (activeTab && startTime && userEmail) {
      const endTime = Date.now();
      const duration = Math.floor((endTime - startTime) / 1000); // Convert to seconds
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

// save current entry for idle state
async function saveCurrentEntry() {
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
    // Reset state
    activeTab = null;
    startTime = null;
  }
}

// Handle idle state
chrome.idle.onStateChanged.addListener((state) => {
  console.log("Idle state changed:", state);
  if (state === "idle" || state === "locked") {
    // End current entry when user goes idle
    saveCurrentEntry();
  }
});

// Handle messages from popup adn content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'startSession') {
    console.log("Starting session with duration:", message.duration, "and name:", message.name);
    startSession(message.duration, message.name)
      .then((sessionId) => {
        console.log("Session started with ID:", sessionId);
        currentSessionId = sessionId;
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
        currentSessionId = null;
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

  if (message.type === 'isDomainBlocked') {
    // Check if domain is blocked
   let isBlocked = false;
    // has to be in a valid session
    if (currentSessionId && message.domain) {
        blocked_domains.forEach((domain) => {
            if (message.domain === domain || message.domain.endsWith('.' + domain)) {
                isBlocked = true;
            }
        });
    }
    sendResponse({ blocked: isBlocked });
    return true;
  }
});

console.log("Background script loaded");
console.log("Popup script loaded");

let timerInterval = null;

//format times, found these on online
// Format seconds to HH:MM:SS 
function formatTime(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Format timestamp to HH:MM AM/PM
function formatEndTime(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

// Update the timer display
function updateTimer(startTime) {
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  document.getElementById("sessionTimer").textContent = formatTime(elapsed);
}

// Show active session UI
function showActiveSession(sessionData) {
  document.getElementById("startSessionForm").classList.add("hidden");
  document.getElementById("activeSession").classList.remove("hidden");
  document.getElementById("activeSessionName").textContent = sessionData.name || "Unnamed Session";
  document.getElementById("targetEndTime").textContent = formatEndTime(sessionData.timeEnd);
  
  // Start timer
  if (timerInterval) clearInterval(timerInterval);
  updateTimer(sessionData.timeStart);
  timerInterval = setInterval(() => updateTimer(sessionData.timeStart), 1000);
}

// Show start session form
function showStartForm() {
  document.getElementById("startSessionForm").classList.remove("hidden");
  document.getElementById("activeSession").classList.add("hidden");
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

// Start a new session
async function startSession() {
  const name = document.getElementById("sessionName").value.trim();
  const durationMinutes = parseInt(document.getElementById("sessionDuration").value) || 0;
  
  if (!name) {
    alert("Please enter a session name");
    return;
  }
  if (durationMinutes <= 0) {
    alert("Please enter a valid duration");
    return;
  }
  
  const durationSeconds = durationMinutes * 60;
  
  // Send message to background script to start session
  chrome.runtime.sendMessage({
    type: 'startSession',
    name: name,
    duration: durationSeconds
  }, (response) => {
    if (response && response.success) {
      // store sessoion shit locally, so we can display it without havign to query
      const sessionData = {
        id: response.sessionId,
        name: name, 
        timeStart: Date.now(),
        timeEnd: Date.now() + (durationSeconds * 1000),
        intendedDuration: durationSeconds
      };
      chrome.storage.local.set({ currentSession: sessionData });
      showActiveSession(sessionData);
    } else {
      alert("Failed to start session");
    }
  });
}


async function endSession() {
 let sesh_name = document.getElementById("sessionName");
 let sesh_duration = document.getElementById("sessionDuration")
  chrome.runtime.sendMessage({ type: 'endSession' }, (response) => {
    chrome.storage.local.get(["currentSession"], (result) => {
        const sessionData = result.currentSession;
        if (sessionData) {
            alert(`Session: ${sesh_name.value} ended\n elapsed time: ${formatTime((Date.now() - sessionData.timeStart) / 1000)}`);
        }
    });

    chrome.storage.local.remove("currentSession");
    showStartForm();
    sesh_name.value = "";
    sesh_duration.value = "";
  });
}

// Check for existing session on load
window.addEventListener("load", () => {
  // Check auth status
  chrome.identity.getProfileUserInfo({ accountStatus: 'ANY' }, (userInfo) => {
    if (userInfo.email) {
      document.getElementById("status").textContent = "Signed in as: " + userInfo.email;
      document.getElementById("status").className = "status signed-in";
    }
  });
  
  // Check for active session
  chrome.storage.local.get(["currentSession"], (result) => {
    if (result.currentSession) {
      const session = result.currentSession;
      // Check if session should still be active (hasn't exceeded intended duration by too much)
      const now = Date.now();
      if (session.timeStart && (now - session.timeStart) < (session.intendedDuration * 1000 * 2)) {
        showActiveSession(session);
      } else {
        // Session expired, clear it
        chrome.storage.local.remove("currentSession");
        showStartForm();
      }
    } else {
      showStartForm();
    }
  });
});

// Add event listeners
document.getElementById("startSessionButton").addEventListener("click", startSession);
document.getElementById("endSessionButton").addEventListener("click", endSession);
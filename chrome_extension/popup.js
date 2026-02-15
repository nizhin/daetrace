
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js'
import { getAuth, signInWithPopup, GoogleAuthProvider, setPersistence, browserLocalPersistence } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js'
console.log("Popup script loaded hihihih");
const firebaseConfig = {
  apiKey: "AIzaSyCG5rGAtx0reT03xXM7Q9_epwd3HkLJEOE",
  authDomain: "daetrace1.firebaseapp.com",
  projectId: "daetrace1",
  storageBucket: "daetrace1.firebasestorage.app",
  messagingSenderId: "359895119451",
  appId: "1:359895119451:web:4e03b950c4bae8f1a8f17e"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

setPersistence(auth, browserLocalPersistence).catch((error) => {
    console.error("Error setting persistence:", error);
});

// Example usage of signInWithPopup
async function signInWithGoogle() {
  console.log("Signing in with Google...");
  try {
   const authWindow = window.open(
      `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${firebaseConfig.apiKey}` +
      `&redirect_uri=https://${chrome.runtime.id}.chromiumapp.org/` +
      `&response_type=token` +
      `&scope=email profile`,
      "auth",
      "width=500,height=600"
    );

    // For now, just store a demo user
    chrome.storage.local.set({
      userId: "demo_user_123",
      email: "user@example.com",
      token: "demo_token"
    });

    console.log("Signed in with Google:", result.user.email);
    document.getElementById("status").textContent = "Signed in as: " + result.user.email;
    document.getElementById("status").className = "status signed-in";
    document.getElementById("signInButton").style.display = "none";
  } catch (error) {
    console.error("Error signing in with Google:", error);
    document.getElementById("status").textContent = "Sign in failed";
    document.getElementById("status").className = "status signed-out";
  }
  
}

window.addEventListener("load", async () => {
  chrome.storage.local.get(["email"], (result) => {
    if (result.email) {
      document.getElementById("status").textContent = "Signed in as: " + result.email;
      document.getElementById("status").className = "status signed-in";
      document.getElementById("signInButton").style.display = "none";
    }
  });
});

document.getElementById("signInButton").addEventListener("click", signInWithGoogle);

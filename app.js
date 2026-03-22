// Type Effect Variables and Function (Only runs on index.html)
const words = ['IT Engineering Student', 'Full-Stack Developer'];
let i = 0, j = 0;
let forward = true;
const typed = document.getElementById('typed-text');

function typeEffect() {
    // Check if 'typed' element exists (i.e., we are on index.html)
    if (typed) { 
        typed.textContent = words[i].substring(0, j);

        if (forward) {
            j++;
            if (j > words[i].length) {
                forward = false;
                setTimeout(typeEffect, 1000); 
                return;
            }
        } else {
            j--;
            if (j < 0) {
                forward = true;
                i = (i + 1) % words.length;
            }
        }
        setTimeout(typeEffect, forward ? 120 : 60); 
    }
}

// Only call typeEffect on index.html
if (typed) {
    typeEffect();
}


// Form Submission Logic (Only runs on index.html)
const form = document.getElementById("contactForm");
const formMsg = document.getElementById("formMsg");

// Check if 'form' element exists before trying to add event listener
if (form) {
    form.addEventListener("submit", async function(event) {
        event.preventDefault(); 

        const formData = new FormData(form);

        try {
            let response = await fetch("https://formspree.io/f/xzzjgpyy", {
                method: "POST",
                body: formData,
                headers: { "Accept": "application/json" }
            });

            if (response.ok) {
                formMsg.style.display = "block";
                formMsg.style.color = "aqua";
                formMsg.textContent = "✅ Thank you! Your message has been sent.";
                form.reset(); // Clear the form on success
            
            } else {
                formMsg.style.display = "block";
                formMsg.style.color = "red";
                formMsg.textContent = "❌ Something went wrong. Try again.";
            }
        } catch (error) {
            formMsg.style.display = "block";
            formMsg.style.color = "red";
            formMsg.textContent = "❌ Error sending message. Check your internet.";
        }
    });
}


// **Mobile Menu Toggle Logic (Runs on ALL pages)**
const hamburger = document.querySelector('.hamburger');
const navbar = document.querySelector('.navbar');
const navLinks = document.querySelectorAll('.nav-link');

if (hamburger && navbar) {
    hamburger.addEventListener('click', () => {
        navbar.classList.toggle('active');
    });
}

// Close the menu when a link is clicked (improves mobile UX)
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (navbar) { 
            navbar.classList.remove('active');
        }
    });
});
/* ================= PORTFOLIO ANALYTICS SYSTEM ================= */

if (typeof firebase !== "undefined") {

const firebaseConfig = {
apiKey: "AIzaSyDZZ9CkBdiS0UJGb5UTT7280p-2SrGxOf0",
authDomain: "portfolio-visitor-fbc1e.firebaseapp.com",
databaseURL: "https://portfolio-visitor-fbc1e-default-rtdb.firebaseio.com",
projectId: "portfolio-visitor-fbc1e",
storageBucket: "portfolio-visitor-fbc1e.firebasestorage.app",
messagingSenderId: "1037738083549",
appId: "1:1037738083549:web:bc4ef62858d74050ff8734"
};

if (!firebase.apps.length) {
firebase.initializeApp(firebaseConfig);
}

const db = firebase.database();

/* -------- SESSION SYSTEM -------- */

function getSessionId(){

let session = localStorage.getItem("portfolio_session");

if(!session){
session = "session_" + Math.random().toString(36).substring(2,10);
localStorage.setItem("portfolio_session", session);
}

return session;
}

const sessionId = getSessionId();

/* -------- DETECT DEVICE -------- */

function getDevice(){

if(/mobile/i.test(navigator.userAgent)) return "Mobile";
if(/tablet/i.test(navigator.userAgent)) return "Tablet";
return "Desktop";

}

/* -------- DETECT BROWSER -------- */

function getBrowser(){

const ua = navigator.userAgent;

if(ua.includes("Chrome")) return "Chrome";
if(ua.includes("Firefox")) return "Firefox";
if(ua.includes("Safari")) return "Safari";
if(ua.includes("Edge")) return "Edge";

return "Unknown";

}

/* -------- TRAFFIC SOURCE -------- */

function getTrafficSource(){

const ref = document.referrer;

if(!ref) return "Direct";

if(ref.includes("google")) return "Google Search";

if(ref.includes("linkedin")) return "LinkedIn";

if(ref.includes("github")) return "GitHub";

return ref;

}

/* -------- FIRST VISITOR DATA -------- */

const sessionRef = db.ref("analytics/sessions/" + sessionId);

fetch("https://ipapi.co/json/")
.then(res=>res.json())
.then(data=>{

sessionRef.once("value",snap=>{

if(!snap.exists()){

const visitorData = {

ip:data.ip,
city:data.city,
region:data.region,
country:data.country_name,

device:getDevice(),
browser:getBrowser(),

screen:screen.width + "x" + screen.height,

language:navigator.language,

timezone:Intl.DateTimeFormat().resolvedOptions().timeZone,

trafficSource:getTrafficSource(),

firstVisit:new Date().toLocaleString()

};

sessionRef.set(visitorData);

/* increase total visitors */

db.ref("analytics/totals/totalVisitors").transaction(count=>{
return (count || 0) + 1;
});

}

});

});

/* -------- PAGE VIEW TRACKING -------- */

db.ref("analytics/totals/totalPageViews").transaction(count=>{
return (count || 0) + 1;
});

/* -------- PAGE VISIT + TIME SPENT -------- */

const startTime = Date.now();

window.addEventListener("beforeunload",()=>{

const timeSpent = Math.round((Date.now() - startTime)/1000);

const visitData = {

page:window.location.pathname,

timeSpentSeconds:timeSpent,

time:new Date().toLocaleString()

};

db.ref("analytics/page_visits/" + sessionId).push(visitData);

});

}
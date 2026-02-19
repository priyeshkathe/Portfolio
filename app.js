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

/* ================= VISITOR COUNTER ================= */

// run only if firebase loaded + visitor element exists
const visitorEl = document.getElementById("visitorCount");

if (visitorEl && typeof firebase !== "undefined") {

    const firebaseConfig = {
        apiKey: "AIzaSyDZZ9CkBdiS0UJGb5UTT7280p-2SrGxOf0",
        authDomain: "portfolio-visitor-fbc1e.firebaseapp.com",
        databaseURL: "https://portfolio-visitor-fbc1e-default-rtdb.firebaseio.com",
        projectId: "portfolio-visitor-fbc1e",
        storageBucket: "portfolio-visitor-fbc1e.firebasestorage.app",
        messagingSenderId: "1037738083549",
        appId: "1:1037738083549:web:bc4ef62858d74050ff8734"
    };

    // Prevent multiple initialization
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }

    const db = firebase.database();
    const visitRef = db.ref("total_visits");

    // Increase count safely
    visitRef.transaction((count) => {
        return (count || 0) + 1;
    });

    // Show count live
    visitRef.on("value", (snapshot) => {
        visitorEl.textContent = snapshot.val();
    });
}

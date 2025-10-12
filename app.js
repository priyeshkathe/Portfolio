const words = ['IT Engineering Student', 'Full-Stack Developer'];
let i = 0, j = 0;
let forward = true;
const typed = document.getElementById('typed-text');

function typeEffect() {
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

typeEffect();


const form = document.getElementById("contactForm");
const formMsg = document.getElementById("formMsg");

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

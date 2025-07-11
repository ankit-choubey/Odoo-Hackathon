// signup.js

// MultipleFiles/signup.js
document.getElementById("signupForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirm = document.getElementById("confirm").value;
  const errorText = document.getElementById("matchError");
  const signupBtn = document.getElementById("signupBtn");

  if (!name || !email || !password || !confirm) {
    alert("Please fill in all fields.");
    return;
  }

  if (password !== confirm) {
    errorText.style.display = "block";
    return;
  } else {
    errorText.style.display = "none";
  }

  signupBtn.disabled = true;
  signupBtn.textContent = "Signing up...";

  try {
    const response = await fetch('/api/signup', { // Replace with your actual backend URL
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, password })
    });

    const data = await response.json();

    if (response.ok) { // Check for 2xx status codes (e.g., 201 Created)
      alert("Signup successful for: " + name);
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      document.getElementById("signupForm").reset(); // Clear form
      window.location.href = "UserProfile.html"; // Redirect after successful signup
    } else {
      alert("Signup failed: " + (data.error || "Unknown error"));
    }
  } catch (error) {
    console.error("Network error during signup:", error);
    alert("An error occurred. Please try again later.");
  } finally {
    signupBtn.disabled = false;
    signupBtn.textContent = "Sign Up";
  }
});
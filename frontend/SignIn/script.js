
// MultipleFiles/script.js
document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const loginBtn = e.target.querySelector('button[type="submit"]'); // Get the submit button

  if (!email || !password) {
    alert("Please fill in both fields.");
    return;
  }

  // Simulate loading state
  loginBtn.disabled = true;
  loginBtn.textContent = "Logging in...";

  try {
    const response = await fetch('/api/login', { // Replace with your actual backend URL if not relative
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json(); // Parse the JSON response

    if (response.ok) { // Check if the response status is 2xx (e.g., 200 OK)
      alert("Login successful for: " + email);
      // Store the token and user info (e.g., in localStorage)
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('currentUser', JSON.stringify(data.user)); // Store user data

      // Redirect to a dashboard or profile page
      window.location.href = "UserProfile.html"; // Assuming UserProfile.html is your dashboard
    } else {
      // Handle errors based on the backend's response
      alert("Login failed: " + (data.error || "Unknown error"));
    }
  } catch (error) {
    // Handle network errors (e.g., server unreachable)
    console.error("Network error during login:", error);
    alert("An error occurred. Please try again later.");
  } finally {
    // Re-enable the button regardless of success or failure
    loginBtn.disabled = false;
    loginBtn.textContent = "Login";
  }
});

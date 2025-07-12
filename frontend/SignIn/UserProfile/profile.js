// profile.js

// MultipleFiles/reset.js
document.getElementById("resetForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const newPassword = document.getElementById("newPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const errorText = document.getElementById("resetMatchError");
  const resetBtn = document.getElementById("resetBtn");

  if (!email || !newPassword || !confirmPassword) {
    alert("Please fill in all fields.");
    return;
  }

  if (newPassword !== confirmPassword) {
    errorText.style.display = "block";
    return;
  } else {
    errorText.style.display = "none";
  }

  resetBtn.disabled = true;
  resetBtn.textContent = "Resetting...";

  try {
    const response = await fetch('/api/reset-password', { // Replace with your actual backend URL
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, newPassword })
    });

    const data = await response.json();

    if (response.ok) {
      alert("Password reset successful for: " + email);
      document.getElementById("resetForm").reset();
      // Optionally redirect to login page
      window.location.href = "Login.html";
    } else {
      alert("Password reset failed: " + (data.error || "Unknown error"));
    }
  } catch (error) {
    console.error("Network error during password reset:", error);
    alert("An error occurred. Please try again later.");
  } finally {
    resetBtn.disabled = false;
    resetBtn.textContent = "Reset Password";
  }
});

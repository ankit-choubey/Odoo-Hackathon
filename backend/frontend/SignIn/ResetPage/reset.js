// reset-password.js
document.getElementById("resetForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const newPassword = document.getElementById("newPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const errorText = document.getElementById("resetMatchError");
  const resetBtn = document.getElementById("resetBtn");

  // Basic validation
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

  // Simulate loading state
  resetBtn.disabled = true;
  resetBtn.textContent = "Resetting...";

  setTimeout(() => {
    alert("Password reset successful for: " + email);
    resetBtn.disabled = false;
    resetBtn.textContent = "Reset Password";
    document.getElementById("resetForm").reset();
  }, 2000);
});

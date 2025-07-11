document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Please fill in both fields.");
    return;
  }

  // Simulate successful login (replace with real API integration)
  alert("Login successful for: " + email);
  // window.location.href = "/dashboard"; // redirect after login
});

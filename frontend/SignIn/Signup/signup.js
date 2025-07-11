// signup.js
document.getElementById("signupForm").addEventListener("submit", function (e) {
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

  // Simulate API call
  setTimeout(() => {
    alert("Signup successful for: " + name);
    signupBtn.disabled = false;
    signupBtn.textContent = "Sign Up";
    document.getElementById("signupForm").reset();
  }, 2000);
});

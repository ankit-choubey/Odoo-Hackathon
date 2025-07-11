// profile.js

document.getElementById("profileForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const role = document.getElementById("role").value;

  const rolePanel = document.getElementById("rolePanel");

  // Simulate saving and showing role-specific content
  rolePanel.innerHTML = "<h3>Access Panel for " + role.charAt(0).toUpperCase() + role.slice(1) + "</h3>";

  switch (role) {
    case "admin":
      rolePanel.innerHTML += "<p>You have access to admin dashboard, user management and settings.</p>";
      break;
    case "user":
      rolePanel.innerHTML += "<p>You can update your profile and manage your account.</p>";
      break;
    case "patient":
      rolePanel.innerHTML += "<p>You can view prescriptions, book appointments and communicate with doctors.</p>";
      break;
    default:
      rolePanel.innerHTML += "<p>No role-specific permissions found.</p>";
  }

  alert("Profile updated successfully!");
});

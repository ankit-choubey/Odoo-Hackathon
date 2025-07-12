console.log("script is loaded");
document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();
  console.log("Js is running - login submitted");

  const email = document.getElementById("email").value;
  console.log("Email entered:",email);
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Please fill in both fields.");
    return;
  }

  // Simulate successful login (replace with real API integration)
  alert("Login successful for: " + email);
  // window.location.href = "/dashboard"; // redirect after login
});
async function fetchDocuments() {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("You need to log in first!");
    return;
  }
  console.log("sending request to backend..");

  const res = await fetch("http://localhost:4000/api/auth/login", {
    method:"POST",
    headers: {
      "Content-Type": "application/json"
    },
    body:JSON.stringify({email,password})
  });
  console.log("response received");

  const data = await res.json();
  console.log("Server response:",data);

  if (res.ok) {
    console.log("Documents:", data);
    // You can also display them in the DOM
  } else {
    alert(data.message || "Failed to fetch documents");
  }
}


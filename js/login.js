const loginBtn = document.getElementById("loginBtn");
const errorMsg = document.getElementById("errorMsg");

loginBtn.addEventListener("click", function () {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (username === "admin" && password === "admin123") {
    localStorage.setItem("loggedIn", "true");

    alert("Log In Successful");

    window.location.href = "index.html";
  } else {
    errorMsg.classList.remove("hidden");
  }
});

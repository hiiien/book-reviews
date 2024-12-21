const form = document.getElementById("login-form");
form.addEventListener("submit", async (event) => {
    try {
        event.preventDefault();
        const formData = new FormData(form);
        const email = formData.get("email");
        const password = formData.get("password");
        const response = await fetch("/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const responseData = await response.json();

        if (response.ok) {
            // Redirect to the specified URL
            console.log("Redirecting to:", responseData.redirect);
            window.location.href = "/home";
        } else {
            // Handle login failure
            console.error("Login failed:", responseData.message);
            alert(responseData.message || "Login failed!");
        }   
    } catch (error) {
        
    }
})

const formPopup = document.getElementById("reg-popup")
function hidePopup(){
    formPopup.style.display = "none"; 
}

const backBtn = document.getElementById("back-btn");
backBtn.addEventListener("click", hidePopup);

const regBtn = document.getElementById("btn-register");
regBtn.addEventListener("click", async (event) => {
    formPopup.style.display = "flex"; 
    formPopup.classList.add("slide-up");
})


const registerForm = document.getElementById("register-form");
registerForm.addEventListener("submit", async (event) => {
    try {
        event.preventDefault();
        const formData = new FormData(registerForm);
        const email = formData.get("email");
        var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if(email.length < 3 || !email.includes("@") || email.length > 254 || !email.match(validRegex)){
            alert("Invalid Email");
            return;
        }
        const password = formData.get("password");
        const response = await fetch("/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        })
        const responseData = await response.json()
        console.log(response)
        console.log(responseData);
        if(response.ok){
            alert(responseData.message);
            hidePopup();
        } else {
            alert(responseData.error);
        }
    } catch (error) {
        
    }
})
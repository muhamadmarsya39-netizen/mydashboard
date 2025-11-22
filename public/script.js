// POPUP MESSAGE
function showPopup(type, msg) {
    let popup = document.getElementById("popup");
    popup.className = "popup " + type + " show";
    popup.innerText = msg;

    setTimeout(() => popup.classList.remove("show"), 3000);
}

// SHAKE EFFECT
function shakeBox() {
    let box = document.getElementById("formBox");
    box.classList.add("shake");
    setTimeout(() => box.classList.remove("shake"), 400);
}

// ===========================
//         REGISTER
// ===========================
function register() {
    const name = document.getElementById("name")?.value.trim();
    const email = document.getElementById("email")?.value.trim();
    const password = document.getElementById("password")?.value.trim();

    if (!name || !email || !password) {
        showPopup("error", "Harap lengkapi data anda!");
        shakeBox();
        return;
    }

    fetch("/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
    })
    .then(res => res.json())
    .then(data => {
        if (data.error) {
            showPopup("error", "Email sudah terdaftar!");
            shakeBox();
        } else {
            showPopup("success", "Register sukses!");
        }
    })
    .catch(() => {
        showPopup("error", "Gagal menghubungi server!");
    });
}


// ===========================
//           LOGIN
// ===========================
function login() {
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();
    const btn = document.getElementById("btnLogin");

    if (!email || !password) {
        showPopup("error", "Harap isi email & password!");
        shakeBox();
        return;
    }

    btn.classList.add("loading"); 

    fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    })
    .then(res => res.json())
    .then(data => {
        btn.classList.remove("loading");

        if (data.error) {
            showPopup("error", data.error);
            shakeBox();
            return;
        }

        // SIMPAN TOKEN
        localStorage.setItem("token", data.token);

        showPopup("success", "Login sukses!");

        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 800);
    })
    .catch(() => {
        btn.classList.remove("loading");
        showPopup("error", "Gagal menghubungi server!");
    });
}

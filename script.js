// REGISTER
function register() {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!name || !email || !password) {
        alert("Harap Lengkapi Data Anda Terlebih Dahulu!");
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
            alert("Email sudah terdaftar di sistem, harap gunakan email lainya.");
        } else {
            alert("Register sukses!");
        }
    });
}


// LOGIN
function login() {
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    // CEK KOSONG
    if (!email || !password) {
        alert("Email dan password Harap di Isi, Terima Kasih");
        return;
    }

    fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    })
    .then(res => res.json())
    .then(data => {
        if (data.error) {
            alert("Error: " + data.error);
        } else {
            // SIMPAN TOKEN
            localStorage.setItem("token", data.token);

            // PINDAH KE DASHBOARD
            window.location.href = "/dashboard.html";
        }
    });
}

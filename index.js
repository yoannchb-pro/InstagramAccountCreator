const puppeteer = require('puppeteer');
const DomParser = require('dom-parser');

const { emailGenerator, readMail } = require("./email-handler");
const { getRandomUser } = require('./random-user');
const { getInstagramCode, writeFile, sleepTime } = require("./utils");

/**
 * Nombres de compte à générer
 */
const config = {
    nbAccount: 1
}

/**
 * Permet la generation des comptes avec email, pwd, name, username ...
 * @returns Promise<Object>
 */
async function usersGeneration() {

    const emailGen = emailGenerator(config.nbAccount);

    const users = [];

    for await (let email of emailGen) {
        const user = getRandomUser();
        user.email = email;
        users.push(user);
    }

    return users;
}

/**
 * Permet de créer un utilisateur instagram
 * @param {Object} user 
 */
async function createAccount(user) {
    console.log(`[INFO] Creation de - ${user.username} - ${user.email}`);

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setExtraHTTPHeaders({
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'fr-FR,fr;q=0.9,fr;q=0.8'
    });

    await page.goto("https://www.instagram.com/accounts/emailsignup");

    console.log("[INFO] Connecte a " + page.url());

    await sleepTime(2000);
    await page.waitForSelector('button[tabindex="0"]');
    await page.click('button[tabindex="0"]'); //cookies accept
    await sleepTime(2000);

    console.log("[INFO] Chargement de la page de connexion ...");
    await page.waitForSelector('input[name=emailOrPhone]');
    console.log("[INFO] OK.");

    await page.type("input[name=emailOrPhone]", user.email);
    await page.type("input[name=fullName]", user.fullName);
    await page.type("input[name=username]", user.username);
    await sleepTime(3000);
    await page.type("input[name=password]", user.password);

    await sleepTime(2000);

    console.log("[INFO] Validation du formulaire ...");
    await page.waitForSelector('button[type=submit]');
    console.log("[INFO] OK.");

    await page.click('button[type=submit]');

    await sleepTime(2000);

    await page.evaluate(() => {
        document.querySelectorAll('.h144Z').forEach((e, i) => {
            e.setAttribute('id', `champ-birth-${i}`);
        });
    });

    await page.select("#champ-birth-0", "2");
    await page.select("#champ-birth-1", "10");
    await page.select("#champ-birth-2", "2000");

    await sleepTime(2000);

    console.log("[INFO] Validation de la date de naissance ...");
    await page.evaluate(() => {
        document.querySelectorAll('button[type=button]')[1].setAttribute('id', "valid-birth");
    });
    await page.click("#valid-birth");
    console.log('[INFO] OK.');

    //renvoyer le mail
    // await sleepTime(2000);

    // await page.click('button[type=button]');

    await sleepTime(10000);

    console.log('[INFO] Chargement des mails...');
    const mail = await readMail(user.email);
    console.log('[INFO] OK.');

    const code = getInstagramCode(mail);

    console.log("[INFO] " + user.fullName + " - " + mail + " - code : " + code);

    console.log("[INFO] Chargement du code de verification ...");
    await page.waitForSelector("input[name=email_confirmation_code]");
    console.log("[INFO] OK.");

    await page.type('input[name=email_confirmation_code]', code);

    console.log("[INFO] Validation de la verification email ...");
    await page.waitForSelector('button[type=submit]');
    console.log("[INFO] OK.");

    await page.click('button[type=submit]');

    await sleepTime(12000);

    console.log('[REUSSI]\n\n');

    await browser.close();
}

/**
 * Lancement de la création des comptes
 */
async function init() {
    const users = await usersGeneration();

    try {
        for (let user of users) {
            await createAccount(user);
            user.validate = true;
        }

        users.forEach(e => delete e.validate);
        console.log(`[INFO] ${users.length} comptes creer avec succees !`);
        writeFile("accounts", users);
    } catch (e) {
        console.log("[ERROR] Une erreur est survenue !");
        console.log(e);

        const valide = users.filters(e => e.validate);
        valide.forEach(e => delete e.validate);

        if (valide.length > 0) {
            console.log(`[INFO] ${valide.length} comptes creer avec succees !`);
            writeFile("accounts", valide);
        } else console.log("[INFO] Aucun creer !")
    }
}

//INIT
init();
const got = require("got");
const puppeteer = require('puppeteer');
const DomParser = require('dom-parser');

const baseSrc = "https://email-fake.com/";

async function* emailGenerator(nbAccount) {
    let i = 0;
    while (i < nbAccount) {
        ++i;
        const reponse = await got(baseSrc);
        const parser = new DomParser();
        const document = parser.parseFromString(reponse.body);
        yield document.getElementById('email_ch_text').textContent;
    }
}

async function readMail(email) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(baseSrc + email);

    await page.waitForSelector('.fem .subj_div_45g45gg');
    const firstMessage = await page.evaluate(() => {
        return document.querySelectorAll('.fem .subj_div_45g45gg')[1].textContent
    });

    await browser.close();

    return firstMessage;
}

module.exports = { emailGenerator, readMail }
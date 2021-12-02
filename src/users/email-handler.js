const { sleepTime } = require("../utils/utils");

const baseSrc = "http://tempomail.org/mailbox/";

let page = new Object();

async function emailGenerator(browser) {
    page = await browser.newPage();
    await page.goto(baseSrc);

    await sleepTime(4000);

    return await page.evaluate(() => {
        return document.querySelector('#email_id').textContent;
    });
}

async function readMail() {
    await page.bringToFront();

    await page.waitForSelector('[data-id] div',  {timeout: 60000});

    const firstMessage = await page.evaluate(() => {
        return document.querySelectorAll('[data-id] div')[2].textContent
    });

    await page.close();

    return firstMessage;
}

module.exports = { emailGenerator, readMail }
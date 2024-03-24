const puppeteer = require('puppeteer');

async function getPODTGFG(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });
    const element = await page.$('#potd_solve_prob');
    const html = element ? await page.evaluate(el => el.getAttribute('href'), element) : null;
    await browser.close();
    return html;
}


async function getPODTLC(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });
    const xpath = '//*[@id="__next"]/div[1]/div[4]/div[2]/div[1]/div[4]/div[2]/div/div/div[2]/div[1]/div[1]/a';
    const elements = await page.$x(xpath);
    const href = elements[0] ? await page.evaluate(el => el.getAttribute('href'), elements[0]) : null;
    await browser.close();
    return href;
}



module.exports = {getPODTGFG,getPODTLC};
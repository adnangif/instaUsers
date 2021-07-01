process.on("uncaughtException", (err) => {
	console.log(err.message);
});

const USER_AGENT =
	"Mozilla/5.0 (Linux; Android 8.0.0; SM-G960F Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.84 Mobile Safari/537.36";
let options = {
	// For debugging purpose
	headless: false,
	defaultViewport: {
		width: 320,
		height: 570,
	},
};

import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
puppeteer.use(StealthPlugin());

import state from "./helpers/state.js";

const browser = await puppeteer.launch(options);
const page = await browser.newPage();
page.setUserAgent(USER_AGENT);

await page.goto("https://instagram.com/accounts/login");
await page.waitForSelector("input[name='username']");
await page.waitForTimeout(5 * 1000);
await page.type("input[name='username']", "kittens__only");
await page.type("input[name='password']", "ZNsz75wv3CGSEA2%%\n");
await page.waitForTimeout(5 * 1000);
await page.goto("https://www.instagram.com/cats_of_instagram");
await page.click("a[href$='/followers/']");
await page.waitForXPath("//button[text()='Follow']");
await page.waitForTimeout(5 * 1000);
// await page.goto("https://www.instagram.com/p/CQwNmZzh57X");
// await page.click("a[href$='liked_by/']");

const keeper = new state();
await keeper.connect();

const informer = setInterval(async () => {
	const allLinks = await page.$$("li a");
	allLinks.forEach((eachLi) => {
		eachLi.getProperty("href").then((link) => {
			keeper.store(link._remoteObject.value);
		});
	});
	console.log(keeper.size());
	keeper.save();

	// Scroll down
	await page.evaluate(async () => {
		const arr = document.querySelectorAll("li");
		const lastItem = arr[arr.length - 1];
		lastItem.scrollIntoView();
	});
}, 2000);

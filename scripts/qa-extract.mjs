import { chromium } from "playwright";

const browser = await chromium.launch({ args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 1280, height: 1600 } });
await page.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle" });
await page.getByRole("button", { name: "@grok" }).click();
await page.getByRole("heading", { name: "@grok" }).waitFor();
const text = await page.locator("article").innerText();
console.log(text);
await browser.close();

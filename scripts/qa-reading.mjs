import { chromium } from "playwright";

const url = process.argv[2] ?? "http://127.0.0.1:8080/";
const out = process.argv[3] ?? "/workspace/screenshots/letterology-reading.png";

const browser = await chromium.launch({ args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const errors = [];
page.on("pageerror", (err) => errors.push(String(err)));
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(msg.text());
});

await page.goto(url, { waitUntil: "networkidle" });
await page.getByRole("button", { name: "@grok" }).click();
await page.getByRole("heading", { name: "@grok" }).waitFor({ timeout: 8000 });
await page.getByPlaceholder("quit, ask them, ship the launch, stay").fill("ship the launch");
await page.getByRole("button", { name: "Time this" }).click();
await page.getByText(/Act sits/).waitFor({ timeout: 5000 });
await page.screenshot({ path: out, fullPage: true });

const mobile = process.argv[4] ?? "/workspace/screenshots/letterology-reading-mobile.png";
await page.setViewportSize({ width: 390, height: 844 });
await page.screenshot({ path: mobile, fullPage: true });

console.log(JSON.stringify({ out, mobile, errors, overflow: await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1) }, null, 2));
await browser.close();

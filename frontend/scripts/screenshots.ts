// Captures README screenshots from a running app.
// Needs the frontend (http://localhost:3000) and backend API running.
// Usage: npm run screenshots   (override with BASE_URL / DEMO_EMAIL / DEMO_PASSWORD)

import { mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium, type Browser, type Page } from "playwright";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";
const EMAIL = process.env.DEMO_EMAIL ?? "admin@doctortracker.com";
const PASSWORD = process.env.DEMO_PASSWORD ?? "Admin@123";

// Saved to <repo root>/docs/screenshots
const OUT_DIR = path.resolve(import.meta.dirname, "../../docs/screenshots");

const VIEWPORTS = {
  desktop: { width: 1440, height: 900 },
  mobile: { width: 390, height: 844 },
} as const;

type ViewportName = keyof typeof VIEWPORTS;

// Wait for requests to settle, skeletons/loaders to go away, and charts to finish animating.
async function waitForContent(page: Page, opts: { charts?: number } = {}) {
  await page.waitForLoadState("networkidle");

  await page.waitForFunction(
    () =>
      document.querySelectorAll(".animate-pulse, .animate-spin, .animate-ping")
        .length === 0,
    undefined,
    { timeout: 20_000 },
  );

  if (opts.charts) {
    await page.waitForFunction(
      (count) => document.querySelectorAll(".recharts-surface").length >= count,
      opts.charts,
      { timeout: 20_000 },
    );
  }

  await page.waitForLoadState("networkidle");
  // Recharts animates bars/lines in after mounting
  await page.waitForTimeout(1_200);
}

async function capture(page: Page, name: string, viewport: ViewportName) {
  // Park the mouse so no chart tooltip or hover state ends up in the shot
  await page.mouse.move(0, 0);
  await page.waitForTimeout(300);
  const file = path.join(OUT_DIR, `${name}-${viewport}.png`);
  await page.screenshot({ path: file, fullPage: true });
  console.log(`  saved ${path.relative(process.cwd(), file)}`);
}

async function run(browser: Browser, viewport: ViewportName) {
  console.log(`\n${viewport} (${VIEWPORTS[viewport].width}x${VIEWPORTS[viewport].height})`);

  const context = await browser.newContext({
    viewport: VIEWPORTS[viewport],
    deviceScaleFactor: viewport === "mobile" ? 2 : 1,
  });
  // Hide the Next.js dev-mode indicator so it doesn't appear in screenshots
  await context.addInitScript(() => {
    const style = document.createElement("style");
    style.textContent = "nextjs-portal { display: none !important; }";
    document.addEventListener("DOMContentLoaded", () => document.head.append(style));
  });
  const page = await context.newPage();

  // Login
  await page.goto(`${BASE_URL}/login`);
  await page.locator("#email").waitFor();
  await waitForContent(page);
  await capture(page, "login", viewport);

  await page.fill("#email", EMAIL);
  await page.fill("#password", PASSWORD);
  await Promise.all([
    page.waitForURL("**/dashboard", { timeout: 20_000 }),
    page.click('button[type="submit"]'),
  ]);

  // Dashboard: patients-over-time + two bar charts
  await waitForContent(page, { charts: 3 });
  await capture(page, "dashboard", viewport);

  // Doctors
  await page.goto(`${BASE_URL}/doctors`);
  await waitForContent(page);
  await capture(page, "doctors", viewport);

  // First doctor's detail page
  const href = await page
    .locator('a[href^="/doctors/"]')
    .first()
    .getAttribute("href");
  if (!href) throw new Error("No doctors found. Add a doctor before capturing.");
  await page.goto(`${BASE_URL}${href}`);
  await waitForContent(page);
  await capture(page, "doctor-detail", viewport);

  // Patients
  await page.goto(`${BASE_URL}/patients`);
  await waitForContent(page);
  await capture(page, "patients", viewport);

  await context.close();
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  const browser = await chromium.launch();
  try {
    await run(browser, "desktop");
    await run(browser, "mobile");
  } finally {
    await browser.close();
  }

  console.log("\nDone.");
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});

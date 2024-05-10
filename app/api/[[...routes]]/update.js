import puppeteer from "puppeteer";
import { writeFileSync } from "fs";
import fetch from "node-fetch";

async function updateIt() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://www.9dcc.xyz/points?tab=leaderboard");

  const element = await page.waitForSelector(
    "body > div > main > div:nth-child(2) > div.w-full.max-w-5xl.mx-auto.min-h-\\[calc\\(100vh-16rem\\)\\].px-6.sm\\:px-8.pt-4.sm\\:pt-8 > div > div > div.w-full.bg-\\[url\\(\\'\\/images\\/rectangle-texture\\.png\\'\\)\\].bg-tile.border-black.border.px-4.py-4.overflow-x-auto > table"
  );

  const data = await page.evaluate((el) => {
    const rows = el.querySelectorAll("tr");
    return Array.from(rows, (row) => {
      const cells = row.querySelectorAll("td, th");
      return Array.from(cells, (cell) => cell.innerText).join("~");
    });
  }, element);

  data.shift();

  const pfp = await page.evaluate((el) => {
    const rows = el.querySelectorAll("tr");
    const baseUrl = "https://www.9dcc.xyz";
    return Array.from(rows, (row) => {
      const imgElements = row.querySelectorAll("img");
      const profilePictures = Array.from(
        imgElements,
        (img) => baseUrl + img.getAttribute("src")
      );
      return profilePictures;
    }).flat();
  }, element);

  for (let pfpIndex in pfp) {
    const response = await fetch(pfp[pfpIndex]);
    if (response.status != 200) {
      pfp[pfpIndex] =
        "https://www.9dcc.xyz/_next/image?url=%2Fimages%2Fdefault-profile-image.png&w=96&q=75";
    }
  }

  for (let i = 0; i < 100; i++) {
    data[i] = data[i] + `~${pfp[i]}`;
  }

  writeFileSync("./lb.txt", data.join("\n"));
  await browser.close();
}

export function runner() {
  updateIt();
  setInterval(updateIt, 1 * 60 * 60 * 1000);
}

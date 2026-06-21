import { stitch } from "@google/stitch-sdk";
import { writeFileSync, mkdirSync } from "fs";

process.env.STITCH_API_KEY = process.env.STITCH_API_KEY || "";

const PROJECT_ID = "18294432027744375469";
const project = stitch.project(PROJECT_ID);
const outDir = "/home/yaser/groomai-app/scripts/stitch-output";
mkdirSync(outDir, { recursive: true });

const screens = await project.screens();
console.log(`Found ${screens.length} screens:`);

const nameMap = {
  0: "admin-dashboard",
  1: "about", 
  2: "faq",
  3: "checkout-improved",
  4: "bookings-improved",
  5: "profile-improved",
  6: "dashboard-improved",
  7: "assistant-improved",
  8: "terms-privacy"
};

let i = 0;
for (const screen of screens) {
  const name = nameMap[i] || `page-${i}`;
  console.log(`\n[${i}] ${name} (${screen.screenId})`);
  try {
    const htmlUrl = await screen.getHtml();
    const imgUrl = await screen.getImage();
    const resp = await fetch(htmlUrl);
    const html = await resp.text();
    const filename = `${outDir}/${i}-${name}.html`;
    writeFileSync(filename, html);
    console.log(`  Saved: ${filename} (${html.length} bytes)`);
    console.log(`  Screenshot: ${imgUrl}`);
  } catch (e) {
    console.log(`  Error: ${e.message || e}`);
  }
  i++;
}

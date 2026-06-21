import { stitch } from "@google/stitch-sdk";
import { writeFileSync, mkdirSync } from "fs";
import { resolve } from "path";

process.env.STITCH_API_KEY = process.env.STITCH_API_KEY || "";

const PROJECT_ID = "18294432027744375469";
const project = stitch.project(PROJECT_ID);
const outDir = "/home/yaser/groomai-app/scripts/stitch-output";
mkdirSync(outDir, { recursive: true });

const screens = await project.screens();
console.log(`Found ${screens.length} screens:`);

for (const screen of screens) {
  console.log(`\nScreen: ${screen.screenId}`);
  try {
    const htmlUrl = await screen.getHtml();
    const imgUrl = await screen.getImage();
    console.log(`  HTML URL: ${htmlUrl}`);
    console.log(`  Screenshot URL: ${imgUrl}`);
    
    const resp = await fetch(htmlUrl);
    const html = await resp.text();
    const filename = `${outDir}/${screen.screenId}.html`;
    writeFileSync(filename, html);
    console.log(`  Saved: ${filename} (${html.length} bytes)`);
  } catch (e) {
    console.log(`  Error: ${e.message || e}`);
  }
}

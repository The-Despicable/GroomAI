import { stitch } from "@google/stitch-sdk";
import { writeFileSync } from "fs";

process.env.STITCH_API_KEY = process.env.STITCH_API_KEY || "";

const PROJECT_ID = "18294432027744375469";
const project = stitch.project(PROJECT_ID);

async function main() {
  console.log("Generating login page...");

  const page = {
    name: "login",
    prompt: `GroomAI login/sign-in page. Dark theme with gold (#C9A84C) accents. Full screen layout. Left side: decorative illustration area with salon/grooming themed abstract art or gradient, with GroomAI brand name in gold. Right side: login form card with "Welcome Back" heading, email input field, password input field with show/hide toggle, "Sign In" button in gold gradient, "Forgot Password?" link, divider with "or continue with", Google and Apple social login buttons. Below form: "Don't have an account? Sign Up" link. Clean modern design with subtle gold glow effects on the form card.`
  };

  try {
    const screen = await project.generate(page.prompt, "DESKTOP");
    const htmlUrl = await screen.getHtml();
    const imgUrl = await screen.getImage();
    console.log(`HTML URL: ${htmlUrl}`);
    console.log(`Screenshot URL: ${imgUrl}`);

    // Fetch the HTML
    const resp = await fetch(htmlUrl);
    const html = await resp.text();
    writeFileSync(`scripts/stitch-output/login.html`, html);
    console.log("Saved to scripts/stitch-output/login.html");
  } catch (e) {
    console.error(`Failed: ${e.message || e}`);
  }
}

main();

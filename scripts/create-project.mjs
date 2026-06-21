import { stitch } from "@google/stitch-sdk";

process.env.STITCH_API_KEY = process.env.STITCH_API_KEY || "";

try {
  const result = await stitch.callTool("create_project", { 
    title: "GroomAI Remaining Pages" 
  });
  console.log(JSON.stringify(result, null, 2));
} catch (e) {
  console.error("Error:", e.message || e);
}

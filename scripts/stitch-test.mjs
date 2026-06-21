import { stitch } from "@google/stitch-sdk";

process.env.STITCH_API_KEY = process.env.STITCH_API_KEY || "";

try {
  const projects = await stitch.projects();
  if (projects.length > 0) {
    console.log(`Connected. Found ${projects.length} project(s):`);
    for (const p of projects) {
      console.log(`  - ${p.projectId}`);
    }
  } else {
    console.log("Connected. No existing projects. Creating one...");
    const result = await stitch.callTool("create_project", { title: "GroomAI Pages" });
    console.log("Created project:", JSON.stringify(result, null, 2));
  }
} catch (e) {
  console.error("Error:", e.message || e);
}

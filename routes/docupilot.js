const express = require("express");
const router = express.Router();

const TEMPLATES = {
  "notice-of-appearance": "b0c207b8",
};

router.post("/generate", async (req, res) => {
  try {
    const { template, data } = req.body;
    if (!template || !TEMPLATES[template]) {
      return res.status(400).json({ success: false, error: "Unknown template: " + template });
    }
    if (!data || typeof data !== "object") {
      return res.status(400).json({ success: false, error: "Missing data field" });
    }
    const templateId = TEMPLATES[template];
    const orgId = process.env.DOCUPILOT_ORG_ID;
    const endpoint = "https://api.docupilot.app/document/create/" + orgId + "/" + templateId;
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ success: false, error: "Docupilot error", details: result });
    }
    const fileUrl = result?.data?.file_url || result?.file_url || result?.url || result?.data?.url;
    if (fileUrl) {
      return res.json({ success: true, file_url: fileUrl, file_name: result?.data?.file_name || template + ".pdf" });
    }
    return res.json({ success: true, raw: result });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

router.get("/templates", (req, res) => {
  res.json({ templates: Object.entries(TEMPLATES).map(([name, id]) => ({ name, id })) });
});

module.exports = router;

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
    var templateId = TEMPLATES[template];
    var orgId = process.env.DOCUPILOT_ORG_ID;
    var endpoint = "https://cais.docupilot.app/dashboard/documents/create/" + orgId + "/" + templateId;
    var response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    var result = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ success: false, error: "Docupilot error", details: result });
    }
    var fileUrl = result && result.data && result.data.file_url ? result.data.file_url : (result.file_url || null);
    if (fileUrl) {
      return res.json({ success: true, file_url: fileUrl, file_name: (result.data && result.data.file_name) || (template + ".pdf") });
    }
    return res.json({ success: true, raw: result });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

router.get("/templates", function(req, res) {
  res.json({ templates: Object.keys(TEMPLATES) });
});

module.exports = router;

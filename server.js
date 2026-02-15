# Docupilot Proxy Service

Backend proxy for generating legal documents via the Docupilot API. Solves CORS issues by forwarding requests from your frontend to Docupilot server-side.

## How It Works

```
Frontend → POST /api/docupilot/generate → This Service → Docupilot API → PDF URL → Frontend
```

## Environment Variables

Set these in Railway dashboard → Service → Variables:

| Variable | Value |
|----------|-------|
| `DOCUPILOT_ORG_ID` | Your Docupilot org ID |
| `DOCUPILOT_API_KEY` | Your Docupilot API key |
| `DOCUPILOT_API_SECRET` | Your Docupilot API secret |
| `ALLOWED_ORIGINS` | Comma-separated frontend URLs (e.g. `https://consul.up.railway.app`) |

## API Endpoints

### `POST /api/docupilot/generate`

Generate a document from a template.

**Request:**
```json
{
  "template": "notice-of-appearance",
  "data": {
    "judicial_circuit": "EIGHTEENTH",
    "county": "SEMINOLE",
    "state": "FLORIDA",
    "plaintiff_name": "DANIELLE SHEPARDSON",
    "case_number": "2020-CA-000775-08-G",
    "defendant_name": "GWENNETH MCKENNA"
  }
}
```

**Response:**
```json
{
  "success": true,
  "file_url": "https://docupilot-documents.s3.amazonaws.com/...",
  "file_name": "notice-of-appearance.pdf"
}
```

### `GET /api/docupilot/templates`

List available templates.

### `GET /health`

Health check endpoint.

## Adding New Templates

1. Create the template in Docupilot dashboard
2. Get the template ID from the URL
3. Add it to `TEMPLATES` in `routes/docupilot.js`:

```js
const TEMPLATES = {
  "notice-of-appearance": "b0c207b8",
  "answer-to-complaint": "NEW_TEMPLATE_ID",
};
```

4. Deploy.

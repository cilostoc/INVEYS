# INVEYS AI setup — v0.11.0

## Mac local setup

Run the application through the local Python server, rather than opening the portable HTML, to use external AI. Follow the existing README installation instructions first. In Terminal inside the `inveys` directory:

```sh
source .venv/bin/activate
export OPENAI_API_KEY='YOUR_API_KEY'
python serve.py
```

Open http://127.0.0.1:3000. Configure only providers you intend to use. Alternative environment variables are `GEMINI_API_KEY` for Gemini and `MODEL_API_KEY` for Muse Spark (Meta). Optional overrides: `OPENAI_MODEL`, `GEMINI_MODEL`, `MUSE_MODEL`. Current defaults are `gpt-4.1-mini`, `gemini-3.8-flash`, and `muse-spark-1.3`; availability depends on your API account. A consumer ChatGPT/Gemini subscription is not an API credential. No .env autoload is implemented; environment variables must exist in the server process. Restart the server after changing them. Never put keys into frontend files or exported workspaces.

## 9Router gateway

INVEYS can call a separately running 9Router gateway. It does not install/start the gateway or connect its upstream providers for you. Reference: https://github.com/decolua/9router/blob/master/README.md . Gateway default API base is http://127.0.0.1:20128/v1; copy your actual model or combo ID from its dashboard.

In the same Terminal session that starts INVEYS:

```sh
export NINEROUTER_BASE_URL='http://127.0.0.1:20128/v1'
export NINEROUTER_API_KEY='YOUR_GATEWAY_KEY'
export NINEROUTER_MODEL='YOUR_MODEL_OR_COMBO_ID'
python serve.py
```

Both key and model are required. Custom base URLs must end in /v1, use HTTPS or loopback HTTP, and contain no credentials/query/fragment. Redirects are rejected. Keys are not entered into frontend settings. INVEYS forwards model/combo selection to the gateway; routing, quotas and fallback are controlled there. It does not silently route requests to another provider. Key/model status is not a live connectivity check.

9Router adapter uses /chat/completions with optional image_url; PDFs are locally extracted into text; audio calls the gateway /audio/transcriptions before chat. The configured gateway must implement these endpoints and the selected upstream model must support the relevant modality. There is no blanket guarantee of support by every model. Local PDF extraction requires Poppler; scanned PDF text should be OCRed/converted to images or handled with a native-PDF provider.

## Chat workflow

1. Open **Integrations → INVEYS AI · 9Router → Assistant & memory settings**. Select local, OpenAI, Gemini, Muse Spark or 9Router, and explicitly permit message/history/attachment sharing. Check API setup refreshes server configuration and opens the same dialog. Provider selection has been removed from the composer.
2. Optional: enable financial-summary sharing or preference context; both are off by default. Edit/delete preferences one per line.
3. Use the single input to ask a question or request a record. External AI classifies intent. Valid income/expense requests create review drafts; transfers use Add transaction. Select the recording account through +; its currency and today's date are shared as necessary recording context. Missing account/amount/currency should produce a clarification. Local mode keeps the deterministic parser.
4. + uploads PNG/JPEG/WebP, PDF, TXT/CSV or audio, or opens supported device camera capture. Maximum 8 MB, one file per message. Microphone recording lasts up to 120 seconds, stop to stage audio before sending. Device/browser support and permission apply; Mac may show a file chooser instead of a camera.
5. File-only messages request analysis. Explicitly request recording to generate drafts. Statement attachments default to journal-only drafts; receipts update balances only after review/save. Existing local Extract & review remains available for images/text PDFs. Review nominal, account, currency, date, category and duplicates before Save selected.
6. Click outside the dock to minimize, then Ask INVEYS to reopen. Input, staged file, conversation and pending drafts persist while navigating. An active modal/native picker is exempt. There is no minimize button or Ask/Record tab. + → New conversation deletes the active view history while keeping preferences.

OpenAI analyzes supported images/PDF and transcribes audio; Gemini receives supported native media; Muse Spark uses image chat and existing local PDF extraction/audio transcription. All support depends on account/model access. Local extraction requires Tesseract/Poppler; Muse audio transcription requires the existing ffmpeg setup. Browser speech dictation is available separately.

## Memory and privacy

Preferences provide context, not autonomous training. The application does not modify model weights or automatically extract permanent memories from documents. Preferences and a maximum of 60 chat messages are stored in the local browser workspace and included in workspace exports. Only the active owner/shared perspective’s last 20 messages are submitted as history. Ownership filters are presentation scoping, not production authentication. Do not use this local prototype as a secure multi-user service.

File binaries are not persisted in localStorage or workspace exports. Explicitly sending a file shares it with the selected external provider; its retention policies apply. OpenAI requests use `store:false`, which does not represent a blanket zero-retention guarantee. Key presence status is a configuration check, not a successful live connectivity test. Requests do not automatically fail over to another provider.

Muse Spark here means Meta’s AI API. The muse.ai video-hosting/player API is a separate service and is not newly integrated by this chat release.

## Verification and references

Adapter payloads and errors use mocked provider responses; no live credentials were supplied. Physical camera/microphone and browser visual QA have not been performed in this environment. Test with your account and device before deployment. This remains a local-first prototype without production authentication or server-enforced subscriptions.

- OpenAI Responses/files: https://developers.openai.com/api/docs/guides/file-inputs
- OpenAI transcription: https://developers.openai.com/api/docs/guides/speech-to-text
- Gemini: https://ai.google.dev/api/generate-content
- Meta: https://dev.meta.ai/docs/protocols/chat-completions

require("dotenv").config()

const express = require("express");
const path = require("path");
const QRCode = require("qrcode");

const app = express();
const PORT = process.env.APP_PORT;
const MAX_BODY = process.env.MAX_BODY_SIZE;

app.use(express.json({ limit: MAX_BODY }));
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/qrcode", async (req, res) => {
  try {
    const { url } = req.body;

    if (!url || typeof url !== "string") {
      return res.status(400).json({ error: "Informe um link válido." });
    }

    let normalizedUrl = url.trim();

    if (!/^https?:\/\//i.test(normalizedUrl)) {
      normalizedUrl = "https://" + normalizedUrl;
    }

    try {
      new URL(normalizedUrl);
    } catch {
      return res.status(400).json({ error: "O link informado não é válido." });
    }

    const dataUrl = await QRCode.toDataURL(normalizedUrl, {
      errorCorrectionLevel: "H",
      margin: 2,
      width: 320
    });

    return res.json({
      original: url,
      normalized: normalizedUrl,
      qrCodeDataUrl: dataUrl
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao gerar o QR Code." });
  }
});

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor iniciado em http://0.0.0.0:${PORT}`);
});

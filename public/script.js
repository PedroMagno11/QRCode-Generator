const qrForm = document.getElementById("qrForm");
const urlInput = document.getElementById("urlInput");
const message = document.getElementById("message");
const result = document.getElementById("result");
const finalUrl = document.getElementById("finalUrl");
const qrImage = document.getElementById("qrImage");
const downloadBtn = document.getElementById("downloadBtn");

qrForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  message.textContent = "Gerando QR Code...";
  result.classList.add("hidden");
  qrImage.removeAttribute("src");
  downloadBtn.removeAttribute("href");

  try {
    const response = await fetch("/api/qrcode", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ url: urlInput.value })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Erro ao gerar o QR Code.");
    }

    finalUrl.textContent = data.normalized;
    qrImage.src = data.qrCodeDataUrl;
    downloadBtn.href = data.qrCodeDataUrl;
    result.classList.remove("hidden");
    message.textContent = "";
  } catch (error) {
    message.textContent = error.message;
  }
});

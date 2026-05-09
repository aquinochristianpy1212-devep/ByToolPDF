
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { execFile } = require("child_process");

const app = express();
const upload = multer({ dest: path.join(__dirname, "uploads") });

app.use(cors());
app.use(express.json());

const UP = path.join(__dirname, "uploads");
const OUT = path.join(__dirname, "output");
fs.mkdirSync(UP, { recursive: true });
fs.mkdirSync(OUT, { recursive: true });

function remove(file) {
  if (file && fs.existsSync(file)) fs.unlink(file, () => {});
}

function run(command, args) {
  return new Promise((resolve, reject) => {
    execFile(command, args, { windowsHide: true }, (error, stdout, stderr) => {
      if (error) reject(new Error(stderr || stdout || error.message));
      else resolve({ stdout, stderr });
    });
  });
}

function sofficeCommand() {
  return process.platform === "win32" ? "soffice.exe" : "soffice";
}

app.get("/", (req, res) => {
  res.json({
    ok: true,
    message: "Backend activo",
    tools: ["pdf-to-word", "word-to-pdf"]
  });
});

app.post("/api/pdf-to-word", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No se subió archivo" });

  const input = req.file.path;
  const output = path.join(OUT, `${req.file.filename}.docx`);

  try {
    await run("python", [
      path.join(__dirname, "pdf_to_word.py"),
      input,
      output
    ]);

    if (!fs.existsSync(output)) {
      throw new Error("No se generó el archivo DOCX.");
    }

    res.download(output, "pdf-convertido.docx", () => {
      remove(input);
      remove(output);
    });
  } catch (err) {
    remove(input);
    remove(output);
    res.status(500).json({
      error: "No se pudo convertir PDF a Word. Instalá Python y ejecutá: pip install pdf2docx",
      detail: err.message
    });
  }
});

app.post("/api/word-to-pdf", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No se subió archivo" });

  const originalName = req.file.originalname.replace(/[\\/:*?"<>|]/g, "-");
  const input = path.join(UP, `${req.file.filename}-${originalName}`);
  fs.renameSync(req.file.path, input);

  try {
    await run(sofficeCommand(), [
      "--headless",
      "--convert-to",
      "pdf",
      "--outdir",
      OUT,
      input
    ]);

    const baseName = path.parse(input).name;
    const output = path.join(OUT, `${baseName}.pdf`);

    if (!fs.existsSync(output)) {
      throw new Error("LibreOffice no generó el PDF.");
    }

    res.download(output, "word-convertido.pdf", () => {
      remove(input);
      remove(output);
    });
  } catch (err) {
    remove(input);
    res.status(500).json({
      error: "No se pudo convertir Word a PDF. Instalá LibreOffice y agregá soffice al PATH.",
      detail: err.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend activo en http://localhost:${PORT}`);
});

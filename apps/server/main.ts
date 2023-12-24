import express from "express";
import * as fs from "fs";
import * as path from "path";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

const cacheDir = "./.cache";

if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir, { recursive: true });
}

app.post("/save", (req, res) => {
  const data = req.body;
  const typeDir = path.join(cacheDir, data.type);

  fs.mkdirSync(typeDir, { recursive: true });

  fs.readdir(typeDir, (err, files) => {
    if (err) {
      console.error("Error reading directory", err);
      res.status(500).send("Error reading directory");
      return;
    }

    const relevantFiles = files
      .filter((file) => file.endsWith(`${data.type}.json`))
      .map((file) => parseInt(file))
      .sort((a, b) => b - a);

    const lastNumber = relevantFiles.length > 0 ? relevantFiles[0] : 0;
    const nextNumber = lastNumber! + 1;
    const paddedNumber = String(nextNumber).padStart(4, "0");
    const filename = path.join(typeDir, `${paddedNumber}${data.type}.json`);

    fs.writeFile(filename, JSON.stringify(data), (err) => {
      if (err) {
        console.error("Error saving data", err);
        res.status(500).send("Error saving data");
        return;
      }
      res.send("Data saved successfully");
    });
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

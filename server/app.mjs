import * as http from "http";
import { writeFile, readFile, mkdir } from "fs";
import { parse } from "url";

const cacheDir = "./.cache";
mkdir(cacheDir, { recursive: true }, (err) => {
  if (err) {
    console.error("Error creating cache directory", err);
  }
});

const server = http.createServer((req, res) => {
  const parsedUrl = parse(req.url, true);

  if (req.method === "POST" && parsedUrl.pathname === "/save") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString(); // convert Buffer to string
    });
    req.on("end", () => {
      const data = JSON.parse(body);
      const filename = `./.cache/${data.id}.json`;

      writeFile(filename, JSON.stringify(data), (err) => {
        if (err) {
          res.writeHead(500);
          res.end("Error saving data");
          return;
        }
        res.writeHead(200);
        res.end("Data saved successfully");
      });
    });
  } else if (req.method === "GET" && parsedUrl.pathname.startsWith("/get/")) {
    const id = parsedUrl.pathname.split("/")[2];
    const filename = `./.cache/${id}.json`;

    readFile(filename, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end("Data not found");
        return;
      }
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(data);
    });
  } else {
    res.writeHead(404);
    res.end("Not Found");
  }
});

server.listen(3000);

import fs from "fs";

export function readLogFile(filePath) {
  return fs.readFileSync(filePath).toString("utf-8");
}
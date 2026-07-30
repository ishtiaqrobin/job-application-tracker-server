import fs from "fs/promises";
import path from "path";

export const logDir = path.resolve(process.cwd(), "logs");

export const ensureLogDir = async () => {
  await fs.mkdir(logDir, { recursive: true });
};

export const writeLog = async (fileName: string, entry: object) => {
  const line = JSON.stringify(entry) + "\n";
  console.log(line.trim());
  await ensureLogDir();
  await fs.appendFile(path.join(logDir, fileName), line, "utf-8");
};

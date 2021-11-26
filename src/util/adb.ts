import { exec } from "child_process";

export async function push(inputPath: string, outputPath: string) {
  return new Promise<void>((resolve, reject) => {
    exec(`adb push ${inputPath} ${outputPath}`, (e) =>
      e ? reject(e) : resolve()
    );
  });
}

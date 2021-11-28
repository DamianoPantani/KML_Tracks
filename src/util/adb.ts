import { execSync, ExecSyncOptions } from "child_process";

export function push(inputPath: string, outputPath: string) {
  const silent: ExecSyncOptions = { stdio: "pipe" };
  execSync(`adb push "${inputPath}" "${outputPath}"`, silent);
}

export function removeContent(outputPath: string) {
  execSync(`adb shell rm -rR "${shellPath(outputPath)}"`);
}

export function stopApp(packageName: string) {
  execSync(`adb shell am force-stop ${packageName}`);
}

export function startApp(packageName: string) {
  execSync(
    `adb shell monkey -p ${packageName} -c android.intent.category.LAUNCHER 1`
  );
}

function shellPath(path: string): string {
  return `${path.replaceAll(" ", "\\ ")}`;
}

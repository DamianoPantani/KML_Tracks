import { execSync, ExecSyncOptions } from "child_process";
const silent: ExecSyncOptions = { stdio: "pipe" };

export function push(inputPath: string, outputPath: string) {
  execSync(`adb push "${inputPath}" "${outputPath}"`, silent);
}

export function removeContent(outputPath: string) {
  execSync(`adb shell "cd ${shellPath(outputPath)} && rm -rf *.gpx"`, silent);
}

export function stopApp(packageName: string) {
  execSync(`adb shell am force-stop ${packageName}`, silent);
}

export function startApp(packageName: string) {
  execSync(
    `adb shell monkey -p ${packageName} -c android.intent.category.LAUNCHER 1`,
    silent
  );
}

function shellPath(path: string): string {
  return `${path.replaceAll(" ", "\\ ")}`;
}

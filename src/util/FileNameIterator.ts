export class FileNameIterator {
  fileNamesCount: Record<string, number> = {};

  next(rawName: string): string {
    const count = this.fileNamesCount[rawName] || 0;
    this.fileNamesCount[rawName] = count + 1;

    return count ? `${rawName} (${count})` : rawName;
  }
}

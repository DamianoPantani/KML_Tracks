export class NameIterator {
  namesCount: Record<string, number> = {};

  next(rawName: string): string {
    const count = this.namesCount[rawName] || 0;
    if (count) {
      console.warn(`Warning: place with name '${rawName}' already exists`);
    }

    this.namesCount[rawName] = count + 1;

    return count ? `${rawName} (${count})` : rawName;
  }
}

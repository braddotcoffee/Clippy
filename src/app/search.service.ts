import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  titleMap = new Map<string, [number, string][]>();

  constructor() { }

  getTitleMap(objects: any[]): Map<string, [number, string][]> {
    objects.forEach((object: any) => {
      const key: string = object.Key;
      const keyParts = key.split("/");
      const uncleanTitle = keyParts[keyParts.length - 1];

      if (uncleanTitle.endsWith(".html")) return;

      uncleanTitle
        .slice(0, uncleanTitle.length - ".mp4".length)
        .replace(/[.,\/#?+!$%\^&\*;:{}=\-`~()]/g, "")
        .toLowerCase()
        .split("_")
        .forEach((word, index) => {
          if (word === "") return;
          if (!this.titleMap.has(word)) this.titleMap.set(word, []);
          this.titleMap.get(word)!.push([index, object.Key])
        });
    });
    return this.titleMap;
  }

  getKeysForSearchWord(word: string): string[] {
    const resultKeys: string[] = []

    if (!this.titleMap.has(word)) return [];

    const weightedKeys = this.titleMap.get(word)!;
    weightedKeys.sort((a, b) => a[0] > b[0] ? 1 : -1);

    const seenKeys = new Set<string>();

    weightedKeys.forEach((weightedKey) => {
      const key = weightedKey[1];
      if (seenKeys.has(key)) return;
      seenKeys.add(key);
      resultKeys.push(key);
    });

    return resultKeys;
  }

  prepareSearchQuery(word: string): string {
    return word
      .replace(/[.,\/#?+!$%\^&\*;:{}=\-`~()]/g, "")
      .toLowerCase()
  }
}

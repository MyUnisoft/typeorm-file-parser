export function charSet(...plages: (string | [number, number])[]): Set<string> {
  const ret = new Set<string>();

  for (const plage of plages) {
    if (typeof plage === "string") {
      ret.add(plage);
      continue;
    }

    for (let tid = plage[0]; tid <= plage[1]; tid++) {
      ret.add(String.fromCharCode(tid));
    }
  }

  return ret;
}

export const END_OF_SEQUENCE = Symbol("EOS");
export type SEQUENCE_OR_TOKEN<T> = typeof END_OF_SEQUENCE | T;

export function getNextItem<T>(iterator: IterableIterator<T>): SEQUENCE_OR_TOKEN<T> {
  const item = iterator.next();

  return item.done ? END_OF_SEQUENCE : item.value;
}

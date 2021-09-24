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

export function zip<T, G>(a: T[], b: G[]) {
  return a.map((e, k) => [e, b[k]]);
}

export function indent(text: string, num: number) {
  let spacing = ' '.repeat(num);
  return spacing + text.replace(/\n/g, '\n' + spacing);
}


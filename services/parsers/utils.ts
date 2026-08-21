export function clean(text: string): string {

  return text
    .replace(/\r/g, "")
    .replace(/\t/g, " ")
    .replace(/\u00a0/g, " ")
    .replace(/ +/g, " ")
    .trim();

}

export function lines(html: string): string[] {

  return clean(html)
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

}

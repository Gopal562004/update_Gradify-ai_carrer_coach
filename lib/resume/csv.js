export function parseCSV(text: string) {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => /\S+@\S+\.\S+/.test(line));
}

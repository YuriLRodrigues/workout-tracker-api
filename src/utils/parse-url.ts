export function parseUrls(envString: string) {
  return envString
    .split(',')
    .map((url) => url.trim())
    .filter((url) => url);
}

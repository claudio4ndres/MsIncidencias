import { URL } from 'url';

export default function getPathAfterPort(urlString: string) {
  try {
    const url = new URL(urlString);
    return url.pathname + url.search + url.hash;
  } catch (error) {
    return '';
  }
}

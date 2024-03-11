import { Md5ShorteningStrategy } from "./md5-encode.strategy";

describe('Md5ShorteningStrategy', () => {
  it('should not return the same URL for a valid input', () => {
    const shortener = new Md5ShorteningStrategy();
    const url = 'https://www.google.com';
    const shortenedUrl = shortener.encode(url);
    expect(shortenedUrl).not.toEqual(url);
  });

  it('should return a shortened URL for a valid input', () => {
    const shortener = new Md5ShorteningStrategy();
    const url = 'https://www.google.com';
    const shortenedUrl = shortener.encode(url);
    expect(shortenedUrl).toHaveLength(6);
  });

  it('should return different shortened URLs for different inputs', () => {
    const shortener = new Md5ShorteningStrategy();
    const url1 = 'https://www.duckduckgo.com';
    const url2 = 'https://www.google.com';
    const shortenedUrl1 = shortener.encode(url1);
    const shortenedUrl2 = shortener.encode(url2);
    expect(shortenedUrl1).not.toEqual(shortenedUrl2);
  });

  it('should not always return the same shortened URL for multiple calls', () => {
    const shortener = new Md5ShorteningStrategy();
    const url = 'https://www.google.com';
    const shortenedUrls = new Set();
    const testSize = 10
    for (let i = 0; i < testSize; i++) {
      const encodedText = shortener.encode(url);
      shortenedUrls.add(encodedText);
    }
    expect(shortenedUrls.size).toBeGreaterThan(testSize-1);
  });
});
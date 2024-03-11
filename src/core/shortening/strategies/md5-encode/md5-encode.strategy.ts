import * as crypto from 'crypto';
import { IShorteningStrategy } from '../encode.strategy';

export class Md5ShorteningStrategy implements IShorteningStrategy {
  private charsToUse =
    'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  /**
   * Encodes a URL string into a shortened string using MD5 hashing and custom base conversion.
   *
   * Algorithm Steps:
   * ============================================================================
   * Step 1: Randomize URL by adding epoch in prefix and random digits at the end
   * Step 2: Create an MD5 hash of the combined randomized string
   * Step 3: Split the MD5 hash into four 8-character substrings
   * Step 4: Convert each substring into a 6-character base 62-like string
   * Step 5: Randomly select one of the four generated base 62-like strings
   * ============================================================================
   * @param url The URL to be shortened.
   * @returns The shortened URL string.
   */
  public encode(url: string) {
    const currentEpoc = new Date().valueOf();
    const salt = Math.floor(Math.random() * 1000);
    const epocUrl = currentEpoc + url + salt;
    const hexDigest = crypto.createHash('md5').update(epocUrl).digest('hex');
    const resUrl: string[] = [];
    for (let i = 0; i < 4; i++) {
      const subString = hexDigest.substring(i * 8, i * 8 + 8);
      let lHexLong = 0x3fffffff & parseInt(subString, 16);
      let output = '';
      for (let j = 0; j < 6; j++) {
        const index = 0x0000003d & lHexLong;
        output = output + this.charsToUse[index];
        lHexLong = lHexLong >> 5;
      }
      resUrl[i] = output;
    }
    const indexToChoose = Math.floor(Math.random() * 3);
    return resUrl[indexToChoose];
  }
}

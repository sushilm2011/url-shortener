import * as crypto from 'crypto';
import { IShorteningStrategy } from './encode.strategy';

export class Md5ShorteningStrategy implements IShorteningStrategy {
  private charsToUse =
    'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  public encode(url: string) {
    const currentEpoc = new Date().valueOf();
    const epocUrl = currentEpoc + url;
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

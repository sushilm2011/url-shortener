export interface IShorteningStrategy {
  encode(url: string): string;
}

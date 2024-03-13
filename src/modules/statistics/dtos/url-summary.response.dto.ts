export class UrlSummaryResponseDto {
  id: string;
  longUrl: string;
  shortAlias: string;
  clicks: number;
  recentAccess: Date;
  createdAt: Date;
}

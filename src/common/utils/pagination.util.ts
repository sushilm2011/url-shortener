import { PaginationQueryDto } from '@common/dtos/pagination-request.dto';

export function getPaginationResponse<T>(
  paginationParamDto: PaginationQueryDto,
  results: T[],
  total: number,
) {
  return {
    results,
    total,
    offset: paginationParamDto.offset,
    limit: paginationParamDto.limit,
  };
}

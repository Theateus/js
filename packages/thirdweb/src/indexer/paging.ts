import type { ChainsawPagingParams } from "./types.js";

export const addPagingToRequest = (
  searchParams: URLSearchParams,
  pagingParams: ChainsawPagingParams,
): URLSearchParams => {
  if (pagingParams.page) {
    searchParams.append("page", pagingParams.page.toString());
  }
  if (pagingParams.pageSize) {
    searchParams.append("pageSize", pagingParams.pageSize.toString());
  }
  return searchParams;
};

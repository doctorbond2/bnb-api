export const getPageQuery = (
  searchParams: URLSearchParams
): {
  page: number;
  pageSize: number;
} | null => {
  const params_page = searchParams.get('page') || '1';
  const params_pageSize = searchParams.get('pageSize') || '10';
  const page = parseInt(params_page, 10);
  const pageSize = parseInt(params_pageSize, 10);
  if (isNaN(page) || isNaN(pageSize)) {
    return null;
  }
  return { page, pageSize };
};
export const getQuery = (
  searchParams: URLSearchParams
): {
  [key: string]: string;
} => {
  const query: { [key: string]: string } = {};
  searchParams.forEach((value, key) => {
    query[key] = value;
  });
  return query;
};

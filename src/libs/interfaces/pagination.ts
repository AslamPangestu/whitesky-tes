export default interface PaginationInterface {
  page: number;
  limit: number;
  fields?: Array<string>;
}

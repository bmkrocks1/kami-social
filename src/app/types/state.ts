import { SortColumn, SortDirection } from '../directives/sortable.directive';

export interface State<T = any> {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: SortColumn<T>;
  sortDirection: SortDirection;
}

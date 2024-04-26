import { SortColumn, SortDirection } from '../directives/sortable.directive';

export interface State<T = unknown> {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: SortColumn<T>;
  sortDirection: SortDirection;
}

import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { Photo } from '../types/photo';
import { debounceTime, delay, map, switchMap, tap } from 'rxjs/operators';
import { SortColumn, SortDirection } from '../directives/sortable.directive';
import { HttpClient } from '@angular/common/http';
import { State } from '../types/state';
import { SearchResult } from '../types/search-result';

const compare = (v1: string | number, v2: string | number) =>
  v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

function sort(
  photos: Photo[],
  column: SortColumn<Photo>,
  direction: string
): Photo[] {
  if (direction === '' || column === '') {
    return photos;
  } else {
    return [...photos].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(photo: Photo, term: string) {
  return photo.title.toLowerCase().includes(term.toLowerCase());
}

@Injectable()
export class PhotosService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _photos$ = new BehaviorSubject<Photo[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  private _state: State<Photo> = {
    page: 1,
    pageSize: 12,
    searchTerm: '',
    sortColumn: '',
    sortDirection: '',
  };
  private _state$ = new BehaviorSubject<State<Photo>>(this._state);

  public albumId: number | null = null;

  constructor(private http: HttpClient) {
    this._search$
      .pipe(
        debounceTime(200),
        tap(() => {
          this._state$.next(this._state);
          this._loading$.next(true);
        }),
        switchMap(() => this._search()),
        delay(200),
        tap(() => {
          this._loading$.next(false);
        })
      )
      .subscribe((result) => {
        this._photos$.next(result.data);
        this._total$.next(result.total);
      });
  }

  get photos$() {
    return this._photos$.asObservable();
  }
  get total$() {
    return this._total$.asObservable();
  }
  get loading$() {
    return this._loading$.asObservable();
  }
  get state$() {
    return this._state$.asObservable();
  }
  get page() {
    return this._state.page;
  }
  get pageSize() {
    return this._state.pageSize;
  }
  get searchTerm() {
    return this._state.searchTerm;
  }

  set state(state: State<Photo>) {
    this._set(state);
  }
  set page(page: number) {
    this._set({ page });
  }
  set pageSize(pageSize: number) {
    this._set({ pageSize });
  }
  set searchTerm(searchTerm: string) {
    this._set({ searchTerm });
  }
  set sortColumn(sortColumn: SortColumn<Photo>) {
    this._set({ sortColumn });
  }
  set sortDirection(sortDirection: SortDirection) {
    this._set({ sortDirection });
  }

  private _set(patch: Partial<State<Photo>>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult<Photo>> {
    const { sortColumn, sortDirection, pageSize, page, searchTerm } =
      this._state;

    const url = `https://jsonplaceholder.typicode.com${this.albumId ? `/albums/${this.albumId}/` : '/'}photos`;

    return this.http.get<Photo[]>(url).pipe(
      map((photos) => {
        const filtered = photos.filter((photo) => matches(photo, searchTerm));
        return {
          data: sort(filtered, sortColumn, sortDirection).slice(
            (page - 1) * pageSize,
            (page - 1) * pageSize + pageSize
          ),
          total: filtered.length,
        };
      })
    );
  }
}

import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { Album } from '../types/album';
import { debounceTime, delay, map, switchMap, tap } from 'rxjs/operators';
import { SortColumn, SortDirection } from '../directives/sortable.directive';
import { HttpClient } from '@angular/common/http';
import { State } from '../types/state';
import { SearchResult } from '../types/search-result';

function matches(album: Album, term: string) {
  return album.title.toLowerCase().includes(term.toLowerCase());
}

@Injectable()
export class AlbumsService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _albums$ = new BehaviorSubject<Album[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  private _state: State<Album> = {
    page: 1,
    pageSize: 12,
    searchTerm: '',
    sortColumn: '',
    sortDirection: '',
  };
  private _state$ = new BehaviorSubject<State<Album>>(this._state);

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
        this._albums$.next(result.data);
        this._total$.next(result.total);
      });
  }

  get albums$() {
    return this._albums$.asObservable();
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

  set state(state: State<Album>) {
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
  set sortColumn(sortColumn: SortColumn<Album>) {
    this._set({ sortColumn });
  }
  set sortDirection(sortDirection: SortDirection) {
    this._set({ sortDirection });
  }

  private _set(patch: Partial<State<Album>>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult<Album>> {
    const { pageSize, page, searchTerm } = this._state;

    return this.http
      .get<Album[]>('https://jsonplaceholder.typicode.com/albums')
      .pipe(
        map((albums) => {
          const filtered = albums.filter((album) => matches(album, searchTerm));
          return {
            data: filtered.slice(
              (page - 1) * pageSize,
              (page - 1) * pageSize + pageSize
            ),
            total: filtered.length,
          };
        })
      );
  }
}

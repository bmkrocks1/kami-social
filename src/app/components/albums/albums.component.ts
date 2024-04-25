import { AsyncPipe, DecimalPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbHighlight, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';

import { Album } from '../../types/album';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { State } from '../../types/state';
import { AlbumsService } from '../../services/albums.service';

@Component({
  selector: 'ks-albums',
  standalone: true,
  imports: [
    DecimalPipe,
    FormsModule,
    AsyncPipe,
    NgbHighlight,
    NgbPaginationModule,
    RouterLink,
  ],
  templateUrl: './albums.component.html',
  styleUrl: './albums.component.scss',
  providers: [AlbumsService, DecimalPipe],
})
export class AlbumsComponent implements OnInit {
  albums$: Observable<Album[]>;
  total$: Observable<number>;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public service: AlbumsService
  ) {
    this.albums$ = service.albums$;
    this.total$ = service.total$;
  }

  ngOnInit() {
    const state: State<Album> = Object.entries(
      this.activatedRoute.snapshot.queryParams
    )
      .filter(([key]) =>
        [
          'page',
          'pageSize',
          'searchTerm',
          // 'sortColumn',
          // 'sortDirection',
        ].includes(key)
      )
      .reduce((acc, [key, value]) => {
        return {
          ...acc,
          [key]: key === 'page' || key === 'pageSize' ? Number(value) : value,
        };
      }, {} as State<Album>);

    this.service.state = state;

    this.service.state$.subscribe((state) => {
      const queryParams: Params = (
        Object.entries(state) as [keyof State, any][]
      ).reduce((params, [key, value]: [keyof State, any]) => {
        if (
          (key === 'page' && value === 1) ||
          (key === 'pageSize' && value === 12) ||
          !value
        ) {
          params[key] = undefined;
          return params;
        }

        params[key] = value;
        return params;
      }, {} as Params);

      console.log('navigate:', queryParams);

      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams,
        queryParamsHandling: 'merge',
      });
    });
  }
}

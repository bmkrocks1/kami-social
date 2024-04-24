import { AsyncPipe, DecimalPipe } from '@angular/common';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbHighlight, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';

import { Post } from '../../types/post';
import { PostsService } from '../../services/posts.service';
import {
  NgbdSortableHeader,
  SortEvent,
} from '../../directives/sortable.directive';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { State } from '../../types/state';

@Component({
  selector: 'ks-posts',
  standalone: true,
  imports: [
    DecimalPipe,
    FormsModule,
    AsyncPipe,
    NgbHighlight,
    NgbdSortableHeader,
    NgbPaginationModule,
  ],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss',
  providers: [PostsService, DecimalPipe],
})
export class PostsComponent implements OnInit {
  posts$: Observable<Post[]>;
  total$: Observable<number>;

  @ViewChildren(NgbdSortableHeader) headers!: QueryList<
    NgbdSortableHeader<Post>
  >;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public service: PostsService
  ) {
    this.posts$ = service.posts$;
    this.total$ = service.total$;
  }

  ngOnInit() {
    const state: State<Post> = Object.entries(
      this.activatedRoute.snapshot.queryParams
    )
      .filter(([key]) =>
        [
          'page',
          'pageSize',
          'searchTerm',
          'sortColumn',
          'sortDirection',
        ].includes(key)
      )
      .reduce((acc, [key, value]) => {
        return {
          ...acc,
          [key]: key === 'page' || key === 'pageSize' ? Number(value) : value,
        };
      }, {} as State<Post>);

    this.service.state = state;

    this.service.state$.subscribe((state) => {
      const queryParams: Params = (
        Object.entries(state) as [keyof State, any][]
      ).reduce((params, [key, value]: [keyof State, any]) => {
        if (
          (key === 'page' && value === 1) ||
          (key === 'pageSize' && value === 10) ||
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

  onSort({ column, direction }: SortEvent<Post>) {
    // resetting other headers
    this.headers.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }
}

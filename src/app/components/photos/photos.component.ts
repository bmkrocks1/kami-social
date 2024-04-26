import { Component } from '@angular/core';
import { PhotosService } from '../../services/photos.service';
import { FormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { NgbHighlight, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { Photo } from '../../types/photo';
import { State } from '../../types/state';

@Component({
  selector: 'ks-photos',
  standalone: true,
  imports: [
    FormsModule,
    AsyncPipe,
    NgbPaginationModule,
    NgbHighlight,
    RouterLink,
  ],
  templateUrl: './photos.component.html',
  styleUrl: './photos.component.scss',
  providers: [PhotosService],
})
export class PhotosComponent {
  photos$: Observable<Photo[]>;
  total$: Observable<number>;

  isLoading = false;

  constructor(
    private router: Router,
    public photosService: PhotosService,
    private activatedRoute: ActivatedRoute
  ) {
    this.photos$ = photosService.photos$;
    this.total$ = photosService.total$;
  }

  ngOnInit(): void {
    this.fetchPhotos();
  }

  fetchPhotos() {
    const state: State = Object.entries(
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
      }, {} as State);

    this.photosService.state = state;

    this.photosService.state$.subscribe((state) => {
      const queryParams: Params = (
        Object.entries(state) as [keyof State, string | number][]
      ).reduce((params, [key, value]: [keyof State, string | number]) => {
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

      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams,
        queryParamsHandling: 'merge',
      });
    });
  }
}

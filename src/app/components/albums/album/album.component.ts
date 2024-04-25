import { Component } from '@angular/core';
import { Album } from '../../../types/album';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable, catchError, finalize, of } from 'rxjs';
import { AlbumService } from '../../../services/album.service';
import { Photo } from '../../../types/photo';
import { State } from '../../../types/state';
import { PhotosService } from '../../../services/photos.service';
import { FormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { NgbHighlight, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ks-album',
  standalone: true,
  imports: [FormsModule, AsyncPipe, NgbPaginationModule, NgbHighlight],
  templateUrl: './album.component.html',
  styleUrl: './album.component.scss',
  providers: [AlbumService, PhotosService],
})
export class AlbumComponent {
  album: Album | null = null;
  albumId!: number;

  photos$: Observable<Photo[]>;
  total$: Observable<number>;

  isLoading = false;

  constructor(
    private router: Router,
    private albumService: AlbumService,
    public photosService: PhotosService,
    private activatedRoute: ActivatedRoute
  ) {
    this.photos$ = photosService.photos$;
    this.total$ = photosService.total$;
  }

  ngOnInit(): void {
    const albumId = this.activatedRoute.snapshot.paramMap.get('id');
    if (albumId) {
      try {
        this.albumId = parseInt(albumId, 10);
        this.getAlbum(this.albumId);
      } catch (e) {
        // TODO
      }
    }
  }

  getAlbum(albumId: number): void {
    this.isLoading = true;
    this.albumService
      .getAlbumById(albumId)
      .pipe(
        catchError((error) => {
          // TODO: handle error
          return of(error);
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((album) => {
        this.album = album;
        this.fetchPhotos();
      });
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
      }, {} as State<Album>);

    this.photosService.albumId = this.albumId;
    this.photosService.state = state;

    this.photosService.state$.subscribe((state) => {
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

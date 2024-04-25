import { Component } from '@angular/core';
import { PhotoService } from '../../../services/photo.service';
import { ActivatedRoute } from '@angular/router';
import { Photo } from '../../../types/photo';
import { catchError, finalize, of } from 'rxjs';

@Component({
  selector: 'ks-photo',
  standalone: true,
  imports: [],
  templateUrl: './photo.component.html',
  styleUrl: './photo.component.scss',
  providers: [PhotoService],
})
export class PhotoComponent {
  photo: Photo | null = null;
  photoId!: number;

  isLoading = false;

  constructor(
    private photoService: PhotoService,
    private activatedRoute: ActivatedRoute
  ) {
    //
  }

  ngOnInit(): void {
    const photoId = this.activatedRoute.snapshot.paramMap.get('id');
    if (photoId) {
      try {
        this.photoId = parseInt(photoId, 10);
        this.getPhoto(this.photoId);
      } catch (e) {
        // TODO
      }
    }
  }

  getPhoto(photoId: number): void {
    this.isLoading = true;
    this.photoService
      .getPhotoById(photoId)
      .pipe(
        catchError((error) => {
          // TODO: handle error
          return of(error);
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((photo) => (this.photo = photo));
  }
}

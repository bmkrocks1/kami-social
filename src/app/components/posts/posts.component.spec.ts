import { render, screen } from '@testing-library/angular';
import { PostsComponent } from './posts.component';
import { PostsService } from '../../services/posts.service';
import { HttpClientModule } from '@angular/common/http';
import { Post } from '../../types/post';
import { of } from 'rxjs';

const MOCK_POSTS: Post[] = [
  {
    userId: 1,
    id: 1,
    title: 'foo',
    body: 'foo',
  },
  {
    userId: 2,
    id: 2,
    title: 'bar',
    body: 'bar',
  },
];

const postsSpy = jest
  .spyOn(PostsService.prototype, 'posts$', 'get')
  .mockReturnValue(of(MOCK_POSTS));

const totalSpy = jest
  .spyOn(PostsService.prototype, 'total$', 'get')
  .mockReturnValue(of(MOCK_POSTS.length));

const loadingSpy = jest
  .spyOn(PostsService.prototype, 'loading$', 'get')
  .mockReturnValue(of(false));

describe('PostsComponent', () => {
  test('should render posts', async () => {
    const result = await render(PostsComponent, {
      imports: [HttpClientModule],
    });

    expect(postsSpy).toHaveBeenCalled();
    expect(totalSpy).toHaveBeenCalled();
    expect(loadingSpy).toHaveBeenCalled();

    const table: HTMLTableElement = screen.getByTestId('posts-table');
    expect(table).toBeInTheDocument();

    const rows: HTMLTableRowElement[] =
      screen.queryAllByTestId('posts-table-row');
    expect(rows.length).toBe(MOCK_POSTS.length);

    expect(result.container).toMatchSnapshot();
  });
});

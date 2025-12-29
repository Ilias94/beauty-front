import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { VideoControllerService } from '../../../api/services';
import { VideoDtoResponse } from '../../../api/models';
import { AddVideoAction, DeleteVideoAction, EditVideoDescriptionAction, LoadVideosAction } from './video.actions';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { environment } from '../../../environments/enfironment';

export class VideoStateModel {
  public videos: VideoDtoResponse[];
}

const defaults: VideoStateModel = {
  videos: []
};

@State<VideoStateModel>({
  name: 'video',
  defaults
})
@Injectable()
export class VideoState {

  constructor(
    private videoService: VideoControllerService,
    private httpClient: HttpClient
  ) { }

  @Action(LoadVideosAction)
  loadVideos({ patchState }: StateContext<VideoStateModel>, { courseId }: LoadVideosAction) {
    return this.videoService.getVideos({ courseId }).pipe(tap(response => {
      patchState({ videos: response })
    }))
  }




  @Action(EditVideoDescriptionAction)
  editVideoDescription(
    { dispatch }: StateContext<VideoStateModel>,
    { videoId, description }: EditVideoDescriptionAction
  ) {
    return this.videoService.editDescription({
      body: { videoId, description }
    }).pipe(
      tap(() => {

      })
    );
  }

  @Action(AddVideoAction)
  addVideos({ }: StateContext<VideoStateModel>, { courseId, files }: AddVideoAction) {
    console.log("in add video action")
    const formdata = new FormData()
    for (const file of files) {
      formdata.append("videos", file)
    }
    return this.httpClient.post(`${environment.apiUrl}/api/v1/video/upload/${courseId}`, formdata)
  }


  @Action(DeleteVideoAction)
  deleteVideo({ dispatch }: StateContext<VideoStateModel>, { videoId, courseId }: DeleteVideoAction) {
    return this.videoService.deleteVideo({ videoId }).pipe(tap(() => { dispatch(new LoadVideosAction(courseId)) }));
  }
}

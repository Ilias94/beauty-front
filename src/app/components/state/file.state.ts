import { Injectable } from '@angular/core';
import { State, Action, StateContext } from '@ngxs/store';
import { DownloadFileCsvAction, DownloadFileExcelAction } from './file.actions';
import { ReportControllerService } from '../../../api/services';
import { tap } from 'rxjs';

export class FileStateModel {
  public items: string[];
}

const defaults = {
  items: []
};

@State<FileStateModel>({
  name: 'file',
  defaults
})
@Injectable()
export class FileState {
  constructor(private reportService: ReportControllerService) { }

  @Action(DownloadFileExcelAction)
  downloadExcelFile({ }: StateContext<FileStateModel>, { courseId }: DownloadFileExcelAction) {
    return this.reportService.generateReportExcel({ courseId }).pipe(
      tap((response) => {
        this.saveFile(response, `course${courseId}.xls`)
      })
    )
  }

  @Action(DownloadFileCsvAction)
  downloadCsvFile({ }: StateContext<FileStateModel>, { courseId }: DownloadFileCsvAction) {
    return this.reportService.generateReportCsv({ courseId }).pipe(
      tap((response) => {
        this.saveFile(response, `course${courseId}.csv`)
      })
    )
  }

  private saveFile(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}

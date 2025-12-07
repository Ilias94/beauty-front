export class DownloadFileExcelAction {
  static readonly type = '[File] DownloadFileExcelAction';
  constructor(public courseId: number) { }
}

export class DownloadFileCsvAction {
  static readonly type = '[File] DownloadFileCsvAction';
  constructor(public courseId: number) { }
}

import { Injectable, inject } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslocoService } from '@jsverse/transloco';

/** Material paginator labels ("Items per page", "1 – 12 of 16") in the UI language. */
@Injectable()
export class TranslatedPaginatorIntl extends MatPaginatorIntl {
  private transloco = inject(TranslocoService);

  constructor() {
    super();
    this.transloco.langChanges$.subscribe(() => this.updateLabels());
    // Labels arrive with the translation file, which may load after the first lang change.
    this.transloco.events$.subscribe(e => { if (e.type === 'translationLoadSuccess') this.updateLabels(); });
  }

  override getRangeLabel = (page: number, pageSize: number, length: number): string => {
    if (length === 0) return this.transloco.translate('paginator.range', { from: 0, to: 0, total: 0 });
    const from = page * pageSize + 1;
    const to = Math.min(length, (page + 1) * pageSize);
    return this.transloco.translate('paginator.range', { from, to, total: length });
  };

  private updateLabels(): void {
    this.itemsPerPageLabel = this.transloco.translate('paginator.itemsPerPage');
    this.nextPageLabel = this.transloco.translate('paginator.next');
    this.previousPageLabel = this.transloco.translate('paginator.previous');
    this.firstPageLabel = this.transloco.translate('paginator.first');
    this.lastPageLabel = this.transloco.translate('paginator.last');
    this.changes.next();
  }
}

import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

/**
 * Picks the plural form of a translation key for a count, e.g. 'rating.count' + 5 in Polish
 * gives 'rating.count.many' ("5 ocen"). Each key defines one/few/many/other in every language,
 * so the result stays valid when the language changes.
 */
@Pipe({ name: 'plural' })
export class PluralPipe implements PipeTransform {
  private transloco = inject(TranslocoService);

  transform(count: number | null | undefined, key: string): string {
    const category = new Intl.PluralRules(this.transloco.getActiveLang()).select(count ?? 0);
    return `${key}.${['one', 'few', 'many'].includes(category) ? category : 'other'}`;
  }
}

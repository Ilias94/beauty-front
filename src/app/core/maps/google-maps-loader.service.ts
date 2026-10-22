import { DOCUMENT, Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../environments/enfironment';

const READY_CALLBACK = '__bellademyMapsReady';

/**
 * Loads the Google Maps script the first time a page shows a map, instead of on every page from index.html.
 * Resolves once `google.maps` is ready; on the server it never resolves, so no map is rendered there.
 */
@Injectable({ providedIn: 'root' })
export class GoogleMapsLoader {
  private document = inject(DOCUMENT);
  private browser = isPlatformBrowser(inject(PLATFORM_ID));
  private loading?: Promise<void>;

  load(): Promise<void> {
    if (!this.browser) return new Promise(() => {});
    if (typeof google !== 'undefined' && google.maps?.importLibrary) return Promise.resolve();
    return this.loading ??= new Promise((resolve, reject) => {
      const win = window as unknown as Record<string, unknown>;
      win[READY_CALLBACK] = () => {
        delete win[READY_CALLBACK];
        resolve();
      };
      const script = this.document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsKey}`
        + `&libraries=marker&loading=async&callback=${READY_CALLBACK}`;
      script.async = true;
      script.onerror = () => {
        // Let the next page try again, e.g. after a network blip.
        this.loading = undefined;
        script.remove();
        reject(new Error('Google Maps could not be loaded'));
      };
      this.document.head.appendChild(script);
    });
  }
}

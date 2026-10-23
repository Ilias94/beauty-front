import { Injectable, signal } from '@angular/core';

/** Counts in-flight work (HTTP requests and route changes) for the top progress bar. */
@Injectable({ providedIn: 'root' })
export class LoadingService {
  private pending = 0;
  private readonly busySignal = signal(false);
  readonly busy = this.busySignal.asReadonly();

  start(): void {
    this.pending++;
    this.publish();
  }

  stop(): void {
    this.pending = Math.max(0, this.pending - 1);
    this.publish();
  }

  // Requests can start while Angular evaluates a computed signal (e.g. Transloco lazily loading
  // a translation file), where writing to a signal throws NG0600. Publish on a microtask instead.
  private publish(): void {
    queueMicrotask(() => this.busySignal.set(this.pending > 0));
  }
}

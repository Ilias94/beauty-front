import { Component, inject, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { MenuComponent } from './components/public/menu/menu.component';
import { ChatWidgetComponent } from './components/chat-widget/chat-widget.component';
import { AssistantWidgetComponent } from './components/assistant-widget/assistant-widget.component';
import { FabDockComponent } from './shared/chat/fab-dock.component';
import { ApiConfiguration } from '../api/api-configuration';
import { environment } from '../environments/enfironment';


@Component({
    selector: 'app-root',
    imports: [MenuComponent, ChatWidgetComponent, AssistantWidgetComponent, FabDockComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.sass'
})

export class AppComponent implements OnInit {
  private apiConfiguration = inject(ApiConfiguration);

  constructor() {
    // <mat-icon>name</mat-icon> renders with Material Symbols Rounded (loaded in index.html).
    inject(MatIconRegistry).setDefaultFontSetClass('material-symbols-rounded');
  }

  ngOnInit(): void {
    this.apiConfiguration.rootUrl = environment.apiUrl;
  }
}

import { Component, inject, OnInit } from '@angular/core';
import { MenuComponent } from './components/public/menu/menu.component';
import { ChatWidgetComponent } from './components/chat-widget/chat-widget.component';
import { AssistantWidgetComponent } from './components/assistant-widget/assistant-widget.component';
import { ApiConfiguration } from '../api/api-configuration';
import { environment } from '../environments/enfironment';


@Component({
    selector: 'app-root',
    imports: [MenuComponent, ChatWidgetComponent, AssistantWidgetComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.sass'
})

export class AppComponent implements OnInit {
  private apiConfiguration = inject(ApiConfiguration);

  ngOnInit(): void {
    this.apiConfiguration.rootUrl = environment.apiUrl;
  }
}

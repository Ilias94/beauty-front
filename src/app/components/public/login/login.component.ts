import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyFieldConfig, FormlyForm, FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import {MatButtonModule} from '@angular/material/button';
import { Store } from '@ngxs/store';
import { LoginAction } from '../../state/security.actions';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormlyModule, FormlyMaterialModule, ReactiveFormsModule, MatButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.sass'
})
export class LoginComponent {

  form = new FormGroup({})
  fields: FormlyFieldConfig[] = [
    {
      key: "email",
      type: "input",
      props: {
        label: "email",
        placeholder: "enter your email",
        type: "email"
      }
    }, 
    {
      key: "password",
      type: "input",
      props: {
        label: "password",
        placeholder: "enter your password",
        type: "password"
      }
    }
  ]
  constructor(private store: Store){}
  login(){
    this.store.dispatch(new LoginAction(this.form.value.email,this.form.value.password))
  }


}

import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { FormlyFieldConfig, FormlyForm, FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';

@Component({
  selector: 'app-account-form',
  standalone: true,
  imports: [FormlyModule, FormlyMaterialModule, ReactiveFormsModule, MatButtonModule],
  templateUrl: './account-form.component.html',
  styleUrl: './account-form.component.sass'
})
export class AccountFormComponent {

  passwordForm = new FormGroup({})
  passwordFields: FormlyFieldConfig[] = [
    {
      key: "password",
      type: "input",
      props: {
        label: "password",
        placeholder: "enter your email",
        type: "email"
      }
    }, 
    {
      key: "confirmPassword",
      type: "input",
      props: {
        label: "confirm password",
        placeholder: "enter your password",
        type: "password"
      }
    }
  ]

  userForm = new FormGroup({})
  userFields: FormlyFieldConfig[] = [
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
      key: "firstName",
      type: "input",
      props: {
        label: "first name",
        placeholder: "enter your password",
      }
    },
    {
      key: "lastName",
      type: "input",
      props: {
        label: "last name",
        placeholder: "enter your password",
      }
    }
  ]
  changePassword(){

  }

  changeUserData(){

  }
}

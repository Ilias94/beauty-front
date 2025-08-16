import { Component, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { FormlyFieldConfig, FormlyForm, FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { Store } from '@ngxs/store';
import { ChangePasswordAction } from '../state/user.actions';
import { passwordRegex } from '../../app.const';

@Component({
  selector: 'app-account-form',
  standalone: true,
  imports: [FormlyModule, FormlyMaterialModule, ReactiveFormsModule, MatButtonModule],
  templateUrl: './account-form.component.html',
  styleUrl: './account-form.component.sass'
})
export class AccountFormComponent {
  store = inject(Store)

  passwordForm = new FormGroup({})
  passwordFields: FormlyFieldConfig[] = [
    {
      key: "oldPassword",
      type: "input",
      props: {
        label: "oldPassword",
        placeholder: "enter your oldPassword",
        type: "password",
        required: true,
      }
    },
    {
      key: "newPassword",
      type: "input",
      props: {
        label: "newPassword",
        placeholder: "enter your newPassword",
        type: "password",
        required: true,
        minLength: 6,
        pattern: passwordRegex
      },
      validation: {
        messages: {
          pattern: (error: any, field: FormlyFieldConfig) => "Needed one small letter, one capital letter and number and special character",
        }
      }
    }, 
    {
      key: "confirmPassword",
      type: "input",
      props: {
        label: "confirm password",
        placeholder: "enter again your newPassword",
        type: "password",
        required: true,
        minLength: 6,
        pattern: passwordRegex
      },
      validation: {
        messages: {
          pattern: (error: any, field: FormlyFieldConfig) => "Needed one small letter, one capital letter and number and special character",
        }
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
        type: "email",
        required: true,
      }
    }, 
    {
      key: "firstName",
      type: "input",
      props: {
        label: "first name",
        placeholder: "enter your password",
        required: true
      }
    },
    {
      key: "lastName",
      type: "input",
      props: {
        label: "last name",
        placeholder: "enter your password",
        required: true
      }
    }
  ]
  changePassword(){
    this.store.dispatch(new ChangePasswordAction({
      oldPassword: this.passwordForm.get('oldPassword')?.value,
      newPassword: this.passwordForm.get('newPassword')?.value,
      confirmNewPassword: this.passwordForm.get('confirmPassword')?.value
    }))
  }

  changeUserData(){

  }
}

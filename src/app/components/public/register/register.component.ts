import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyFieldConfig, FormlyForm, FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { MatButtonModule } from '@angular/material/button';
import { NgxsModule, Store } from '@ngxs/store';
import { LoginAction, RegisterAction } from '../../state/security.actions';
import { UserDto } from '../../../../api/models/user-dto';
import { passwordRegex } from '../../../app.const';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormlyModule, FormlyMaterialModule, ReactiveFormsModule, MatButtonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.sass'
})
export class RegisterComponent {

  file: File

  form = new FormGroup({})
  fields: FormlyFieldConfig[] = [
    {
      key: "firstName",
      type: "input",
      props: {
        label: "firstName",
        placeholder: "enter your first name",
        required: true
      }
    },
    {
      key: "lastName",
      type: "input",
      props: {
        label: "lastName",
        placeholder: "enter your last name",
        required: true
      }
    },
    {
      key: "email",
      type: "input",
      props: {
        label: "email",
        placeholder: "enter your email",
        type: "email",
        required: true
      }
    },
    {
      validators: {
        validation: [{ name: 'passwordMatch', options: { errorPath: 'passwordConfirm' } }],
      },
      fieldGroup: [
        {
          key: "password",
          type: "input",
          props: {
            label: "password",
            placeholder: "enter your password",
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
            label: "confirmPassword",
            placeholder: "confirm your password",
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
          key: "teacher",
          type: "checkbox",
          props: {
            label: "teacher"
          }
        }
      ]
    }
  ]
  // constructor(private store: Store){}
  // login(){
  //   this.store.dispatch(new LoginAction(this.form.get('email')?.value, this.form.get('password')?.value));
  // }
  constructor(private store: Store) { }
  register() {
    const userDto: UserDto = {
      email: this.form.get('email').value,
      firstName: this.form.get('firstName').value,
      lastName: this.form.get('lastName').value,
      password: this.form.get('password').value,
      confirmPassword: this.form.get('confirmPassword').value,
      teacher: this.form.get('teacher').value
    };

    this.store.dispatch(new RegisterAction(userDto, this.file))
  }

  onFileChange(event: Event) {
    const inputFile = event.target as HTMLInputElement;
    if (inputFile.files.length > 0) {
      this.file = inputFile.files[0]
    }
  }
}

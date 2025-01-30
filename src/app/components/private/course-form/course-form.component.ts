import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { FormlyMatDatepickerModule } from '@ngx-formly/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Action, Store } from '@ngxs/store';
import { MatButtonModule } from '@angular/material/button';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { SaveCourseAction } from '../../state/course.actions';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

@Component({
  selector: 'app-course-form',
  standalone: true,
  imports: [MatNativeDateModule, FormlyMatDatepickerModule, ReactiveFormsModule,
    FormlyModule, MatButtonModule, FormlyMaterialModule, NgxMaterialTimepickerModule],
  templateUrl: './course-form.component.html',
  styleUrl: './course-form.component.sass'
})
export class CourseFormComponent {

  form = new FormGroup({})
  fields: FormlyFieldConfig[] = [
    {
      fieldGroup: [
        {
          key: "title",
          type: "input",
          props: {
            label: "title",
            placeholder: "enter your title",
            required: true,
            minLength: 5
          }
        },
        {
          key: "description",
          type: "textarea",
          props: {
            label: "description",
            placeholder: "enter your description",
            rows: 5,
            required: true
          }
        },
        {
          key: "price",
          type: "input",
          props: {
            label: "price",
            placeholder: "input course price",
            type: "number",
            min: 10,
            required: true
          }
        },
        {
          key: "maxParticipants",
          type: "input",
          props: {
            label: "maxParticipants",
            placeholder: "enter your maxParticipants",
            required: true
          }
        },
        {
          key: "startDate",
          type: "datepicker",
          props: {
            label: "startDate",
            placeholder: "enter your startDate",
            required: true
          }
        },
        {
          key: "endDate",
          type: "datepicker",
          props: {
            label: "endDate",
            placeholder: "enter your endDate",
            required: true
          }
        },
        {
          key: "timePicker",
          type: "time-picker",
          props: {
            label: "start-time",
            placeholder: "enter your startTime",
            required: true
          }
        }
      ]
    },
    {
      template: "<h2>address:</h2>"
    },
    {
      fieldGroup: [
        {
          key: "district",
          type: "input",
          props: {
            label: "district",
            placeholder: "enter your district",
            required: true
          }
        },
        {
          key: "street",
          type: "input",
          props: {
            label: "street",
            placeholder: "enter your street",
            required: true
          }
        },
        {
          key: "streetNumber",
          type: "input",
          props: {
            label: "streetNumber",
            placeholder: "enter your street number",
            required: true
          }
        },
        {
          key: "apartmentNumber",
          type: "input",
          props: {
            label: "apartment number",
            placeholder: "enter your apartment number",
            required: true
          }
        },
        {
          key: "city",
          type: "input",
          props: {
            label: "city",
            placeholder: "enter your city",
            required: true
          }
        },
        {
          key: "postalCode",
          type: "input",
          props: {
            label: "postal code",
            placeholder: "enter your postal code",
            required: true
          }
        }
      ]
    },
    {
      template: "<h2>category:</h2>"
    },
    {
      fieldGroup: [
        {
          key: "category",
          type: "select",
          props: {
            label: "category",
            placeholder: "enter your category",
            options: [
              {
                "value": "Barber",
                "label": "barber"
              },
              {
                "value": "Hairdresser",
                "label": "hairdresser"
              },
              {
                "value": "Makeup Artist",
                "label": "makeup artist"
              },
              {
                "value": "Nail Technician",
                "label": "nail technician"
              },
              {
                "value": "Esthetician",
                "label": "esthetician"
              },
              {
                "value": "Massage Therapist",
                "label": "massage therapist"
              },
              {
                "value": "Skin Care Specialist",
                "label": "skin care specialist"
              },
              {
                "value": "Lash Technician",
                "label": "lash technician"
              },
              {
                "value": "Permanent Makeup Artist",
                "label": "permanent makeup artist"
              },
              {
                "value": "Hair Colorist",
                "label": "hair colorist"
              },
              {
                "value": "Wax Specialist",
                "label": "wax specialist"
              }
            ],
            required: true
          }
        }
      ]
    }

  ]
  constructor(private store: Store) { }
  submit() {
    this.store.dispatch(new SaveCourseAction({
      title: this.form.get('title')?.value,
      description: this.form.get('description')?.value,
      price: this.form.get('price').value,
      maxParticipants: this.form.get('maxParticipants')?.value,
      startDate: this.form.get('startDate')?.value,
      endDate: this.form.get('endDate')?.value,
      address: {
        district: this.form.get('district')?.value,
        street: this.form.get('street')?.value,
        streetNumber: this.form.get('streetNumber')?.value,
        apartmentNumber: this.form.get('apartmentNumber')?.value,
        city: this.form.get('city')?.value,
        postalCode: this.form.get('postalCode')?.value
      },
      category: { label: this.form.get('category')?.value }
    }))
  }
}

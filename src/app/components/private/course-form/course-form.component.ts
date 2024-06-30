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
     FormlyModule, MatButtonModule, FormlyMaterialModule,NgxMaterialTimepickerModule],
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
          }
        },
        {
          key: "description",
          type: "textarea",
          props: {
            label: "description",
            placeholder: "enter your description",
            rows: 5
          }
        },
        {
          key: "maxParticipants",
          type: "input",
          props: {
            label: "maxParticipants",
            placeholder: "enter your maxParticipants",
          }
        },
        {
          key: "startDate",
          type: "datepicker",
          props: {
            label: "startDate",
            placeholder: "enter your startDate",
          }
        },
        {
          key: "endDate",
          type: "datepicker",
          props: {
            label: "endDate",
            placeholder: "enter your endDate",
          }
        },
        {
          key: "timePicker",
          type: "time-picker",
          props: {
            label: "start-time",
            placeholder: "enter your startTime",
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
          }
        },
        {
          key: "street",
          type: "input",
          props: {
            label: "street",
            placeholder: "enter your street",
          }
        },
        {
          key: "streetNumber",
          type: "input",
          props: {
            label: "streetNumber",
            placeholder: "enter your street number",
          }
        },
        {
          key: "apartmentNumber",
          type: "input",
          props: {
            label: "apartment number",
            placeholder: "enter your apartment number",
          }
        },
        {
          key: "city",
          type: "input",
          props: {
            label: "city",
            placeholder: "enter your city",
          }
        },
        {
          key: "postalCode",
          type: "input",
          props: {
            label: "postal code",
            placeholder: "enter your postal code",
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
                "value": "BARBER",
                "label": "barber"
            },
            {
                "value": "HAIRDRESSER",
                "label": "hairdresser"
            },
            {
                "value": "MAKEUP_ARTIS",
                "label": "makeup artist"
            },
            {
                "value": "NAIL_TECHNICIAN",
                "label": "nail technician"
            },
            {
                "value": "ESTHETICIAN",
                "label": "esthetician"
            },
            {
                "value": "MASSAGE_THERAPIST",
                "label": "massage therapist"
            },
            {
                "value": "SKIN_CARE_SPECIALIST",
                "label": "skin care specialist"
            },
            {
                "value": "LASH_TECHNICIAN",
                "label": "lash technician"
            },
            {
                "value": "BROW_ARTIST",
                "label": "brow artist"
            },
            {
                "value": "SPA_THERAPIST",
                "label": "spa therapist"
            },
            {
                "value": "COSMETOLOGIST",
                "label": "cosmetologist"
            },
            {
                "value": "PERMANENT_MAKEUP_ARTIST",
                "label": "permanent makeup artist"
            },
            {
                "value": "HAIR_COLORIST",
                "label": "hair colorist"
            },
            {
                "value": "WAX_SPECIALIST",
                "label": "wax specialist"
            }
            ]
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
    category: this.form.get('category')?.value,
   }))
  }
}

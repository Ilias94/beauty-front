import { Component, effect, Signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { FormlyMatDatepickerModule } from '@ngx-formly/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Action, Store } from '@ngxs/store';
import { MatButtonModule } from '@angular/material/button';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { SaveCourseAction } from '../../state/course.actions';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { GetAiPromptAction } from '../../state/ai.actions';
import { toSignal } from '@angular/core/rxjs-interop';
import { state } from '@angular/animations';

function toLocalIsoString(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0');

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
         `T${pad(date.getHours())}:${pad(date.getMinutes())}:00`;
}

function toLocalIsoDateOnly(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T00:00:00`;
}

@Component({
  selector: 'app-course-form',
  standalone: true,
  imports: [MatNativeDateModule, FormlyMatDatepickerModule, ReactiveFormsModule,
    FormlyModule, MatButtonModule, FormlyMaterialModule, NgxMaterialTimepickerModule],
  templateUrl: './course-form.component.html',
  styleUrl: './course-form.component.sass'
})

export class CourseFormComponent {
  searchInput$ = new Subject<string>();
  prompt: Signal<string> = toSignal(this.store.select(state => state.ai.prompt));
  

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
            minLength: 5,
            keyup: (field, event: any) => {
              this.searchInput$.next(event.target.value);
            }
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
  constructor(private store: Store) {
    effect(() => {
      if (this.prompt()) {
        this.form.patchValue({ "description": this.prompt() })
      }
    })
  }
  ngOnInit() {
    this.searchInput$
      .pipe(
        debounceTime(1000), // poczekaj 1000ms od ostatniego wpisania
        distinctUntilChanged() // tylko jeśli wartość się zmieniła
      )
      .subscribe(value => {
        console.log('Wysyłam request z:', value);
        // TODO: wykonaj zapytanie do backendu tutaj
        this.store.dispatch(new GetAiPromptAction({
          prompt: value
        }))
      });
  }

  
  submit() {
    const date: Date = this.form.get('startDate')?.value;
    const time: string = this.form.get('timePicker')?.value; // np. "14:30"

    let startDateTimeIso: string | null = null;
    if (date && time) {
      const [hours, minutes] = time.split(':').map(Number);

      // Stwórz nową datę z połączonym czasem
      const combinedDate = new Date(date);
      combinedDate.setHours(hours);
      combinedDate.setMinutes(minutes);
      combinedDate.setSeconds(0);
      combinedDate.setMilliseconds(0);

      // Konwertuj na ISO string (dla backendu)
      startDateTimeIso = toLocalIsoString(combinedDate);

    }

    // Analogicznie można dodać obróbkę endDate jeśli potrzeba
   const endDateControl = this.form.get('endDate');
const endDate = endDateControl?.value as Date;
const endDateIso = endDate ? toLocalIsoDateOnly(endDate) : null;
    this.store.dispatch(new SaveCourseAction({
      title: this.form.get('title')?.value,
      description: this.form.get('description')?.value,
      price: this.form.get('price').value,
      maxParticipants: this.form.get('maxParticipants')?.value,
      startDate: startDateTimeIso,
      endDate: endDateIso,
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



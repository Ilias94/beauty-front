import { Routes } from '@angular/router';
import { LoginComponent } from './components/public/login/login.component';
import { RegisterComponent } from './components/public/register/register.component';
import { CourseFormComponent } from './components/private/course-form/course-form.component';
import { authGuard } from './auth.guard';
import { ForbiddenComponent } from './components/public/forbidden/forbidden.component';
import { CoursesComponent } from './components/courses/courses.component';
import { CourseDetailsComponent } from './components/course-details/course-details.component';
import { MyAccountComponent } from './components/my-account/my-account.component';
import { AccountFormComponent } from './components/account-form/account-form.component';
import { CreatorCoursesComponent } from './components/creator-courses/creator-courses.component';
import { StudentCoursesComponent } from './components/student-courses/student-courses.component';
import { MyCommentsComponent } from './components/my-comments/my-comments.component';
import { PaymentStatusComponent } from './components/payment-status/payment-status.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { QuestionResultsComponent } from './components/question-results/question-results.component';
import { EditQuestionsComponent } from './components/edit-questions/edit-questions.component';
import { ResolveQuestionsComponent } from './components/resolve-questions/resolve-questions.component';


export const routes: Routes = [
    {
        path: "login",
        component: LoginComponent
    },
    {
        path: "registry",
        component: RegisterComponent
    },
    {
        path: "course",
        component: CourseFormComponent,
        canActivate: [authGuard],
        data: {roles: ["TEACHER"]}
    },
    {
        path: "forbidden",
        component: ForbiddenComponent
    },
    {
        path: "courses",
        component: CoursesComponent
    },
    {
        path:"course/:id",
        component: CourseDetailsComponent
    },
    {
        path:"my-account",
        component: MyAccountComponent,
        canActivate: [authGuard]
    },
    {
        path:"account",
        component: AccountFormComponent,
        canActivate: [authGuard]
    },
    {
        path:"creator-courses",
        component: CreatorCoursesComponent
    },
    {
        path:"student-courses",
        component: StudentCoursesComponent
    },
    {
        path:"my-comments",
        component: MyCommentsComponent
    },
    {
        path:"payment-status",
        component: PaymentStatusComponent
    },
    {
        path:"calendar",
        component: CalendarComponent
    },
    {
        path:"questions/:courseId",
        component: QuestionResultsComponent
    },
    {
        path:"edit-questions/:courseId",
        component: EditQuestionsComponent
    },
    {
        path:"resolve-questions/:courseId",
        component: ResolveQuestionsComponent
    }
];

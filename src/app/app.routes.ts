import { Routes } from '@angular/router';
import { LoginComponent } from './components/public/login/login.component';
import { RegisterComponent } from './components/public/register/register.component';
import { CourseFormComponent } from './components/private/course-form/course-form.component';
import { authGuard } from './auth.guard';
import { ForbiddenComponent } from './components/public/forbidden/forbidden.component';
import { CoursesComponent } from './components/courses/courses.component';
import { CourseDetailsComponent } from './course-details/course-details.component';
import { MyAccountComponent } from './components/my-account/my-account.component';
import { AccountFormComponent } from './components/account-form/account-form.component';


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
    }
];

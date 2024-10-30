import { Routes } from '@angular/router';
import { LayoutComponent } from '../pages/layout/layout.component';
import { HomeComponent } from '../pages/home/home.component';
import { ResumelistComponent } from '../pages/resumelist/resumelist.component';
import { QuestionerComponent } from '../pages/questioner/questioner.component';
import { ResumeUploadComponent } from '../pages/resume-upload/resume-upload.component';
import { JDUploadComponent } from '../pages/jd-upload/jd-upload.component';



export const routes: Routes = [
    
    {
        path:'',
        component:LayoutComponent,
        children:[
            {
                path: '',
                redirectTo:'home',
                pathMatch:'full'
             },
            {
                path:'home',
                component:HomeComponent,
                title:'Home'
            },
            {
                path:'resumelist',
                component:ResumelistComponent,
                title:'Resumelist'
            },
            {
                path: 'questioner',
                component:QuestionerComponent,
                title:'Questioner'
            },
            {
                path:'resume-upload',
                component:ResumeUploadComponent,
                title:'Resume-upload'
            },
            {
                path:'JD-upload',
                component:JDUploadComponent,
                title:'Jd-upload'
            }
            
        ]
    }
    
    ];
    

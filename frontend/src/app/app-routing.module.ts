import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DraftBoardComponent } from './pages/draft-board/draft-board.component';

const routes: Routes = [
  {
    path: 'draft-board',
    component: DraftBoardComponent
  }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [

    ]
  })
export class AppRoutingModule { }

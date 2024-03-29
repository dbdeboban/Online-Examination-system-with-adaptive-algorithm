import { Injectable } from '@angular/core';

import { NavigationStart, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  message = '';
  messageType = 'danger';

  user: any;
  tests: any;
  
  constructor( private router: Router ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.message = '';
      }
    });
   }


   error(message) {
     this.messageType = 'danger';
     this.message = message;
   }

   success(message) {
     this.messageType = 'success';
     this.message = message;
   }

   warning(message) {
     this.messageType = 'warning';
     this.message = message;
   }

   saveuser(data) {
     this.user = data;
     console.log(this.user);
   }

}

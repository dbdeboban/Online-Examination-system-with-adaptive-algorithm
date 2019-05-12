import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { RestApiService } from '../rest-api.service';
import { DataService } from '../data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';

  btnDisabled = false;
  constructor(private router: Router, private data: DataService, private rest: RestApiService) { }

  ngOnInit() {
  }
  validate() {
    if (this.email) {
      if (this.password) {
        return true;
      } else {
        this.data.error('Password not Entered');
      }
    } else {
      this.data.error('Email Not Entered');
    }
  }

  async login() {
    this.btnDisabled = true;
    try {
      if (this.validate()) {
        const data = await this.rest.post(
          'http://localhost:3030/api/accounts/login',
          {
            email: this.email,
            password: this.password
          }
        );
        if (data['success']) {
          localStorage.setItem('token', data['token']);
          this.data.saveuser(data['userdata']);
          this.router.navigate(['/profile']);
        } else {
          this.data.error(data['message']);
        }
      }
    } catch (error) {
      this.data.error(error['message']);
    }
    this.btnDisabled =false;
  }
}

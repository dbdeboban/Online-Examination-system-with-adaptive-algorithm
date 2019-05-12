import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { RestApiService } from '../rest-api.service';
import { DataService } from '../data.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  tests: any = [];

  constructor(private router: Router, private data: DataService, private rest: RestApiService) { }

  async ngOnInit() {
    try{
      const data = await this.rest.get('http://localhost:3030/api/loadtests/test');
      data['success'] ?
        (this.tests = data['tests']): (this.data.error(data['message']));
    } catch (error){
      this.data.error(error['message']);
    }
  }

  logout() {
    this.data.user = {};
    localStorage.clear();
    this.router.navigate(['']);
  }

  getTest(id) {
    this.router.navigate(['test', { query: id }]);
  }
}

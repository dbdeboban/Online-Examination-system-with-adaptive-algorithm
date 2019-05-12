import { Component, OnInit } from '@angular/core';

import { Router,ActivatedRoute } from '@angular/router';
import { RestApiService } from '../rest-api.service';
import { DataService } from '../data.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {
  query: Number;
  scores: any=[];
  score: any = [];
  constructor(private activcatedRoute: ActivatedRoute, private data: DataService, private rest: RestApiService, private router: Router) { }

  async ngOnInit() {
    this.activcatedRoute.params.subscribe(res => {
      this.query = res['query'];
    });
    this.scores = this.data['user'].score;
    this.testScore();
  }
  testScore(){
    for (var i = 0; i < this.scores.length; i++) {
      if (this.scores[i].testid == this.query) {
        for (var j = 0; j < this.scores[i].score.length; j++) {
          this.score.push(this.scores[i].score[j].sectionScore);
        }
      }
    }
  }
  goToProfile(){
    this.router.navigate(['/profile']);
  }
}

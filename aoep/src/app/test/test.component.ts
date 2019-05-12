import { Component, OnInit } from '@angular/core';

import { Router,ActivatedRoute } from '@angular/router';
import { RestApiService } from '../rest-api.service';
import { DataService } from '../data.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {
  query: Number;
  test: any = [];
  questionSet: any = [];
  sectionScore: any = [];
  scores: any = [];
  email: String;
  currentQues: Number = 0;
  currentSec: Number = 0;
  currentOption: Number = -1;
  testStarted: Boolean = false;

  constructor(private activcatedRoute: ActivatedRoute, private data: DataService, private rest: RestApiService, private router: Router) { }

  async ngOnInit() {
    this.activcatedRoute.params.subscribe(res => {
      this.query = res['query'];
    });
    this.scores = this.data['user'].score;
    try {
      const data = await this.rest.get(`http://localhost:3030/api/loadtests/test/${this.query}`);
      if (data['success']) {
        this.test = data['test'];
        this.createTest();
      } else {
        this.data.error(data['message']);
      }
    } catch (error) {
      this.data.error(error['message']);
    }
  }
  async updateUserScores() {
    try {
      const data = await this.rest.post('http://localhost:3030/api/accounts/registerScore', { scores: this.scores, email: this.data.user.email });
      if (data['success']) {
        this.data.success('Scores Updated');
        this.getResults();
      } else {
        this.data.error(data['message']);
      }
    } catch (error) {
      this.data.error(error['message']);
    }
  }
  getResults(){
    this.router.navigate(['result', { query:  this.query}]);
  }
  startTest() {
    this.testStarted = true;
    localStorage.setItem('testStarted', "true");
  }

  endTest() {
    this.testStarted = false;
    localStorage.removeItem('testStarted');
    this.updateLocalScore();
  }
  updateLocalScore(){
    for(var i=0; i<this.sectionScore.length; i++){
      var thisSecScore = 0;
      for(var j=0; j<this.sectionScore[i].nosQues; j++){
        if(this.questionSet[i].questions[j].givenAnswer == this.questionSet[i].questions[j].answer)
        {
          thisSecScore++;
        }
      }
      this.sectionScore[i].sectionScore = Math.round((thisSecScore/this.sectionScore[i].nosQues)*100);
    }

    for(var i=0;i<this.scores.length;i++){
      if(this.scores[i].testid == this.query){
        for(var j=0;j<this.scores[i].score.length;j++){
          this.scores[i].score[j].sectionScore = this.sectionScore[j].sectionScore;
        }
      }
    }
    this.data['user'].score = this.scores;
    this.updateUserScores();
  }
  createTest() {
    var flag = 0;
    for (var i = 0; i < this.scores.length; i++) {
      if (this.scores[i].testid == this.query) {
        for (var j = 0; j < this.scores[i].score.length; j++) {
          var newSectionScore = {};
          newSectionScore['sectionid'] = this.scores[i].score[j].sectionid;
          newSectionScore['sectionScore'] = this.scores[i].score[j].sectionScore;
          newSectionScore['nosQues'] = 0;
          newSectionScore['ineff'] = 100 - this.scores[i].score[j].sectionScore;
          this.sectionScore.push(newSectionScore);
        }
        flag = 1;
        break;
      }
    }
    if (flag == 0) {
      var newScore = {};
      newScore['testid'] = this.query;
      newScore['score'] = [];
      for (var i = 0; i < this.test[0].sections.length; i++) {
        var newSectionScore = {};
        newSectionScore['sectionid'] = this.test[0].sections[i].sectionid;
        newSectionScore['sectionScore'] = 0;
        newSectionScore['nosQues'] = 0;
        newSectionScore['ineff'] = 100;
        this.sectionScore.push(newSectionScore);

        newScore['score'].push({sectionid: this.test[0].sections[i].sectionid , sectionScore: 0 });
      }
      this.scores.push(newScore);
    }

    var TotalQues = 30;
    var TotalIneff = 0;
    for (var i = 0; i < this.sectionScore.length; i++) {
      TotalIneff = TotalIneff + this.sectionScore[i].ineff;
    }
    for (var i = 0; i < this.sectionScore.length; i++) {
      if(TotalIneff){
        this.sectionScore[i].nosQues = Math.round((this.sectionScore[i].ineff / TotalIneff) * TotalQues);
      }
      else {
        this.sectionScore[i].nosQues = Math.round(TotalQues/this.sectionScore.length);
      }
    }

    var newQuestionSet = [];
    for (var i = 0; i < this.sectionScore.length; i++) {

      var newSec = {};
      newSec['questions'] = [];
      newSec['sectionid'] = i;
      var numarr = [];
      while (numarr.length < this.sectionScore[i].nosQues) {
        var r = Math.floor(Math.random() * 50);
        if (numarr.indexOf(r) === -1) {
          numarr.push(r);
          var newQues = {};
          newQues['qid'] = numarr.length - 1;
          var x = this.test[0].sections[this.sectionScore[i].sectionid].questions[r];
          newQues['question'] = x.question;
          newQues['options'] =[];
          newQues['options'].push(x.option1);
          newQues['options'].push(x.option2);
          newQues['options'].push(x.option3);
          newQues['options'].push(x.option4);

          newQues['answer'] = x.answer;
          newQues['givenAnswer'] = -1;

          newSec['questions'].push(newQues);
        }
      }
      newQuestionSet.push(newSec);
    }

    this.questionSet = newQuestionSet;
    console.log(this.questionSet);
  }
  changeQS(ques, sec) {
    this.currentSec = sec;
    this.currentQues = ques;
    this.currentOption = this.questionSet[parseInt(this.currentSec.toString())].questions[parseInt(this.currentQues.toString())].givenAnswer;
  }
  changeSO(id){
    this.currentOption = id + 1;
  }
  SubmitThisAnswer(){
    var sectionNumber = this.currentSec.toString();
    var QuestionNumber = this.currentQues.toString();
    this.questionSet[parseInt(sectionNumber)].questions[parseInt(QuestionNumber)].givenAnswer = this.currentOption;

    if(this.questionSet[parseInt(sectionNumber)].questions.length == parseInt(QuestionNumber)+1 && this.questionSet.length == parseInt(sectionNumber)+1){}
    else if(this.questionSet[parseInt(sectionNumber)].questions.length == parseInt(QuestionNumber)+1){
      sectionNumber = (parseInt(sectionNumber)+1).toString();
      QuestionNumber = "0";
      this.currentSec= Number(sectionNumber);
      this.currentQues = 0;
    }
    else {
      QuestionNumber = (parseInt(QuestionNumber)+1).toString()
      this.currentQues = Number(QuestionNumber);
    }
    this.currentOption = this.questionSet[parseInt(sectionNumber)].questions[parseInt(QuestionNumber)].givenAnswer;
    
  }
}

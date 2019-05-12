import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  isQuizDone: boolean = false;
  score: number = null;
  time: number;
  constructor() { }

  quizDone(data: boolean) {
    this.isQuizDone = data;
  }

  quizScore(data: number) {
    this.score = data;
  }

  timeLeft(data: number) {
    this.time = data;
  }
}

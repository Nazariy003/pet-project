import {Injectable, inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {IQuestion} from '../models/question.interface';
import {ITopic} from '../models/topic.interface';

export interface QuestionsResponse {
  data: IQuestion[];
  total: number;
}

export interface CreateQuestionResponse {
  data: IQuestion;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getQuestions(filters?: any): Observable<QuestionsResponse> {
    return this.http.get<QuestionsResponse>(`${this.apiUrl}/questions`, {params: filters});
  }

  getQuestionById(id: string): Observable<{data: IQuestion}> {
    return this.http.get<{data: IQuestion}>(`${this.apiUrl}/questions/${id}`);
  }

  getTopics(): Observable<ITopic[]> {
    return this.http.get<ITopic[]>(`${this.apiUrl}/topics`);
  }

  createQuestion(questionData: {
    title: string;
    type: string;
    description: string;
    time: number;
    topicIds: string[];
  }): Observable<CreateQuestionResponse> {
    return this.http.post<CreateQuestionResponse>(`${this.apiUrl}/questions`, questionData);
  }
}

import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class GenerationService {

  public url = 'https://ngx.ampath.or.ke/amrs-id-generator';
  constructor(
    private http: Http
  ) {}

  public generateIdentifers(number, user, password) {
    const url = this.url + '/generatemultiple';
    const payload = {
      number: number,
      user: user,
      password: password
    };
    const options = new RequestOptions({responseType: ResponseContentType.Blob});
    return this.http.post(url, payload, options).map((res) => {
      return <Blob>res.blob();
    }, (err) => {
      return err;
    });
  }

}

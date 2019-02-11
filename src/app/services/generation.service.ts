import { Injectable } from '@angular/core';
import { Http, RequestOptions, ResponseContentType } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class GenerationService {

  public url = 'https://ngx.ampath.or.ke/amrs-idgenerator';
  // public url = 'http://localhost:8016';
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

  public generateZuriIds(number, user) {
    const url = this.url + '/generatezuri';
    const payload = {
      number: number,
      user: user
    };
    const options = new RequestOptions({responseType: ResponseContentType.Json});
    return this.http.post(url, payload, options).map((res) => {
      const data = this.arrayToCSV(res.json());
      return new Blob([data], { type: 'text/csv' });
    }, (err) => {
      return err;
    });
  }

  public arrayToCSV(data) {
    const csvRows = [];
    for (let i = 0; i < data.length; ++i) {
        for (let j = 0; j < data[i].length; ++j) {
            data[i][j] = '' + data[i][j] + '';
        }
        csvRows.push(data[i].join(', '));
    }

    const csvString = csvRows.join('\r\n');
    return csvString;
  }

}

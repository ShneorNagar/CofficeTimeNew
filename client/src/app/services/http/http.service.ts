import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {HttpResponse} from "./http-response";
import {HttpStatusCodeEnum} from "./http-status-code.enum";
import {ToastService} from "../toast.service";

@Injectable({providedIn: "root"})
export class HttpService {

  private SERVER_URL = "http://localhost:8010/proxy/";
  private httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};

  constructor(private http: HttpClient,
              private toastService: ToastService) {
  }

  sendGetRequest(path: string, params?: any): Promise<HttpResponse>{
    return this.http.get<HttpResponse>(`${this.SERVER_URL}${path}`, {params: params}).toPromise();
  }

  sendPostRequest(path: string, body: any, options?: {headers: HttpHeaders}): Promise<HttpResponse> {
    const postHeaders = options ?? this.httpOptions;
    return this.http.post<HttpResponse>(`${this.SERVER_URL}${path}`, body, postHeaders).toPromise();
  }

  stringifyResponseMessage(message){
    if (message){
      return typeof message === 'object' ? JSON.stringify(message) : message;
    }
    return '';
  }

  displayToastByResponse(response: HttpResponse){
    if (response.statusCode == HttpStatusCodeEnum.OK || response.statusCode == HttpStatusCodeEnum.CREATED){
      this.toastService.displaySuccessToast(this.stringifyResponseMessage(response.message));
    } else {
      this.toastService.displayErrorToast(this.stringifyResponseMessage(response.message));
    }
  }
}

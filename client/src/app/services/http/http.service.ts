import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {DialogService} from "primeng/dynamicdialog";
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

  sendGetRequest(path: string): Promise<HttpResponse>{
    return this.http.get<HttpResponse>(`${this.SERVER_URL}${path}`).toPromise();
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
    switch (response.statusCode) {
      case HttpStatusCodeEnum.OK: {
        this.toastService.displaySuccessToast(this.stringifyResponseMessage(response.message));
        break;
      }
      case HttpStatusCodeEnum.UNAUTHORIZED: {
        this.toastService.displayErrorToast(this.stringifyResponseMessage(response.message));
        break;
      }
      case HttpStatusCodeEnum.CONFLICT: {
        this.toastService.displayErrorToast(this.stringifyResponseMessage(response.message));
        break;
      }
      case HttpStatusCodeEnum.INTERNAL_SERVER_ERROR: {
        this.toastService.displayErrorToast(this.stringifyResponseMessage(response.message));
        break;
      }
    }
  }
}

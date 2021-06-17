import {Component, OnInit} from '@angular/core';
import {UserResponseService} from "./user-response.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-reaction',
  templateUrl: './user-response.component.html',
  styleUrls: ['./user-response.component.css']
})
export class UserResponseComponent implements OnInit {

  orderId: string;

  constructor(private userResponseService: UserResponseService,
              private route: ActivatedRoute,) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.orderId = params['orderId'];
    });
  }

  accept() {
    this.userResponseService.accept(this.orderId)
  }

  acceptCustom() {
    this.userResponseService.acceptCustom(this.orderId);
  }

  decline() {
    this.userResponseService.decline(this.orderId)
  }
}

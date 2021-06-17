import {Component} from '@angular/core';
import {CoffeeFactsData} from "./coffee-facts-data";
import {WebSocketService} from "../../../services/web-socket/web-socket.service";
import {OrdersService} from "../../../services/orders.service";
import {HttpStatusCodeEnum} from "../../../services/http/http-status-code.enum";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  isOrderSent: boolean;
  currFact;

  constructor(private pushService: OrdersService,
              private webSocketService: WebSocketService) {
    this.subscribeToWebSocket();
    this.pickRandomFact();
  }

  private subscribeToWebSocket() {
    this.webSocketService.listen('response').subscribe(data => {
      console.log('response')
      console.log(data);
    })
    this.webSocketService.listen('order').subscribe(data => {
      console.log('order')
      console.log(data);
    })
  }

  private pickRandomFact() {
    let facts = new CoffeeFactsData().getData();
    let randomIndex = Math.floor(Math.random() * facts.length)
    this.currFact = facts[randomIndex];
  }

  async startNewOrder() {
    let response = await this.pushService.sendNewOrderRequest();
    this.isOrderSent = response?.statusCode === HttpStatusCodeEnum.OK;
    console.log(this.isOrderSent)
  }
}

import {Directive, ElementRef, HostListener, Input} from '@angular/core';

@Directive({
  selector: '[appFlip]'
})
export class HomeFlipDirective {

  @Input() appFlip: boolean = false;

  constructor(private el: ElementRef) {
  }

  // TODO replace with animations
  @HostListener('click') onMouseClick(){
    if (this.appFlip !== undefined){
      if (this.appFlip){
        this.rotate()
      } else{
        this.vibrate();
      }
      this.disableButtonStyle();
    }
  }


  private rotate(){
    this.el.nativeElement.style.transform = 'rotateY(180deg)'
  }

  private vibrate(){
    this.el.nativeElement.style.backgroundColor = 'black';
  }

  private disableButtonStyle() {
    this.el.nativeElement.classList.remove('flip-card-front-btn');
  }
}

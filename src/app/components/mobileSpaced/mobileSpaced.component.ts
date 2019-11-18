import { Component, Input } from '@angular/core';

@Component({
  selector: 'moo-mobile-spaced',
  styleUrls: [ './mobileSpaced.style.scss' ],
  templateUrl: './mobileSpaced.template.html',
  providers: [ ]
})
export class MobileSpacedComponent {
  @Input() chars: string;

  constructor() {
  }

  ngOnInit() {
  }
}

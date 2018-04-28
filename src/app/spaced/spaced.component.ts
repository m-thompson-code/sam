import { Component, Input } from '@angular/core';

@Component({
  selector: 'moo-spaced',
  styleUrls: [ './spaced.style.css' ],
  templateUrl: './spaced.template.html',
  providers: [ ]
})
export class SpacedComponent {
  @Input() chars: string;

  constructor() {
  }

  ngOnInit() {
  }
}
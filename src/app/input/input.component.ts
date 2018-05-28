import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'moo-input',
  styleUrls: [ './input.style.css' ],
  templateUrl: './input.template.html',
  providers: [ ]
})
export class InputComponent {
 	@Input() text: string;
 	@Input() label: string;

 	@Output() valueChanged: EventEmitter<string> = new EventEmitter();

 	focused: boolean;
 	
	constructor() {
	}

	ngOnInit() {
	}
}

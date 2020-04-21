import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'moo-input',
  styleUrls: [ './input.style.scss' ],
  templateUrl: './input.template.html',
  providers: [ ]
})
export class InputComponent {
 	@Input() text: string;
 	@Input() label: string;
	@Input() mode: any;
	@Input() inputType: string;

 	@Output() valueChanged: EventEmitter<string> = new EventEmitter();

 	focused: boolean;

	id: string;
	 
	@Input() textIsInvalidFuncs: ((text: string) => string)[];

	invalidText: string;
 	
	constructor(private appService: AppService) {
	}

	ngOnInit() {
		this.id = this.appService.getID();

		// this.textIsInvalidFunc = (text: string) => {
		// 	console.log(text);

		// 	if (text && text.indexOf('p') !== -1) {
		// 		console.log(text.indexOf('p'));
		// 		return "contains p";
		// 	}
		// }
	}

	blurFunc() {
		this.focused = false;

		this.handleValidation(this.text);
	}

	focusFunc() {
		this.focused = true;
	}

	handleValidation(text: string) {
		text = text || this.text;

		// if (!text) {
		// 	this.invalidText = null;
		// 	return;
		// }

		if (this.textIsInvalidFuncs && this.textIsInvalidFuncs.length) {
			for (let textIsInvalidFunc of this.textIsInvalidFuncs) {
				const invalidText = textIsInvalidFunc(text);
				this.invalidText = invalidText || null;

				if (invalidText) {
					break;
				}
			}
		} else {
			this.invalidText = null;
		}
	}

	handleInputChange(event) {
		const text = event.target.value;

		this.valueChanged.emit(text);

		if (this.invalidText) {
			this.handleValidation(text);
		}
	}
}

import { Component, Input, Output, EventEmitter } from '@angular/core';

import { AppService } from 'src/app/app.service';

import { Mode } from 'src/app/home/home.component';

@Component({
	selector: 'moo-input',
	styleUrls: [ './input.style.scss' ],
	templateUrl: './input.template.html',
	providers: [ ]
})
export class InputComponent {
 	@Input() public text: string;
 	@Input() public label: string;
	@Input() public mode: Mode;
	@Input() public inputType?: string;

 	@Output() public valueChanged: EventEmitter<string> = new EventEmitter();

 	public focused: boolean;

	public id: string;
	 
	@Input() public textIsInvalidFuncs?: ((text: string) => string)[];

	public invalidText?: string;
 	
	constructor(private appService: AppService) {
		this.text = "";
		this.label = "";

		this.focused = false;

		this.id = "temp-id";
	}

	public ngOnInit(): void {
		this.id = this.appService.getID();
	}

	public blurFunc(): void {
		this.focused = false;

		this.handleValidation(this.text);
	}

	public focusFunc(): void {
		this.focused = true;
	}

	public handleValidation(text: string): void {
		text = text || this.text;

		if (this.textIsInvalidFuncs && this.textIsInvalidFuncs.length) {
			for (let textIsInvalidFunc of this.textIsInvalidFuncs) {
				const invalidText = textIsInvalidFunc(text);
				this.invalidText = invalidText || undefined;

				if (invalidText) {
					break;
				}
			}
		} else {
			this.invalidText = undefined;
		}
	}

	// TODO: Figure out what typescript's change event is
	public handleInputChange(event: any) {
		const text = event.target.value;

		this.valueChanged.emit(text);

		if (this.invalidText) {
			this.handleValidation(text);
		}
	}
}

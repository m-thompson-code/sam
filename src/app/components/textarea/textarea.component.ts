import { Component, Input, Output, EventEmitter, ViewChild, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { AppService } from 'src/app/app.service';

declare var M;

@Component({
  selector: 'moo-textarea',
  styleUrls: [ './textarea.style.scss' ],
  templateUrl: './textarea.template.html',
  providers: [ ]
})
export class TextareaComponent implements OnInit, AfterViewInit {
	@ViewChild("textarea") textarea: ElementRef<HTMLTextAreaElement>;

 	@Input() text: string;
 	@Input() label: string;
	@Input() mode: any;

 	@Output() valueChanged: EventEmitter<string> = new EventEmitter();

 	focused: boolean;

	id: string;
	 
	@Input() textIsInvalidFuncs: ((text: string) => string)[];

	invalidText: string;
 	
	constructor(private appService: AppService) {
	}

	public ngOnInit(): void {
		this.id = this.appService.getID();

		// this.textIsInvalidFunc = (text: string) => {
		// 	console.log(text);

		// 	if (text && text.indexOf('p') !== -1) {
		// 		console.log(text.indexOf('p'));
		// 		return "contains p";
		// 	}
		// }
	}

	public ngAfterViewInit(): void {
		M.textareaAutoResize(this.textarea.nativeElement);
	}

	public blurFunc(): void {
		this.focused = false;

		// this.handleValidation(this.text);
	}

	public focusFunc(): void {
		this.focused = true;
	}

	// handleValidation(text: string) {
	// 	text = text || this.text;

	// 	// if (!text) {
	// 	// 	this.invalidText = null;
	// 	// 	return;
	// 	// }

	// 	if (this.textIsInvalidFuncs && this.textIsInvalidFuncs.length) {
	// 		for (let textIsInvalidFunc of this.textIsInvalidFuncs) {
	// 			const invalidText = textIsInvalidFunc(text);
	// 			this.invalidText = invalidText || null;

	// 			if (invalidText) {
	// 				break;
	// 			}
	// 		}
	// 	} else {
	// 		this.invalidText = null;
	// 	}
	// }

	// Figure out what typescript's change event is
	public handleInputChange(event: any): void {
		const text = event.target.value;

		this.valueChanged.emit(text);

		// if (this.invalidText) {
		// 	this.handleValidation(text);
		// }
	}
}

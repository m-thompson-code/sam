import { Component, Input, Output, EventEmitter, ViewChild, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { AppService } from 'src/app/services/app.service';

import { Mode } from 'src/app/home/home.component';

import "materialize-css";

@Component({
	selector: 'moo-textarea',
	styleUrls: [ './textarea.style.scss' ],
	templateUrl: './textarea.template.html',
	providers: [ ]
})
export class TextareaComponent implements OnInit, AfterViewInit {
	@ViewChild("textarea", { static: true }) private textarea!: ElementRef<HTMLTextAreaElement>;

 	@Input() public text: string;
 	@Input() public label: string;
	@Input() public mode: Mode;

 	@Output() public valueChanged: EventEmitter<string> = new EventEmitter();

 	public focused: boolean;

	public id: string;
 	
	constructor(private appService: AppService) {
		this.text = "";
		this.label = "";
		this.mode = "";

		this.focused = false;
		this.id = "temp-id";
	}

	public ngOnInit(): void {
		this.id = this.appService.getID();
	}

	public ngAfterViewInit(): void {
		M.textareaAutoResize(this.textarea.nativeElement);
	}

	public blurFunc(): void {
		this.focused = false;
	}

	public focusFunc(): void {
		this.focused = true;
	}

	// TODO: Figure out what typescript's change event is
	public handleInputChange(event: any): void {
		const text = event.target.value;

		this.valueChanged.emit(text);
	}
}

import { Component, Input } from '@angular/core';

@Component({
  selector: 'moo-icon',
  styleUrls: [ './icon.style.scss' ],
  templateUrl: './icon.template.html',
  providers: [ ]
})
export class IconComponent {
	@Input() icon: string;
	constructor() {
	}

	ngOnInit() {
	}
}
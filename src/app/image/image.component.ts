import { Component, Input } from '@angular/core';

@Component({
  selector: 'moo-image',
  styleUrls: [ './image.style.scss' ],
  templateUrl: './image.template.html',
  providers: [ ]
})
export class ImageComponent {
	@Input() href: string;

	loading: boolean;
	constructor() {
	}

	ngOnInit() {
		this.loading = true;
		
		var img = new Image();

		img.onload = () => {
			console.log('onload finished');
			this.loading = false;
			console.log(img);
			console.log(img.height);
			console.log(img.width);
		};

		img.src = this.href;
	}
}

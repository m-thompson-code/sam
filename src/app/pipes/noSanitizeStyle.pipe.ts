
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';


// source: https://stackoverflow.com/questions/47681813/angular-2-sanitizing-html-stripped-some-content-on-css-style?rq=1
// source: https://stackoverflow.com/questions/38110028/angular-2-adding-calc-as-inline-style-unsafe-interpolation-using-parentheses
// source: https://angular.io/api/platform-browser/DomSanitizer

@Pipe({ name: 'noSanitizeStyle' })
export class NoSanitizeStylePipe implements PipeTransform {
     	constructor(private domSanitizer: DomSanitizer) { }

     	transform(style: string): SafeStyle {
     		style = style || "";
     		return this.domSanitizer.bypassSecurityTrustStyle(style);
     	}
}

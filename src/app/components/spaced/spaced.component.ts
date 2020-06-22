import { Component, Input } from '@angular/core';

@Component({
    selector: 'moo-spaced',
    styleUrls: [ './spaced.style.scss' ],
    templateUrl: './spaced.template.html',
    providers: [ ]
})
export class SpacedComponent {
    @Input() public chars?: string;

    constructor() {
    }
}

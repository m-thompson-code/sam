import { Component, Input } from '@angular/core';

@Component({
  selector: 'moo-dots',
  styleUrls: [ './dots.style.scss' ],
  templateUrl: './dots.template.html',
  providers: [ ]
})
export class DotsComponent {
	@Input() items?: any[];

	private _activeIndex: number;
    @Input()
    public set activeIndex(activeIndex: number) {
		this.setSizes(this._activeIndex, activeIndex);
		this._activeIndex = activeIndex;
    }
    public get activeIndex(): number {
        return this._activeIndex;
    };

	public sizes: string[] = [];
	constructor() {
		this._activeIndex = 0;
	}

	public ngOnInit(): void {
		this.setToBeginning();
	}

	public setToBeginning(): void {
		const _sizes = [];

		if (!this.items) {
			this.sizes = [];
			return;
		}

		for (let i = 0; i < this.items.length; i++) {
			if (i < 4) {
				_sizes[i] = "full";
			} else if (i === 4) {
				_sizes[i] = "small";
			} else if (i === 5) {
				_sizes[i] = "smallest";
			} else {
				_sizes[i] = "gone";
			}
		}

		this.sizes = _sizes;
	}

	public setToEnding(): void {
		const _sizes = [];

		if (!this.items) {
			this.sizes = [];
			return;
		}

		for (let i = 0; i < this.items.length; i++) {
			if (i < 4) {
				_sizes[this.items.length - 1 - i] = "full";
			} else if (i === 4) {
				_sizes[this.items.length - 1 - i] = "small";
			} else if (i === 5) {
				_sizes[this.items.length - 1 - i] = "smallest";
			} else {
				_sizes[this.items.length - 1 - i] = "gone";
			}
		}

		this.sizes = _sizes;
	}

	public setSizes(prevIndex: number, activeIndex: number): void {
		if (!this.items) {
			this.sizes = [];
			return;
		}

		if (prevIndex === this.sizes.length - 1 && activeIndex === 0) {
			this.setToBeginning();
			return;
		}

		if (prevIndex === 0 && activeIndex === this.sizes.length - 1) {
			this.setToEnding();
			return;
		}

		const _sizes = [];

		for (let i = 0; i < this.items.length; i++) {
			_sizes[i] = this.sizes[i] || 'gone';
		}

		if (activeIndex > prevIndex) {
			if (this.sizes[activeIndex + 1] && (this.sizes[activeIndex + 1] === 'gone' || this.sizes[activeIndex + 1] === 'smallest')) {
				this.sizes[activeIndex + 1] = "small";

				if (this.sizes[activeIndex - 4]) {
					this.sizes[activeIndex - 4] = "small";
				}
				if (this.activeIndex !== this.sizes.length - 1) {
					if (this.sizes[activeIndex - 5]) {
						this.sizes[activeIndex - 5] = "smallest";
					}
					if (this.sizes[activeIndex - 6]) {
						this.sizes[activeIndex - 6] = "gone";
					}
				}
			}
			
		} else {
			if (this.sizes[activeIndex - 1] && (this.sizes[activeIndex - 1] === 'gone' || this.sizes[activeIndex - 1] === 'smallest')) {
				this.sizes[activeIndex - 1] = "small";

				if (this.sizes[activeIndex + 4]) {
					this.sizes[activeIndex + 4] = "small";
				}
				if (this.activeIndex !== 0) {
					if (this.sizes[activeIndex + 5]) {
						this.sizes[activeIndex + 5] = "smallest";
					}
					if (this.sizes[activeIndex + 6]) {
						this.sizes[activeIndex + 6] = "gone";
					}
				}
			}
		}

		this.sizes[activeIndex] = "full";
	}
}

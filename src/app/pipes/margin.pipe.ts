import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'margin' })
export class MarginPipe implements PipeTransform {
    public transform(marginPercent: number, delta: number, limit: number): string {
        // console.log(marginPercent, delta, limit);
        if (marginPercent === 0 && delta < 0) {
            return '0';
        }

        if (marginPercent === limit && delta > 0) {
            return `${(-100 * marginPercent)}%`;
        }

        return `calc(${-100 * marginPercent}% + ${-delta}px)`;
    }
}

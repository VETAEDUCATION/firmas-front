import { Component, Input, Output, ElementRef, EventEmitter, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs';
import { switchMap, takeUntil, pairwise } from 'rxjs/operators';

@Component({
	selector: 'app-drawarea',
	templateUrl: './drawarea.component.html',
	styleUrls: ['./drawarea.component.scss']
})
export class DrawareaComponent {

	@ViewChild('canvas') public canvas: ElementRef | undefined;

	@Input() public width = 400;
	@Input() public height = 200;

	@Output() onSign: EventEmitter<any> = new EventEmitter<any>();

	@Input() public title = '';

	private cx: CanvasRenderingContext2D | null | undefined;

	public ngAfterViewInit() {
		const canvasEl: HTMLCanvasElement = this.canvas?.nativeElement;

		this.cx = canvasEl.getContext('2d');

		canvasEl.width = this.width;
		canvasEl.height = this.height;

		if (!this.cx) throw 'Cannot get context';

		this.cx.fillStyle = "#FFF";
		this.cx.fillRect(0, 0, canvasEl.width, canvasEl.height);

		this.cx.lineWidth = 3;
		this.cx.lineCap = 'round';
		this.cx.strokeStyle = '#000';

		this.captureEvents(canvasEl);
	}
	active = true;
	private captureEvents(canvasEl: HTMLCanvasElement) {
		// this will capture all mousedown events from the canvas element
		fromEvent(canvasEl, 'mousedown')
			.pipe(
				switchMap(e => {
					// after a mouse down, we'll record all mouse moves
					return fromEvent(canvasEl, 'mousemove').pipe(
						// we'll stop (and unsubscribe) once the user releases the mouse
						// this will trigger a 'mouseup' event
						takeUntil(fromEvent(canvasEl, 'mouseup')),
						// we'll also stop (and unsubscribe) once the mouse leaves the canvas (mouseleave event)
						takeUntil(fromEvent(canvasEl, 'mouseleave')),
						// pairwise lets us get the previous value to draw a line from
						// the previous point to the current point
						pairwise()
					);
				})
			)
			.subscribe((res) => {
				const rect = canvasEl.getBoundingClientRect();
				const prevMouseEvent = res[0] as MouseEvent;
				const currMouseEvent = res[1] as MouseEvent;

				// previous and current position with the offset
				const prevPos = {
					x: prevMouseEvent.clientX - rect.left,
					y: prevMouseEvent.clientY - rect.top
				};

				const currentPos = {
					x: currMouseEvent.clientX - rect.left,
					y: currMouseEvent.clientY - rect.top
				};

				// this method we'll implement soon to do the actual drawing
				this.drawOnCanvas(prevPos, currentPos);
			});
	}

	private drawOnCanvas(
		prevPos: { x: number; y: number },
		currentPos: { x: number; y: number }
	) {
		if (!this.cx || !this.active) return;

		this.cx.beginPath();

		if (prevPos) {
			this.cx.moveTo(prevPos.x, prevPos.y); // from
			this.cx.lineTo(currentPos.x, currentPos.y);
			this.cx.stroke();
		}
	}

	public clearCanvas() {
		if (!this.cx) return;
		this.cx.clearRect(0, 0, this.width, this.height);
		this.active = true;
		this.ngAfterViewInit();
	}
	public saveCanvas() {
		if (!this.canvas || !this.cx) return;

		this.onSign.emit(this.canvas.nativeElement.toDataURL("image/jpeg").replace("data:image/jpeg;base64,", ""))
		this.active = false;
	}
}

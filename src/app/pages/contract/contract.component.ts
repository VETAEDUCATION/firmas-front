import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { HttpClient } from "@angular/common/http";

@Component({
	selector: 'app-contract',
	templateUrl: './contract.component.html',
	styleUrls: ['./contract.component.scss']
})
export class ContractComponent implements OnInit {
	link: string = '';
	linkAux: string = '';
	id: string | null;
	qrData: string = '';
	showPdf: boolean = true;
	signedPdf: any[] = [];
	signs: any[] = [];
	stepMovil: number = 1;
	signed: number[] = [];
	step: number = 1;

	drawareaWidth: number = 400;

	title = [
		'Main Applicant',
		'Secondary Applicant',
		'First Dependent',
		'Second Dependent',
		'Third Dependent'
	]

	constructor(private api: ApiService,
		private route: ActivatedRoute,
		private http: HttpClient) {
		this.id = this.route.snapshot.paramMap.get("id");
	}


	ngOnInit(): void {
		this.api.send('GET', `contracts?id=${this.id}`).then(res => {
			this.link = res.data[0].pdflink;
			this.linkAux = res.data[0].pdflink;
			this.signs = Array.from(Array(res.data[0].signatures_no).keys());

			this.signedPdf = res.data[0].signature_path ? JSON.parse(res.data[0].signature_path) : [];

			if ((this.signedPdf.length == this.signs.length) && this.signedPdf.filter(el => el).length) {
				this.step = 2;
			}
		});
		this.drawareaWidth = window.innerWidth > 900 ? window.innerWidth * .2 : window.innerWidth;
	}

	dataURLtoBlob(dataURL: string) {
		const byteString = window.atob(dataURL);
		const arrayBuffer = new ArrayBuffer(byteString.length);
		const int8Array = new Uint8Array(arrayBuffer);
		for (let i = 0; i < byteString.length; i++) {
			int8Array[i] = byteString.charCodeAt(i);
		}
		const blob = new Blob([int8Array], { type: 'image/jpeg' });
		return blob;
	}

	onSuccess(signIndex: number) {
		this.signed.push(signIndex);

		this.http.get<any>(`http://ec2-34-239-163-93.compute-1.amazonaws.com/update_recibo.php?rid=${this.id}`).subscribe((res: any) => {
			console.log(res);
			this.showPdf = false;
			setTimeout(() => {
				this.showPdf = true;
			}, 100);
		});

		if ((this.signed.length + this.signedPdf.length) === this.signs.length) {
			this.step = 2;

			this.http.get<any>(`http://ec2-34-239-163-93.compute-1.amazonaws.com/send_notification.php?rid=${this.id}`).subscribe((res: any) => {
				console.log(res);
				this.showPdf = false;
				setTimeout(() => {
					this.showPdf = true;
				}, 100);
			});
		}
	}

	save(signData: Event, signIndex: number) {
		const imageName = `${this.id} ${signIndex}.jpg`;
		const imageBlob = this.dataURLtoBlob(signData.toString());
		const imageFile = new File([imageBlob], imageName, { type: 'image/jpeg' });
		this.api.sendFile(imageFile).then(res => {
			this.onSuccess(signIndex);

		})
	}

}

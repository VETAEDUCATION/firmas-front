import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
	selector: 'app-contract',
	templateUrl: './contract.component.html',
	styleUrls: ['./contract.component.scss']
})
export class ContractComponent implements OnInit {
	link: string = '';
	id: string | null;
	qrData: string = '';

	title = [
		'Main Applicant',
		'Secondary Applicant',
		'First Dependent',
		'Second Dependent',
		'Third Dependent'
	]

	constructor(private api: ApiService,
		private route: ActivatedRoute) {
		this.id = this.route.snapshot.paramMap.get("id");
	}
	signs: any[] = [];

	ngOnInit(): void {
		this.api.send('GET', `contracts?id=${this.id}`).then(res => {
			this.link = res.data[0].pdflink;
			this.signs = Array.from(Array(res.data[0].signatures_no).keys())
		});
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

	save(signData: Event, signIndex: number) {
		const imageName = `${this.id} ${signIndex}.jpg`;
		const imageBlob = this.dataURLtoBlob(signData.toString());
		const imageFile = new File([imageBlob], imageName, { type: 'image/jpeg' });

		this.api.sendFile(imageFile);
	}

}

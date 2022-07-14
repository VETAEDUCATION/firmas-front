import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { CookieService } from "ngx-cookie";
import { Router } from "@angular/router";


interface ComponentResponse {
	data: any,
	success: boolean
}

@Injectable({
	providedIn: 'root'
})
export class ApiService {
	protected APIURL: string = '/api';

	constructor(
		private http: HttpClient,
		private router: Router,
		private cookie: CookieService
	) { }

	send = (
		method: 'POST' | 'GET' | 'DELETE' | 'PUT',
		endpoint: string,
		payload: object | null = null
	): Promise<any> => {


		return new Promise((resolve, error) => {

			let resolveRequest = (res: ComponentResponse) => {
				if (res.success) {
					resolve(res.data);
				} else {
					console.error(res);
					error(res);
				}
			}

			switch (method) {
				case 'POST':
					this.http.post<ComponentResponse>(`${this.APIURL}/${endpoint}`, payload).subscribe(resolveRequest);
					break;
				case 'GET':
					this.http.get<ComponentResponse>(`${this.APIURL}/${endpoint}`).subscribe(resolveRequest);
					break;
				case 'DELETE':
					this.http.delete<ComponentResponse>(`${this.APIURL}/${endpoint}`).subscribe(resolveRequest);
					break;
				case 'PUT':
					this.http.put<ComponentResponse>(`${this.APIURL}/${endpoint}`, payload).subscribe(resolveRequest);
					break;

				default:
					error("Method not valid");
					break;
			}

		});
	};

	sendFile(file: File) {
		const formData: FormData = new FormData();
		formData.append("fileKey", file, file.name);

		return new Promise((resolve, error) => {
			this.http.post<any>(`/fileupload`, formData).subscribe((res) => {
				if (res.success) {
					resolve(res.data);
				} else {
					console.error(res);
					error(res);
				}
			});
		});
	}
}

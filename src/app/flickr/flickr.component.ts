import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
	selector: 'app-flickr',
	templateUrl: `./flickr.component.html`,
	styleUrls: [`./flickr.component.css`]
})

export class FlickrComponent implements OnInit {
	title = 'Photos';

	AllPhotoLinks: any = [];
	pageNo = 1;
	pageLimit;
	pageBtns = [];

	modalDisplay = 'none';
	modalImg;

	constructor(public http: HttpClient) { }

	ngOnInit() {
		for (let i = 0; i < 10; i++) {
			this.pageBtns.push(i + 1)
		}
		this.nav(1)
	}

	nav(page) {
		const no = parseInt(page);
		this.pageNo = no;

		if (no < 5) {
			for (let i = 0; i < this.pageBtns.length; i++) {
				this.pageBtns[i] = i + 1;
			}
		} else
			if (no > this.pageLimit - 5) {
				for (let i = 0; i < this.pageBtns.length; i++) {
					this.pageBtns[i] = (this.pageLimit - 9) + i;
				}
			} else {
				for (let i = -4; i < 6; i++) {
					this.pageBtns[i + 4] = no + i;
				}
			}
		this.toLinks(no);
	}

	async toLinks(page) {
		let data = await this.getPhotos( page );
		let pics = data['results'];
		if (this.pageNo == 1) {
			this.AllPhotoLinks = [];
			pics.forEach(element => {
				this.AllPhotoLinks.push(`url(${element.urls.regular})`)
			});
		} else {
			this.AllPhotoLinks = this.AllPhotoLinks.map((elem, i) => {
				let link = pics[i].urls.regular;
				return `url(${link})`;
			});
		}
	}

	getPhotos(page) {
		return new Promise((resolve, rej) => {
			const url = 'https://api.unsplash.com/search/photos?query=soccer&client_id=c1e898ba8b250e1a7a30a41f5db550c4f8e31c56e9c58cf706a835e2202c362b&page=' + page;
			this.http.get(url)
				.subscribe(data => {
					resolve(data);
				}, err => {
					console.log(err);
					rej(err);
				});
		}).then(data => data)
	}

	zoomIn(event) {
		event.target['style'].backgroundSize = '210%';
	}

	zoomOut(event) {
		event.target['style'].backgroundSize = '180%';
	}

	maximize(event) {
		this.modalDisplay = 'block'
		this.modalImg = event.target['style'].backgroundImage.split('"')[1];
	}

	close() {
		this.modalDisplay = 'none'
	}

}

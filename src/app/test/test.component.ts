import { Component } from '@angular/core';

// Don't forget to import these in the module!
import { HttpClient } from '@angular/common/http';




@Component({
  selector: 'test',
  templateUrl: `./test.component.html`,
  styleUrls: [`./test.component.css`]
})

export class TestComponent {
  title = 'Photos';

  AllPhotoLinks = [];
  pageNo = 1;
  pageLimit;
  pageBtns = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];



  imgStyles = `
      width: 300px; 
      height: 300px; 
      border: 5px black solid; 
      border-radius: 5%; 
      cursor: zoom-in;
      margin: 20px 20px;
      background-size: 180%;
      background-repeat: no-repeat;
      background-position: center;
      background-color: black;
      transition: 100ms linear;
    `;

  constructor(public http: HttpClient) { }

  public async ngOnInit() {
    this.getPhotos(this.pageNo)

  }

  nav(page) {
    var no = parseInt(page); // variable initialization
    this.pageNo = no;
    // for the beginning and the ending parts of the nav
    if (no < 5) {
      for (var i = 0; i < this.pageBtns.length; i++) {
        this.pageBtns[i] = i + 1;
      }
    } else
      if (no > this.pageLimit - 5) {
        for (var i = 0; i < this.pageBtns.length; i++) {
          this.pageBtns[i] = (this.pageLimit - 9) + i;
        }
      } else {
        for (var i = -4; i < 6; i++) {
          this.pageBtns[i + 4] = no + i;
        }
      }
    this.getPhotos(no);
  }


  getPhotos(page) {
    return new Promise((resolve, rej) => {
      var url = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=10a341066aefdd9e971da9afa18624ad&tags=soccer&format=json&nojsoncallback=true&per_page=10&page=" + page;
      this.http.get(url)
        .subscribe(data => {
          resolve(data)
        }, err => {
          console.log(err)
          rej(err)
        });
    }).then(data => {
      this.AllPhotoLinks = [];
      this.pageLimit = parseInt(data['photos'].pages);
      data['photos'].photo.forEach(element => {
        this.AllPhotoLinks.push(`https://farm${element["farm"]}.staticflickr.com/${element["server"]}/${element['id']}_${element['secret']}.jpg`)
      });
    }).then(data => {
      this.generateTags()
    });
  }

  generateTags() {
    let body = document.getElementById('body');
    body.innerHTML = '';
    this.AllPhotoLinks.forEach(e => {
      let x = document.createElement('div');
      x.classList.add('img-con');
      x.style.cssText = this.imgStyles;
      x.style.backgroundImage = 'url(' + e + ')';

      x.addEventListener('click', (e) => {
        modal.style.display = "block";
        modalImg['src'] = e.target['style'].backgroundImage.split('"')[1]
      })

      x.addEventListener('mouseenter', (e) => {
        e.target['style'].backgroundSize = '200%';
      })

      x.addEventListener('mouseleave', (e) => {
        e.target['style'].backgroundSize = '180%';
      })

      document.getElementById('body').appendChild(x);
    });

    let modal = document.getElementById('myModal');
    let modalImg = document.getElementById("img01");
    let modalClose = document.getElementsByClassName('close')[0];

    modalClose.addEventListener('click', (e) => {
      modal.style.display = "none";
    });

  }




}

import Notiflix from "notiflix";
import { searchImages } from "./axios";




const form = document.querySelector('form');
const input = document.querySelector('input');
const gallery = document.querySelector('.gallery');

let thisPage = 1;
let totalPageCount = 0;
const photosPerPage = 40;
let noMorePhotos = false;

gallery.style.display = 'grid';
gallery.style.gridTemplateColumns = 'repeat(4, 1fr)';
gallery.style.gap = '10px';

form.style.backgroundColor = 'blue';
form.style.height = '4em';
form.style.display = 'flex';
form.style.justifyContent = 'center';
form.style.alignItems = 'center';
form.style.gap = '1em';






form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (input.value.length < 3 || input.value.trim() == ''){
    Notiflix.Notify.failure('Give us a longer description');
  } else {
    gallery.innerHTML = '';
    currentPage = 1;

    const keyWord = input.value;

    try {
      const data = await searchImages(keyWord, thisPage, photosPerPage);
      if (data.totalHits === 0) {
        Notiflix.Notify.failure(`No matches with "${keyWord}" found`);
      } else {
        totalPageCount = Math.ceil(data.totalHits / photosPerPage);
        Notiflix.Notify.success(`${data.totalHits} matches found`);
        createCards(data.hits);
       }
    } catch (error) {
      Notiflix.Notify.failure('Something went wrong');
    }
  }
});

window.addEventListener('scroll', async () => {
  const keyWord = input.value;
  
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
    if (thisPage < totalPageCount) {
      thisPage++;

      try {
        const data = await searchImages(keyWord, thisPage, photosPerPage);
        if (data.hits.length > 0) {
          gallery.append(createCards(data.hits));
        }
        
      } catch (error) {
        Notiflix.Notify.failure('Something went wrong');
      }
    }
    else{
      noMorePhotos = true;
      Notiflix.Notify.info('No photos to show');
    }
    
  }
});



async function createCards(arr) {
  await arr.forEach(element => {
    const cardImage = document.createElement('img');
    cardImage.src = element.webformatURL;
    cardImage.alt = element.tags;
    cardImage.style.width = '100%'

    const descriptionList = document.createElement('ul');
    descriptionList.style.paddingLeft = '0'
    descriptionList.style.listStyle = 'none';
    descriptionList.style.display = 'flex';
    descriptionList.style.flexDirection = 'row';
    descriptionList.style.justifyContent = 'space-between';

    const photoLikes = document.createElement('li');
    photoLikes.innerHTML = `<b>Likes:</b> ${element.likes}`;

    const photoViews = document.createElement('li');
    photoViews.innerHTML = `<b>Views:</b> ${element.views}`;

    const photoComments = document.createElement('li');
    photoComments.innerHTML = `<b>Comments:</b> ${element.comments}`;

    const photoDownloads = document.createElement('li');
    photoDownloads.innerHTML = `<b>Downloads:</b> ${element.downloads}`;

    descriptionList.append(photoLikes);
    descriptionList.append(photoViews);
    descriptionList.append(photoComments);
    descriptionList.append(photoDownloads);

    const hitContainer = document.createElement('div');
    hitContainer.style.display = 'flex';
    hitContainer.style.flexDirection = 'column';
    hitContainer.append(cardImage);
    hitContainer.append(descriptionList);

    gallery.append(hitContainer);



  });
}

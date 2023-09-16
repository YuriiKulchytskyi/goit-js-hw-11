import Notiflix from "notiflix";
import { searchImages } from "./axios"; // Import the searchImages function




const form = document.querySelector('form');
const input = document.querySelector('input');
const gallery = document.querySelector('.gallery');

const loadMoreBtn = document.querySelector('.loadBtn');


let thisPage = 1;

const photosPerPage = 40;

gallery.style.display = 'grid';
gallery.style.gridTemplateColumns = 'repeat(4, 1fr)';
gallery.style.gap = '10px';

form.style.backgroundColor = 'blue';
form.style.height = '4em';
form.style.display = 'flex';
form.style.justifyContent = 'center';
form.style.alignItems = 'center';
form.style.gap = '1em';

const API_KEY = '39406634-bdefc0ba04eb08cccc787049c';
const API_URL = `https://pixabay.com/api/?key=${API_KEY}`;




form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (input.value.length < 3) {
    Notiflix.Notify.failure('Give us a longer description');
  } else {
    gallery.innerHTML = '';
    loadMoreBtn.style.display = 'none';
    thisPage = 1;

    const keyWord = input.value;

    try {
      const data = await searchImages(keyWord, thisPage, photosPerPage); // Use the imported function
      if (data.hits.length === 0) {
        Notiflix.Notify.failure(`No matches with "${keyWord}" found`);
      } else {
        Notiflix.Notify.success(`${data.totalHits} matches found`);
        createCards(data.hits);

        if (data.hits.length > 0) {
          loadMoreBtn.style.display = 'block';
        }
      }
    } catch (error) {
      Notiflix.Notify.failure('Something went wrong');
    }
  }
});

loadMoreBtn.addEventListener('click', async () => {
  thisPage++;

  const keyWord = input.value;

  try {
    const data = await searchImages(keyWord, thisPage, photosPerPage); // Use the imported function
    if (data.hits.length > 0) {
      gallery.append(createCards(data.hits));
    } else {
      Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
      loadMoreBtn.style.display = 'none';
    }
  } catch (error) {
    Notiflix.Notify.failure('Something went wrong');
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

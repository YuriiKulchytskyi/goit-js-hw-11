
import axios from "axios";

const API_KEY = '39406634-bdefc0ba04eb08cccc787049c';
const API_URL = `https://pixabay.com/api/?key=${API_KEY}`;

export async function searchImages(keyword, page, perPage) {
  try {
    const response = await axios.get(`${API_URL}&q=${keyword}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${page}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
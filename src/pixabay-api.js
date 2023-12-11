import axios from "axios";

const API_KEY = "8266158-4a1697a03b4440b2b1b0a0b25";
const BASE_URL = 'https://pixabay.com/api/'

async function fatchPixabay(request, page = 1) {
	return await axios.get(`${BASE_URL}?key=${API_KEY}&q=${request}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`);
}

export { fatchPixabay }


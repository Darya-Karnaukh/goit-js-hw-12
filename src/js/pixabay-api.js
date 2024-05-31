import axios from 'axios';

const axiosMetod = axios.create({
  baseURL: 'https://pixabay.com/api/',
  params: {
    key: '44049437-ef12fae0346c4a67068c57c01',
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    
  }
});


export async function searchFoto(word, page = 1) {
  const userFoto = await axiosMetod.get('', {
    params: {
      q: word,
      page: page,
      per_page: 15,
    }
  });


  return userFoto.data;
}


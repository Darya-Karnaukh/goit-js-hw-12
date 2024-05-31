function imageTemplate(image) {
    return `<li class="gallery-item">
    <a href="${image.largeImageURL}">
    <img src="${image.webformatURL}" alt="${image.tags}"/>
    <div class="wrapper">
    <div><h3>Likes</h3><p>${image.likes}</p></div>
    <div><h3>Views</h3><p>${image.views}</p></div>
    <div><h3>Comments</h3><p>${image.comments}</p></div>
    <div><h3>Downloads</h3><p>${image.downloads}</p></div>
    </div>
    </a>
  </li>`;
}

export function imagesTemplate(arr) {
    return arr.map(imageTemplate).join('');
}



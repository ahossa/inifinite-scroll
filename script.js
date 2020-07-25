// Unsplash API
let initPhotoLoadCount = 5;
const apiKey = config.API_KEY;
let apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${initPhotoLoadCount}`;

// Document Elements
const imgContainer = document.getElementById("image-container");
const loader = document.getElementById("loader");

// Variables
let photosArray = []; // Array container for photos
let isReadyToFetchNewPhotos = false; // Are we ready to fetch New Photos ?
let isInitLoad = true; // Is this the Initial Load ?
let numImagesLoaded = 0; // Number of Loaded Images
let numTotalImagesInList = 0; // Total num of images in the list

/*
 * Update the API Url with the new count after the intial Load
 */
function updateAPIUrlWithNewCount(newCount) {
  apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${newCount}`;
}

/*
 * Check if all images are loaded
 * When all img finished -> sets the flag to load new Photos
 * Event-Listener on every Photo Load
 */

function imageLoaded() {
  numImagesLoaded++;

  if (numImagesLoaded === numTotalImagesInList) {
    isReadyToFetchNewPhotos = true;
    loader.hidden = true;
  }
}

/*
 * Helper method to set attributes to the DOM elements
 */
function setAttributes(element, attributes) {
  for (const key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
}

/*
 * Create Elements for Links & Photos, Add to DOM
 */
function displayPhotos() {
  numTotalImagesInList += photosArray.length;
  console.log("Total-Images-In-List", numTotalImagesInList);

  // Run function for each obj in photosArray
  photosArray.forEach((photo) => {
    // Create an anchor element <a> to link to Unsplash
    const item = document.createElement("a");
    setAttributes(item, {
      href: photo.links.html,
      target: "_blank",
    });

    // Create <img> for photos
    const img = document.createElement("img");
    setAttributes(img, {
      src: photo.urls.regular,
      alt: photo.alt_description,
      title: photo.alt_description,
    });

    // Event listener, check when each is finished loading
    img.addEventListener("load", imageLoaded);

    // Put <img> inside <a> and put both in img container element
    item.appendChild(img);
    imgContainer.appendChild(item);
  });
}

/*
 * Get Photos from Unsplash API
 */
async function getPhotos() {
  try {
    const response = await fetch(apiUrl);
    photosArray = await response.json();
    console.log(photosArray);
    displayPhotos();

    // Now that we've completed the Init Load, Update the API URL
    if (isInitLoad) {
      updateAPIUrlWithNewCount(30);
      isInitLoad = false;
    }
  } catch (error) {
    // Catch error here
  }
}

/*
 * Scroll based Event-listener
 * Loads more photos after Scrolling to certain point in the screen
 */
window.addEventListener("scroll", () => {
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 2000 &&
    isReadyToFetchNewPhotos
  ) {
    isReadyToFetchNewPhotos = false;
    getPhotos();
  }
});

/*
 * On Load
 */
getPhotos();

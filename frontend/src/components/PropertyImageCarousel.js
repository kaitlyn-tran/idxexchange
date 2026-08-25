import React, {useState} from 'react';

function parsePhotos(photoData) {
  if (!photoData) {
    return [];
  }

  if (Array.isArray(photoData)) {
    return photoData;
  }

  try {
    const photos = JSON.parse(photoData);

    if (Array.isArray(photos)) {
      return photos;
    }

    return [];
  } catch {
    return [];
  }
}

function PropertyImageCarousel({ photos }) {
  const fallbackImage =
    'https://via.placeholder.com/400x250?text=No+Photo+Available';

  const parsedPhotos = parsePhotos(photos);

  const images = parsedPhotos.length
    ? parsedPhotos
    : [fallbackImage];

  const [currentIndex, setCurrentIndex] = useState(0);

  function previousPhoto(event) {
    event.stopPropagation();

    if (currentIndex == 0) {
      setCurrentIndex(images.length - 1);
    } else {
      setCurrentIndex(currentIndex - 1);
    }
  }

  function nextPhoto(event) {
    event.stopPropagation();

    if (currentIndex == images.length - 1) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  }

  function handleImageError(event) {
    event.currentTarget.src = fallbackImage;
  }

  return (
    <div className="image-carousel">
      <img
        src={images[currentIndex]}
        alt={`Property photo ${currentIndex + 1}`}
        className="carousel-image"
        onError={handleImageError}
      />

      {images.length > 1 && (
        <>
          <button
            type="button"
            className="carousel-button carousel-prev"
            onClick={previousPhoto}
            aria-label="Previous photo"
          >
            ‹
          </button>

          <button
            type="button"
            className="carousel-button carousel-next"
            onClick={nextPhoto}
            aria-label="Next photo"
          >
            ›
          </button>

          <div className="carousel-counter">
            {currentIndex + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  );
}

export default PropertyImageCarousel;
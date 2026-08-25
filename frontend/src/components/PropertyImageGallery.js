import React, {useEffect, useState} from 'react';

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

function PropertyImageGallery({ photos }) {
  const fallbackImage =
    'https://via.placeholder.com/1000x600?text=No+Photo+Available';

  const parsedPhotos = parsePhotos(photos);

  const images = parsedPhotos.length
    ? parsedPhotos
    : [fallbackImage];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  function previousPhoto() {
    if (currentIndex == 0) {
      setCurrentIndex(images.length - 1);
    } else {
      setCurrentIndex(currentIndex - 1);
    }
  }

  function nextPhoto() {
    if (currentIndex == images.length - 1) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  }

  function openLightbox() {
    setLightboxOpen(true);
  }

  function closeLightbox() {
    setLightboxOpen(false);
  }

  useEffect(() => {
    function handleKeyDown(event) {
      if (!lightboxOpen) {
        return;
      }

      if (event.key == 'Escape') {
        closeLightbox();
      }

      if (event.key == 'ArrowLeft') {
        previousPhoto();
      }

      if (event.key == 'ArrowRight') {
        nextPhoto();
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [lightboxOpen, currentIndex]);

  return (
    <>
      <div className="property-gallery">
        <div className="gallery-main">
          <img
            src={images[currentIndex]}
            alt={`Property photo ${currentIndex + 1}`}
            onClick={openLightbox}
          />
        </div>

        {images.length > 1 && (
          <div className="gallery-thumbnails">
            {images.map((image, index) => (
              <button
                type="button"
                key={index}
                className={
                  index == currentIndex
                    ? 'thumbnail active'
                    : 'thumbnail'
                }
                onClick={() => setCurrentIndex(index)}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {lightboxOpen && (
        <div
          className="lightbox"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            className="lightbox-close"
            onClick={closeLightbox}
            aria-label="Close"
          >
            ×
          </button>

          {images.length > 1 && (
            <button
              type="button"
              className="lightbox-prev"
              onClick={(event) => {
                event.stopPropagation();
                previousPhoto();
              }}
              aria-label="Previous photo"
            >
              ‹
            </button>
          )}

          <img
            src={images[currentIndex]}
            alt={`Property photo ${currentIndex + 1}`}
            className="lightbox-image"
            onClick={(event) => event.stopPropagation()}
          />

          {images.length > 1 && (
            <button
              type="button"
              className="lightbox-next"
              onClick={(event) => {
                event.stopPropagation();
                nextPhoto();
              }}
              aria-label="Next photo"
            >
              ›
            </button>
          )}
        </div>
      )}
    </>
  );
}

export default PropertyImageGallery;
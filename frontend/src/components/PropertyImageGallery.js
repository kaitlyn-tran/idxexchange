import React, { useEffect, useState } from 'react';

function parsePhotos(photoData) {
  if (!photoData) {
    return [];
  }

  if (Array.isArray(photoData)) {
    return photoData.filter((photo) => typeof photo === 'string' && photo.trim());
  }

  if (typeof photoData !== 'string') {
    return [];
  }

  try {
    const photos = JSON.parse(photoData);

    if (Array.isArray(photos)) {
      return photos.filter(
        (photo) => typeof photo === 'string' && photo.trim()
      );
    }

    return [];
  } catch {
    return [];
  }
}

function PropertyImageGallery({ photos }) {
  const parsedPhotos = parsePhotos(photos);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    if (currentIndex >= parsedPhotos.length && parsedPhotos.length > 0) {
      setCurrentIndex(0);
    }
  }, [parsedPhotos.length, currentIndex]);

  function previousPhoto() {
    if (parsedPhotos.length === 0) {
      return;
    }

    if (currentIndex === 0) {
      setCurrentIndex(parsedPhotos.length - 1);
    } else {
      setCurrentIndex(currentIndex - 1);
    }
  }

  function nextPhoto() {
    if (parsedPhotos.length === 0) {
      return;
    }

    if (currentIndex === parsedPhotos.length - 1) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  }

  function openLightbox() {
    if (parsedPhotos.length > 0) {
      setLightboxOpen(true);
    }
  }

  function closeLightbox() {
    setLightboxOpen(false);
  }

  useEffect(() => {
    function handleKeyDown(event) {
      if (!lightboxOpen) {
        return;
      }

      if (event.key === 'Escape') {
        closeLightbox();
      }

      if (event.key === 'ArrowLeft') {
        if (parsedPhotos.length > 0) {
          setCurrentIndex((previousIndex) => {
            if (previousIndex === 0) {
              return parsedPhotos.length - 1;
            }

            return previousIndex - 1;
          });
        }
      }

      if (event.key === 'ArrowRight') {
        if (parsedPhotos.length > 0) {
          setCurrentIndex((previousIndex) => {
            if (previousIndex === parsedPhotos.length - 1) {
              return 0;
            }

            return previousIndex + 1;
          });
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [lightboxOpen, parsedPhotos.length]);

  if (parsedPhotos.length === 0) {
    return (
      <div className="property-gallery">
        <div className="gallery-main no-photo">
          <span>No Photo Available</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="property-gallery">
        <div className="gallery-main">
          <img
            src={parsedPhotos[currentIndex]}
            alt={`Property photo ${currentIndex + 1}`}
            onClick={openLightbox}
            onError={(event) => {
              event.currentTarget.style.display = 'none';
            }}
          />
        </div>

        {parsedPhotos.length > 1 && (
          <div className="gallery-thumbnails">
            {parsedPhotos.map((image, index) => (
              <button
                type="button"
                key={index}
                className={
                  index === currentIndex
                    ? 'thumbnail active'
                    : 'thumbnail'
                }
                onClick={() => setCurrentIndex(index)}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  onError={(event) => {
                    event.currentTarget.style.display = 'none';
                  }}
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

          {parsedPhotos.length > 1 && (
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
            src={parsedPhotos[currentIndex]}
            alt={`Property photo ${currentIndex + 1}`}
            className="lightbox-image"
            onClick={(event) => event.stopPropagation()}
            onError={(event) => {
              event.currentTarget.style.display = 'none';
            }}
          />

          {parsedPhotos.length > 1 && (
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

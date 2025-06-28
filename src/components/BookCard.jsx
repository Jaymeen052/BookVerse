import React from 'react';

const BookCard = ({ book }) => {
  const volume = book.volumeInfo;
  const thumbnail = volume.imageLinks?.extraLarge ||
    volume.imageLinks?.large ||
    volume.imageLinks?.medium ||
    volume.imageLinks?.small ||
    volume.imageLinks?.thumbnail;

  const {
    title,
    authors,
    publishedDate,
    pageCount,
    language,
    averageRating,
  } = volume;

  return (
    <div className="glass-card p-4 rounded-xl shadow-glow hover-lift transition-all h-full flex flex-col">
      {/* Book Image */}
      <img
        src={thumbnail || '/default-book.png'}
        alt={title}
        className="w-full h-56 object-cover rounded-lg mb-3"
      />

      {/* Title & Author */}
      <h3 className="text-white text-md font-semibold line-clamp-2">{title}</h3>
      <p className="text-sm text-gray-300 mb-1">{authors?.join(', ') || 'Unknown Author'}</p>

      {/* Inline Metadata */}
      <p className="text-xs text-gray-400">
        {publishedDate?.slice(0, 4) || '----'} • {pageCount || '---'} pages • {language?.toUpperCase() || '--'} • ⭐ {averageRating ?? 'N/A'}
      </p>
    </div>
  );
};


export default BookCard;

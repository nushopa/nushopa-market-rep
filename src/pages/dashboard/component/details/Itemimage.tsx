import React, { useState } from "react";

interface ItemImageProps {
  src: string;
  alt: string;
}

export const ItemImage: React.FC<ItemImageProps> = ({ src, alt }) => {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return <div className="w-16 h-16 rounded-lg bg-gray-200 flex-shrink-0" />;
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
    />
  );
};

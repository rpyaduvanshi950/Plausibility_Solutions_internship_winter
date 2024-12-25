import React, { useState, useEffect } from 'react';

const PhotoPage = () => {
  const [imageShown, setImageShown] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      alert('The image was shown. This is not a real person!');
    }, 1000);
  }, []);

  return (
    <div>
      <h1>Photo Page</h1>
      <div>
        <img
          src="your-image-url.jpg"
          alt="Displayed Image"
          width="400"
          onLoad={() => setImageShown(true)}
        />
      </div>
    </div>
  );
};

export default PhotoPage;

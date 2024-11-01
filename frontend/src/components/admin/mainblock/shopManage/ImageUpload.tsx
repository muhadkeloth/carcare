// import React, { useState } from 'react';

// interface ImageUploadProps {
//   image: File | null;
//   setImage: (file: File | null) => void;
// }

// const ImageUpload: React.FC<ImageUploadProps> = ({ image, setImage }) => {
//   const [previewUrl, setPreviewUrl] = useState<string>('');

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setImage(file);
//       setPreviewUrl(URL.createObjectURL(file));
//     }
//   };

//   return (
//     <div className="my-3">
//       {previewUrl && <img src={previewUrl} alt="Preview" className="w-16 h-16 mb-3" />}
//       <input type="file" accept="image/*" onChange={handleImageChange} />
//     </div>
//   );
// };

// export default ImageUpload;



// <ImageUpload image={newShop.image} setImage={(img) => setNewShop({ ...newShop, image: img })} />
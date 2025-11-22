import React from 'react';

const ImageUpload = ({ onUpload }) => {
  const [preview, setPreview] = React.useState(null);
  const handleFile = (files) => {
    const file = files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(file);
    onUpload && onUpload(file);
  };
  return (
    <div className="image-upload">
      <input type="file" accept="image/*" onChange={(e) => handleFile(e.target.files)} />
      {preview && <img src={preview} alt="preview" style={{ maxWidth: 200 }} />}
    </div>
  );
};

export default ImageUpload;

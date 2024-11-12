import React from 'react'
import profileImg from '../../assets/images/profileimg.png';

const ProfileImage: React.FC = () => {

    const placeholderImage = "https://via.placeholder.com/150";
    const imageUrl = null;

  return (
    <img
            src={imageUrl || placeholderImage}
            alt="Profile"
            className="rounded-full me-1"
            style={{
                width: 45,
                height: 45,
                objectFit: 'cover',
            }}
        />
  )
}

export default ProfileImage
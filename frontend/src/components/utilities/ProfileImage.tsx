import React from 'react'
import profileImg from '../../assets/images/profileimg.png';

const ProfileImage: React.FC = () => {

    const placeholderImage = "https://via.placeholder.com/150";
    const imageUrl = profileImg;

  return (
    <img
            src={imageUrl || placeholderImage}
            alt="Profile"
            className="rounded-full"
            style={{
                width: 50,
                height: 50,
                objectFit: 'cover',
            }}
        />
  )
}

export default ProfileImage
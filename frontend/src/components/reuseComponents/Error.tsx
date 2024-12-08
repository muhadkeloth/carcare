import React from 'react'
import Header from '../user/reusableComponents/Header';
import Footer from '../user/reusableComponents/Footer';
import NavLogin from '../authenticate/NavLogin';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { RoleProps } from '../utilities/interface';


const Error:React.FC<RoleProps> = ({role}) => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    }

  return (
    <div className='flex flex-col min-h-screen'>
        {role == 'user' ? (
            <Header />
        ) : (
            <NavLogin showBar={true}  />
        ) }
    <div className="flex-grow flex justify-center items-center ">
    <div className="m-10 flex justify-center  border rounded-lg h-fit p-5 max-w-xl md:w-2/3  mb-4 ">
        <div className="flex-col flex gap-5 justify-center rounded-lg h-fit p-5 max-w-xl md:w-2/3 mb-4 ">   
                <p className='text-center font-semibold text-3xl'>Page Not Fount</p>
                <img src="https://res.cloudinary.com/drhtxuege/image/upload/v1733304480/9283b08aff5edbc0_kiaink.png" alt="Page Not Found" />
                <button className="btn-primary" onClick={handleGoBack}><FontAwesomeIcon icon={faArrowLeft} /> go back</button>
        </div>
    </div>
    </div>




        <Footer />
    </div>
  )
}

export default Error
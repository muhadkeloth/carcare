import React from 'react'
import carcare_logo from '../../../assets/images/Car_Care_logo.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopyright } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faInstagram, faLinkedin, faXTwitter } from '@fortawesome/free-brands-svg-icons';


const Footer:React.FC = () => {

  return (
    <footer className="bg-gray-800 text-white pt-6">
      <div className="container max-w-6xl mx-auto px-4 mb-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div className="pt-2">
          <button className="w-2/3">
            <img src={carcare_logo} alt="carcare logo" />
          </button>
        </div>

        <div className="p-4">
          <h3 className="font-bold mb-4">Getting Started</h3>
          <ul className="space-y-2 text-gray-300">
            <li>
              <button className="hover:underline hover:cursor-pointer">
                Get an Estimate
              </button>
            </li>
            <li>
              <button className="hover:underline hover:cursor-pointer">
                Find CarCare Location
              </button>
            </li>
            <li>
              <button className="hover:underline hover:cursor-pointer">
                Why CarCare?
              </button>
            </li>
            <li>
              <button className="hover:underline hover:cursor-pointer">
                How to Guides
              </button>
            </li>
          </ul>
        </div>

        <div className="p-4">
          <h3 className="font-bold mb-4">For Business</h3>
          <ul className="space-y-2 text-gray-300">
            <li>
              <button className="hover:underline hover:cursor-pointer">
                Shop Owners
              </button>
            </li>
            <li>
              <button className="hover:underline hover:cursor-pointer">
                Dealership
              </button>
            </li>
            <li>
              <button className="hover:underline hover:cursor-pointer">
                Certified Shop Resources
              </button>
            </li>
            <li>
              <button className="hover:underline hover:cursor-pointer">
                Shop Dashboard Login
              </button>
            </li>
          </ul>
        </div>

        <div className="p-4">
          <h3 className="font-bold mb-4">About</h3>
          <ul className="space-y-2 text-gray-300">
            <li>
              <button className="hover:underline hover:cursor-pointer">
                Team
              </button>
            </li>
            <li>
              <button className="hover:underline hover:cursor-pointer">
                FAQ
              </button>
            </li>
            <li>
              <button className="hover:underline hover:cursor-pointer">
                Jobs
              </button>
            </li>
            <li>
              <button className="hover:underline hover:cursor-pointer">
                Support
              </button>
            </li>
            <li>
              <button className="hover:underline hover:cursor-pointer">
                Contact Us
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-500 text-gray-300 container max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2  gap-6">
        <div className="p-4">
          <ul className="flex gap-2 ">
            <li>
              <FontAwesomeIcon icon={faXTwitter} />
            </li>
            <li>
              <FontAwesomeIcon icon={faInstagram} />
            </li>
            <li>
              <FontAwesomeIcon icon={faLinkedin} />
            </li>
            <li>
              <FontAwesomeIcon icon={faFacebook} />
            </li>
          </ul>
        </div>
        <div className="p-4">
          <p>
            <FontAwesomeIcon icon={faCopyright} /> 2024 CarCare, Inc. CarCare
            Certified
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer
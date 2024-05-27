import React from 'react';
import gplay from "./google_play.png";
import astore from "./app_store.svg";

function Footer() {
  return (
    <footer className='mt-10 p-6 bg-gray-800 text-white flex justify-between items-start'>
      <div className='w-1/5'>
        <h4 className='text-lg mb-4'>Download Our App</h4>
        <p className='mb-6'>Download App for Android and iOS mobile phone</p>
        <div className='flex space-x-2 '>
          <img className='w-40 h-auto cursor-pointer' src={gplay} alt="Google Play" />
        </div>
      </div>
      <div className='w-3/5 text-center  mt-28 '>
        
        <p className='text-sm'>&copy; 2024 Baljit Singh - MarketMe. All rights reserved.</p>
      </div>
      <div className='w-1/5'>
        <h4 className='text-lg mb-4'>Follow Us</h4>
        <ul className='list-none space-y-2'>
          <li><a href="#" className='text-gray-300 hover:text-white'>Instagram</a></li>
          <li><a href="#" className='text-gray-300 hover:text-white'>Youtube</a></li>
          <li><a href="#" className='text-gray-300 hover:text-white'>Facebook</a></li>
        </ul>
      </div>
    </footer>
  );
}

export default Footer;

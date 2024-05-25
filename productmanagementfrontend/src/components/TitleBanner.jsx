import React from 'react';
import { Link } from 'react-router-dom';
import './TitleBanner.css';

const TitleBanner = () => {
  return (
    <div className='banner'>
      <div className="Title">
        <Link to="/" className='link'>INTELLIGEST</Link>
      </div>
      <svg className="Log-in_z" viewBox="16 10 48 40">
        <path id="Log-in_z" d="M 63.99999618530273 50 C 63.99999618530273 40.09749603271484 53.25565338134766 32.06849670410156 40 32.06849670410156 C 26.74435234069824 32.06849670410156 16 40.09799194335938 16 50 L 19.69294357299805 50 C 19.69294357299805 41.62099456787109 28.78511428833008 34.8279914855957 39.99972534179688 34.8279914855957 C 51.21433639526367 34.8279914855957 60.30650329589844 41.62099075317383 60.30650329589844 50 L 63.99999618530273 50 Z M 40 29.31049346923828 C 47.1359977722168 29.31049346923828 52.9238395690918 24.98824119567871 52.9238395690918 19.65449905395508 C 52.9238395690918 14.3224983215332 47.13579559326172 9.999996185302734 40.00000762939453 9.999996185302734 C 32.86421966552734 9.999996185302734 27.07617950439453 14.32224655151367 27.07617950439453 19.65449905395508 C 27.07617950439453 24.98849105834961 32.86421966552734 29.31049346923828 40.00000762939453 29.31049346923828 Z M 40 26.55074310302734 C 34.90219497680664 26.55074310302734 30.76869583129883 23.46479034423828 30.76869583129883 19.65424537658691 C 30.76869583129883 15.84564781188965 34.90184020996094 12.75774574279785 40 12.75774574279785 C 45.09815979003906 12.75774574279785 49.23130416870117 15.84564781188965 49.23130416870117 19.65424537658691 C 49.23130416870117 23.46479415893555 45.09815979003906 26.55074310302734 40 26.55074310302734 Z">
        </path>
      </svg>
    </div>
  );
};

export default TitleBanner;

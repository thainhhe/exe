
import { Carousel } from 'antd';
import slider from '../../../assets/images/home/slider.png';
import FeaturedProduct from './FeaturedProduct';
import FlashSale from './FlashSale';
import './home.css';
import DealerSection from './Dealer';



function Home() {
  return (
    <div className="container mx-auto">
      {/* Banner Carousel */}
      <Carousel autoplay className="banner-carousel">
        <div>
          <div className="h-[400px] bg-gradient-to-r from-[#e74c3c] to-[#c0392b] px-8 py-12 flex items-center">
            <div className="w-1/2 flex justify-center items-center">
              <img src={slider} alt="Highlands Coffee Products" />
            </div>
          </div>
        </div>
      </Carousel>

      
      {/* Flash Sale Section */}
      <FlashSale />

      {/* Featured Product Section */}
      <FeaturedProduct />

      <DealerSection />


    </div>
  );
}

export default Home;

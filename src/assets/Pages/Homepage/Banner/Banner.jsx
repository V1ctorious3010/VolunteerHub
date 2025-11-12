import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';    
import Carousel from './Carousel';
import bg1 from '../../../images/banner/7.webp'
import bg2 from '../../../images/banner/2.webp'
import bg3 from '../../../images/banner/3.webp'
import bg4 from '../../../images/banner/5.jpg'
import bg5 from '../../../images/banner/6.jpg'
const Banner = () => {
    return (
        <div data-aos="fade-up"
        data-aos-anchor-placement="top-bottom"
        data-aos-easing="linear"
        data-aos-duration="1000" className='pb-10 mt-8'>
          <Swiper
            spaceBetween={30}
            centeredSlides={true}
            loop={true}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
            }}
            navigation={true}
            modules={[Autoplay, Pagination, Navigation]}
            className="mySwiper"
          >
            <SwiperSlide>
                <Carousel image={bg1} text='Join Our Cause' paragraph="Dive into community service and be a catalyst for change. With VolunteerHub, you're not just volunteering; you're becoming part of a movement dedicated to creating a brighter future for all."></Carousel>
            </SwiperSlide>
            <SwiperSlide>
                <Carousel image={bg2} text='Empower Change' paragraph=" Take action and be the change you wish to see. VolunteerHub provides the platform for you to champion causes close to your heart, driving tangible impact and fostering a culture of empowerment."></Carousel>
            </SwiperSlide>
            <SwiperSlide>
                <Carousel image={bg3} text='Connect and Grow' paragraph="Expand your network while making a difference. VolunteerHub connects you with passionate individuals, fostering friendships and providing opportunities for personal and professional growth."></Carousel>
            </SwiperSlide>
            <SwiperSlide>
                <Carousel image={bg4} text='Inspire Through Action' paragraph="Lead by example and inspire others to join the movement. VolunteerHub empowers you to turn your passion into meaningful action, sparking inspiration and catalyzing positive change in your community."></Carousel>
            </SwiperSlide>
            <SwiperSlide>
                <Carousel image={bg5} text='Make Your Mark' paragraph=' Leave a legacy of compassion and progress. VolunteerHub enables you to leave a lasting impact on the causes you care about, one volunteer opportunity at a time. Join us and make your mark on the world.'></Carousel>
            </SwiperSlide>
          </Swiper>
        </div>
    );
};

export default Banner;
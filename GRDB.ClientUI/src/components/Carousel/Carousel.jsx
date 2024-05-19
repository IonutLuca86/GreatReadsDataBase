import Carousel from 'react-bootstrap/Carousel';
import Slide1 from '../../assets/slide1.jpeg';
import Slide2 from '../../assets/slide2.jpeg';
import Slide3 from '../../assets/slide3.jpeg';
import './Carousel.css'

export default function CarouselFadeExample() {
  return (
    <div className='carousel-wrapper'>
    <Carousel fade className='carousel' >
      <Carousel.Item>
        <img src={Slide1} className='carousel-image' /> 
        <Carousel.Caption>
          <p className='carousel-text1'>Welcome to Great Reads DataBase!</p>
          <p className='carousel-text2'>Your companion in finding your next good book to read.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img src={Slide2} className='carousel-image' />
        <Carousel.Caption>
          <p className='carousel-text1'>Hard to decide? You are in luck!</p>
          <p className='carousel-text2'>Use our search engine to browse between a broad list of books and decide with the help of others reviews.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img src={Slide3} className='carousel-image' />
        <Carousel.Caption>
          <p className='carousel-text1'>You are important! Help others too!</p>
          <p className='carousel-text2'>
            Your review is important for others to decide what to read next, so do not hesitate to give a thumbs up on a good book you have read.
          </p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
    </div>
  );
}
import React from 'react';
import { Carousel } from 'react-bootstrap';
import classNames from 'classnames/bind';
import styles from './Slider.module.scss';

const cx = classNames.bind(styles);

const Slider = ({ images, captions }) => {
  return (
    <div className="container mt-2">
      <Carousel className={cx('carousel')}>
        {images.map((image, index) => (
          <Carousel.Item key={index} className={cx('carousel-item')}>
            <img
              className="d-block w-100"
              src={image.src}
              alt={`Slide ${index + 1}`}
            />
            {captions && captions[index] && (
              <Carousel.Caption>
                <h3>{captions[index].title || 'Phòng đẹp, đầy đủ tiện nghi'}</h3>
                <p>{captions[index].description || 'Top 1 khách sạn chất lượng nhất Việt Nam'}</p>
              </Carousel.Caption>
            )}
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default Slider;
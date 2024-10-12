import React from 'react';
import classNames from 'classnames/bind';
import styles from './HotelIntro.module.scss';
import introImage from '~/user/UserImg/banner/banner6.jpg';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import AOS from 'aos';

const cx = classNames.bind(styles);

const HotelIntro = () => {
    useEffect(() => {
        AOS.init({ duration: 1000 });
        }, []);
    
  return (
    <div className={cx('container mt-5')}>
        <div className={cx('intro-container')}>
            <div className={cx('intro-text')} data-aos="fade-right" data-aos-duration="1000">
                <h2>Chào mừng bạn đến với Khách Sạn Khoa Hotel</h2>
                <p>
                    Nằm trong hệ thống Tổng công ty khoáng sản và thương mại Đăng Khoa, Khách sạn Khoa Hotel có nhiều lợi thế riêng để thu hút khách du lịch. Ngoài nguồn khách truyền thống là các công ty lữ hành, khách quan trọng của chính phủ, các cơ quan ban ngành cấp Quốc Gia, cấp Tỉnh… Khách sạn Khoa Hotel còn là nơi lưu trú lý tưởng cho khách du lịch kết hợp hội nghị, hội thảo trong và ngoài nước.
                </p>
                <Link to="/blog" className={cx('btn btn-dark')}>Xem thêm</Link>
            </div>
            <div className={cx('intro-image')} data-aos="fade-left" data-aos-duration="1000">
                <img src={introImage} alt="Khách Sạn Khoa Hotel" />
            </div>
        </div>
    </div>
  );
};

export default HotelIntro;

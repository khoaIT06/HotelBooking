import React from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Footer.module.scss';

const cx = classNames.bind(styles);

const Footer = () => {
  return (
    <footer className={cx('footer')}>
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <h5>Liên hệ</h5>
            <p>58 Trần Tế Xương, TP. Cao Lãnh, tỉnh Đồng Tháp</p>
            <p>Email: <a href="#">trandangkhoantl@gmail.com</a></p>
            <p>Phone: +869072497</p>
          </div>

          <div className="col-md-4">
            <h5>Menu</h5>
            <ul className={cx('nav-links')}>
              <li><Link to="/">Trang chủ</Link></li>
              <li><Link to="/room">Phòng</Link></li>
              <li><Link to="/blog">Blog</Link></li>
            </ul>
          </div>

          <div className="col-md-4">
            <h5>Mạng xã hội</h5>
            <div className={cx('social-media')}>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={cx('social-icon')}>
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={cx('social-icon')}>
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={cx('social-icon')}>
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className={cx('social-icon')}>
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col text-center">
            <p className={cx('bottom-text')}>
              &copy; {new Date().getFullYear()} Khoa Hotel. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

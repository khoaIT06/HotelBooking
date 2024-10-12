import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import logo from '../../../UserImg/logo/logo-hotel.png';

const cx = classNames.bind(styles);

const Header = () => {
  const [username, setUsername] = useState(null);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('username');
    const userRole = localStorage.getItem('role');
    setUsername(user);
    setRole(userRole);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    setUsername(null);
    setRole(null);
    navigate('/');
  };
  return (
    <Navbar className={cx('navbar')} expand="lg">
      <Navbar.Brand as={Link} to="/">
        <img
          src={logo}
          className="d-inline-block align-top"
          width="60"
          height="60"
          alt="Logo"
        />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className={cx('nav-menu')}>
          <Nav.Link as={Link} to="/" className={cx('nav-item')}>Trang Chủ</Nav.Link>
          <Nav.Link as={Link} to="/room" className={cx('nav-item')}>Phòng</Nav.Link>
          <Nav.Link as={Link} to="/blog" className={cx('nav-item')}>Blog</Nav.Link>
        </Nav>
        <Nav className={cx('login-link')}>
          {username ? (
            <Dropdown>
              <Dropdown.Toggle 
                variant="link"
                id="dropdown-basic" 
                className={cx('nav-item', 'username-link')}
              >
                Xin chào! {username}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item as={Link} to="/profile">Thông tin cá nhân</Dropdown.Item>
                <Dropdown.Item as={Link} to="/bookinginfo">Thông tin đặt phòng</Dropdown.Item>
                <Dropdown.Item as={Link} to="/changepassword">Đổi mật khẩu</Dropdown.Item>
                {role === "Admin" &&
                <Dropdown.Item as={Link} to="/admin/dashboard">Trang admin</Dropdown.Item>}
                <Dropdown.Item onClick={handleLogout}>Đăng xuất</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <Nav.Link as={Link} to="/login">Đăng Nhập</Nav.Link>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;

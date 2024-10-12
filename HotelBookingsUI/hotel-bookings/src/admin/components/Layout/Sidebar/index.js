import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import classNames from 'classnames/bind';
import styles from './Sidebar.module.scss'
import logo from '~/user/UserImg/logo/logo-hotel.png';

const cx = classNames.bind(styles)

const Sidebar = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem('jwt');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        navigate('/');
      };

    return (
        <>
            <button 
                className="btn btn-primary d-md-none" 
                onClick={toggleSidebar}
                style={{ position: 'fixed', top: '10px', left: '10px', zIndex: 999 }}
            >
                <i className="fas fa-bars"></i>
            </button>

            <div className={`d-flex flex-column flex-shrink-0 p-3 text-white vh-100 ${isSidebarOpen ? '' : 'd-none d-md-block'}`} style={{ width: '360px', backgroundColor: '#0046ff'}}>
                <Link to="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none justify-content-center">
                    <img 
                        src={logo} 
                        alt="Hotel Logo" 
                        className="img-fluid rounded-circle" 
                        style={{ width: '120px' }} 
                    />
                </Link>
                <hr />
                <ul className="nav nav-pills flex-column mb-auto">
                    <li className="nav-item">
                        <NavLink to="/admin/dashboard" className="nav-link text-white" activeClassName="active" style={{fontWeight: '600', fontSize: '1.1rem'}}>
                            <i className="fas fa-tachometer-alt me-2"></i> Trang chủ
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/admin/rooms" className="nav-link text-white" activeClassName="active" style={{fontWeight: '600', fontSize: '1.1rem'}}>
                            <i className="fas fa-door-open me-2"></i> Quản lý phòng  {/* Font Awesome Icon */}
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/admin/customers" className="nav-link text-white" activeClassName="active" style={{fontWeight: '600', fontSize: '1.1rem'}}>
                            <i className="fas fa-users me-2"></i> Quản lý khách hàng  {/* Font Awesome Icon */}
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/admin/bookings" className="nav-link text-white" activeClassName="active" style={{fontWeight: '600', fontSize: '1.1rem'}}>
                            <i className="fas fa-calendar-check me-2"></i> Quản lý đơn đặt phòng  {/* Font Awesome Icon */}
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/admin/roomstatus" className="nav-link text-white" activeClassName="active" style={{fontWeight: '600', fontSize: '1.1rem'}}>
                            <i className="fas fa-door-closed me-2"></i> Quản lý trạng thái phòng  {/* Font Awesome Icon */}
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/admin/roomtype" className="nav-link text-white" activeClassName="active" style={{fontWeight: '600', fontSize: '1.1rem'}}>
                            <i className="fas fa-list-ul me-2"></i> Quản lý loại phòng 
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/admin/bookingstatus" className="nav-link text-white" activeClassName="active" style={{fontWeight: '600', fontSize: '1.1rem'}}>
                            <i className="fas fa-check-circle me-2"></i> Quản lý trạng thái đặt phòng 
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/admin/accounts" className="nav-link text-white" activeClassName="active" style={{fontWeight: '600', fontSize: '1.1rem'}}>
                            <i className="fas fa-user me-2"></i> Quản lý tài khoản và phân quyền 
                        </NavLink>
                    </li>
                </ul>

                <hr />
                <div className="mt-5">
                    <button className="btn btn-danger w-100" onClick={handleLogout}>
                        <i className="fas fa-sign-out-alt me-2"></i> Đăng xuất
                    </button>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
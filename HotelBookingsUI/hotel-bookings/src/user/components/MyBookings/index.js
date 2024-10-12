import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './MyBookings.module.scss';
import classNames from 'classnames';

let cx = classNames.bind(styles);

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const fetchBookings = async () => {
            const jwt = localStorage.getItem('jwt');
            try {
                const response = await axios.get('http://localhost:8080/bookings/myBookings', {
                    headers: {
                        Authorization: `Bearer ${jwt}`
                    }
                });
                setBookings(response.data);
            } catch (error) {
                toast.error("Failed to fetch bookings.");
            }
        };

        fetchBookings();
    }, []);

    const handleCancelBooking = async (id) => {
        const jwt = localStorage.getItem('jwt');
        try {
            await axios.put(`http://localhost:8080/bookings/cancel/${id}`, {}, {
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            });

            setBookings(prevBookings =>
                prevBookings.map(booking => {
                    if (booking.bookingId === id) {
                        return { 
                            ...booking, 
                            bookingStatus: 'Cancelled'
                        };
                    }
                    return booking;
                })
            );
            toast.success("Hủy đặt phòng thành công!");
        } catch (error) {
            toast.error("Lỗi khi hủy đặt phòng");
        }
    };

    const formatPrice = (price) => {
        return price.toLocaleString('vi-VN');
    };

    const translateBookingStatus = (status) => {
        switch (status) {
            case 'Pending':
                return 'Đang chờ';
            case 'Confirmed':
                return 'Đã hoàn thành';
            case 'Cancelled':
                return 'Đã hủy';
            default:
                return status;
        }
    };

    return (
        <div className="container mb-5 mt-5 d-flex justify-content-center">
            <div className="card shadow-lg p-4" style={{ width: '100%' }}>
                <h2 className="text-center mb-4">Các phòng đã đặt</h2>
                <table className="table table-striped table-hover text-center">
                    <thead className="thead-dark">
                        <tr>
                            <th className='text-primary'>Số phòng</th>
                            <th className='text-primary'>Loại phòng</th>
                            <th className='text-primary'>Giá</th>
                            <th className='text-primary'>Ngày đến</th>
                            <th className='text-primary'>Ngày trả phòng</th>
                            <th className='text-primary'>Trạng thái đơn đặt</th>
                            <th className='text-primary'>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map(booking => (
                            <tr key={booking.bookingId}>
                                <td>
                                    {booking.roomInfos.map(room => (
                                        <div key={room.roomNumber}>{room.roomNumber}</div>
                                    ))}
                                </td>
                                <td>
                                    {booking.roomInfos.map(room => (
                                        <div key={room.roomNumber}>{room.roomType}</div>
                                    ))}
                                </td>
                                <td>{formatPrice(booking.price)} VND</td>
                                <td>{booking.checkInDate}</td>
                                <td>{booking.checkOutDate}</td>
                                <td>{translateBookingStatus(booking.bookingStatus)}</td>
                                <td>
                                    <button
                                        className={`btn ${booking.bookingStatus === 'Pending' ? 'btn-danger' : 'btn-secondary'}`}
                                        onClick={() => booking.bookingStatus === 'Pending' && handleCancelBooking(booking.bookingId)}
                                        disabled={booking.bookingStatus !== 'Pending'}
                                    >
                                        Hủy
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MyBookings;
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Modal, Button, Form, Table, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faEye } from "@fortawesome/free-solid-svg-icons";

const Bookings = () => {
    const [bookings, setBookings] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [statusFilter, setStatusFilter] = useState("all");

    const jwt = localStorage.getItem("jwt");

    const fetchBookings = async () => {
        try {
            const response = await axios.get("http://localhost:8080/bookings/getAll", {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            setBookings(response.data);
            setFilteredBookings(response.data);
        } catch (error) {
            console.error("Error fetching bookings:", error);
        }
    };

    const fetchBookingDetails = async (bookingId) => {
        try {
            const bookingResponse = await axios.get(`http://localhost:8080/bookingdetails/getDetails/${bookingId}`, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });

            const bookingIdResponse = await axios.get(`http://localhost:8080/bookings/getById/${bookingId}`, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });

            const customer = bookingIdResponse.data.customer;

            const roomPromises = bookingResponse.data.map(detail => {
                return axios.get(`http://localhost:8080/rooms/getById/${detail.room.id}`, {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                });
            });
            
            const roomsResponses = await Promise.all(roomPromises);
            const rooms = roomsResponses.map(response => response.data);
            return {
                rooms,
                customer
            };
        } catch (error) {
            console.error("Error fetching booking details:", error);
            throw error;
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleDelete = async (id, status) => {
        if (status === 3 && window.confirm("Bạn có chắc chắn muốn xóa đơn này?")) {
            try {
                await axios.delete(`http://localhost:8080/bookings/delete/${id}`, {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                });
                toast.success("Xóa đơn thành công!");
                fetchBookings();
            } catch (error) {
                toast.error("Đã xảy ra lỗi khi xóa đơn!");
                console.error("Error deleting booking:", error);
            }
        } else {
            toast.error("Chỉ có thể xóa đơn đã hủy!");
        }
    };

    const handleViewDetails = async (booking) => {
        setSelectedBooking(booking);
        setShowModal(true);

        try {
            const bookingDetails = await fetchBookingDetails(booking.id);
            setSelectedBooking(prev => ({
                ...prev,
                customer: bookingDetails.customer,
                rooms: bookingDetails.rooms,
            }));
        } catch (error) {
            toast.error("Không thể lấy thông tin chi tiết!");
        }
    };

    const handleStatusUpdate = async (status) => {
        try {
            await axios.put(
                `http://localhost:8080/bookings/update/${selectedBooking.id}`,
                { 
                    ...selectedBooking,
                    bookingStatus: { id: status }
                },
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            );
            toast.success("Cập nhật trạng thái đơn thành công!");
            fetchBookings();
            setShowModal(false);
        } catch (error) {
            toast.error("Đã xảy ra lỗi khi cập nhật trạng thái!");
            console.error("Error updating status:", error);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        const filtered = bookings.filter(
            (booking) =>
                booking.customer.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
                booking.checkInDate.toLowerCase().includes(e.target.value.toLowerCase()) ||
                booking.checkOutDate.toLowerCase().includes(e.target.value.toLowerCase())
        );
        setFilteredBookings(filtered);
    };

    const handleFilter = (e) => {
        setStatusFilter(e.target.value);
        const filtered = bookings.filter(
            (booking) => e.target.value === "all" || booking.bookingStatus.id === parseInt(e.target.value)
        );
        setFilteredBookings(filtered);
    };

    return (
        <div className="container">
            <h2>Quản lý đơn đặt phòng</h2>
            <input
                type="text"
                className="form-control mb-3"
                placeholder="Tìm kiếm đơn đặt phòng..."
                value={searchTerm}
                onChange={handleSearch}
            />
            <Col xs={12} md={6} lg={2}>
                <Form.Select
                    value={statusFilter}
                    onChange={handleFilter}
                >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="1">Đang chờ</option>
                    <option value="2">Đã xác nhận</option>
                    <option value="3">Đã hủy</option>
                </Form.Select>
            </Col>

            <Table striped bordered hover className="mt-3">
                <thead>
                    <tr>
                        <th>Ngày đến</th>
                        <th>Ngày đi</th>
                        <th>Tổng tiền</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredBookings.length > 0 ? (
                        filteredBookings.map((booking) => (
                            <tr key={booking.id}>
                                <td>{booking.checkInDate}</td>
                                <td>{booking.checkOutDate}</td>
                                <td>{booking.totalAmount}</td>
                                <td>{booking.bookingStatus.id === 1 ? "Đang chờ" : booking.bookingStatus.id === 2 ? "Đã xác nhận" : "Đã hủy"}</td>
                                <td>
                                    <Button
                                        variant="primary"
                                        className="mx-2"
                                        onClick={() => handleViewDetails(booking)}
                                    >
                                        <FontAwesomeIcon icon={faEye} /> Xem chi tiết
                                    </Button>
                                    <Button
                                        variant="danger"
                                        onClick={() => handleDelete(booking.id, booking.bookingStatus.id)}
                                    >
                                        <FontAwesomeIcon icon={faTrashAlt} /> Xóa
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center">Không tìm thấy đơn đặt phòng</td>
                        </tr>
                    )}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Chi tiết đơn đặt phòng</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedBooking && (
                        <>
                            <h5>Thông tin khách hàng:</h5>
                            <p>Tên: {selectedBooking.customer?.name || 'Không có thông tin'}</p>
                            <p>Ngày sinh: {selectedBooking.customer?.birthday || 'Không có thông tin'}</p>
                            <p>Số điện thoại: {selectedBooking.customer?.phone || 'Không có thông tin'}</p>
                            <p>Số CCCD: {selectedBooking.customer?.identificationnumber || 'Không có thông tin'}</p>

                            <h5>Thông tin đặt phòng:</h5>
                            <p>Ngày đến: {selectedBooking.checkInDate}</p>
                            <p>Ngày đi: {selectedBooking.checkOutDate}</p>
                            <p>Tổng tiền: {selectedBooking.totalAmount}</p>
                            <p>Trạng thái đơn: {selectedBooking.bookingStatus.id === 1 ? "Đang chờ" : selectedBooking.bookingStatus.id === 2 ? "Đã xác nhận" : "Đã hủy"}</p>

                            <h5>Danh sách phòng:</h5>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Số phòng</th>
                                        <th>Giá</th>
                                        <th>Số giường</th>
                                        <th>Loại phòng</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedBooking.rooms?.map((room) => (
                                        <tr key={room.id}>
                                            <td>{room.roomNumber}</td>
                                            <td>{room.price}</td>
                                            <td>{room.bedsNumber}</td>
                                            <td>{room.roomType.name}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                            <div className="d-flex justify-content-end">
                                {(selectedBooking.bookingStatus.id === 1) && (
                                    <>
                                        <Button variant="primary" onClick={() => handleStatusUpdate(2)}>Duyệt</Button>
                                        <Button variant="danger" className="mx-3" onClick={() => handleStatusUpdate(3)}>Hủy</Button>
                                    </>
                                )}
                                <Button variant="secondary" onClick={() => setShowModal(false)}>
                                    Đóng
                                </Button>
                            </div>
                        </>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Bookings;
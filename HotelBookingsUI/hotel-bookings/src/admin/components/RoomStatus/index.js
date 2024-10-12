import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Form, Modal, Toast } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { Col, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons';

const RoomStatus = () => {
    const [roomStatuses, setRoomStatuses] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [statusName, setStatusName] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const jwt = localStorage.getItem("jwt");
    const fetchRoomStatuses = async () => {
        try {
            const response = await axios.get('http://localhost:8080/roomstatus/getAll',
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            );
            setRoomStatuses(response.data);
        } catch (error) {
            toast.error('Không thể tải trạng thái phòng!');
            console.error('Error fetching room statuses:', error);
        }
    };

    useEffect(() => {
        fetchRoomStatuses();
    }, []);

    const handleSave = async () => {
        const trimmedStatusName = statusName.trim();
        
        if (trimmedStatusName === '') {
            toast.error('Tên trạng thái không được để trống!');
            return;
        }

        try {
            const url = selectedStatus ? 
                `http://localhost:8080/roomstatus/update/${selectedStatus.id}` : 
                'http://localhost:8080/roomstatus/create';

            const method = selectedStatus ? 'put' : 'post';

            await axios[method](url, { name: trimmedStatusName }, 
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            );

            toast.success(selectedStatus ? 'Cập nhật trạng thái thành công!' : 'Thêm trạng thái thành công!');
            fetchRoomStatuses();
            handleClose();
        } catch (error) {
            toast.error('Đã xảy ra lỗi khi lưu trạng thái!');
            console.error('Error saving room status:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa trạng thái này?')) {
            try {
                await axios.delete(`http://localhost:8080/roomstatus/delete/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${jwt}`,
                        },
                    }
                );
                toast.success('Xóa trạng thái thành công!');
                fetchRoomStatuses();
            } catch (error) {
                toast.error('Không thể xóa trạng thái này!');
                console.error('Error deleting room status:', error);
            }
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleShow = (status) => {
        setSelectedStatus(status);
        setStatusName(status ? status.name : '');
        setShowModal(true);
    };

    const handleClose = () => {
        setSelectedStatus(null);
        setStatusName('');
        setShowModal(false);
    };

    return (
        <div className="container mt-5">
            <Row className="mb-3">
                <Col xs={12} md={6} lg={4}>
                    <Form.Control
                        type="text"
                        placeholder="Tìm kiếm trạng thái..."
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </Col>
                <Col xs={12} md={6} lg={6}>
                </Col>
                <Col xs={12} md={6} lg={2}>
                    <Button onClick={() => handleShow(null)} className="btn btn-success">
                        <FontAwesomeIcon icon={faPlus} /> Thêm trạng thái
                    </Button>
                </Col>
            </Row>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tên Trạng Thái</th>
                        <th>Hành Động</th>
                    </tr>
                </thead>
                <tbody>
                    {roomStatuses.filter(status => 
                        status.name.toLowerCase().includes(searchTerm.toLowerCase())
                    ).map(status => (
                        <tr key={status.id}>
                            <td>{status.id}</td>
                            <td>{status.name}</td>
                            <td>
                                <Button variant="warning" onClick={() => handleShow(status)}>
                                    <FontAwesomeIcon icon={faEdit} /> Sửa
                                </Button>
                                <Button variant="danger" className='mx-2' onClick={() => handleDelete(status.id)}>
                                    <FontAwesomeIcon icon={faTrashAlt} /> Xóa
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedStatus ? 'Sửa Trạng Thái' : 'Thêm Trạng Thái'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="formStatusName">
                        <Form.Label>Tên Trạng Thái</Form.Label>
                        <Form.Control
                            type="text"
                            value={statusName}
                            onChange={(e) => setStatusName(e.target.value)}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                        Lưu
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default RoomStatus;
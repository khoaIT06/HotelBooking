import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Form, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { Col, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons';

const RoomType = () => {
    const [roomTypes, setRoomTypes] = useState([]);
    const [selectedType, setSelectedType] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [typeName, setTypeName] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const jwt = localStorage.getItem("jwt");

    const fetchRoomTypes = async () => {
        try {
            const response = await axios.get('http://localhost:8080/roomtype/getAll', {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            setRoomTypes(response.data);
        } catch (error) {
            toast.error('Không thể tải loại phòng!');
            console.error('Error fetching room types:', error);
        }
    };

    useEffect(() => {
        fetchRoomTypes();
    }, []);

    const handleSave = async () => {
        const trimmedTypeName = typeName.trim();

        if (trimmedTypeName === '') {
            toast.error('Tên loại phòng không được để trống!');
            return;
        }

        try {
            const url = selectedType ? 
                `http://localhost:8080/roomtype/update/${selectedType.id}` : 
                'http://localhost:8080/roomtype/create';

            const method = selectedType ? 'put' : 'post';

            await axios[method](url, { name: trimmedTypeName }, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });

            toast.success(selectedType ? 'Cập nhật loại phòng thành công!' : 'Thêm loại phòng thành công!');
            fetchRoomTypes();
            handleClose();
        } catch (error) {
            toast.error('Đã xảy ra lỗi khi lưu loại phòng!');
            console.error('Error saving room type:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa loại phòng này?')) {
            try {
                await axios.delete(`http://localhost:8080/roomtype/delete/${id}`, {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                });
                toast.success('Xóa loại phòng thành công!');
                fetchRoomTypes();
            } catch (error) {
                toast.error('Không thể xóa loại phòng này!');
                console.error('Error deleting room type:', error);
            }
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleShow = (type) => {
        setSelectedType(type);
        setTypeName(type ? type.name : '');
        setShowModal(true);
    };

    const handleClose = () => {
        setSelectedType(null);
        setTypeName('');
        setShowModal(false);
    };

    return (
        <div className="container mt-5">
            <Row className="mb-3">
                <Col xs={12} md={6} lg={4}>
                    <Form.Control
                        type="text"
                        placeholder="Tìm kiếm loại phòng..."
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </Col>
                <Col xs={12} md={6} lg={6}></Col>
                <Col xs={12} md={6} lg={2}>
                    <Button onClick={() => handleShow(null)} className="btn btn-success">
                        <FontAwesomeIcon icon={faPlus} /> Thêm loại phòng
                    </Button>
                </Col>
            </Row>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tên Loại Phòng</th>
                        <th>Hành Động</th>
                    </tr>
                </thead>
                <tbody>
                    {roomTypes.filter(type => 
                        type.name.toLowerCase().includes(searchTerm.toLowerCase())
                    ).map(type => (
                        <tr key={type.id}>
                            <td>{type.id}</td>
                            <td>{type.name}</td>
                            <td>
                                <Button variant="warning" onClick={() => handleShow(type)}>
                                    <FontAwesomeIcon icon={faEdit} /> Sửa
                                </Button>
                                <Button variant="danger" className='mx-2' onClick={() => handleDelete(type.id)}>
                                    <FontAwesomeIcon icon={faTrashAlt} /> Xóa
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedType ? 'Sửa Loại Phòng' : 'Thêm Loại Phòng'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="formTypeName">
                        <Form.Label>Tên Loại Phòng</Form.Label>
                        <Form.Control
                            type="text"
                            value={typeName}
                            onChange={(e) => setTypeName(e.target.value)}
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

export default RoomType;

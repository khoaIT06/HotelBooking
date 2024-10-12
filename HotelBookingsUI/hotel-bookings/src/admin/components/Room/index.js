import React, { useState, useEffect } from 'react';
import { Modal, Button, Table, Form } from 'react-bootstrap';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons';
import 'react-toastify/dist/ReactToastify.css';
import styles from './Room.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const Room = () => {
    const [rooms, setRooms] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [roomImages, setRoomImages] = useState([]);
    const [roomNumber, setRoomNumber] = useState('');
    const [floor, setFloor] = useState(0);
    const [price, setPrice] = useState(0);
    const [bedsNumber, setBedsNumber] = useState(0);
    const [description, setDescription] = useState('');
    const [roomTypeID, setRoomTypeID] = useState('');
    const [roomStatusID, setRoomStatusID] = useState('');
    const [hasAirConditioning, setHasAirConditioning] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [roomTypes, setRoomTypes] = useState([]);
    const [roomStatuses, setRoomStatuses] = useState([]);
    const [deletedImageIds, setDeletedImageIds] = useState([]);

    const jwt = localStorage.getItem("jwt");

    useEffect(() => {
        fetchRooms();
        fetchRoomTypes();
        fetchRoomStatuses();
    }, []);

    const fetchRooms = async () => {
        try {
            const response = await axios.get('http://localhost:8080/rooms/getAll', {
                headers: { Authorization: `Bearer ${jwt}` }
            });
            setRooms(response.data);
        } catch (error) {
            console.error("Failed to fetch rooms:", error);
            toast.error("Không thể lấy danh sách phòng!");
        }
    };

    const fetchRoomTypes = async () => {
        try {
            const response = await axios.get('http://localhost:8080/roomtype/getAll', {
                headers: { Authorization: `Bearer ${jwt}` }
            });
            setRoomTypes(response.data);
        } catch (error) {
            console.error("Failed to fetch room types:", error);
            toast.error("Không thể lấy loại phòng!");
        }
    };

    const fetchRoomStatuses = async () => {
        try {
            const response = await axios.get('http://localhost:8080/roomstatus/getAll', {
                headers: { Authorization: `Bearer ${jwt}` }
            });
            setRoomStatuses(response.data);
        } catch (error) {
            console.error("Failed to fetch room statuses:", error);
            toast.error("Không thể lấy trạng thái phòng!");
        }
    };
    

    const handleShow = async (room = null) => {
        setSelectedRoom(room);
        if (room) {
            setRoomNumber(room.roomNumber);
            setFloor(room.floor);
            setPrice(room.price);
            setBedsNumber(room.bedsNumber);
            setDescription(room.description);
            setRoomTypeID(room.roomType ? room.roomType.id : '');
            setRoomStatusID(room.roomStatus ? room.roomStatus.id : '');
            setHasAirConditioning(room.hasAirCondition);

            try {
                const response = await axios.get(`http://localhost:8080/roomimages/getByRoomId/${room.id}`, {
                    headers: { Authorization: `Bearer ${jwt}` },
                });
                console.log(response.data)
                const files = await Promise.all(response.data.map(async img => 
                    await fetchImageAsFile(`http://localhost:8080/roomimages/getImage/${img.url.split('/').pop()}`, img.url.split('/').pop())
                ));
                setRoomImages(files);
            } catch (error) {
                console.error("Failed to fetch room images:", error);
                toast.error("Không thể lấy hình ảnh của phòng!");
            }

        } else {
            setRoomNumber();
            setFloor();
            setPrice();
            setBedsNumber();
            setDescription('');
            setRoomImages([]);
            setRoomTypeID('');
            setRoomStatusID('');
            setHasAirConditioning(false);
        }
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
        setSelectedRoom(null);
        setRoomImages([]);
    };

    const handleSave = async () => {
        if (!roomNumber || !floor || !price || !bedsNumber || !description || !roomTypeID || !roomStatusID) {
            toast.error("Tất cả các trường không được bỏ trống!");
            return;
        }
    
        if (roomNumber < 100 || roomNumber > 999) {
            toast.error("Số phòng phải từ 100 đến 999!");
            return;
        }
    
        if (floor < 1 || floor > 10) {
            toast.error("Tầng phải từ 1 đến 10!");
            return;
        }
    
        if (price <= 50000) {
            toast.error("Giá phải lớn hơn 50,000!");
            return;
        }
    
        if (bedsNumber < 1 || bedsNumber > 10) {
            toast.error("Số giường phải từ 1 đến 10!");
            return;
        }

        if (roomImages.length === 0) {
            toast.error("Bạn cần chọn ít nhất một hình ảnh!");
            return;
        }
    
        const formData = new FormData();
    
        const newRoom = {
            roomNumber,
            floor,
            price,
            bedsNumber,
            description,
            roomType: { id: roomTypeID },
            roomStatus: { id: roomStatusID },
            hasAirCondition: hasAirConditioning
        };
        formData.append('roomData', new Blob([JSON.stringify(newRoom)], { type: 'application/json' }));
        console.log(roomImages)
    
        roomImages.forEach((image) => {
            // formData.append('images', image);
            if (image.isEdit) {
                formData.append("images", image.file);
            }
        });
    
        try {
            if (selectedRoom) {
                const roomExists = rooms.some(room => room.roomNumber === roomNumber && room.roomNumber !== selectedRoom.roomNumber);
                if (roomExists) {
                    toast.error("Số phòng đã tồn tại trong cơ sở dữ liệu!");
                    return;
                }
                for (const imageId of deletedImageIds) {
                    try {
                        await axios.delete(`http://localhost:8080/roomimages/delete/${imageId}`, {
                            headers: {
                                Authorization: `Bearer ${jwt}`,
                            },
                        });
                    } catch (error) {
                        toast.error(`Lỗi khi xóa hình ảnh ID ${imageId}: ${error.message}`);
                    }
                }

                await axios.put(`http://localhost:8080/rooms/update/${selectedRoom.id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${jwt}`,
                    },
                });
                toast.success("Cập nhật phòng thành công!");
            } else {
                const roomExists = rooms.some(room => room.roomNumber === roomNumber);
                if (roomExists) {
                    toast.error("Số phòng đã tồn tại trong cơ sở dữ liệu!");
                    return;
                }
                await axios.post('http://localhost:8080/rooms/create', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${jwt}`,
                    },
                });
                toast.success("Thêm phòng thành công!");
            }
            fetchRooms();
            handleClose();
        } catch (error) {
            toast.error("Đã xảy ra lỗi, vui lòng thử lại!");
            console.error("Error saving room:", error);
        }
    };
    
    const handleDelete = async (id) => {
        try {
            const roomById = await axios.get(`http://localhost:8080/rooms/getById/${id}`, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            if(roomById.data.roomStatus.id === 2){
                toast.error("Không thể xóa phòng đang được đặt!");
                return;
            }
        } catch (error) {
            toast.error("Đã xảy ra lỗi!");
            console.error("Error deleting room:", error);
        }
        if (window.confirm("Bạn có chắc chắn muốn xóa phòng này?")) {
            try {
                await axios.delete(`http://localhost:8080/roomimages/deleteByRoomId/${id}`, {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                });

                await axios.delete(`http://localhost:8080/rooms/delete/${id}`, {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                });
                toast.success("Xóa phòng thành công!");
                fetchRooms();
            } catch (error) {
                toast.error("Đã xảy ra lỗi khi xóa phòng!");
                console.error("Error deleting room:", error);
            }
        }
    };

    const handleImageChange = (e) => {
        // const files = Array.from(e.target.files);
        // setRoomImages(prevImages => [...prevImages, ...files]);
        const files = Array.from(e.target.files);
        const newImages = files.map(file => ({
            file,
            isEdit: true
        }));
        setRoomImages(prevImages => [...prevImages, ...newImages]);
        console.log(roomImages)
    };

    const handleImageRemove = async (index) => {
        const updatedImages = roomImages.filter((_, i) => i !== index);
        setRoomImages(updatedImages);
        const imageToRemove = roomImages[index];
        if (!imageToRemove.isEdit) {
            try {
                const imgDelete = await axios.get(`http://localhost:8080/roomimages/getByUrl/${imageToRemove.name}`, {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                });
                setDeletedImageIds((prev) => [...prev, imgDelete.data.id]);
                toast.success("Xóa ảnh thành công!");
            } catch (error) {
                toast.error("Đã xảy ra lỗi khi xóa ảnh!");
                console.error("Error deleting room:", error);
            }
        }
    };

    const fetchImageAsFile = async (url, filename) => {
        const response = await fetch(url);
        const blob = await response.blob();
        return new File([blob], filename, { type: blob.type });
    };
    

    return (
        <div className="container">
            <h2>Quản lý phòng</h2>
            <input
                type="text"
                placeholder="Tìm kiếm phòng"
                className="form-control mb-3"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="success" onClick={() => handleShow()}>
                <FontAwesomeIcon icon={faPlus} /> Thêm phòng
            </Button>

            <Table striped bordered hover className="mt-3">
                <thead>
                    <tr>
                        <th>Số phòng</th>
                        <th>Tầng</th>
                        <th>Giá</th>
                        <th>Số giường</th>
                        <th>Mô tả</th>
                        <th>Loại phòng</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {rooms.filter(room =>
                        room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        room.floor.toString().includes(searchTerm) ||
                        room.price.toString().includes(searchTerm) ||
                        room.bedsNumber.toString().includes(searchTerm) ||
                        room.description.toLowerCase().includes(searchTerm) ||
                        (room.roomType && room.roomType.name.toLowerCase().includes(searchTerm)) ||
                        (room.roomStatus && room.roomStatus.name.toLowerCase().includes(searchTerm))
                    ).map(room => (
                        <tr key={room.id}>
                            <td>{room.roomNumber}</td>
                            <td>{room.floor}</td>
                            <td>{room.price}</td>
                            <td>{room.bedsNumber}</td>
                            <td>{room.description.length > 50 ? room.description.slice(0, 50) + '...' : room.description}</td>
                            <td>{room.roomType ? room.roomType.name : 'N/A'}</td>
                            <td>
                                {room.roomStatus ? (
                                    room.roomStatus.name === 'Available' ? 'Trống' :
                                        room.roomStatus.name === 'Booked' ? 'Đã được đặt' :
                                            room.roomStatus.name === 'Out of service' ? 'Không khả dụng' :
                                                'N/A'
                                ) : 'N/A'}
                            </td>
                            <td>
                                <Button variant="warning" className="mx-2" onClick={() => handleShow(room)}>
                                    <FontAwesomeIcon icon={faEdit} /> Sửa
                                </Button>
                                <Button variant="danger" onClick={() => handleDelete(room.id)}>
                                    <FontAwesomeIcon icon={faTrashAlt} /> Xóa
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedRoom ? 'Sửa phòng' : 'Thêm phòng'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formRoomNumber">
                            <Form.Label>Số phòng</Form.Label>
                            <Form.Control type="number" placeholder="Nhập số phòng" value={roomNumber} onChange={(e) => setRoomNumber(e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId="formFloor">
                            <Form.Label className='mt-3'>Tầng</Form.Label>
                            <Form.Control type="number" placeholder="Nhập tầng" value={floor} onChange={(e) => setFloor(parseInt(e.target.value))} />
                        </Form.Group>
                        <Form.Group controlId="formPrice">
                            <Form.Label className='mt-3'>Giá</Form.Label>
                            <Form.Control type="number" placeholder="Nhập giá" value={price} onChange={(e) => setPrice(parseFloat(e.target.value))} />
                        </Form.Group>
                        <Form.Group controlId="formBedsNumber">
                            <Form.Label className='mt-3'>Số giường</Form.Label>
                            <Form.Control type="number" placeholder="Nhập số giường" value={bedsNumber} onChange={(e) => setBedsNumber(parseInt(e.target.value))} />
                        </Form.Group>
                        <Form.Group controlId="formDescription">
                            <Form.Label className='mt-3'>Mô tả</Form.Label>
                            <Form.Control as="textarea" rows={3} placeholder="Nhập mô tả" value={description} onChange={(e) => setDescription(e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId="formRoomType">
                            <Form.Label className='mt-3'>Loại phòng</Form.Label>
                            <Form.Control as="select" value={roomTypeID} onChange={(e) => setRoomTypeID(e.target.value)}>
                                <option value="">Chọn loại phòng</option>
                                {roomTypes.map(roomType => (
                                    <option key={roomType.id} value={roomType.id}>{roomType.name}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="formRoomStatus">
                            <Form.Label className='mt-3'>Trạng thái phòng</Form.Label>
                            <Form.Control as="select" value={roomStatusID} onChange={(e) => setRoomStatusID(e.target.value)}>
                                <option value="">Chọn trạng thái</option>
                                {roomStatuses.map(roomStatus => (
                                    <option key={roomStatus.id} value={roomStatus.id}>{roomStatus.name}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="formHasAirConditioning">
                            <Form.Check 
                                type="checkbox"
                                label="Có điều hòa"
                                checked={hasAirConditioning}
                                onChange={() => setHasAirConditioning(!hasAirConditioning)}
                                className='mt-3'
                            />
                        </Form.Group>
                        <Form.Group controlId="formRoomImages">
                            <Form.Label className='mt-3'>Hình ảnh phòng</Form.Label>
                            <div className={cx('image-upload-container')}>
                                <label htmlFor="file-upload" className={cx('image-upload-label')}>
                                    <FontAwesomeIcon icon={faPlus} /> Chọn ảnh
                                </label>
                                <input
                                    id="file-upload"
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageChange}
                                    style={{ display: 'none' }}
                                />
                                <div className={cx('image-preview')}>
                                    {roomImages.map((image, index) => (
                                        <div key={index} className={cx('image-preview-item')}>
                                            {image.file && (
                                                <img 
                                                    src={URL.createObjectURL(image.file)} 
                                                    alt={`Room Image ${index + 1}`} 
                                                />
                                            ) ||
                                            <img src={URL.createObjectURL(image)} alt={`Room Image ${index + 1}`} />}
                                            <Button variant="danger" onClick={() => handleImageRemove(index)}>
                                                <FontAwesomeIcon icon={faTrashAlt} />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Form.Group>
                    </Form>
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

export default Room;
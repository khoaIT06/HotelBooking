import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Slider from '~/user/components/Slider';
import { useParams, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from '~/user/components/RoomDetails/RoomDetails.module.scss';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const cx = classNames.bind(styles);

const RoomDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [images, setImages] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [roomStatuses, setRoomStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRooms, setSelectedRooms] = useState([]);

  useEffect(() => {
    // Lấy danh sách phòng đã chọn từ localStorage
    const savedRooms = localStorage.getItem('selectedRooms');
    if (savedRooms) {
      setSelectedRooms(JSON.parse(savedRooms));
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const roomResponse = await axios.get(`http://localhost:8080/rooms/getById/${id}`);
        const imagesResponse = await axios.get('http://localhost:8080/roomimages/getAll');
        const roomTypesResponse = await axios.get('http://localhost:8080/roomtype/getAll');
        const roomStatusesResponse = await axios.get('http://localhost:8080/roomstatus/getAll');
        setRoom(roomResponse.data);
        setImages(imagesResponse.data.filter(image => String(image.room.id) === String(id)));
        setRoomTypes(roomTypesResponse.data);
        setRoomStatuses(roomStatusesResponse.data);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSelectRoom = (room) => {
    const isSelected = selectedRooms.some(selectedRoom => selectedRoom.id === room.id);
    let updatedSelectedRooms;
    
    if (isSelected) {
      updatedSelectedRooms = selectedRooms.filter(selectedRoom => selectedRoom.id !== room.id);
      toast.info(`Bỏ chọn phòng ${room.roomNumber}`);
    } else {
      updatedSelectedRooms = [...selectedRooms, room];
      toast.success(`Đã chọn phòng ${room.roomNumber}`);
    }

    setSelectedRooms(updatedSelectedRooms);
    localStorage.setItem('selectedRooms', JSON.stringify(updatedSelectedRooms));
  };

  if (loading) {
    return <div className="text-center mt-5">Đang tải...</div>;
  }

  if (!room) {
    return <div className="text-center mt-5">Phòng không tồn tại</div>;
  }

  const getRoomTypeName = (roomTypeId) => {
    const roomType = roomTypes.find(type => String(type.id) === String(roomTypeId));
    return roomType ? roomType.name : 'Không xác định';
  };

  const getRoomStatusName = (roomStatusId) => {
    const status = roomStatuses.find(status => String(status.id) === String(roomStatusId));
    return status ? status.name : 'Không xác định';
  };

  return (
    <div className={cx('container')}>
      <h2 className={cx('text-center text-dark mb-4 mt-4')}>Phòng {room.roomNumber}</h2>
      
      <div className={cx('d-flex', 'flex-row', 'justify-content-between', 'align-items-start', 'mt-4')}>
        <div className={cx('slider-container', 'p-0', 'flex-shrink-1')}>
          <Slider
            images={images.map(img => ({ src: `http://localhost:8080/roomimages/getImage/${img.url.split('/').pop()}` }))}
            captions={images.map(img => ({ title: `Phòng ${room.roomNumber}`, description: getRoomTypeName(room.roomType.id) }))}
          />
        </div>

        <div className={cx('room-details', 'flex-grow-1', 'ml-4', 'p-4')}>
          <h4 className={cx('text-center')}>Chi tiết phòng {room.roomNumber}</h4>
          <div className={cx('row', 'mb-5')}>
            <div className={cx('col-md-6')}>
              <p><strong>Giá:</strong> {room.price.toLocaleString('vi-VN')} VND</p>
              <p><strong>Loại:</strong> {getRoomTypeName(room.roomType.id)}</p>
              <p><strong>Trạng thái:</strong> {getRoomStatusName(room.roomStatus.id) === "Available" ? "Trống" : getRoomStatusName(room.roomStatus.id) === "Booked" ? "Đã được đặt" : "Dừng hoạt động"}</p>
            </div>
            <div className={cx('col-md-6')}>
              <p><strong>Tầng:</strong> {room.floor}</p>
              <p><strong>Số giường:</strong> {room.bedsNumber}</p>
              <p><strong>Có điều hòa:</strong> {room.hasAirCondition ? 'Có' : 'Không'}</p>
            </div>
            <div className={cx('col-md-12')}>
              <p><strong>Mô tả:</strong> {room.description}</p>
            </div>
          </div>

          <div className={cx('d-flex', 'justify-content-center')}>
            <button
              className={cx('btn', 'btn-primary', { disabled: getRoomStatusName(room.roomStatus.id) !== 'Available' })}
              onClick={() => {
                if (getRoomStatusName(room.roomStatus.id) === 'Available') {
                  navigate('/booking', { state: { selectedRooms } });
                }
              }}
            >
              Đặt phòng
            </button>
            
            {getRoomStatusName(room.roomStatus.id) === 'Available' && (
              <button
                className={cx('btn', 'ml-3', 'btn-choose',{
                  'btn-success': !selectedRooms.some(selectedRoom => selectedRoom.id === room.id),
                  'btn-secondary': selectedRooms.some(selectedRoom => selectedRoom.id === room.id),
                })}
                onClick={() => handleSelectRoom(room)}
              >
                {selectedRooms.some(selectedRoom => selectedRoom.id === room.id) ? 'Bỏ chọn' : 'Chọn phòng'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetail;

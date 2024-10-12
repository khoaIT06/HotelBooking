import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import classNames from 'classnames/bind';
import styles from './RoomList.module.scss';
import RoomFilter from './RoomFilter';

import errorImg from '~/user/UserImg/error/room-error.jpg';

const cx = classNames.bind(styles);

const RoomList = ({ limit = Infinity, withFilters = false }) => {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [roomStatuses, setRoomStatuses] = useState([]);
  const [roomImages, setRoomImages] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const roomsResponse = await axios.get('http://localhost:8080/rooms/getAll');
        const roomTypesResponse = await axios.get('http://localhost:8080/roomtype/getAll');
        const roomStatusesResponse = await axios.get('http://localhost:8080/roomstatus/getAll');
        const roomImagesResponse = await axios.get('http://localhost:8080/roomimages/getAll');
        setRooms(roomsResponse.data.slice(0, limit));
        setFilteredRooms(roomsResponse.data.slice(0, limit));
        setRoomTypes(roomTypesResponse.data);
        setRoomStatuses(roomStatusesResponse.data);
        setRoomImages(roomImagesResponse.data);
        console.log(roomImagesResponse.data)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [limit]);

  const getRoomTypeName = (roomTypeId) => {
    const roomType = roomTypes.find(type => String(type.id) === String(roomTypeId));
    return roomType ? roomType.name : 'Không rõ loại phòng';
  };

  const getRoomImageUrl = (roomId) => {
    const roomImage = roomImages.find(image => String(image.room.id) === String(roomId));
    const filename = roomImage ? roomImage.url.split('/').pop() : 'default-image.jpg';
    return `http://localhost:8080/roomimages/getImage/${filename}`;
  };



  const handleFilterChange = (filters) => {
    let updatedRooms = [...rooms];
  
    if (filters.roomType) {
      updatedRooms = updatedRooms.filter(room => 
        String(room.roomType.id) === String(filters.roomType)
      );
    }
  
    if (filters.status) {
      updatedRooms = updatedRooms.filter(room => 
        String(room.roomStatus.id) === String(filters.status)
      );
    }

    if (filters.minPrice !== null && filters.minPrice !== undefined) {
      updatedRooms = updatedRooms.filter(room => room.price >= filters.minPrice);
    }
  
    if (filters.maxPrice !== null && filters.maxPrice !== undefined) {
      updatedRooms = updatedRooms.filter(room => room.price <= filters.maxPrice);
    }
  
    setFilteredRooms(updatedRooms);
  };
  

  return (
    <div className="container mt-5">
      {withFilters && (
        <RoomFilter
          onFilterChange={handleFilterChange}
          roomTypes={roomTypes}
          roomStatuses={roomStatuses}
        />
      )}
      <h4 className='text-center mb-3'>Danh sách các phòng</h4>
      <div className="row">
        {filteredRooms.map((room) => (
          <div key={room.id} className="col-md-4 mb-4">
            <div className={cx('room-item')}>
              <img
                src={getRoomImageUrl(String(room.id))}
                alt={`Room ${room.roomNumber}`}
                className={cx('room-image')}
              />
              <div className={cx('room-info-overlay')}>
                <h5>{getRoomTypeName(String(room.roomType.id))}</h5>
                <p>Giá: ${room.price.toLocaleString('vi-VN')} VND</p>
                <Link to={`/room/${room.id}`} className="btn btn-primary mt-3">
                  Xem Chi Tiết
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomList;
import React, { useState, useEffect } from 'react';
import Slider from 'react-slider';
import classNames from 'classnames/bind';
import styles from './RoomFilter.module.scss';

const cx = classNames.bind(styles);

const RoomFilter = ({ onFilterChange, roomTypes, roomStatuses }) => {
  const [selectedRoomType, setSelectedRoomType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [priceRange, setPriceRange] = useState([0, 5000000]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onFilterChange({
        roomType: selectedRoomType,
        status: selectedStatus,
        minPrice: priceRange[0],
        maxPrice: priceRange[1]
      });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [selectedRoomType, selectedStatus, priceRange, onFilterChange]);

  return (
    <div className="row mb-3">
      <div className="col-md-4">
        <label>Loại phòng</label>
        <select
          className="form-select"
          value={selectedRoomType}
          onChange={(e) => setSelectedRoomType(e.target.value)}
        >
          <option value="">Tất cả loại phòng</option>
          {roomTypes.map((type) => (
            <option key={type.id} value={type.id}>{type.name}</option>
          ))}
        </select>
      </div>

      <div className="col-md-4">
        <label>Trạng thái phòng</label>
        <select
          className="form-select"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="">Tất cả trạng thái</option>
          {roomStatuses.map((status) => (
            <option key={status.id} value={status.id}>{status.name}</option>
          ))}
        </select>
      </div>

      <div className="col-md-4">
        <label>Khoảng giá</label>
        <Slider
          value={priceRange}
          onChange={setPriceRange}
          min={0}
          max={2000000}
          step={10000}
          renderTrack={(props, state) => <div {...props} className={cx('track')} />}
          renderThumb={(props, state) => <div {...props} className={cx('thumb')} />}
          className={cx('slider mt-3')}
        />
        <div className="d-flex justify-content-between mt-5">
          <span>{priceRange[0].toLocaleString('vi-VN')} VND</span>
          <span>{priceRange[1].toLocaleString('vi-VN')} VND</span>
        </div>
      </div>
    </div>
  );
};

export default RoomFilter;

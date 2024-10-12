import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import styles from './Booking.module.scss';
import classNames from 'classnames';
import axios from 'axios';

const cx = classNames.bind(styles);

const Booking = () => {
  const { state } = useLocation();
  const { selectedRooms: initialSelectedRooms } = state || { selectedRooms: [] };
  const [selectedRooms, setSelectedRooms] = useState(initialSelectedRooms);
  const [totalAmount, setTotalAmount] = useState(0);
  const [customers, setCustomers] = useState([]);
  const [customerId, setCustomerId] = useState(null);

  const { register, handleSubmit, formState: { errors }, watch, reset} = useForm();
  const checkInDate = watch("checkIn");
  const checkOutDate = watch("checkOut");

  useEffect(() => {
    localStorage.setItem('selectedRooms', JSON.stringify(selectedRooms));
    calculateTotalAmount();
  }, [selectedRooms, checkInDate, checkOutDate]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get('http://localhost:8080/customers/getAll');
        setCustomers(response.data);
      } catch (error) {
        console.error('Có lỗi xảy ra khi lấy danh sách khách hàng:', error);
      }
    };
    fetchCustomers();
  }, []);

  useEffect(() => {
    const getUsername = localStorage.getItem('username');
    if (getUsername) {
      const fetchCustomerByUsername = async () => {
        try {
          const response = await axios.get(`http://localhost:8080/accounts/getByUsername/${getUsername}`);
          setCustomerId(response.data.customerId);
          const responseCustomers = await axios.get(`http://localhost:8080/customers/getById/${response.data.customerId}`);
          reset({
            customerName: responseCustomers.data.name,
            dob: responseCustomers.data.birthday.split('T')[0],
            phone: responseCustomers.data.phone,
            address: responseCustomers.data.address,
            identityCard: responseCustomers.data.identificationnumber,
            email: responseCustomers.data.email,
          });
        } catch (error) {
          console.error('Có lỗi xảy ra khi lấy thông tin khách hàng:', error);
        }
      };
      fetchCustomerByUsername();
    }
  }, []);

  const onSubmit = async (data) => {
    try {
      if (selectedRooms.length === 0) {
        toast.error('Bạn chưa chọn phòng. Vui lòng chọn phòng trước khi đặt!');
        return;
      }
  
      const storedRooms = JSON.parse(localStorage.getItem('selectedRooms')) || [];
      const roomIds = storedRooms.map(room => room.id);
  
      const allRoomsResponse = await axios.get('http://localhost:8080/rooms/getAll');
      const allRooms = allRoomsResponse.data;
  
      const unavailableRooms = allRooms.filter(room => 
        roomIds.includes(room.id) && room.roomStatus.id !== 1
      );
  
      if (unavailableRooms.length > 0) {
        const unavailableRoomNumbers = unavailableRooms.map(room => room.roomNumber).join(', ');
        toast.error(`Các phòng sau không thể đặt: ${unavailableRoomNumbers}. Vui lòng chọn phòng khác!`);
        return;
      }

      if(customerId){
        console.log(customerId)
        let bookingData = {
          customer: { id: customerId || undefined },
          bookingStatus: { id: 1 },
          checkInDate: new Date(data.checkIn).toISOString().split('T')[0],
          checkOutDate: new Date(data.checkOut).toISOString().split('T')[0],
          totalAmount: totalAmount,
          email: data.email
        };

        const bookingResponse = await axios.post('http://localhost:8080/bookings/create', bookingData);
          await addBookingDetails(bookingResponse.data.id);
          toast.success('Đặt phòng thành công!');
    
          reset();
          localStorage.removeItem('selectedRooms');
          setSelectedRooms([]);
      }

      else{
        const existingCustomer = customers.find(customer => customer.identificationnumber === data.identityCard);
        let customerid;
    
        if (existingCustomer) {
          customerid = existingCustomer.id;
    
          const bookingData = {
            customer: { id: customerid },
            bookingStatus: { id: 1 },
            checkInDate: new Date(data.checkIn).toISOString().split('T')[0],
            checkOutDate: new Date(data.checkOut).toISOString().split('T')[0],
            totalAmount: totalAmount,
            email: data.email
          };
    
          const bookingResponse = await axios.post('http://localhost:8080/bookings/create', bookingData);
          await addBookingDetails(bookingResponse.data.id);
          toast.success('Đặt phòng thành công!');
    
          reset();
          localStorage.removeItem('selectedRooms');
          setSelectedRooms([]);
    
        } else {
          const existingEmail = customers.find(customer => customer.email === data.email);
          
          if (existingEmail) {
            toast.error('Email đã được sử dụng. Vui lòng nhập email khác!');
            return;
          }
    
          const newCustomerData = {
            name: data.customerName,
            birthday: data.dob,
            phone: data.phone,
            address: data.address,
            identificationnumber: data.identityCard,
            email: data.email
          };
    
          const newCustomerResponse = await axios.post('http://localhost:8080/customers/create', newCustomerData);
          customerid = newCustomerResponse.data.id;
    
          const bookingData = {
            customer: { id: customerid },
            bookingStatus: { id: 1 },
            checkInDate: new Date(data.checkIn).toISOString().split('T')[0],
            checkOutDate: new Date(data.checkOut).toISOString().split('T')[0],
            totalAmount: totalAmount,
            email: data.email
          };
    
          console.log("Booking Data for new customer:", bookingData);
    
          const bookingResponse = await axios.post('http://localhost:8080/bookings/create', bookingData);
          await addBookingDetails(bookingResponse.data.id);
          toast.success('Đặt phòng thành công và khách hàng đã được thêm vào hệ thống!');
    
          reset();
          localStorage.removeItem('selectedRooms');
          setSelectedRooms([]);
        }
      }
    } catch (error) {
      console.error('Có lỗi xảy ra khi đặt phòng:', error);
      toast.error('Có lỗi xảy ra. Vui lòng thử lại!');
    }
  };  
    
  const addBookingDetails = async (bookingId) => {
    const jwt = localStorage.getItem("jwt");
    try {
      for (const room of selectedRooms) {
        const bookingDetailData = {
          booking: { id: bookingId },
          room: { id: room.id },
        };
  
        await axios.post('http://localhost:8080/bookingdetails/create', bookingDetailData);
  
        await axios.put(`http://localhost:8080/rooms/updateStatus/${room.id}`, null);
      }
    } catch (error) {
      console.error('Có lỗi xảy ra khi thêm chi tiết booking:', error);
      toast.error('Có lỗi xảy ra khi thêm chi tiết booking.');
    }
  };

  const calculateTotalAmount = () => {
    if (!checkInDate || !checkOutDate) {
      setTotalAmount(0);
      return;
    }

    const dailyRate = selectedRooms.reduce((total, room) => total + room.price, 0);
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
      setTotalAmount(0);
      return;
    }

    const timeDiff = checkOut - checkIn;
    const days = Math.ceil(timeDiff / (1000 * 3600 * 24));
    setTotalAmount(days * dailyRate);
  };

  const removeRoom = (roomId) => {
    const updatedRooms = selectedRooms.filter(room => room.id !== roomId);
    setSelectedRooms(updatedRooms);
    localStorage.setItem('selectedRooms', JSON.stringify(updatedRooms));
    toast.info('Phòng đã được xóa khỏi danh sách.');
  };

  useEffect(() => {
    const storedRooms = localStorage.getItem('selectedRooms');
    if (storedRooms) {
      setSelectedRooms(JSON.parse(storedRooms));
    }
  }, []);

  return (
    <div className="container">
      <h2 className="text-center mt-4">Đặt Phòng</h2>
      <div className="row mt-4 mb-5">
        <div className="col-md-6">
          <form onSubmit={handleSubmit(onSubmit)} className="p-4 border rounded shadow bg-light">
          {!customerId && (
            <>
            <div className="form-group mb-3">
              <label htmlFor="customerName" className="font-weight-bold">Tên Khách Hàng</label>
              <input
                type="text"
                className="form-control"
                id="customerName"
                {...register('customerName', {
                  required: 'Tên khách hàng là bắt buộc',
                  validate: {
                    noEmptyString: value => value.trim() !== '' || 'Không được để trống hoặc chỉ chứa khoảng trắng',
                    noSpecialChars: value => /^[A-Za-zÀ-Ỹ\s]+$/.test(value.trim()) || 'Tên chỉ được chứa chữ cái, dấu tiếng Việt và khoảng trắng'
                  }
                })}
              />
              {errors.customerName && <span className="text-danger">{errors.customerName.message}</span>}
            </div>

            <div className="form-group mb-3">
              <label htmlFor="dob" className="font-weight-bold">Ngày Sinh</label>
              <input
                type="date"
                className="form-control"
                id="dob"
                {...register('dob', {
                  required: 'Ngày sinh là bắt buộc',
                  validate: {
                    noEmptyString: value => value.trim() !== '' || 'Không được để trống hoặc chỉ chứa khoảng trắng',
                    isAdult: value => {
                      const dob = new Date(value);
                      const today = new Date();
                      const age = today.getFullYear() - dob.getFullYear();
                      return age >= 18 && dob <= today || 'Bạn phải ít nhất 18 tuổi';
                    }
                  }
                })}
              />
              {errors.dob && <span className="text-danger">{errors.dob.message}</span>}
            </div>

            <div className="form-group mb-3">
              <label htmlFor="phone" className="font-weight-bold">Số Điện Thoại</label>
              <input
                type="tel"
                className="form-control"
                id="phone"
                {...register('phone', {
                  required: 'Số điện thoại là bắt buộc',
                  noEmptyString: value => value.trim() !== '' || 'Không được để trống hoặc chỉ chứa khoảng trắng',
                  pattern: {
                    value: /^[0-9]{10,12}$/,
                    message: 'Số điện thoại phải là số và từ 10 đến 12 số'
                  }
                })}
              />
              {errors.phone && <span className="text-danger">{errors.phone.message}</span>}
            </div>

            <div className="form-group mb-3">
              <label htmlFor="address" className="font-weight-bold">Địa Chỉ</label>
              <input
                type="text"
                className="form-control"
                id="address"
                {...register('address', { required: 'Địa chỉ là bắt buộc', noEmptyString: value => value.trim() !== '' || 'Không được để trống hoặc chỉ chứa khoảng trắng'})}
              />
              {errors.address && <span className="text-danger">{errors.address.message}</span>}
            </div>

            <div className="form-group mb-3">
              <label htmlFor="identityCard" className="font-weight-bold">Số CCCD</label>
              <input
                type="text"
                className="form-control"
                id="identityCard"
                {...register('identityCard', {
                  required: 'Số CCCD là bắt buộc',
                  noEmptyString: value => value.trim() !== '' || 'Không được để trống hoặc chỉ chứa khoảng trắng',
                  pattern: {
                    value: /^[0-9]{12}$/,
                    message: 'Số CCCD phải là 12 số'
                  }
                })}
              />
              {errors.identityCard && <span className="text-danger">{errors.identityCard.message}</span>}
            </div>

            <div className="form-group mb-3">
              <label htmlFor="email" className="font-weight-bold">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                {...register('email', {
                  required: 'Email là bắt buộc',
                  noEmptyString: value => value.trim() !== '' || 'Không được để trống hoặc chỉ chứa khoảng trắng',
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: 'Email không hợp lệ'
                  }
                })}
              />
              {errors.email && <span className="text-danger">{errors.email.message}</span>}
            </div>
            </>
            )}
            <div className="form-group mb-3">
              <label htmlFor="checkIn" className="font-weight-bold">Ngày Nhận Phòng</label>
              <input
                type="date"
                className="form-control"
                id="checkIn"
                {...register('checkIn', {
                  required: 'Ngày nhận phòng là bắt buộc',
                  validate: {
                    isFutureDate: value => {
                      const today = new Date();
                      const checkInDate = new Date(value);
                      return checkInDate > today || 'Ngày nhận phòng phải sau ngày hôm nay';
                    }
                  }
                })}
              />
              {errors.checkIn && <span className="text-danger">{errors.checkIn.message}</span>}
            </div>

            <div className="form-group mb-3">
              <label htmlFor="checkOut" className="font-weight-bold">Ngày Trả Phòng</label>
              <input
                type="date"
                className="form-control"
                id="checkOut"
                {...register('checkOut', {
                  required: 'Ngày trả phòng là bắt buộc',
                  validate: {
                    isAfterCheckIn: value => {
                      const checkOutDate = new Date(value);
                      const checkInDate = new Date(watch("checkIn"));
                      return checkOutDate > checkInDate || 'Ngày trả phòng phải sau ngày nhận phòng';
                    }
                  }
                })}
              />
              {errors.checkOut && <span className="text-danger">{errors.checkOut.message}</span>}
            </div>

            <div className='d-flex justify-content-center'>
              <button type="submit" className="btn btn-success mt-4">Đặt Phòng</button>
            </div>
          </form>
        </div>

        <div className="col-md-6">
          <div className="p-4 border rounded shadow bg-light">
            <h4 className="mt-4 mb-4 d-flex justify-content-center">Các Phòng Đã Chọn</h4>
            <ul className="list-group">
              {selectedRooms.map(room => (
                <li key={room.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <strong className='text-primary'>Phòng {room.roomNumber}</strong>
                    <br />
                    <span>Loại: {room.roomType.name}</span>
                    <br />
                    <span>Giá: {room.price.toLocaleString('vi-VN')} VND</span>
                  </div>
                  <button 
                    className="btn btn-danger btn-sm"
                    onClick={() => removeRoom(room.id)}
                    aria-label="Xóa phòng"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-3 d-flex justify-content-end">
              <strong className='text-success'>Tổng thành tiền: {totalAmount.toLocaleString('vi-VN')} VND</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
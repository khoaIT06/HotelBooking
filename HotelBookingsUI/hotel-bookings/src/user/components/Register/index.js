import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const { register, handleSubmit, setError, formState: { errors } } = useForm();
  const [customers, setCustomers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get('http://localhost:8080/customers/getAll');
        setCustomers(response.data);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };

    const fetchAccounts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/accounts/getAll');
        setAccounts(response.data);
      } catch (error) {
        console.error('Error fetching accounts:', error);
      }
    };

    fetchCustomers();
    fetchAccounts();
  }, []);

  const onSubmit = async (data) => {
    const { username, password, confirmPassword, name, birthday, phone, address, identificationNumber, email } = data;

    if (password !== confirmPassword) {
      setError('confirmPassword', { type: 'manual', message: 'Mật khẩu không khớp!' });
      return;
    }

    if (accounts.some(account => account.username === username)) {
      setError('username', { type: 'manual', message: 'Tên đăng nhập đã tồn tại!' });
      return;
    }

    if (customers.some(customer => customer.identificationnumber === identificationNumber)) {
      setError('identificationNumber', { type: 'manual', message: 'Số CCCD đã tồn tại!' });
      return;
    }

    if (customers.some(customer => customer.email === email)) {
      setError('email', { type: 'manual', message: 'Email đã tồn tại!' });
      return;
    }

    try {
      await axios.post('http://localhost:8080/api/register', {
        username,
        password,
        name,
        birthday,
        phone,
        address,
        identificationNumber,
        email,
      });

      toast.success('Đăng ký thành công!', {
        position: 'top-right',
        autoClose: 2000, 
        onClose: () => navigate('/login'), 
      });
    } catch (error) {
      console.error('Registration failed', error);
      toast.error('Đăng ký không thành công!', {
        position: 'top-right',
        autoClose: 2000,
      });
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <h2 className="text-center mb-4">Đăng Ký Tài Khoản</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="p-4 border rounded shadow bg-light mb-5">
            
            <div className="row">
              <div className="form-group col-md-6 mb-3">
                <label htmlFor="username" className="font-weight-bold">Tên Đăng Nhập</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nhập tên đăng nhập"
                  id="username"
                  {...register('username', { 
                    required: 'Tên đăng nhập là bắt buộc',
                    validate: {
                      noEmptyString: value => value.trim() !== '' || 'Không được để trống hoặc chỉ chứa khoảng trắng',
                      noSpecialChars: value => /^[A-Za-z0-9]+$/.test(value.trim()) || 'Tên đăng nhập chỉ được chứa chữ cái và số'
                    }
                  })}
                />
                {errors.username && <span className="text-danger">{errors.username.message}</span>}
              </div>

              <div className="form-group col-md-6 mb-3">
                <label htmlFor="password" className="font-weight-bold">Mật Khẩu</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Nhập mật khẩu"
                  id="password"
                  {...register('password', { required: 'Mật khẩu là bắt buộc', minLength: 8, maxLength: 32 })}
                />
                {errors.password && <span className="text-danger">Mật khẩu phải từ 8 đến 32 ký tự!</span>}
              </div>
            </div>

            <div className="row">
              <div className="form-group col-md-6 mb-3">
                <label htmlFor="confirmPassword" className="font-weight-bold">Xác Nhận Mật Khẩu</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Nhập lại mật khẩu"
                  id="confirmPassword"
                  {...register('confirmPassword', { required: 'Xác nhận mật khẩu là bắt buộc' })}
                />
                {errors.confirmPassword && <span className="text-danger">{errors.confirmPassword.message}</span>}
              </div>

              <div className="form-group col-md-6 mb-3">
                <label htmlFor="name" className="font-weight-bold">Họ và Tên</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nhập họ và tên"
                  id="name"
                  {...register('name', { 
                    required: 'Tên khách hàng là bắt buộc',
                    validate: {
                      noEmptyString: value => value.trim() !== '' || 'Không được để trống hoặc chỉ chứa khoảng trắng',
                      noSpecialChars: value => /^[A-Za-zÀ-Ỹ\s]+$/.test(value.trim()) || 'Tên chỉ được chứa chữ cái, dấu tiếng Việt và khoảng trắng'
                    } 
                  })}
                />
                {errors.name && <span className="text-danger">{errors.name.message}</span>}
              </div>
            </div>

            <div className="row">
              <div className="form-group col-md-6 mb-3">
                <label htmlFor="birthday" className="font-weight-bold">Ngày Sinh</label>
                <input
                  type="date"
                  className="form-control"
                  id="birthday"
                  {...register('birthday', {
                    required: 'Ngày sinh là bắt buộc',
                    validate: {
                      isAdult: value => {
                        const dob = new Date(value);
                        const today = new Date();
                        const age = today.getFullYear() - dob.getFullYear();
                        return age >= 18 || 'Bạn phải ít nhất 18 tuổi';
                      }
                    }
                  })}
                />
                {errors.birthday && <span className="text-danger">{errors.birthday.message}</span>}
              </div>

              <div className="form-group col-md-6 mb-3">
                <label htmlFor="identificationNumber" className="font-weight-bold">Số CCCD</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nhập số CCCD"
                  id="identificationNumber"
                  {...register('identificationNumber', {
                    required: 'Số CCCD là bắt buộc',
                    pattern: { value: /^[0-9]{12}$/, message: 'Số CCCD phải là 12 số' }
                  })}
                />
                {errors.identificationNumber && <span className="text-danger">{errors.identificationNumber.message}</span>}
              </div>
            </div>

            <div className="row">
              <div className="form-group col-md-6 mb-3">
                <label htmlFor="email" className="font-weight-bold">Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Nhập email"
                  id="email"
                  {...register('email', {
                    required: 'Email là bắt buộc',
                    pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: 'Email không hợp lệ' }
                  })}
                />
                {errors.email && <span className="text-danger">{errors.email.message}</span>}
              </div>

              <div className="form-group col-md-6 mb-3">
                <label htmlFor="phone" className="font-weight-bold">Điện Thoại</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nhập số điện thoại"
                  id="phone"
                  {...register('phone', {
                    required: 'Số điện thoại là bắt buộc',
                    pattern: { value: /^[0-9]{10}$/, message: 'Số điện thoại phải là 10 số' }
                  })}
                />
                {errors.phone && <span className="text-danger">{errors.phone.message}</span>}
              </div>
            </div>

            <div className="row">
              <div className="form-group col-md-12 mb-3">
                <label htmlFor="address" className="font-weight-bold">Địa Chỉ</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nhập địa chỉ"
                  id="address"
                  {...register('address', { required: 'Địa chỉ là bắt buộc' })}
                />
                {errors.address && <span className="text-danger">{errors.address.message}</span>}
              </div>
            </div>

            <button type="submit" className="btn btn-success w-100">Đăng Ký</button>
          </form>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Register;
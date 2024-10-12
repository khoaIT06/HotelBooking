import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Form, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';

const Profile = () => {
    const [customer, setCustomer] = useState(null);
    const [customers, setCustomers] = useState([]);
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();

    useEffect(() => {
        const fetchCustomer = async () => {
            try {
                const username = localStorage.getItem('username');
                const response = await axios.get(`http://localhost:8080/accounts/getByUsername/${username}`);
                const responseCustomer = await axios.get(`http://localhost:8080/customers/getById/${response.data.customerId}`);
                
                setCustomer(responseCustomer.data);

                const allCustomersResponse = await axios.get('http://localhost:8080/customers/getAll');
                setCustomers(allCustomersResponse.data);

                setValue('name', responseCustomer.data.name);
                setValue('birthday', responseCustomer.data.birthday);
                setValue('phone', responseCustomer.data.phone);
                setValue('address', responseCustomer.data.address);
                setValue('identificationnumber', responseCustomer.data.identificationnumber);
                setValue('email', responseCustomer.data.email);
            } catch (error) {
                console.error('Error fetching customer:', error);
                toast.error('Không thể lấy thông tin khách hàng.');
            }
        };
        fetchCustomer();
    }, [setValue]);

    const onSubmit = async (data) => {
        const isDuplicateCCCD = customers.some(c => c.identificationnumber === data.identificationnumber && c.id !== customer.id);
        const isDuplicateEmail = customers.some(c => c.email === data.email && c.id !== customer.id);

        if (isDuplicateCCCD) {
            toast.error('Số CCCD đã tồn tại');
            return;
        }

        if (isDuplicateEmail) {
            toast.error('Email đã tồn tại');
            return;
        }

        try {
            const token = localStorage.getItem('jwt');
            await axios.put(`http://localhost:8080/customers/update/${customer.id}`, data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            toast.success('Cập nhật thông tin thành công!');
        } catch (error) {
            console.error('Error updating customer:', error);
            toast.error('Cập nhật thông tin không thành công.');
        }
    };

    return (
        <div className="container mt-5">
            <Row className="justify-content-center">
                <Col md={6} className="">
                    <h2 className="text-center mb-4">Thông Tin Cá Nhân</h2>
                    {customer && (
                        <Form onSubmit={handleSubmit(onSubmit)} className="border p-4 shadow-sm rounded mb-5">
                            <Form.Group controlId="formName">
                                <Form.Label>Tên</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    {...register('name', { 
                                        required: 'Tên là bắt buộc',
                                        validate: {
                                            noEmptyString: value => value.trim() !== '' || 'Không được để trống hoặc chỉ chứa khoảng trắng',
                                            noSpecialChars: value => /^[A-Za-zÀ-Ỹ\s]+$/.test(value.trim()) || 'Tên chỉ được chứa chữ cái, dấu tiếng Việt và khoảng trắng'
                                        }
                                    })}
                                    isInvalid={!!errors.name} 
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.name?.message}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group controlId="formBirthday">
                                <Form.Label>Ngày Sinh</Form.Label>
                                <Form.Control 
                                    type="date" 
                                    {...register('birthday', { 
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
                                    isInvalid={!!errors.birthday} 
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.birthday?.message}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group controlId="formPhone">
                                <Form.Label>Số Điện Thoại</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    {...register('phone', { 
                                        required: 'Số điện thoại là bắt buộc',
                                        noEmptyString: value => value.trim() !== '' || 'Không được để trống hoặc chỉ chứa khoảng trắng',
                                        pattern: {
                                            value: /^[0-9]{10,12}$/,
                                            message: 'Số điện thoại phải là số và từ 10 đến 12 số'
                                        }
                                    })}
                                    isInvalid={!!errors.phone} 
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.phone?.message}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group controlId="formAddress">
                                <Form.Label>Địa Chỉ</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    {...register('address', { required: 'Địa chỉ là bắt buộc', noEmptyString: value => value.trim() !== '' || 'Không được để trống hoặc chỉ chứa khoảng trắng' })}
                                    isInvalid={!!errors.address} 
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.address?.message}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group controlId="formIdentificationNumber">
                                <Form.Label>Số CCCD</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    {...register('identificationnumber', { 
                                        required: 'Số CCCD là bắt buộc',
                                        noEmptyString: value => value.trim() !== '' || 'Không được để trống hoặc chỉ chứa khoảng trắng',
                                        pattern: {
                                            value: /^[0-9]{12}$/,
                                            message: 'Số CCCD phải là 12 số'
                                        }
                                    })}
                                    isInvalid={!!errors.identificationnumber} 
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.identificationnumber?.message}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group controlId="formEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control 
                                    type="email" 
                                    {...register('email', { 
                                        required: 'Email là bắt buộc',
                                        noEmptyString: value => value.trim() !== '' || 'Không được để trống hoặc chỉ chứa khoảng trắng',
                                        pattern: {
                                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                            message: 'Email không hợp lệ'
                                        }
                                    })}
                                    isInvalid={!!errors.email} 
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.email?.message}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Button variant="primary" type="submit" className="w-100 mt-4">
                                Cập Nhật
                            </Button>
                        </Form>
                    )}
                </Col>
            </Row>
        </div>
    );
};

export default Profile;
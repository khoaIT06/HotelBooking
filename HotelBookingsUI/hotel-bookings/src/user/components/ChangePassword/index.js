import React, { useState } from 'react';
import axios from 'axios';
import { Button, Form, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';

const ChangePassword = () => {
    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        if (data.newPassword !== data.confirmNewPassword) {
            toast.error('Mật khẩu mới và xác nhận mật khẩu không khớp.');
            return;
        }
    
        try {
            const username = localStorage.getItem('username');
            const token = localStorage.getItem('jwt');

            const isPasswordMatchResponse = await axios.post(
                'http://localhost:8080/accounts/checkPassword',
                { username, oldPassword: data.oldPassword },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (!isPasswordMatchResponse.data) {
                toast.error('Mật khẩu cũ không đúng.');
                return;
            }

            setLoading(true);
            const updateResponse = await axios.put(
                'http://localhost:8080/accounts/updatePassword',
                { 
                    newPassword: data.newPassword,
                    username,
                    oldPassword: data.oldPassword,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (updateResponse.status === 200) {
                toast.success('Đổi mật khẩu thành công!');
            } 
            else {
                toast.error('Có lỗi xảy ra khi đổi mật khẩu.');
            }
        } catch (error) {
            if (error.response) {
            toast.error(error.response.data);
        } else if (error.request) {
            toast.error("Không nhận được phản hồi từ server");
        } else {
            toast.error("Đã xảy ra lỗi: " + error.message);
        }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <Row className="justify-content-center">
                <Col md={6}>
                    <h2 className="text-center mb-4">Đổi Mật Khẩu</h2>
                    <Form onSubmit={handleSubmit(onSubmit)} className="border p-4 shadow-sm rounded mb-5">
                        <Form.Group controlId="formOldPassword">
                            <Form.Label>Mật Khẩu Cũ</Form.Label>
                            <Form.Control 
                                type="password" 
                                {...register('oldPassword', { required: 'Mật khẩu cũ là bắt buộc' })} 
                                isInvalid={!!errors.oldPassword}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.oldPassword?.message}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="formNewPassword">
                            <Form.Label>Mật Khẩu Mới</Form.Label>
                            <Form.Control 
                                type="password" 
                                {...register('newPassword', { 
                                    required: 'Mật khẩu mới là bắt buộc',
                                    minLength: {
                                        value: 6,
                                        message: 'Mật khẩu mới phải ít nhất 6 ký tự'
                                    }
                                })} 
                                isInvalid={!!errors.newPassword}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.newPassword?.message}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="formConfirmNewPassword">
                            <Form.Label>Xác Nhận Mật Khẩu Mới</Form.Label>
                            <Form.Control 
                                type="password" 
                                {...register('confirmNewPassword', { 
                                    required: 'Xác nhận mật khẩu mới là bắt buộc',
                                    validate: value => value === watch('newPassword') || 'Mật khẩu xác nhận không khớp'
                                })} 
                                isInvalid={!!errors.confirmNewPassword}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.confirmNewPassword?.message}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Button variant="primary" type="submit" className="w-100 mt-4" disabled={loading}>
                            {loading ? 'Đang xử lý...' : 'Đổi Mật Khẩu'}
                        </Button>
                    </Form>
                </Col>
            </Row>
        </div>
    );
};

export default ChangePassword;

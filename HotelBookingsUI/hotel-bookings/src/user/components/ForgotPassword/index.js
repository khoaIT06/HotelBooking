    import React, { useState } from 'react';
    import axios from 'axios';
    import { Button, Form, Row, Col } from 'react-bootstrap';
    import { toast, ToastContainer } from 'react-toastify';
    import emailjs from 'emailjs-com';
    import 'react-toastify/dist/ReactToastify.css';

    const ForgotPassword = () => {
        const [email, setEmail] = useState('');
        const [newPassword, setNewPassword] = useState('');
        const [confirmNewPassword, setConfirmNewPassword] = useState('');
        const [verificationCode, setVerificationCode] = useState('');
        const [loading, setLoading] = useState(false);

        const sendVerificationCode = async () => {
            const code = Math.floor(100000 + Math.random() * 900000).toString();

            const templateParams = {
                to_email: email,
                code: code
            };

            try {
                await axios.post('http://localhost:8080/accounts/sendVerificationCode', { code });
                await emailjs.send('service_mhhrooj', 'template_gfdjtmh', templateParams, 'pWXGV9JKOksOMCINW');
                toast.success('Mã xác nhận đã được gửi đến email của bạn!');
            } catch (error) {
                toast.error('Không thể gửi mã xác nhận. Vui lòng thử lại.');
                console.log(error)
            }
        };

        const handleSubmit = async (e) => {
            e.preventDefault();

            if (newPassword.length < 8 || newPassword.length > 32) {
                toast.error('Mật khẩu mới phải từ 8 đến 32 ký tự.');
                return;
            }

            if (newPassword !== confirmNewPassword) {
                toast.error('Mật khẩu mới và xác nhận mật khẩu không khớp.');
                return;
            }

            const requestPayload = {
                email: email,
                newPassword: newPassword,
                verificationCode: verificationCode
            };

            setLoading(true);
            try {
                const response = await axios.put(
                    'http://localhost:8080/accounts/resetPassword',
                    requestPayload
                );

                if (response.status === 200) {
                    toast.success('Mật khẩu đã được khôi phục thành công!');
                } else {
                    toast.error('Có lỗi xảy ra khi khôi phục mật khẩu.');
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
                        <h2 className="text-center mb-4">Quên Mật Khẩu</h2>
                        <Form onSubmit={handleSubmit} className="border p-4 shadow-sm rounded mb-5">
                            <Form.Group controlId="formEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Button 
                                variant="primary" 
                                onClick={sendVerificationCode} 
                                className="mt-2"
                                disabled={!email}
                            >
                                Gửi Mã Xác Nhận
                            </Button>

                            <Form.Group controlId="formNewPassword" className="mt-4">
                                <Form.Label>Mật Khẩu Mới</Form.Label>
                                <Form.Control
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    minLength={6}
                                />
                            </Form.Group>

                            <Form.Group controlId="formConfirmNewPassword" className="mt-4">
                                <Form.Label>Xác Nhận Mật Khẩu Mới</Form.Label>
                                <Form.Control
                                    type="password"
                                    value={confirmNewPassword}
                                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId="formVerificationCode" className="mt-4">
                                <Form.Label>Mã Xác Nhận</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Button variant="primary" type="submit" className="w-100 mt-4" disabled={loading}>
                                {loading ? 'Đang xử lý...' : 'Khôi Phục Mật Khẩu'}
                            </Button>
                        </Form>
                    </Col>
                </Row>
                <ToastContainer />
            </div>
        );
    };

    export default ForgotPassword;

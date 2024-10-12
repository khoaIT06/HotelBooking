import React, { useState } from 'react';
import axios from 'axios';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/login', { username, password });

      localStorage.setItem('jwt', response.data.jwt);
      localStorage.setItem('username', username);
      localStorage.setItem('role', response.data.role);

      toast.success('Đăng nhập thành công!', {
        position: 'top-right',
        autoClose: 2000,
        onClose: () => {
          if (response.data.role === 'Admin') {
            navigate('/admin/dashboard');
          } else {
            navigate('/');
          }
          window.location.reload();
        }
      });
    } catch (error) {
      console.error('Login failed', error);
      toast.error('Tên đăng nhập hoặc mật khẩu không chính xác!', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <h2 className="text-center mb-4">Đăng Nhập</h2>
          <Form onSubmit={handleLogin} className="p-4 border rounded shadow bg-light mb-5">
            <Form.Group controlId="formUsername" className="mb-3">
              <Form.Label className="font-weight-bold">Tên đăng nhập</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập tên đăng nhập"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formPassword" className="mb-3">
              <Form.Label className="font-weight-bold">Mật khẩu</Form.Label>
              <Form.Control
                type="password"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Form.Text className="text-muted d-flex justify-content-end">
                <Link to="/forgotpassword" className="text-decoration-none">Quên mật khẩu?</Link>
              </Form.Text>
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              Đăng Nhập
            </Button>

            <div className="mt-3 text-center">
              <span>Bạn chưa có tài khoản? </span>
              <Link to="/register" className="text-decoration-none">Đăng ký</Link>
            </div>
          </Form>
        </Col>
      </Row>
      <ToastContainer />
    </Container>
  );
};

export default Login;
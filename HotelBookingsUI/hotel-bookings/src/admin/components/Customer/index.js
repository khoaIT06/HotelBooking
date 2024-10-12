import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Modal, Button, Form, Table } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons';

const Customer = () => {
    const [customers, setCustomers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCustomer, setSelectedCustomer] = useState({
        name: "",
        birthday: "",
        phone: "",
        address: "",
        identificationnumber: "",
        email: "",
    });
    const [editingId, setEditingId] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const jwt = localStorage.getItem("jwt");

    const fetchCustomers = async () => {
        try {
            const response = await axios.get("http://localhost:8080/customers/getAll", {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            setCustomers(response.data);
        } catch (error) {
            console.error("Error fetching customers:", error);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa khách hàng này?")) {
            try {
                const response = await axios.get(`http://localhost:8080/accounts/findByCustomerId/${id}`, {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                });
    
                if (response.status === 200 && response.data.length > 0) {
                    await axios.delete(`http://localhost:8080/accounts/deleteByCustomerId/${id}`, {
                        headers: {
                            Authorization: `Bearer ${jwt}`,
                        },
                    });
                }
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    console.log(`Tài khoản không tìm thấy cho customerId: ${id}. Tiếp tục...`);
                } else {
                    toast.error("Đã xảy ra lỗi khi kiểm tra tài khoản!");
                    console.error("Error checking account:", error);
                }
            }
    
            try {
                await axios.delete(`http://localhost:8080/customers/delete/${id}`, {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                });
    
                toast.success("Xóa khách hàng thành công!");
                fetchCustomers();
            } catch (error) {
                toast.error("Đã xảy ra lỗi khi xóa khách hàng!");
                console.error("Error deleting customer:", error);
            }
        }
    };        

    const handleEdit = (customer) => {
        setSelectedCustomer(customer);
        setEditingId(customer.id);
        setShowModal(true);
    };

    const handleAdd = () => {
        setSelectedCustomer({ name: "", birthday: "", phone: "", address: "", identificationnumber: "", email: "" });
        setEditingId(null);
        setShowModal(true);
    };

    const handleSave = async () => {
        const nameRegex = /^[a-zA-ZÀ-ỹ\s]+$/;
        const phoneRegex = /^[0-9]{10,12}$/;
        const cccdRegex = /^[0-9]{12}$/;
    
        if (!selectedCustomer.name.trim() || !selectedCustomer.birthday || !selectedCustomer.phone.trim() || !selectedCustomer.address.trim() || !selectedCustomer.identificationnumber.trim() || !selectedCustomer.email.trim()) {
            toast.error("Vui lòng điền tất cả các trường!");
            return;
        }
    
        if (!nameRegex.test(selectedCustomer.name.trim())) {
            toast.error("Tên chỉ được chứa chữ cái và dấu cách!");
            return;
        }
    
        const today = new Date();
        const birthDate = new Date(selectedCustomer.birthday);
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        if (age < 18) {
            toast.error("Khách hàng phải đủ 18 tuổi!");
            return;
        }
    
        if (!phoneRegex.test(selectedCustomer.phone.trim())) {
            toast.error("Số điện thoại phải chứa từ 10 đến 12 chữ số!");
            return;
        }
    
        if (!cccdRegex.test(selectedCustomer.identificationnumber.trim())) {
            toast.error("Số CCCD phải gồm 12 số!");
            return;
        }
    
        const cccdExists = customers.some(customer => customer.identificationnumber === selectedCustomer.identificationnumber && customer.id !== editingId);
        if (cccdExists) {
            toast.error("Số CCCD đã tồn tại trong hệ thống!");
            return;
        }
    
        const emailExists = customers.some(customer => customer.email === selectedCustomer.email && customer.id !== editingId);
        if (emailExists) {
            toast.error("Email đã tồn tại trong hệ thống!");
            return;
        }
    
        try {
            if (editingId) {
                await axios.put(`http://localhost:8080/customers/update/${editingId}`, selectedCustomer, {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                });
                toast.success("Cập nhật khách hàng thành công!");
            } else {
                await axios.post("http://localhost:8080/customers/create", selectedCustomer, {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                });
                toast.success("Thêm khách hàng thành công!");
            }
            fetchCustomers();
            setShowModal(false);
        } catch (error) {
            toast.error("Đã xảy ra lỗi!");
            console.error("Error saving customer:", error);
        }
    };
    

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredCustomers = customers.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.birthday.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.identificationnumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container">
            <h2>Quản lý khách hàng</h2>
            <input
                type="text"
                className="form-control mb-3"
                placeholder="Tìm kiếm khách hàng..."
                value={searchTerm}
                onChange={handleSearch}
            />
            <Button className="btn btn-success" onClick={handleAdd}>
                <FontAwesomeIcon icon={faPlus} /> Thêm khách hàng
            </Button>

            <Table striped bordered hover className="mt-3">
                <thead>
                    <tr>
                        <th>Tên khách hàng</th>
                        <th>Ngày sinh</th>
                        <th>Số điện thoại</th>
                        <th>Địa chỉ</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredCustomers.length > 0 ? (
                        filteredCustomers.map((customer) => (
                            <tr key={customer.id}>
                                <td>{customer.name}</td>
                                <td>{customer.birthday}</td>
                                <td>{customer.phone}</td>
                                <td>{customer.address}</td>
                                <td>
                                    <Button variant="warning" className="mx-2" onClick={() => handleEdit(customer)}>
                                        <FontAwesomeIcon icon={faEdit} /> Sửa
                                    </Button>
                                    <Button variant="danger" onClick={() => handleDelete(customer.id)}>
                                        <FontAwesomeIcon icon={faTrashAlt} /> Xóa
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center">Không tìm thấy khách hàng</td>
                        </tr>
                    )}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{editingId ? "Sửa khách hàng" : "Thêm khách hàng"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formCustomerName">
                            <Form.Label>Tên khách hàng</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nhập tên khách hàng"
                                value={selectedCustomer.name}
                                onChange={(e) => setSelectedCustomer(prev => ({ ...prev, name: e.target.value }))}
                            />
                        </Form.Group>
                        <Form.Group controlId="formBirthDay">
                            <Form.Label>Ngày sinh</Form.Label>
                            <Form.Control
                                type="date"
                                placeholder="Nhập ngày sinh"
                                value={selectedCustomer.birthday}
                                onChange={(e) => setSelectedCustomer(prev => ({ ...prev, birthday: e.target.value }))}
                            />
                        </Form.Group>
                        <Form.Group controlId="formPhone">
                            <Form.Label>Số điện thoại</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nhập số điện thoại"
                                value={selectedCustomer.phone}
                                onChange={(e) => setSelectedCustomer(prev => ({ ...prev, phone: e.target.value }))}
                            />
                        </Form.Group>
                        <Form.Group controlId="formAddress">
                            <Form.Label>Địa chỉ</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nhập địa chỉ"
                                value={selectedCustomer.address}
                                onChange={(e) => setSelectedCustomer(prev => ({ ...prev, address: e.target.value }))}
                            />
                        </Form.Group>
                        <Form.Group controlId="formIdentificationNumber">
                            <Form.Label>Số CCCD</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nhập số CCCD"
                                value={selectedCustomer.identificationnumber}
                                onChange={(e) => setSelectedCustomer(prev => ({ ...prev, identificationnumber: e.target.value }))}
                            />
                        </Form.Group>
                        <Form.Group controlId="formEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Nhập email"
                                value={selectedCustomer.email}
                                onChange={(e) => setSelectedCustomer(prev => ({ ...prev, email: e.target.value }))}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                        {editingId ? "Cập nhật" : "Thêm"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Customer;
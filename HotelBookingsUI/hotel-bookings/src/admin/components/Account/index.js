import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Form, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { Col, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const Account = () => {
    const [accounts, setAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleId, setRoleId] = useState('');
    const [customerNames, setCustomerNames] = useState({});
    const [roles, setRoles] = useState([]);
    const jwt = localStorage.getItem("jwt");

    const fetchAccounts = async () => {
        try {
            const response = await axios.get('http://localhost:8080/accounts/getAll', {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            setAccounts(response.data);
            fetchCustomerNames(response.data);
        } catch (error) {
            toast.error('Không thể tải danh sách tài khoản!');
            console.error('Error fetching accounts:', error);
        }
    };

    const fetchCustomerNames = async (accounts) => {
        const customerIdSet = new Set(accounts.map(account => account.customerId));
        const customerNamesMap = {};

        for (const customerId of customerIdSet) {
            try {
                const response = await axios.get(`http://localhost:8080/customers/getById/${customerId}`, {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                });
                customerNamesMap[customerId] = response.data.name;
            } catch (error) {
                console.error(`Error fetching customer with ID ${customerId}:`, error);
            }
        }

        setCustomerNames(customerNamesMap);
    };

    const fetchRoles = async () => {
        try {
            const response = await axios.get('http://localhost:8080/roles/getAll', {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            setRoles(response.data);
        } catch (error) {
            console.error('Error fetching roles:', error);
        }
    };

    useEffect(() => {
        fetchAccounts();
        fetchRoles();
    }, []);

    const handleDisableAccount = async (accountId) => {
        console.log(accountId)
        if (window.confirm('Bạn có chắc chắn muốn vô hiệu hóa tài khoản này?')) {
            try {
                await axios.put(`http://localhost:8080/accounts/disable/${accountId}`, {}, {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                });
                toast.success('Vô hiệu hóa tài khoản thành công!');
                fetchAccounts();
            } catch (error) {
                toast.error('Đã xảy ra lỗi khi vô hiệu hóa tài khoản!');
                console.error('Error disabling account:', error);
            }
        }
    };

    const handleShowRoleModal = (account) => {
        setSelectedAccount(account);

        const foundRole = roles.find(role => role.name === account.roleName);
        const roleIdToSet = foundRole ? foundRole.id : '';
        setRoleId(roleIdToSet);

        setShowRoleModal(true);
    };

    const handleCloseRoleModal = () => {
        setSelectedAccount(null);
        setRoleId('');
        setShowRoleModal(false);
    };

    const handleSaveRole = async () => {
        if (selectedAccount && roleId) {
            try {
                await axios.put(`http://localhost:8080/accounts/updateRole?customerid=${selectedAccount.customerId}&roleid=${roleId}`, {}, {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                });
                toast.success('Cập nhật vai trò thành công!');
                fetchAccounts();
                handleCloseRoleModal();
            } catch (error) {
                toast.error('Đã xảy ra lỗi khi cập nhật vai trò!');
                console.error('Error updating role:', error);
            }
        } else {
            toast.error('Vui lòng chọn vai trò hợp lệ!');
        }
    };      

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div className="container mt-5">
            <Row className="mb-3">
                <Col xs={12} md={6} lg={4}>
                    <Form.Control
                        type="text"
                        placeholder="Tìm kiếm tài khoản..."
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </Col>
            </Row>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Tên Tài Khoản</th>
                        <th>Tên Khách Hàng</th>
                        <th>Vai Trò</th>
                        <th>Trạng Thái</th>
                        <th>Hành Động</th>
                    </tr>
                </thead>
                <tbody>
                    {accounts.filter(account => 
                        account.username.toLowerCase().includes(searchTerm.toLowerCase())
                    ).map(account => (
                        <tr key={account.customerId}>
                            <td>{account.username}</td>
                            <td>{customerNames[account.customerId]}</td>
                            <td>{account.roleName}</td>
                            <td>{account.active ? 'Đã kích hoạt' : 'Đã vô hiệu hóa'}</td>
                            <td>
                                <Button variant="warning" className='mx-2' onClick={() => handleShowRoleModal(account)}>
                                    <FontAwesomeIcon icon={faUser} /> Phân quyền
                                </Button>
                                <Button variant="danger" onClick={() => handleDisableAccount(account.id)}>
                                    <FontAwesomeIcon icon={faTrashAlt} /> Vô hiệu hóa
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showRoleModal} onHide={handleCloseRoleModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Phân Quyền Tài Khoản</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="formRole">
                        <Form.Label>Vai Trò</Form.Label>
                        <Form.Control
                            as="select"
                            value={roleId}
                            onChange={(e) => setRoleId(e.target.value)}
                        >
                            <option value="">Chọn vai trò</option>
                            {roles.map(role => (
                                <option key={role.id} value={role.id}>
                                    {role.name}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseRoleModal}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={handleSaveRole}>
                        Lưu
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Account;
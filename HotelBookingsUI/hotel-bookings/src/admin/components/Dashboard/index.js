import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBed, faUser, faDollarSign, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import styles from './Dashboard.module.scss';
import classNames from 'classnames/bind';
import 'chart.js/auto';

const cx = classNames.bind(styles);

const Dashboard = () => {
  const [roomCount, setRoomCount] = useState(0);
  const [customerCount, setCustomerCount] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [accountCount, setAccountCount] = useState(0);
  const [monthlyRevenueData, setMonthlyRevenueData] = useState([]);
  const [yearlyRevenueData, setYearlyRevenueData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const roomsResponse = await axios.get('http://localhost:8080/rooms/getAll');
        setRoomCount(roomsResponse.data.length);

        const customersResponse = await axios.get('http://localhost:8080/customers/getAll');
        setCustomerCount(customersResponse.data.length);

        const bookingsResponse = await axios.get('http://localhost:8080/bookings/getAll');
        const confirmedBookings = bookingsResponse.data.filter(
          (booking) => booking.bookingStatus.name === 'Confirmed'
        );

        const AccountsResponse = await axios.get('http://localhost:8080/accounts/getAll');
        setAccountCount(AccountsResponse.data.length);

        const totalRevenue = confirmedBookings.reduce((total, booking) => total + booking.totalAmount, 0);
        setRevenue(totalRevenue);

        const monthlyRevenueMap = {};
        confirmedBookings.forEach((booking) => {
          const month = booking.checkInDate.substring(0, 7);
          if (!monthlyRevenueMap[month]) {
            monthlyRevenueMap[month] = 0;
          }
          monthlyRevenueMap[month] += booking.totalAmount;
        });

        const monthlyRevenueArray = Object.entries(monthlyRevenueMap).map(([month, revenue]) => ({
          month,
          revenue,
        }));
        setMonthlyRevenueData(monthlyRevenueArray);

        const yearlyRevenueMap = {};
        confirmedBookings.forEach((booking) => {
          const year = booking.checkInDate.substring(0, 4);
          if (!yearlyRevenueMap[year]) {
            yearlyRevenueMap[year] = 0;
          }
          yearlyRevenueMap[year] += booking.totalAmount;
        });

        const yearlyRevenueArray = Object.entries(yearlyRevenueMap).map(([year, revenue]) => ({
          year,
          revenue,
        }));
        setYearlyRevenueData(yearlyRevenueArray);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  const monthlyRevenueChartData = {
    labels: monthlyRevenueData.map(item => item.month),
    datasets: [
      {
        label: 'Doanh thu theo tháng',
        data: monthlyRevenueData.map(item => item.revenue),
        fill: false,
        borderColor: '#42A5F5',
        tension: 0.1,
      },
    ],
  };

  const yearlyRevenueChartData = {
    labels: yearlyRevenueData.map(item => item.year),
    datasets: [
      {
        label: 'Doanh thu theo năm',
        data: yearlyRevenueData.map(item => item.revenue),
        fill: false,
        borderColor: '#FFA726',
        tension: 0.1,
      },
    ],
  };

  return (
    <Container fluid className={cx('dashboard-container')}>
      <Row className="mb-4">
        <Col>
          <h2>Trang chủ</h2>
        </Col>
      </Row>

      <Row>
        <Col lg={3}>
          <Card className="text-white bg-primary mb-4">
            <Card.Body>
              <Card.Title><FontAwesomeIcon icon={faBed} /> Số lượng phòng</Card.Title>
              <Card.Text>{roomCount}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3}>
          <Card className="text-white bg-success mb-4">
            <Card.Body>
              <Card.Title><FontAwesomeIcon icon={faUser} /> Số lượng khách hàng</Card.Title>
              <Card.Text>{customerCount}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3}>
          <Card className="text-white bg-warning mb-4">
            <Card.Body>
              <Card.Title><FontAwesomeIcon icon={faDollarSign} /> Doanh thu</Card.Title>
              <Card.Text>{revenue.toLocaleString()} VNĐ</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3}>
          <Card className="text-white bg-danger mb-4">
            <Card.Body>
              <Card.Title><FontAwesomeIcon icon={faUserCircle} /> Số lượng tài khoản</Card.Title>
              <Card.Text>{accountCount}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col lg={6}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Doanh thu theo tháng</Card.Title>
              <Line data={monthlyRevenueChartData} />
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Doanh thu theo năm</Card.Title>
              <Line data={yearlyRevenueChartData} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
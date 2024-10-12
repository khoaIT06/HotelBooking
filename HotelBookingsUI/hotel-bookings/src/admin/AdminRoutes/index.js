import DashBoard from '~/admin/pages/Dashboard';
import AdminRoom from '~/admin/pages/AdminRoom';
import AdminCustomer from '~/admin/pages/AdminCustomer';
import AdminBooking from '../pages/AdminBooking';
import AdminRoomStatus from '../pages/AdminRoomStatus';
import AdminRoomType from '../pages/AdminRoomType';
import AdminBookingStatus from '../pages/AdminBookingStatus';
import AdminAccount from '../pages/AdminAccount';

const AdminRoutes = [
    { path: '/admin/dashboard', component: DashBoard },
    { path: '/admin/rooms', component: AdminRoom },
    { path: '/admin/customers', component: AdminCustomer },
    { path: '/admin/bookings', component: AdminBooking },
    { path: '/admin/roomstatus', component:  AdminRoomStatus},
    { path: '/admin/roomtype', component:  AdminRoomType},
    { path: '/admin/bookingstatus', component:  AdminBookingStatus},
    { path: '/admin/accounts', component:  AdminAccount},
];

export default AdminRoutes;
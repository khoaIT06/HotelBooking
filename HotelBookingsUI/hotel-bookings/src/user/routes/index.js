import Home from '../pages/Home'
import Room from '../pages/Room'
import Blog from '../pages/Blog'
import Login from '../pages/Login'
import Register from '../pages/Register'
import RoomDetail from '../components/RoomDetails'
import Booking from '../components/Booking'
import Profile from '../components/Profile'
import ChangePassword from '../components/ChangePassword'
import MyBookings from '../components/MyBookings'
import ForgotPassword from '../components/ForgotPassword'

const publicRoutes = [
    {path: '/', component: Home},
    {path: '/room', component: Room},
    {path: '/blog', component: Blog},
    {path: '/login', component: Login},
    {path: '/register', component: Register},
    {path: '/room/:id', component: RoomDetail},
    {path: '/booking', component: Booking},
    {path: '/profile', component: Profile},
    {path: '/changepassword', component: ChangePassword},
    {path: '/bookinginfo', component: MyBookings},
    {path: '/forgotpassword', component: ForgotPassword},
]

const privateRoutes = [
    
]

export {publicRoutes, privateRoutes}
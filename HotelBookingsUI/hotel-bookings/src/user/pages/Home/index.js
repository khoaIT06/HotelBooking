import React, { Fragment } from 'react';
import Slider from '../../components/Slider';
import RoomList from '~/user/components/RoomList';
import HotelIntro from '~/user/components/HotelIntro';
import { Link } from 'react-router-dom';

import banner1 from '~/user/UserImg/banner/banner1.jpg';
import banner2 from '~/user/UserImg/banner/banner2.jpeg';
import banner3 from '~/user/UserImg/banner/banner3.jpg';
import banner4 from '~/user/UserImg/banner/banner4.jpg';
import banner5 from '~/user/UserImg/banner/banner5.jpg';

function Home() {
    const banners = [
        { src: banner1 },
        { src: banner2 },
        { src: banner3 },
        { src: banner4 },
        { src: banner5 },
    ];

    const captions = [
        { title: 'Chào mừng bạn đến với khách sạn Khoa Hotel', description: 'Top 1 khách sạn chất lượng nhất Việt Nam' },
        { title: 'Chào mừng bạn đến với khách sạn Khoa Hotel', description: 'Top 1 khách sạn chất lượng nhất Việt Nam' },
        { title: 'Chào mừng bạn đến với khách sạn Khoa Hotel', description: 'Top 1 khách sạn chất lượng nhất Việt Nam' },
        { title: 'Chào mừng bạn đến với khách sạn Khoa Hotel', description: 'Top 1 khách sạn chất lượng nhất Việt Nam' },
        { title: 'Chào mừng bạn đến với khách sạn Khoa Hotel', description: 'Top 1 khách sạn chất lượng nhất Việt Nam' },
    ];

    return (
        <Fragment>
            <Slider images={banners} captions={captions}/>
            <HotelIntro/>
            <RoomList limit={6} withFilters={false} />
            <div className="text-center mb-5">
                <Link to="/room" className="btn btn-dark">Xem thêm</Link>
            </div>
        </Fragment>
    );
}

export default Home;

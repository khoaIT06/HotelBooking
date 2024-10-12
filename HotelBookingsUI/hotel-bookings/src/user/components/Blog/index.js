import React from 'react';
import classNames from 'classnames/bind';
import styles from './Blog.module.scss';
import HotelIntro from '../HotelIntro';
import AOS from 'aos';
import { useEffect } from 'react';

import introImage from '~/user/UserImg/banner/banner6.jpg';
import ownerImage from '~/user/UserImg/owner/owner.jpg'

const cx = classNames.bind(styles);

function Blog() {

    useEffect(() => {
        AOS.init({ duration: 1000 });
    }, []);

    return (
        <div className={cx('container', 'mt-5')}>
            <h1 className={cx('col-md-12 text-center text-dark mb-5')}>
                Về chúng tôi
            </h1>
          <div className={cx('row', 'intro-section', 'align-items-center')}>
            <div className={cx('col-md-6', 'text-center')} data-aos="fade-right">
              <img
                src={ownerImage}
                alt="Chủ khách sạn"
                className={cx('img-fluid', 'owner-img')}
              />
            </div>
            <div className={cx('col-md-6')} data-aos="fade-left">
              <h2 className={cx('intro-title text-dark')}>Chủ Khách Sạn</h2>
              <p className={cx('intro-description')}>
                Trần Đăng Khoa, sinh ngày 24-06-2003, là một chuyên gia xuất sắc trong lĩnh vực công nghệ thông tin, tốt nghiệp năm 2025 với bằng IT và đã tích lũy hơn 10 năm kinh nghiệm quản lý khách sạn. Khoa không chỉ nổi bật trong lĩnh vực IT mà còn là một người lãnh đạo tận tâm và chuyên nghiệp trong ngành dịch vụ khách sạn. Bằng sự hiểu biết sâu rộng về công nghệ và khả năng quản lý xuất sắc, anh đã góp phần nâng cao chất lượng dịch vụ và trải nghiệm khách hàng tại các khách sạn mà mình điều hành.
                Khoa được biết đến với tư duy sáng tạo, khả năng lãnh đạo đội nhóm, và việc ứng dụng công nghệ hiện đại vào quản lý vận hành khách sạn. Nhờ sự tận tâm và không ngừng học hỏi, anh đã trở thành một hình mẫu lý tưởng trong ngành, giúp các khách sạn của mình đạt được những thành công đáng kể. Với nền tảng IT vững chắc và sự nhạy bén trong việc nắm bắt xu hướng thị trường, Trần Đăng Khoa không chỉ là một quản lý xuất sắc mà còn là một người tiên phong trong việc kết hợp công nghệ vào ngành dịch vụ.
              </p>
            </div>
          </div>
    
          <div className={cx('row', 'hotel-section', 'mt-5')}>
            <div className={cx('col-md-12', 'text-center')}>
                <HotelIntro/>
            </div>
            <div className={cx('col-md-12 mt-3 mb-5')} data-aos="fade-up">
              <h2 className={cx('hotel-title', 'text-center')}>Khách Sạn Sang Trọng</h2>
              <p className={cx('hotel-description')}>
                Khoa Hotel, tọa lạc tại vị trí đắc địa giữa trung tâm thành phố Cao Lãnh, là điểm dừng chân lý tưởng cho những du khách tìm kiếm sự thoải mái, sang trọng và tinh tế. Được thiết kế với phong cách hiện đại nhưng vẫn giữ được nét gần gũi với thiên nhiên, Khoa Hotel mang đến cho khách hàng không gian nghỉ dưỡng đẳng cấp với tầm nhìn tuyệt đẹp ra toàn cảnh thành phố.
                Với phương châm "Sự hài lòng của khách hàng là trên hết", Khoa Hotel không ngừng nâng cao chất lượng dịch vụ, từ đội ngũ nhân viên tận tâm đến hệ thống tiện ích cao cấp. Khách sạn cung cấp nhiều loại phòng nghỉ phù hợp với mọi nhu cầu, từ những căn phòng tiêu chuẩn ấm cúng cho đến các phòng suite sang trọng với đầy đủ tiện nghi.
                Ngoài ra, nhà hàng tại Khoa Hotel còn mang đến những trải nghiệm ẩm thực độc đáo, từ các món ăn truyền thống Việt Nam đến những món Âu hiện đại, tất cả đều được chế biến từ nguồn nguyên liệu tươi ngon nhất. Sau một ngày dài khám phá, du khách có thể thư giãn tại spa của khách sạn hoặc tận hưởng không gian yên tĩnh tại hồ bơi trên sân thượng.
                Khoa Hotel không chỉ là nơi nghỉ ngơi, mà còn là điểm đến mang lại những kỷ niệm khó quên, nơi du khách cảm nhận được sự chu đáo và đẳng cấp trong từng chi tiết.
              </p>
            </div>
          </div>
        </div>
      );
}

export default Blog;
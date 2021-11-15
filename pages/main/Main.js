import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation, Autoplay } from 'swiper/core';

/* styles */
import styles from '../../styles/main/Main.module.scss';
import 'swiper/swiper.min.css';
import 'swiper/components/navigation/navigation.min.css';
import Webp from '../../components/common/Webp';

SwiperCore.use([Navigation, Autoplay]);

export default function Main() {
  const refs = {
    swiperRef: useRef(),
  }

  const [swiper, setSwiper] = useState();
  const [slide, setSlide] = useState(1);

  return (
      <>
        {/* 대배너 */}
        <Swiper
          ref={refs.swiperRef}
          slidesPerView={1}
          loop={true}
          grabCursor={true}
          autoplay={{
              'delay': 4000,
              'disableOnInteraction': false
          }}
          onBeforeInit={(swiper) => {
            swiper.navigation.init();
            swiper.navigation.update();
          }}
          onSlideChange={(e) => {
            setSlide(e.realIndex);
          }}
          onSwiper={(swiper) => {
            setSwiper(swiper);
          }}
        >
          <SwiperSlide className={styles.swiper_slide} style={{ background: '#f3f3f3', color: '#000' }}>
            <div className={styles.slide_container}>
              <div className={styles.slide_content_area}>
                <div className={styles.slide_title}>
                  {/* 태그 */}
                  <span className={styles.slide_tag} style={{ background: '#000', color: '#f3f3f3' }}>이공계사람들 소개</span>

                  {/* 제목 */}
                  <p>이공계 분야에 더욱 특화된</p>
                  <p>구인구직 플랫폼 입니다.</p>

                  {/* 내용 */}
                  <div className={styles.slide_title_description}>
                    <p>상표등록부터 점진적으로 사업화를 추진중입니다.</p>
                    <p>이공계사람들에서 구인중인 회사와 대학원 연구실들을 무료로 만나보세요!</p>
                  </div>
                </div>

                {/* 이미지 */}
                <div className={styles.slide_image}>
                  <Webp src='/assets/images/common/logo.png' width={400} />
                </div>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide className={styles.swiper_slide} style={{ background: '#33cdac', color: '#000' }}>
            <div className={styles.slide_container}>
              <div className={styles.slide_content_area}>
                <div className={styles.slide_title}>
                  {/* 태그 */}
                  <span className={styles.slide_tag} style={{ background: '#2e86b3', color: '#fff' }}>제뉴원사이언스 채용</span>

                  {/* 제목 */}
                  <p>제뉴원사이언스에서</p>
                  <p>신입/경력사원을 적극 모집합니다.</p>

                  {/* 내용 */}
                  <div className={styles.slide_title_description}>
                    <p>의약품 CMO 마케팅, 의약품영업, 의약품개발기획, 품질관리, 품질경영,</p>
                    <p>재무회계, 임상, 제제연구, 분석연구, R&D전략, 신약연구, 제제기술</p>
                  </div>
                </div>

                {/* 이미지 */}
                <div className={styles.slide_image}>
                  <Webp src='/assets/images/main/banner/banner_genuone.png' width={400} />
                </div>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
        
        {/* 대배너 컨트롤러 */}
        <div className={styles.slide_controller_area}>
          <div className={styles.slide_controller}>
            <div className={styles.slide_controller_panel}>
              <Webp src='/assets/images/main/prev.png' onClick={() => swiper.slidePrev()} />
                <span>{slide + 1}</span>/2
              <Webp src='/assets/images/main/next.png' onClick={() => swiper.slideNext()} />
            </div>

            <div className={styles.slide_list_panel}>
              <ul>
                <li className={`${slide === 0 ? styles.current : ''} ${styles.cursor}`} onClick={() => swiper.slideTo(1)}>이공계사람들 소개</li>
                <li className={`${slide === 1 ? styles.current : ''} ${styles.cursor}`} onClick={() => swiper.slideTo(2)}>제뉴원사이언스 채용</li>
              </ul>
            </div>
          </div>
        </div>

        <div className={styles.container}>
          123
        </div>
      </>
  )
}
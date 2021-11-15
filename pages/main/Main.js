import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation, Autoplay } from 'swiper/core';

/* styles */
import styles from '../../styles/Main.module.scss';
import 'swiper/swiper.min.css';
import 'swiper/components/navigation/navigation.min.css';
import Webp from '../../components/common/Webp';

SwiperCore.use([Navigation, Autoplay]);

export default function Main() {
  const refs = {
    swiperRef: useRef(),
    prevRef: useRef(),
    nextRef: useRef(),
  }

  return (
      <>
        {/* 대배너 */}
        <Swiper
          ref={refs.swiperRef}
          slidesPerView={1}
          loop={true}
          grabCursor={true}
          autoplay={{
              'delay': 5000,
              'disableOnInteraction': false
          }}
          onBeforeInit={(swiper) => {
              swiper.params.navigation.nextEl = refs.nextRef.current;
              swiper.params.navigation.prevEl = refs.prevRef.current;

              swiper.navigation.init();
              swiper.navigation.update();
          }}
          onSlideChange={(e) => {

          }}
          onSwiper={(swiper) => {

          }}
        >
          <SwiperSlide className={styles.swiper_slide} style={{ background: '#f3f3f3', color: '#000' }}>
            <div className={styles.slide_container}>
              <div className={styles.slide_content_area}>
                <div className={styles.slide_title}>
                  {/* 태그 */}
                  <div className={styles.slide_tag}>이공계사람들 소개</div>

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
                  <Webp src='/assets/images/common/logo.png' />
                </div>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>

        <div className={styles.container}>

        </div>
      </>
  )
}
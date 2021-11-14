import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation, Autoplay } from 'swiper/core';

/* styles */
import styles from '../../styles/Main.module.scss';
import 'swiper/swiper.min.css';
import 'swiper/components/navigation/navigation.min.css';

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
          <SwiperSlide className={styles.swiper_slide} style={{ background: '#af28ff', color: '#fff' }}>
            <div className={styles.slide_container}>
              테스트1
            </div>
          </SwiperSlide>
        </Swiper>

        <div className={styles.container}>

        </div>
      </>
  )
}
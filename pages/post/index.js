import React, { useEffect, useState } from 'react';

import styles from '../../styles/post/Post.module.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation, Autoplay } from 'swiper/core';

import 'swiper/swiper.min.css';
import 'swiper/components/navigation/navigation.min.css';
import Webp from '../../components/common/Webp';
import utilCommon from '../../utils/common';

SwiperCore.use([Navigation, Autoplay]);

export default function Post() {
    const [swiper, setSwiper] = useState();
    const [slideIndex, setSlideIndex] = useState(0);
    const [postContents, setPostContents] = useState([]);
    const [isBookmark, setIsBookmark] = useState(false);

    function fetchPostContents() {
        setPostContents({
            images: ['/assets/images/main/category/develop.jpg'],
            contents: '<p>테스트 입니다.</p>'
        });
    }

    function triggerBookmark() {
        setIsBookmark(!isBookmark);
    }

    useEffect(() => {
        fetchPostContents();
    }, []);

    if (!postContents.images && !postContents.contents) return null;

    return (
        <div className={styles.container}>
            <div className={styles.contents_area}>
                {/* 슬라이드 */}
                <Swiper
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
                    onSlideChange={(swiper) => {
                        setSlideIndex(swiper.realIndex);
                    }}
                    onSwiper={(swiper) => {
                        setSwiper(swiper);
                    }}
                    className={styles.swiper_container}
                >
                {
                    postContents.images.map((image) => 
                        <SwiperSlide className={styles.swiper_slide}
                            key={utilCommon.getRandomKey()}>
                            <Webp src={image} width='100%' height='100%' />
                        </SwiperSlide>
                    )
                }
                </Swiper>

                {/* 포스트 내용 */}
                <p className={styles.contents_title}>React.js 프론트엔드 개발자를 모집합니다.</p>
                <span className={styles.company_name}>이공계사람들</span>
                <span className={styles.company_location}>서울</span>
                <div className={styles.contents} dangerouslySetInnerHTML={{ __html: postContents.contents }} />
            </div>
            <div className={styles.apply_area}>
                <div className={styles.static_apply_tab}>
                    <div className={styles.company_info}>
                        <p className={styles.company_name}>이공계사람들</p>
                        <p className={styles.category}>인공지능/소프트웨어/개발</p>
                    </div>
                    <div className={styles.apply_controller}>
                        <button className={styles.submit}>지원하기</button>
                        <button className={styles.favorit} onClick={() => triggerBookmark(isBookmark)}>
                            <Webp src={`${isBookmark ? '/assets/images/post/bookmark_enabled.png' : '/assets/images/post/bookmark_disabled.png'}`} width={15} />
                            북마크
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
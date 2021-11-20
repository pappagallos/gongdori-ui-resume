import React, { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation, Autoplay } from 'swiper/core';

/* styles */
import styles from '../../styles/main/Main.module.scss';
import 'swiper/swiper.min.css';
import 'swiper/components/navigation/navigation.min.css';
import Webp from '../../components/common/Webp';
import utilCommon from '../../utils/common';

SwiperCore.use([Navigation, Autoplay]);

export default function Main() {
  const refs = {
    swiperRef: useRef(),
  }

  const [swiper, setSwiper] = useState();
  const [slideIndex, setSlideIndex] = useState(0);
  const [slideList, setSlideList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [hiringList, setHiringList] = useState([]);

  function fetchBannerList() {
    setSlideList([
      {
        design: {
          slideBackgroundColor: '#f3f3f3',
          slideFontColor: '#000',
          tagBackgroundColor: '#000',
          tagFontColor: '#f3f3f3'
        },
        contents: {
          tag: '이공계사람들 소개',
          title: '<p>이공계 분야에 더욱 특화된</p><p>구인구직 플랫폼 입니다.</p>',
          description: '<p>상표등록부터 점진적으로 사업화를 추진중입니다.</p><p>이공계사람들에서 구인중인 회사와 대학원 연구실들을 무료로 만나보세요!</p>',
          imageUrl: '/assets/images/common/logo.png'
        }
      }, 
      {
        design: {
          slideBackgroundColor: '#33cdac',
          slideFontColor: '#000',
          tagBackgroundColor: '#2e86b3',
          tagFontColor: '#fff'
        },
        contents: {
          tag: '제뉴원사이언스 채용',
          title: '<p>제뉴원사이언스에서</p><p>신입/경력사원을 적극 모집합니다.</p>',
          description: '<p>의약품 CMO 마케팅, 의약품영업, 의약품개발기획, 품질관리, 품질경영,</p><p>재무회계, 임상, 제제연구, 분석연구, R&D전략, 신약연구, 제제기술</p>',
          imageUrl: '/assets/images/main/banner/banner_genuone.png'
        }
      }
    ]);
  }

  function fetchCategoryList() {
    setCategoryList([
      {
        categoryName: '건축/인테리어/설계',
        imageUrl: '/assets/images/main/category/building.jpg',
        link: ''
      },
      {
        categoryName: '의료/제약/생명과학',
        imageUrl: '/assets/images/main/category/bio.jpg',
        link: ''
      },
      {
        categoryName: '인공지능/소프트웨어/개발',
        imageUrl: '/assets/images/main/category/develop.jpg',
        link: ''
      },
      {
        categoryName: '교육/대학원/연구실',
        imageUrl: '/assets/images/main/category/college.jpg',
        link: ''
      }
    ]);
  }

  function fetchHiringList() {
    setHiringList([
      {
        hiringTitle: 'React.js Front-End 개발자',
        hiringCompanyName: '카카오엔터테인먼트',
        hiringCompanyLocation: '한국/서울',
        imageUrl: '/assets/images/main/category/building.jpg'
      },
      {
        hiringTitle: '메타버스 AR/VR 개발자',
        hiringCompanyName: '카카오엔터테인먼트',
        hiringCompanyLocation: '한국/서울',
        imageUrl: '/assets/images/main/category/building.jpg'
      },
      {
        hiringTitle: '메타버스 AR/VR 개발자',
        hiringCompanyName: '카카오엔터테인먼트',
        hiringCompanyLocation: '한국/서울',
        imageUrl: '/assets/images/main/category/building.jpg'
      },
      {
        hiringTitle: '메타버스 AR/VR 개발자',
        hiringCompanyName: '카카오엔터테인먼트',
        hiringCompanyLocation: '한국/서울',
        imageUrl: '/assets/images/main/category/building.jpg'
      },
      {
        hiringTitle: '메타버스 AR/VR 개발자',
        hiringCompanyName: '카카오엔터테인먼트',
        hiringCompanyLocation: '한국/서울',
        imageUrl: '/assets/images/main/category/building.jpg'
      },
      {
        hiringTitle: '메타버스 AR/VR 개발자',
        hiringCompanyName: '카카오엔터테인먼트',
        hiringCompanyLocation: '한국/서울',
        imageUrl: '/assets/images/main/category/building.jpg'
      },
      {
        hiringTitle: '메타버스 AR/VR 개발자',
        hiringCompanyName: '카카오엔터테인먼트',
        hiringCompanyLocation: '한국/서울',
        imageUrl: '/assets/images/main/category/building.jpg'
      },
      {
        hiringTitle: '메타버스 AR/VR 개발자',
        hiringCompanyName: '카카오엔터테인먼트',
        hiringCompanyLocation: '한국/서울',
        imageUrl: '/assets/images/main/category/building.jpg'
      },
      {
        hiringTitle: '메타버스 AR/VR 개발자',
        hiringCompanyName: '카카오엔터테인먼트',
        hiringCompanyLocation: '한국/서울',
        imageUrl: '/assets/images/main/category/building.jpg'
      },
      {
        hiringTitle: '메타버스 AR/VR 개발자',
        hiringCompanyName: '카카오엔터테인먼트',
        hiringCompanyLocation: '한국/서울',
        imageUrl: '/assets/images/main/category/building.jpg'
      }
    ]);
  }

  useEffect(() => {
    fetchBannerList();
    fetchCategoryList();
    fetchHiringList();
  }, []);

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
          onSlideChange={(swiper) => {
            setSlideIndex(swiper.realIndex);
          }}
          onSwiper={(swiper) => {
            setSwiper(swiper);
          }}
        >
          { slideList.map((slide, index) => 
              <SwiperSlide className={styles.swiper_slide} 
                style={{ background: slide.design.slideBackgroundColor, color: slide.design.slideFontColor }} 
                key={index}>
                <div className={styles.slide_container}>
                  <div className={styles.slide_content_area}>
                    <div className={styles.slide_left_content}>
                      {/* 태그 */}
                      <span 
                        className={styles.slide_tag} 
                        style={{ background: slide.design.tagBackgroundColor, color: slide.design.tagFontColor }}>
                          {slide.contents.tag}
                      </span>

                      {/* 제목 */}
                      <div className={styles.slide_title} 
                        dangerouslySetInnerHTML={{ __html: slide.contents.title }}>
                      </div>

                      {/* 내용 */}
                      <div className={styles.slide_title_description} 
                        dangerouslySetInnerHTML={{ __html: slide.contents.description }}>
                      </div>
                    </div>

                    {/* 이미지 */}
                    <div className={styles.slide_image}>
                      <Webp src={slide.contents.imageUrl} width={400} />
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            )
          }
        </Swiper>
        
        {/* 대배너 컨트롤러 */}
        <div className={styles.slide_controller_area}>
          <div className={styles.slide_controller}>
            {/* 현재 슬라이드/전체 슬라이드 표시 패널 */}
            <div className={styles.slide_controller_panel}>
              <Webp src='/assets/images/main/prev.png' onClick={() => swiper.slidePrev()} />
                <span>{slideIndex + 1}</span>/{slideList.length}
              <Webp src='/assets/images/main/next.png' onClick={() => swiper.slideNext()} />
            </div>

            {/* 슬라이드 태그 */}
            <div className={styles.slide_list_panel}>
              <ul>
                {slideList.map((slide, index) => 
                  <li className={`${slideIndex === index ? styles.current : ''} ${styles.cursor}`} 
                    onClick={() => swiper.slideTo(index + 1)} key={index}>
                      {slide.contents.tag}
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
        
        {/* 메인 화면 */}
        <div className={styles.container}>
          {/* 지금 채용중인 공고 */}
          <div className={styles.hiring_list_section}>
            <p className={styles.section_title}>지금 채용중인 공고</p>

            <div className={styles.hiring_list}>
              <ul>
                { hiringList.map((hiring, index) => 
                  <li key={index}>
                    <div className={styles.hiring_image}>
                      <Webp src={hiring.imageUrl} />
                    </div>
                    <div className={styles.hiring_description}>
                      <p className={styles.hiring_title}>{hiring.hiringTitle}</p>
                      <p className={styles.company_name}>{hiring.hiringCompanyName}</p>
                      <p className={styles.company_location}>{hiring.hiringCompanyLocation}</p>
                    </div>
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* 지금 진행중인 대외활동 */}
          <div className={styles.hiring_list_section}>
            <p className={styles.section_title}>지금 진행중인 대외활동</p>

            <div className={styles.hiring_list}>
              <ul>
                { hiringList.map((hiring, index) => 
                  <li key={index}>
                    <div className={styles.hiring_image}>
                      <Webp src={hiring.imageUrl} />
                    </div>
                    <div className={styles.hiring_description}>
                      <p className={styles.hiring_title}>{hiring.hiringTitle}</p>
                      <p className={styles.company_name}>{hiring.hiringCompanyName}</p>
                      <p className={styles.company_location}>{hiring.hiringCompanyLocation}</p>
                    </div>
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* 이공계 계열 종류 */}
          <div className={styles.category_list_section}>
            <p className={styles.section_title}>어떤 분야의 채용 공고를 찾으시나요?</p>

            <div className={styles.category_list}>
              <ul>
                { categoryList.map((category, index) => 
                  <li key={index}>
                    <Webp src={category.imageUrl} />
                    <p className={styles.category_name}>{category.categoryName}</p>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </>
  )
}
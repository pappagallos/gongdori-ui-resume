import React from 'react';

/* styles */
import styles from '../../styles/common/Footer.module.scss';
import Webp from './Webp';

const Footer = () => {
    return (
        <div className={styles.container}>
            <div className={styles.footer_area}>
                <ul>
                    <li>
                        <p className={styles.category_title}>이공계사람들 소개</p>
                        <p className={styles.category_name}>소개</p>
                        <p className={styles.category_name}>공지사항</p>
                        <p className={styles.category_name}>운영방식</p>
                        <p className={styles.category_name}>기술블로그</p>
                    </li>
                    <li>
                        <p className={styles.category_title}>사업추진계획</p>
                        <p className={styles.category_name}>개요</p>
                        <p className={styles.category_name}>비즈니스모델</p>
                        <p className={styles.category_name}>투자유치</p>
                    </li>
                    <li>
                        <p className={styles.category_title}>광고센터</p>
                        <p className={styles.category_name}>광고위치소개</p>
                        <p className={styles.category_name}>신청방법</p>
                        <p className={styles.category_name}>광고신청</p>
                    </li>
                    <li>
                        <p className={styles.category_title}>고객센터</p>
                        <p className={styles.category_name}>문의사항</p>
                    </li>
                    <li>
                        <p className={styles.category_title}>이용 및 약관</p>
                        <p className={styles.category_name}>약관 및 개인정보</p>
                        <p className={styles.category_name}>오픈소스 라이센스</p>
                    </li>
                </ul>
                <div className={styles.copyright}>
                    <Webp src='/assets/images/common/logo.png' />
                    <p>© 2021 이공계사람들</p>
                </div>
            </div>
        </div>
    );
}

export default Footer;
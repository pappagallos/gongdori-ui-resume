import React from 'react';

/* styles */
import styles from '../../styles/common/Header.module.scss';

/* components */
import Webp from './Webp';

const Header = () => {
    return (
        <div className={styles.container}>
            <div className={styles.header_area}>
                <div className={styles.menu_area}>
                    <Webp src='/assets/images/common/logo.png' />
                    <ul>
                        <li>채용공고</li>
                        <li>대외활동/공모전</li>
                    </ul>
                </div>
                <div className={styles.sign_area}>
                    <button className={styles.button_sign}>로그인/회원가입</button>
                    <button className={styles.button_business_service}>기업 서비스</button>
                </div>
            </div>
        </div>
    );
}

export default Header;
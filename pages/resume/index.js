import { useRouter } from 'next/dist/client/router';
import React, { useEffect, useState } from 'react';

import styles from '../../styles/resume/Resume.module.scss';

import RecommentList from './recommend_list.json';

export default function Resume() {
    const router = useRouter();

    const [selectedFormList, setSelectedFormList] = useState({
        education: false,       // 학력
        score: false,           // 성적
        career: false,          // 경력
        me: false,              // 자기소개
        portfolio: false,       // 포트폴리오
        certification: false,   // 자격증
        paper: false,           // 논문
        academy: false,         // 학회
        language: false,        // 외국어
        awards: false,          // 수상
        external_links: false,  // 외부링크
    });

    const [preferenceFormList, setPreferenceFormList] = useState();

    function handleChangeForm(key) {
        setSelectedFormList({
            ...selectedFormList,
            [`${key}`]: !selectedFormList[`${key}`]
        });
    }

    useEffect(() => {
        if (router.isReady) {
            // query parameter로 category가 넘어오지 않았다면 뒤로가기
            if (!router.query.category) {
                router.back();
            }

            if (RecommentList) {
                switch(router.query.category) {
                    case 'construct': {
                        setPreferenceFormList(RecommentList[0]);
                        return;
                    }
                    case 'biology': {
                        setPreferenceFormList(RecommentList[1]);
                        return;
                    }
                    case 'development': {
                        setPreferenceFormList(RecommentList[2]);
                        return;
                    }
                    case 'college': {
                        setPreferenceFormList(RecommentList[3]);
                        return;
                    }
                }
            }
        }
    }, [router]);

    if (!preferenceFormList) return null;

    return (
        <div className={styles.container}>
            <div className={styles.edit_area}>
                1
            </div>
            <div className={styles.submit_area}>
                <div className={styles.submit_controller_area}>
                    <p className={styles.title}>지원서 작성하기</p>
                    <p className={styles.description}>기업 채용담당자에게 보여줄 지원서를 작성해주세요.</p>

                    <div className={styles.submit_controller}>
                        <button className={styles.submit}>작성하기</button>
                    </div>
                </div>

                <div className={styles.submit_controller_area}>
                    <p className={styles.title}>양식 추가하기</p>
                    <p className={styles.description}>더 작성하기를 원하시는 양식이 있으신가요? 퍼센트는 지원하시고자 하시는 분야의 채용담당자들이 가장 중요하게 여기는 정도를 나타냅니다.</p>

                    <ul>
                        <label htmlFor='education'>
                            <li className={selectedFormList.education ? styles.selected : undefined}>
                                <input type='checkbox' id='education' onChange={() => handleChangeForm('education')} />
                                <span>학력</span>
                                <span className={styles.percent_score}>{preferenceFormList.category_item.score.education}</span>
                                <div className={styles.chart} style={{ width: preferenceFormList.category_item.score.education }} />
                            </li>
                        </label>
                        <label htmlFor='score'>
                            <li className={selectedFormList.score ? styles.selected : undefined}>
                                <input type='checkbox' id='score' onChange={() => handleChangeForm('score')} />
                                <span>성적</span>
                                <span className={styles.percent_score}>{preferenceFormList.category_item.score.score}</span>
                                <div className={styles.chart} style={{ width: preferenceFormList.category_item.score.score }} />
                            </li>
                        </label>
                        <label htmlFor='career'>
                            <li className={selectedFormList.career ? styles.selected : undefined}>
                                <input type='checkbox' id='career' onChange={() => handleChangeForm('career')} />
                                <span>경력</span>
                                <span className={styles.percent_score}>{preferenceFormList.category_item.score.career}</span>
                                <div className={styles.chart} style={{ width: preferenceFormList.category_item.score.career }} />
                            </li>
                        </label>
                        <label htmlFor='me'>
                            <li className={selectedFormList.me ? styles.selected : undefined}>
                                <input type='checkbox' id='me' onChange={() => handleChangeForm('me')} />
                                <span>자기소개</span>
                                <span className={styles.percent_score}>{preferenceFormList.category_item.score.me}</span>
                                <div className={styles.chart} style={{ width: preferenceFormList.category_item.score.me }} />
                            </li>
                        </label>
                        <label htmlFor='portfolio'>
                            <li className={selectedFormList.portfolio ? styles.selected : undefined}>
                                <input type='checkbox' id='portfolio' onChange={() => handleChangeForm('portfolio')} />
                                <span>포트폴리오</span>
                                <span className={styles.percent_score}>{preferenceFormList.category_item.score.portfolio}</span>
                                <div className={styles.chart} style={{ width: preferenceFormList.category_item.score.portfolio }} />
                            </li>
                        </label>
                        <label htmlFor='certification'>
                            <li className={selectedFormList.certification ? styles.selected : undefined}>
                                <input type='checkbox' id='certification' onChange={() => handleChangeForm('certification')} />
                                <span>자격증</span>
                                <span className={styles.percent_score}>{preferenceFormList.category_item.score.certification}</span>
                                <div className={styles.chart} style={{ width: preferenceFormList.category_item.score.certification }} />
                            </li>
                        </label>
                        <label htmlFor='paper'>
                            <li className={selectedFormList.paper ? styles.selected : undefined}>
                                <input type='checkbox' id='paper' onChange={() => handleChangeForm('paper')} />
                                <span>논문</span>
                                <span className={styles.percent_score}>{preferenceFormList.category_item.score.paper}</span>
                                <div className={styles.chart} style={{ width: preferenceFormList.category_item.score.paper }} />
                            </li>
                        </label>
                        <label htmlFor='academy'>
                            <li className={selectedFormList.academy ? styles.selected : undefined}>
                                <input type='checkbox' id='academy' onChange={() => handleChangeForm('academy')} />
                                <span>학회</span>
                                <span className={styles.percent_score}>{preferenceFormList.category_item.score.academy}</span>
                                <div className={styles.chart} style={{ width: preferenceFormList.category_item.score.academy }} />
                            </li>
                        </label>
                        <label htmlFor='language'>
                            <li className={selectedFormList.language ? styles.selected : undefined}>
                                <input type='checkbox' id='language' onChange={() => handleChangeForm('language')} />
                                <span>외국어</span>
                                <span className={styles.percent_score}>{preferenceFormList.category_item.score.language}</span>
                                <div className={styles.chart} style={{ width: preferenceFormList.category_item.score.language }} />
                            </li>
                        </label>
                        <label htmlFor='awards'>
                            <li className={selectedFormList.awards ? styles.selected : undefined}>
                                <input type='checkbox' id='awards' onChange={() => handleChangeForm('awards')} />
                                <span>수상</span>
                                <span className={styles.percent_score}>{preferenceFormList.category_item.score.awards}</span>
                                <div className={styles.chart} style={{ width: preferenceFormList.category_item.score.awards }} />
                            </li>
                        </label>
                        <label htmlFor='external_links'>
                            <li className={selectedFormList.external_links ? styles.selected : undefined}>
                                <input type='checkbox' id='external_links' onChange={() => handleChangeForm('external_links')} />
                                <span>외부링크</span>
                                <span className={styles.percent_score}>{preferenceFormList.category_item.score.external_links}</span>
                                <div className={styles.chart} style={{ width: preferenceFormList.category_item.score.external_links }} />
                            </li>
                        </label>
                    </ul>
                </div>
            </div>
        </div>
    );
}
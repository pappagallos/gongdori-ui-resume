import { useRouter } from 'next/dist/client/router';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

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

    const [form, setForm] = useState({
        education: [{
            collegeType: '',
            collegeStatus: '',
            collegeName: '',
            collegeMajorName: ''
        }],
    })

    function handleChangeForm(key) {
        setSelectedFormList({
            ...selectedFormList,
            [`${key}`]: !selectedFormList[`${key}`]
        });
    }

    const educationHandler = {
        handleAddEducation: () => {
            // 최대 추가 가능한 학력 개수는 4개까지 이므로 4개 이상알 때 추가하기를 누르면 더 추가되지 않도록 제약
            if (form.education.length >= 4) {
                toast.info('학력은 최대 4개까지 추가 가능합니다.', { position: 'bottom-center' })
                return;
            }
    
            const educationObj = {
                collegeType: '',
                collegeStatus: '',
                collegeName: '',
                collegeMajorName: ''
            };
    
            const tempForm = JSON.parse(JSON.stringify(form));
            tempForm.education.push(educationObj);
    
            setForm(tempForm);
        },
        handleUpdateEducation: (payload) => {
            if (!payload) {
                return;
            }
    
            const key = Object.keys(payload)[0];
            const tempForm = Object.assign({}, form);
    
            tempForm.education[payload[key].index][key] = payload[key].value.target.value;
            setForm(tempForm);
        },
        handleRemoveEducation: (index) => {
            const tempForm = Object.assign({}, form);
            tempForm.education.splice(index, 1);
    
            setForm(tempForm);
        }
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
                { selectedFormList.education &&
                    <section>
                        <div className={styles.title_area}>
                            <p className={styles.title}>학력</p>
                            <p className={styles.description}>
                                학력을 입력해주세요.
                            </p>
                        </div>
                        <div className={styles.editor}>
                            { form.education.map((education, index) => 
                                <div className={styles.sub_area} key={index}>
                                    <select className={styles.college_type} onChange={(value) => educationHandler.handleUpdateEducation({ collegeType: { value, index }})}>
                                        <option value='0' disabled selected>학교</option>
                                        <option value='1'>대학교(2, 3년제)</option>
                                        <option value='2'>대학교(4년제)</option>
                                        <option value='3'>대학원(석사)</option>
                                        <option value='4'>대학원(박사)</option>
                                    </select>
                                    <select className={styles.college_status} onChange={(value) => educationHandler.handleUpdateEducation({ collegeStatus: { value, index }})}>
                                        <option value='0' disabled selected>상태</option>
                                        <option value='1'>졸업</option>
                                        <option value='2'>재학</option>
                                        <option value='3'>휴학</option>
                                        <option value='4'>중퇴</option>
                                        <option value='5'>수료</option>
                                    </select>
                                    <input type='text' 
                                        placeholder='학교명' 
                                        className={styles.college_name} 
                                        value={education.collegeName} 
                                        onChange={(value) => educationHandler.handleUpdateEducation({ collegeName: { value, index }})} 
                                    />
                                    <input type='text' 
                                        placeholder='전공' 
                                        className={styles.major_name} 
                                        value={education.collegeMajorName} 
                                        onChange={(value) => educationHandler.handleUpdateEducation({ collegeMajorName: { value, index }})} 
                                    />
                                    { index > 0 &&
                                        <button className={styles.button_remove} onClick={() => educationHandler.handleRemoveEducation(index)}>삭제</button>
                                    }
                                </div>
                            )}
                            <div className={styles.controller}>
                                <button className={styles.button_add} onClick={educationHandler.handleAddEducation}>추가하기</button>
                            </div>
                        </div>
                    </section>
                }
                { selectedFormList.score &&
                    <section>
                        <div className={styles.title_area}>
                            <p className={styles.title}>성적</p>
                            <p className={styles.description}>
                                학력의 성적을 입력해주세요. 성적을 입력하기 위해서는 학력이 입력되어 있어야 합니다.
                            </p>
                        </div>
                        <div className={styles.editor}>
                            <div className={styles.sub_area}>
                                <input type='text' placeholder='학점입력' className={styles.grade} />
                                <select className={styles.max_grade}>
                                    <option value='0' disabled selected>기준학점선택</option>
                                    <option value='1'>4.0</option>
                                    <option value='2'>4.3</option>
                                    <option value='3'>4.5</option>
                                    <option value='4'>5.0</option>
                                    <option value='5'>7.0</option>
                                    <option value='6'>100</option>
                                </select>
                            </div>
                        </div>
                    </section>
                }
                { selectedFormList.career &&
                    <section>
                        경력
                    </section>
                }
                { selectedFormList.me &&
                    <section>
                        자기소개
                    </section>
                }
                { selectedFormList.portfolio &&
                    <section>
                        포트폴리오
                    </section>
                }
                { selectedFormList.certification &&
                    <section>
                        자격증
                    </section>
                }
                { selectedFormList.paper &&
                    <section>
                        논문
                    </section>
                }
                { selectedFormList.academy &&
                    <section>
                        학회
                    </section>
                }
                { selectedFormList.language &&
                    <section>
                        외국어
                    </section>
                }
                { selectedFormList.awards &&
                    <section>
                        수상
                    </section>
                }
                { selectedFormList.external_links &&
                    <section>
                        외부링크
                    </section>
                }
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
import React, { useEffect, useRef, useState } from 'react';
import DaumPostcode from 'react-daum-postcode';
import { toast } from 'react-toastify';

import dynamic from 'next/dynamic';

const ToastEditor = dynamic(() => import('../../../components/editor/ToastEditor'), { ssr: false });

import styles from '../../../styles/post/PostEdit.module.scss';
import Webp from '../../../components/common/Webp';

import walfareJSON from './walfare_list.json';
import utilCommon from '../../../utils/common';

export default function PostEdit() {
    const [postTitle, setPostTitle] = useState('');                     // 채용공고 제목 저장용
    const [fullAddress, setFullAddress] = useState('');                 // 다음카카오 주소 검색 API에서 가져온 전체 주소 저장용
    const [showMap, setShowMap] = useState(false);                      // 근무지 작성 시 카카오 지도 보여주기 여부
    const [validateList, setValidateList] = useState({                  // 작성하기 전 검증
        validPostTitle: false,
        validPictures: false,
        validContents: false,
        validAddress: false,
        validAboutCompany: false,
        validMainJob: false,
        validQualification: false,
        validWalfare: false,
    });
    const [images, setImages] = useState({                              // 회사 이미지
        image1: null,   // 사진1
        image2: null,   // 사진2
        image3: null,   // 사진3
        image4: null,   // 사진4
        image5: null,   // 사진5
    });
    const [editorWordCounter, setEditorWordCounter] = useState({        // 토스트 에디터에 입력한 글자 수 저장용
        editor1: 0,     // 자유양식
        editor2: 0,     // 가이드양식 - 회사소개
        editor3: 0,     // 가이드양식 - 주요업무
    });
    const [qualification, setQualification] = useState('');             // 자격요건 입력
    const [qualificationList, setQualificationList] = useState([]);     // 자격요건 리스트
    const [benefit, setBenefit] = useState('');                         // 우대사항 입력
    const [benefitList, setBenefitList] = useState([]);                 // 우대사항 리스트
    const [walfare, setWalfare] = useState('');                         // 복지 및 혜택 입력
    const [walfareList, setWalfareList] = useState([]);                 // 복지 및 혜택 리스트
    const [walfareAutoComplete, setWalfareAutoComplete] = useState([]); // 복지 및 혜택 자동완성기 결과
    const [tabIndex, setTabIndex] = useState(0);
    const [tempSave, setTempSave] = useState({
        editor1: '',
        editor2: '',
        editor3: ''
    });

    const mapRef = useRef();
    const editorRef1 = useRef();
    const editorRef2 = useRef();
    const editorRef3 = useRef();

    /*************************************************************
     * 관점
     *************************************************************/

    useEffect(() => {
        if (editorWordCounter.editor1 >= 300) {
            setValidateList({
                ...validateList,
                validContents: true
            });
        } else {
            setValidateList({
                ...validateList,
                validContents: false
            });
        }
    }, [editorWordCounter.editor1]);

    useEffect(() => {
        if (editorWordCounter.editor2 >= 200) {
            setValidateList({
                ...validateList,
                validAboutCompany: true
            });
        } else {
            setValidateList({
                ...validateList,
                validAboutCompany: false
            });
        }
    }, [editorWordCounter.editor2]);

    useEffect(() => {
        if (editorWordCounter.editor3 >= 200) {
            setValidateList({
                ...validateList,
                validMainJob: true
            });
        } else {
            setValidateList({
                ...validateList,
                validMainJob: false
            });
        }
    }, [editorWordCounter.editor3]);

    useEffect(() => {
        const container = mapRef.current;
		const options = {
			center: new kakao.maps.LatLng(33.450701, 126.570667),
			level: 3,
            draggable: false
		};

		const map = new kakao.maps.Map(container, options);

        const geocoder = new kakao.maps.services.Geocoder();

        geocoder.addressSearch(fullAddress, (result, status) => {
             if (status === kakao.maps.services.Status.OK) {
                const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
        
                const marker = new kakao.maps.Marker({
                    map: map,
                    position: coords
                });
        
                marker.setMap(map, marker);
                map.setCenter(coords);
            } 
        });
    }, [showMap]);

    useEffect(() => {
        if (postTitle.length > 0) {
            setValidateList({
                ...validateList,
                validPostTitle: true
            });
        } else {
            setValidateList({
                ...validateList,
                validPostTitle: false
            });
        }
    }, [postTitle]);

    useEffect(() => {
        const { image1, image2, image3, image4, image5 } = images;

        if (image1 || image2 || image3 || image4 || image5) {
            setValidateList({
                ...validateList,
                validPictures: true
            });
        } else {
            setValidateList({
                ...validateList,
                validPictures: false
            });
        }
    }, [images]);

    useEffect(() => {
        if (fullAddress.length > 0 && showMap) {
            setValidateList({
                ...validateList,
                validAddress: true
            });
        } else {
            setValidateList({
                ...validateList,
                validAddress: false
            });
        }
    }, [fullAddress, showMap]);

    useEffect(() => {
        if (qualificationList.length > 0) {
            setValidateList({
                ...validateList,
                validQualification: true
            });
        } else {
            setValidateList({
                ...validateList,
                validQualification: false
            });
        }
    }, [qualificationList]);

    /*************************************************************
     * 함수
     *************************************************************/
    function handleSearchWalfareList(keyword) {
        const walfareList = walfareJSON;
        const keys = Object.keys(walfareList);
        
        const searchResult = [];

        const limit = keys.length;
        for (let i = 0; i < limit; i++) {
            const key = keys[i];
            const searchList = walfareList[key].list.filter(v => v.list_name.indexOf(keyword) >= 0);
            
            if (searchList.length > 0) {
                const searchObj = {
                    key: key,
                    name: walfareList[key].name,
                    searchList,
                };

                searchResult.push(searchObj);
            }
        }

        console.log(searchResult);

        return searchResult;
    }

    function handleChangeTab(index) {
        // 동일한 탭을 다시 눌렀을 경우
        if (index === tabIndex) return;

        // 가이드 양식에서 자유 양식으로 변경하는 경우
        if (index === 1) {
            setTempSave({
                ...tempSave,
                editor2: editorRef2.current.getInstance().getHTML(),
                editor3: editorRef3.current.getInstance().getHTML(),
            });

            setTabIndex(index);

            const interval = setInterval(() => {
                if (editorRef1.current && tempSave.editor1.length > 0) {
                    editorRef1.current.getInstance().setHTML(tempSave.editor1);
                    clearInterval(interval);
                }
            }, 1);
            

        // 자유 양식에서 가이드 양식으로 변경하는 경우
        } else if (index === 0) {
            setTempSave({
                ...tempSave,
                editor1: editorRef1.current.getInstance().getHTML(),
            });

            setTabIndex(index);

            const interval = setInterval(() => {
                if (editorRef2.current && editorRef3.current && (tempSave.editor2.length > 0 || tempSave.editor3.length > 0)) {
                    editorRef2.current.getInstance().setHTML(tempSave.editor2);
                    editorRef3.current.getInstance().setHTML(tempSave.editor3);
                    clearInterval(interval);
                }
            }, 1);
        }
    } 

    function handleUpdateEditor(index) {
        if (index === 1) {
            if (!editorRef1.current) {
                return;
            }
        } else if (index === 2 || index === 3) {
            if (!editorRef2.current || !editorRef3.current) {
                return;
            }
        }

        const extractTextPattern = /(<([^>]+)>)/gi;
        let html = { editor1: '', editor2: '', editor3: '' };

        if (index === 1) {
            html.editor1 = editorRef1.current.getInstance().getHTML();

            const plainText1 = html.editor1.replace(extractTextPattern, '');

            setEditorWordCounter({
                ...editorWordCounter,
                editor1: plainText1.length
            });
        } else if (index === 2 || index === 3) {
            html.editor2 = editorRef2.current.getInstance().getHTML();
            html.editor3 = editorRef3.current.getInstance().getHTML();

            const plainText2 = html.editor2.replace(extractTextPattern, '');
            const plainText3 = html.editor3.replace(extractTextPattern, '');

            setEditorWordCounter({
                ...editorWordCounter,
                editor2: plainText2.length,
                editor3: plainText3.length
            });
        }
    }

    function handleUpdateTitle(e) {
        setPostTitle(e.target.value);
    }

    function handleComplete(data) {
        let fullAddress = data.address;
        let extraAddress = ''; 
        
        if (data.addressType === 'R') {
          if (data.bname !== '') {
            extraAddress += data.bname;
          }
          if (data.buildingName !== '') {
            extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
          }
          fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
        }
    
        setFullAddress(fullAddress);
        setShowMap(true);
    }

    // 자격요건 관련 함수 {
    function handleUpdateQualification(e) {
        setQualification(e.target.value);
    }

    function handleModifyUpdateQualification(e, index) {
        const tempQualificationList = [...qualificationList];

        tempQualificationList[index].qualification = e.target.value;

        setQualificationList(tempQualificationList);
    }

    function handleAddQualification() {
        if (qualification.length <= 0) {
            toast.warn('아무것도 입력되지 않았어요.', {
                position: "bottom-center",
                autoClose: 3000,
            });
            return;
        }

        const tempQualificationList = [...qualificationList];

        const qualificationObject = {
            qualification,
            isModify: false
        }

        tempQualificationList.push(qualificationObject);
        setQualification('');
        setQualificationList(tempQualificationList);
    }

    function handleModifyQualification(index) {
        const tempQualificationList = [...qualificationList];

        tempQualificationList[index].isModify = !tempQualificationList[index].isModify;

        setQualificationList(tempQualificationList);
    }

    function handleRemoveQualification(index) {
        const tempQualificationList = [...qualificationList];

        tempQualificationList.splice(index, 1);

        setQualificationList(tempQualificationList);
    }
    // }

    // 우대사항 관련 함수 {
    function handleUpdateBenefit(e) {
        setBenefit(e.target.value);
    }

    function handleModifyUpdateBenefit(e, index) {
        const tempBenefitList = [...benefitList];

        tempBenefitList[index].benefit = e.target.value;

        setBenefitList(tempBenefitList);
    }

    function handleAddBenefit() {
        if (benefit.length <= 0) {
            toast.warn('아무것도 입력되지 않았어요.', {
                position: "bottom-center",
                autoClose: 3000,
            });
            return;
        }

        const tempBenefitList = [...benefitList];

        const benefitObject = {
            benefit,
            isModify: false
        }

        tempBenefitList.push(benefitObject);
        setBenefit('');
        setBenefitList(tempBenefitList);
    }

    function handleModifyBenefit(index) {
        const tempBenefitList = [...benefitList];

        tempBenefitList[index].isModify = !tempBenefitList[index].isModify;

        setBenefitList(tempBenefitList);
    }

    function handleRemoveBenefit(index) {
        const tempBenefitList = [...benefitList];

        tempBenefitList.splice(index, 1);

        setBenefitList(tempBenefitList);
    }
    // }

    // 혜택 및 복지 관련 함수 {
    function handleUpdateWalfare(e) {
        const keyword = e.target.value;
        setWalfareAutoComplete(() => handleSearchWalfareList(keyword));

        setWalfare(keyword);
    }

    function handleAddWalfare(keyword) {
        let tempWalfare = keyword ? keyword : walfare;

        const walfareObject = {
            walfare: undefined,
            isModify: false
        }

        if (!keyword) {
            if (walfare.length <= 0) {
                toast.warn('아무것도 입력되지 않았어요.', {
                    position: "bottom-center",
                    autoClose: 3000,
                });
                return;
            }
        }

        const tempWalfareList = [...walfareList];

        walfareObject.walfare = tempWalfare;

        tempWalfareList.push(walfareObject);
        setWalfare('');
        setWalfareList(tempWalfareList);
    }
    // }

    function changeFile(event, index) {
        event.preventDefault();
        
        const file = event.target.files[0];
        const reader = new FileReader(file);
        const formData = new FormData();

        reader.readAsDataURL(file);
        reader.onload = () => {
            setImages({
                ...images,
                [`image${index}`]: reader.result
            });
        };
        reader.onerror = () => {
            console.log('error');
        }

        formData.append('file', file);
    }

    function sendPostContents() {
        const extractTextPattern = /(<([^>]+)>)/gi;
        const html = editorRef1.current.getInstance().getHTML();
        const plainText = html.replace(extractTextPattern, '');

        console.log(plainText);
        console.log(html);
    }

    return (
        <div className={styles.container}>
            {/* 좌측 contents 영역 */}
            <div className={styles.edit_area}>
                <section>
                    <div className={styles.title_area}>
                        <p className={styles.title}>채용공고 제목</p>
                        <p className={styles.description}>
                            채용을 원하는 직무명을 포함하여 제목을 작성해주시면 정확히 원하는 인재를 채용할 확률이 높아집니다.
                        </p>
                    </div>
                    <div className={styles.editor}>
                       <input type='text' 
                            value={postTitle} 
                            onChange={handleUpdateTitle} 
                            placeholder='채용공고 제목을 입력해주세요'
                            autoFocus
                       />
                    </div>
                </section>

                <section>
                    <div className={styles.title_area}>
                        <p className={styles.title}>사진</p>
                        <p className={styles.description}>
                            사진은 지원자가 가장 먼저 보게 될 영역입니다. 회사를 자랑할 수 있는 사진들을 1개 이상 올려주세요.
                            <br />회사를 최대한 보여줄 수 있는 사진들은 지원자들이 지원할 확률과 북마크할 가능성이 높아집니다.
                        </p>
                    </div>
                    <div className={styles.slide_images}>
                        <ul>
                            <label htmlFor='file1'>
                                <input type='file' id='file1' accept='image/png, image/jpeg' onChange={(e) => changeFile(e, 1)} />

                                <li>
                                    {
                                        images.image1 ?
                                        <>
                                            <img src={images.image1} className={styles.uploaded_image} />
                                        </>
                                        :
                                        <>
                                            <Webp src='/assets/images/post/upload_file.png' className={styles.icon_upload} />
                                            <p>사진 추가</p>
                                        </>
                                    }
                                </li>
                            </label>
                            <label htmlFor='file2'>
                                <input type='file' id='file2' accept='image/png, image/jpeg' onChange={(e) => changeFile(e, 2)} />

                                <li>
                                    {
                                        images.image2 ?
                                        <>
                                            <img src={images.image2} className={styles.uploaded_image} />
                                        </>
                                        :
                                        <>
                                            <Webp src='/assets/images/post/upload_file.png' className={styles.icon_upload} />
                                            <p>사진 추가</p>
                                        </>
                                    }
                                </li>
                            </label>
                            <label htmlFor='file3'>
                                <input type='file' id='file3' accept='image/png, image/jpeg' onChange={(e) => changeFile(e, 3)} />

                                <li>
                                    {
                                        images.image3 ?
                                        <>
                                            <img src={images.image3} className={styles.uploaded_image} />
                                        </>
                                        :
                                        <>
                                            <Webp src='/assets/images/post/upload_file.png' className={styles.icon_upload} />
                                            <p>사진 추가</p>
                                        </>
                                    }
                                </li>
                            </label>
                            <label htmlFor='file4'>
                                <input type='file' id='file4' accept='image/png, image/jpeg' onChange={(e) => changeFile(e, 4)} />

                                <li>
                                    {
                                        images.image4 ?
                                        <>
                                            <img src={images.image4} className={styles.uploaded_image} />
                                        </>
                                        :
                                        <>
                                            <Webp src='/assets/images/post/upload_file.png' className={styles.icon_upload} />
                                            <p>사진 추가</p>
                                        </>
                                    }
                                </li>
                            </label>
                            <label htmlFor='file5'>
                                <input type='file' id='file5' accept='image/png, image/jpeg' onChange={(e) => changeFile(e, 5)} />

                                <li>
                                    {
                                        images.image5 ?
                                        <>
                                            <img src={images.image5} className={styles.uploaded_image} />
                                        </>
                                        :
                                        <>
                                            <Webp src='/assets/images/post/upload_file.png' className={styles.icon_upload} />
                                            <p>사진 추가</p>
                                        </>
                                    }
                                </li>
                            </label>
                        </ul>
                    </div>
                </section>
                
                <div className={styles.tab_area}>
                    <ul>
                        <li className={tabIndex === 0 ? styles.current : undefined} onClick={() => handleChangeTab(0)}>가이드 양식</li>
                        <li className={tabIndex === 1 ? styles.current : undefined} onClick={() => handleChangeTab(1)}>자유 양식</li>
                    </ul>
                </div>

                {/* 가이드 양식을 선택한 경우 */}
                {
                    tabIndex === 0 &&
                    <>
                        <section>
                            <div className={styles.title_area}>
                                <p className={styles.title}>회사소개</p>
                                <p className={styles.description}>
                                    회사를 자세하게 소개해주세요.<br />
                                    회사의 비전과 사업 방향 그리고 이제부터 해결해나가야 할 과제들 등에 대해 자세하게 소개해주시면 원하는 인재를 찾으실 확률이 높아집니다.
                                </p>
                            </div>
                            <div className={styles.editor}>
                                <ToastEditor 
                                    editorRef={editorRef2}
                                    height={300}
                                    onChange={() => handleUpdateEditor(2)}
                                    // placeholder='회사에 대해서 소개해주세요.'
                                />
                            </div>
                        </section>

                        <section>
                            <div className={styles.title_area}>
                                <p className={styles.title}>주요업무</p>
                                <p className={styles.description}>
                                    채용될 경우 어떤 업무를 맡게 될지에 대해 자세하게 설명해주세요.<br />
                                    업무가 구체적 일수록 업무에 자신있는 지원자가 지원할 확률이 높아집니다.
                                </p>
                            </div>
                            <div className={styles.editor}>
                                <ToastEditor 
                                    editorRef={editorRef3}
                                    height={300}
                                    onChange={() => handleUpdateEditor(3)}
                                    // placeholder='어떤 업무를 수행하게 될지 자세하게 설명해주세요.'
                                />
                            </div>
                        </section>

                        <section>
                            <div className={styles.title_area}>
                                <p className={styles.title}>자격요건</p>
                                <p className={styles.description}>
                                    회사가 원하는 인재의 자격요건을 한 개씩 간결하게 설명해주세요.
                                </p>
                            </div>
                            <div className={styles.editor}>
                                <div className={styles.controller}>
                                    <input className={styles.textbox} 
                                        value={qualification} 
                                        onChange={handleUpdateQualification} 
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                handleAddQualification();
                                            }
                                        }}
                                    />
                                    <button className={styles.button_add} onClick={handleAddQualification}>추가하기</button>
                                </div>
                                <div className={styles.add_list}>
                                    <ul>
                                        { qualificationList.map((qualification, index) => 
                                            <li key={`qualification${index}`}>
                                                <div className={styles.list_content}>
                                                    { !qualification.isModify &&
                                                        <>
                                                            <span>{qualification.qualification}</span>
                                                            <div className={styles.buttons_area}>
                                                                <div className={`${styles.button} ${styles.edit}`} 
                                                                    onClick={() => handleModifyQualification(index)}>
                                                                    수정
                                                                </div>
                                                                <div className={`${styles.button} ${styles.remove}`} 
                                                                    onClick={() => handleRemoveQualification(index)}>
                                                                    삭제
                                                                </div>
                                                            </div>
                                                        </>
                                                    }
                                                    { qualification.isModify && 
                                                        <>
                                                            <input value={qualification.qualification} 
                                                                onChange={(e) => handleModifyUpdateQualification(e, index)}
                                                                onKeyPress={(e) => {
                                                                    if (e.key === 'Enter') {
                                                                        handleModifyQualification(index);
                                                                    }
                                                                }} />
                                                            <div className={`${styles.button} ${styles.confirm}`} 
                                                                onClick={() => handleModifyQualification(index)}>
                                                                확인
                                                            </div>
                                                        </>
                                                    }
                                                </div>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </section>

                        <section>
                            <div className={styles.title_area}>
                                <p className={styles.title}>우대사항</p>
                                <p className={styles.description}>
                                    채용 시 우대사항이 있으실 경우 채용될 가능성이 높아진다는 점을 알려주세요.<br />
                                    우대사항을 함께 알려주시면 원하는 인재를 채용할 확률이 높아집니다. 더 나은 채용을 위해 한 개씩 간결하게 설명해주세요.
                                </p>
                            </div>
                            <div className={styles.editor}>
                                <div className={styles.controller}>
                                    <input className={styles.textbox} 
                                    value={benefit} 
                                    onChange={handleUpdateBenefit}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            handleAddBenefit();
                                        }
                                    }}
                                    />
                                    <button className={styles.button_add} onClick={handleAddBenefit}>추가하기</button>
                                </div>
                                <div className={styles.add_list}>
                                    <ul>
                                        { benefitList.map((benefit, index) => 
                                            <li key={`benefit${index}`}>
                                                <div className={styles.list_content}>
                                                    { !benefit.isModify &&
                                                        <>
                                                            <span>{benefit.benefit}</span>
                                                            <div className={styles.buttons_area}>
                                                                <div className={`${styles.button} ${styles.edit}`} 
                                                                    onClick={() => handleModifyBenefit(index)}>
                                                                    수정
                                                                </div>
                                                                <div className={`${styles.button} ${styles.remove}`} 
                                                                    onClick={() => handleRemoveBenefit(index)}>
                                                                    삭제
                                                                </div>
                                                            </div>
                                                        </>
                                                    }
                                                    { benefit.isModify && 
                                                        <>
                                                            <input value={benefit.benefit} 
                                                                onChange={(e) => handleModifyUpdateBenefit(e, index)}
                                                                onKeyPress={(e) => {
                                                                    if (e.key === 'Enter') {
                                                                        handleModifyBenefit(index);
                                                                    }
                                                                }} />
                                                            <div className={`${styles.button} ${styles.confirm}`} 
                                                                onClick={() => handleModifyBenefit(index)}>
                                                                확인
                                                            </div>
                                                        </>
                                                    }
                                                </div>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </section>

                        <section>
                            <div className={styles.title_area}>
                                <p className={styles.title}>혜택 및 복지</p>
                                <p className={styles.description}>
                                    회사의 혜택과 복지에 대해서 설명해주세요.
                                </p>
                            </div>
                            <div className={styles.editor}>
                                <div className={styles.controller}>
                                    <input className={styles.textbox} 
                                        value={walfare} 
                                        onChange={handleUpdateWalfare}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                handleAddWalfare();
                                            }
                                        }}
                                    />
                                    <button className={styles.button_add} onClick={handleAddWalfare}>추가하기</button>
                                </div>
                                
                                <div className={styles.auto_complete_area} style={{ display: (walfare.length >= 2 && walfareAutoComplete.length > 0) ? 'block' : 'none' }}>
                                    <p className={styles.auto_complete_notice}>
                                        <Webp src='/assets/images/post/information.png' />
                                        자동완성기에 나열된 복지를 클릭하시거나 입력한 복지가 없으시면 [Enter] 혹은 [추가하기]를 눌러주세요.
                                    </p>

                                    {
                                        walfareAutoComplete.map((complete) => {
                                            const subList = complete.searchList.map((walfareName) => 
                                                <li key={utilCommon.getRandomKey()} onClick={() => handleAddWalfare(walfareName.list_name)}>
                                                    { walfareName.list_name }
                                                </li>
                                            )

                                            return  (
                                                <div key={complete.key} className={styles.auto_complete_item}>
                                                    <p className={styles.walfare_category}>{complete.name}</p>
                                                    <div className={styles.walfare_list_area}>
                                                        <ul>
                                                            { subList }
                                                        </ul>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    }
                                </div>

                                <div className={styles.add_list}>
                                    <ul>
                                        { walfareList.map((walfare, index) => 
                                            <li key={`walfare${index}`}>
                                                <div className={styles.list_content}>
                                                    { !walfare.isModify &&
                                                        <>
                                                            <span>{walfare.walfare}</span>
                                                            <div className={styles.buttons_area}>
                                                                <div className={`${styles.button} ${styles.edit}`} 
                                                                    onClick={() => handleModifyWalfare(index)}>
                                                                    수정
                                                                </div>
                                                                <div className={`${styles.button} ${styles.remove}`} 
                                                                    onClick={() => handleRemoveWalfare(index)}>
                                                                    삭제
                                                                </div>
                                                            </div>
                                                        </>
                                                    }
                                                    { walfare.isModify && 
                                                        <>
                                                            <input value={walfare.walfare} 
                                                                onChange={(e) => handleModifyUpdateWalfare(e, index)}
                                                                onKeyPress={(e) => {
                                                                    if (e.key === 'Enter') {
                                                                        handleModifyWalfare(index);
                                                                    }
                                                                }} />
                                                            <div className={`${styles.button} ${styles.confirm}`} 
                                                                onClick={() => handleModifyWalfare(index)}>
                                                                확인
                                                            </div>
                                                        </>
                                                    }
                                                </div>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </section>
                    </>
                }

                {/* 자유양식을 선택한 경우 */}
                {
                    tabIndex === 1 &&
                    <section>
                        <div className={styles.title_area}>
                            <p className={styles.title}>채용공고 세부내용</p>
                            <p className={styles.description}>
                                회사 소개와 회사에서 원하는 인재의 자격요건과 우대사항 그리고 혜택 및 복지, 채용 절차 등에 대해 자유롭게 300자 이상으로 설명해주세요.
                            </p>
                        </div>
                        <div className={styles.editor}>
                            <ToastEditor
                                height={600}
                                editorRef={editorRef1}
                                onChange={() => handleUpdateEditor(1)}
                                // placeholder='채용공고를 자세하고 자유로운 양식으로 작성해주세요. 작성해주신 채용공고는 1시간 이내에 이공계사람들에서 심사 후 승인되면 보여집니다.'
                            />
                        </div>
                    </section>
                }

                <section>
                    <div className={styles.title_area}>
                        <p className={styles.title}>근무지</p>
                        <p className={styles.description}>
                            회사에서 채용된 인재가 업무를 보게 될 근무지를 입력해주세요.
                        </p>
                    </div>
                    <div className={styles.map_area}>
                        { !showMap &&
                            <DaumPostcode
                                onComplete={handleComplete}
                                className={styles.daum_address}
                            />
                        }

                        <div className={styles.map_location_area} style={{ display: showMap ? 'block' : 'none' }}>
                            <div className={styles.address_controller}>
                                <p className={styles.address}>{fullAddress}</p>
                                <button onClick={() => setShowMap(false)}>수정하기</button>
                            </div>
                            <div ref={mapRef} className={styles.kakao_map}></div>
                        </div>
                    </div>
                </section>
            </div>

            {/* 우측 sticky 영역 */}
            <div className={styles.submit_area}>
                <div className={styles.static_submit_area}>
                    <p className={styles.title}>채용공고 작성하기</p>
                    <p className={styles.description}>작성된 채용공고는 1시간 이내에 이공계사람들에서 검토 후 승인 시 보여집니다. 미승인 처리되실 경우 이메일과 연락처로 안내해드립니다.</p>
                    
                    <div className={styles.check_list_area}>
                        <ul>
                            <li>
                                <Webp src={validateList.validPostTitle ? '/assets/images/post/check_active.png' : '/assets/images/post/check_inactive.png'} />
                                <span style={{ color: validateList.validPostTitle ? '#000' : undefined }}>채용공고 제목 작성</span>
                            </li>
                            <li>
                                <Webp src={validateList.validPictures ? '/assets/images/post/check_active.png' : '/assets/images/post/check_inactive.png'} />
                                <span style={{ color: validateList.validPictures ? '#000' : undefined }}>사진 1장 이상 추가</span>
                            </li>

                            {/* 가이드 양식을 선택했을 경우 */}
                            { tabIndex === 0 &&
                                <>
                                    <li>
                                        <Webp src={validateList.validAboutCompany ? '/assets/images/post/check_active.png' : '/assets/images/post/check_inactive.png'} />
                                        <span style={{ color: validateList.validAboutCompany ? '#000' : undefined }}>회사소개 200자 이상 작성({ editorWordCounter.editor2 }자)</span>
                                    </li>
                                    <li>
                                        <Webp src={validateList.validMainJob ? '/assets/images/post/check_active.png' : '/assets/images/post/check_inactive.png'} />
                                        <span style={{ color: validateList.validMainJob ? '#000' : undefined }}>주요업무 200자 이상 작성({ editorWordCounter.editor3 }자)</span>
                                    </li>
                                    <li>
                                        <Webp src={validateList.validQualification ? '/assets/images/post/check_active.png' : '/assets/images/post/check_inactive.png'} />
                                        <span style={{ color: validateList.validQualification ? '#000' : undefined }}>자격요건 1개 이상 등록</span>
                                    </li>
                                    <li>
                                        <Webp src={validateList.validWalfare ? '/assets/images/post/check_active.png' : '/assets/images/post/check_inactive.png'} />
                                        <span style={{ color: validateList.validWalfare ? '#000' : undefined }}>혜택 및 복지 작성</span>
                                    </li>
                                </>
                            }

                            {/* 자유 양식을 선택했을 경우 */}
                            { tabIndex === 1 &&
                                <>
                                    <li>
                                        <Webp src={validateList.validContents ? '/assets/images/post/check_active.png' : '/assets/images/post/check_inactive.png'} />
                                        <span style={{ color: validateList.validContents ? '#000' : undefined }}>채용공고 세부내용 300자 이상 작성({ editorWordCounter.editor1 }자)</span>
                                    </li>
                                </>
                            }

                            <li>
                                <Webp src={validateList.validAddress ? '/assets/images/post/check_active.png' : '/assets/images/post/check_inactive.png'} />
                                <span style={{ color: validateList.validAddress ? '#000' : undefined }}>근무지 설정</span>
                            </li>
                        </ul>
                    </div>

                    <div className={styles.submit_controller}>
                        <button className={styles.submit} onClick={sendPostContents}>작성하기</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
import React, { useEffect, useRef, useState } from 'react';
import DaumPostcode from 'react-daum-postcode';

import dynamic from 'next/dynamic';

const ToastEditor = dynamic(() => import('../../../components/editor/ToastEditor'), { ssr: false });

import styles from '../../../styles/post/PostEdit.module.scss';
import Webp from '../../../components/common/Webp';

export default function PostEdit() {
    const [postTitle, setPostTitle] = useState('');
    const [fullAddress, setFullAddress] = useState('');
    const [showMap, setShowMap] = useState(false);
    const [validateList, setValidateList] = useState({
        validPostTitle: false,
        validPictures: false,
        validContents: false,
        validAddress: false,
    });
    const [images, setImages] = useState({
        image1: null,
        image2: null,
        image3: null,
        image4: null,
        image5: null,
    });
    const [editorWordCounter, setEditorWordCounter] = useState({
        editor1: 0,
    });
    const [tabIndex, setTabIndex] = useState(0);

    const mapRef = useRef();
    const editorRef = useRef();

    useEffect(() => {
        if (editorWordCounter.editor1 > 300) {
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
    }, [editorWordCounter]);

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

    function handleUpdateEditor(index) {
        if (!editorRef.current) {
            return;
        }

        const extractTextPattern = /(<([^>]+)>)/gi;
        const html = editorRef.current.getInstance().getHTML();
        const plainText = html.replace(extractTextPattern, '');

        setEditorWordCounter({
            ...editorWordCounter,
            [`editor${index}`]: plainText.length
        });
    }

    function handleUpdateTitle(e) {
        setPostTitle(e.target.value);
    }

    function handleComplete(data) {
        console.log(data);

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
        const html = editorRef.current.getInstance().getHTML();
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
                        <li className={tabIndex === 0 && styles.current} onClick={() => setTabIndex(0)}>가이드 양식</li>
                        <li className={tabIndex === 1 && styles.current} onClick={() => setTabIndex(1)}>자유 양식</li>
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
                                    editorRef={editorRef}
                                    height={300}
                                    onChange={() => handleUpdateEditor(2)}
                                    placeholder='회사에 대해서 소개해주세요.'
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
                                    editorRef={editorRef}
                                    height={300}
                                    onChange={() => handleUpdateEditor(3)}
                                    placeholder='어떤 업무를 수행하게 될지 자세하게 설명해주세요.'
                                />
                            </div>
                        </section>

                        <section>
                            <div className={styles.title_area}>
                                <p className={styles.title}>자격요건</p>
                                <p className={styles.description}>
                                    회사가 원하는 인재의 자격요건을 설명해주세요.
                                </p>
                            </div>
                            <div className={styles.editor}>
                                <ToastEditor 
                                    editorRef={editorRef}
                                    height={300}
                                    onChange={() => handleUpdateEditor(4)}
                                    placeholder='어떤 자격 요건을 가진 인재를 원하시는지 설명해주세요.'
                                />
                            </div>
                        </section>

                        <section>
                            <div className={styles.title_area}>
                                <p className={styles.title}>우대사항</p>
                                <p className={styles.description}>
                                    채용 시 우대사항이 있으실 경우 채용될 가능성이 높아진다는 점을 알려주세요.<br />
                                    우대사항을 함께 알려주시면 원하는 인재를 채용할 확률이 높아집니다.
                                </p>
                            </div>
                            <div className={styles.editor}>
                                <ToastEditor 
                                    editorRef={editorRef}
                                    height={300}
                                    onChange={() => handleUpdateEditor(5)}
                                    placeholder='자격요건에 이어 우대사항도 있다면 함께 설명해주세요.'
                                />
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
                                <ToastEditor 
                                    editorRef={editorRef}
                                    height={300}
                                    onChange={() => handleUpdateEditor(6)}
                                    placeholder='회사의 혜택과 복지에 대해 자세하게 설명해주세요.'
                                />
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
                                editorRef={editorRef}
                                onChange={() => handleUpdateEditor(1)}
                                placeholder='채용공고를 자세하고 자유로운 양식으로 작성해주세요. 작성해주신 채용공고는 1시간 이내에 이공계사람들에서 심사 후 승인되면 보여집니다.'
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
                                <span style={{ color: validateList.validPostTitle && '#000' }}>채용공고 제목 작성</span>
                            </li>
                            <li>
                                <Webp src={validateList.validPictures ? '/assets/images/post/check_active.png' : '/assets/images/post/check_inactive.png'} />
                                <span style={{ color: validateList.validPictures && '#000' }}>사진 1장 이상 추가</span>
                            </li>

                            {/* 가이드 양식을 선택했을 경우 */}
                            { tabIndex === 0 &&
                                <>
                                    <li>
                                        <Webp src={validateList.validContents ? '/assets/images/post/check_active.png' : '/assets/images/post/check_inactive.png'} />
                                        <span style={{ color: validateList.validContents && '#000' }}>회사소개 작성</span>
                                    </li>
                                    <li>
                                        <Webp src={validateList.validContents ? '/assets/images/post/check_active.png' : '/assets/images/post/check_inactive.png'} />
                                        <span style={{ color: validateList.validContents && '#000' }}>주요업무 작성</span>
                                    </li>
                                    <li>
                                        <Webp src={validateList.validContents ? '/assets/images/post/check_active.png' : '/assets/images/post/check_inactive.png'} />
                                        <span style={{ color: validateList.validContents && '#000' }}>자격요건 작성</span>
                                    </li>
                                    <li>
                                        <Webp src={validateList.validContents ? '/assets/images/post/check_active.png' : '/assets/images/post/check_inactive.png'} />
                                        <span style={{ color: validateList.validContents && '#000' }}>혜택 및 복지 작성</span>
                                    </li>
                                </>
                            }

                            {/* 자유 양식을 선택했을 경우 */}
                            { tabIndex === 1 &&
                                <>
                                    <li>
                                        <Webp src={validateList.validContents ? '/assets/images/post/check_active.png' : '/assets/images/post/check_inactive.png'} />
                                        <span style={{ color: validateList.validContents && '#000' }}>채용공고 세부내용 300자 이상 작성({ editorWordCounter.editor1 }자)</span>
                                    </li>
                                </>
                            }

                            <li>
                                <Webp src={validateList.validAddress ? '/assets/images/post/check_active.png' : '/assets/images/post/check_inactive.png'} />
                                <span style={{ color: validateList.validAddress && '#000' }}>근무지 설정</span>
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
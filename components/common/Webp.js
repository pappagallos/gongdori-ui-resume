import React, { useState, forwardRef } from 'react';

function Webp(props, ref) {
    const [isError, setIsError] = useState(false);

    if (!props || !props.src) {
        return null;
    }

    const src = props.src;
    const alt = (props.alt) ? props.alt : '';

    let propsList = [];
    let styleList = null;

    Object.keys(props).map((property) => {
        if (property === 'style') {
            styleList = props[property];
        } else if (property !== 'alt' && property !== 'src') {
            propsList[property] = props[property];
        }
    });

    let imageOriginSrc = src;
    let imageFormat = imageOriginSrc.match(/\.(.){3,4}$/gi)[0].replace('.', '');
    let imageWebpSrc = imageOriginSrc.replace(/\.(.){3,4}$/gi, '.webp');

    function handleOnError() {
        console.warn('[WARN] 다음 파일의 Webp 이미지가 업로드되지 않았습니다.', imageOriginSrc);
        setIsError(true);
    }

    if (ref) {
        return (
            (!isError ?
                    <picture onError={handleOnError} ref={ref}>
                        <source srcSet={imageWebpSrc} type="image/webp" />
                        <source srcSet={imageOriginSrc} type={`image/${imageFormat}`} />
                        <img {...propsList} src={imageOriginSrc} alt={alt} style={styleList} />
                    </picture>
                :
                    <img {...propsList} src={imageOriginSrc} alt={alt} style={styleList} ref={ref} />
            )
        )
    } else {
        return (
            (!isError ?
                    <picture onError={handleOnError}>
                        <source srcSet={imageWebpSrc} type="image/webp" />
                        <source srcSet={imageOriginSrc} type={`image/${imageFormat}`} />
                        <img {...propsList} src={imageOriginSrc} alt={alt} style={styleList} />
                    </picture>
                :
                    <img {...propsList} src={imageOriginSrc} alt={alt} style={styleList} />
            )
        )
    }
}

export default forwardRef(Webp);
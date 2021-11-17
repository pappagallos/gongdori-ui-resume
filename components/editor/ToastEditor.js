import React from 'react';
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/i18n/ko-kr';

import '@toast-ui/editor/dist/toastui-editor.css';
import styles from '../../styles/post/PostEdit.module.scss';

export default function ToastEditor({ editorRef, height, placeholder, onChange }) {
    return (
        <div className={styles.toast_container}>
            <Editor
                ref={editorRef}
                height={`${height}px`}
                previewStyle='vertical'
                initialEditType='wysiwyg'
                language='ko-KR'
                toolbarItems={[
                    ['heading', 'bold', 'italic', 'strike'],
                    ['hr', 'quote'],
                    ['ul', 'ol', 'task', 'indent', 'outdent'],
                    ['table', 'image', 'link'],
                ]}
                autofocus={false}
                placeholder={placeholder}
                events={{
                    change: onChange
                }}
            />
        </div>
    );
}
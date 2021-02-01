import React, { useEffect } from 'react';
import './editor.css';
import Wysiwyg from './Wysiwyg/Wysiwyg';

const EditorPage = () => {
    useEffect(() => {
        console.log('editor');
    }, []);

    return (
        <div className="editor-page">
            <Wysiwyg />
        </div>
    );
};

export default EditorPage;

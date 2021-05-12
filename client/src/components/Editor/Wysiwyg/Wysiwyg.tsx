import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.bubble.css';
import 'react-quill/dist/quill.snow.css';

const Wysiwyg = ({
    setEditorHTML,
    editorHTML,
    handleSubmit,
    draftId,
    saveAsDraft,
}: any) => {
    const handleEditorChange = (html: string) => {
        setEditorHTML(html);
    };

    const modules = {
        toolbar: [
            [{ header: '1' }, { header: '2' }, { font: [] }],
            [{ size: [] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [
                { list: 'ordered' },
                { list: 'bullet' },
                { indent: '-1' },
                { indent: '+1' },
            ],
            ['link', 'image', 'video'],
            ['clean'],
        ],
        clipboard: {
            matchVisual: false,
        },
    };

    const formats = [
        'header',
        'font',
        'size',
        'bold',
        'italic',
        'underline',
        'strike',
        'blockquote',
        'list',
        'bullet',
        'indent',
        'link',
        'image',
        'video',
    ];

    return (
        <div className="Wysiwyg">
            <ReactQuill
                className="actual-editor"
                theme="snow"
                value={editorHTML || ''}
                onChange={handleEditorChange}
                modules={modules}
                formats={formats}
                placeholder="Start Sharing..."
                bounds=".app"
            />

            <div className="editor-controls">
                <button className="draft-btn" onClick={saveAsDraft}>
                    Save as draft
                </button>
                <button className="publish-btn" onClick={handleSubmit}>
                    Publish Story
                </button>
            </div>
        </div>
    );
};

export default Wysiwyg;

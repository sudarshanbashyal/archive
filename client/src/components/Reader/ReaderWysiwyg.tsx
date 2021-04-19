import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.bubble.css';
import 'react-quill/dist/quill.snow.css';

const ReaderWysiwyg = ({ blogContent }: { blogContent: string }) => {
    return (
        <div className="reader-wysiwyg">
            <ReactQuill
                className="actual-editor"
                theme="bubble"
                style={{ fontSize: '1.5rem' }}
                value={blogContent}
                readOnly={true}
                bounds=".app"
            />
        </div>
    );
};

export default ReaderWysiwyg;

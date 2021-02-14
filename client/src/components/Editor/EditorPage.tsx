import React, { useRef, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { openModal } from 'src/redux/Actions/applicationActions';
import { showFailureToast } from '../Utils/ToastNotification';
import './editor.css';
import Wysiwyg from './Wysiwyg/Wysiwyg';

const EditorPage = () => {
    const dispatch = useDispatch();

    //
    const [blogTitle, setBlogTitle] = useState<string | null>(null);
    const [blogTopics, setBlogTopics] = useState<
        Array<{ topic_id: number; topic_image: string; topic_title: string }>
    >([]);
    const [selectedTopic, setSelectedTopic] = useState<number | null>(null);

    // image preview and error
    const imageUpload = useRef<any>(null);

    const [previewSource, setPreviewSource] = useState<any>(null);
    const [imageError, setImageError] = useState<string | null>(null);

    // editor state, onchange functions
    const [editorHTML, setEditorHTML] = useState();
    const [editorError, setEditorError] = useState<string | null>(null);

    // image uploader and previewer
    const openFileUploader = (): void => {
        imageUpload.current!.click();
    };

    const handleFileInputChange = (e: any): void => {
        const file = e.target.files![0];
        if (file) {
            if (!file.name.match(/.(jpg|jpeg|png|gif)$/i)) {
                setImageError('The uploaded file has to be an image.');
                return;
            }
            if (file.size > 1000000) {
                setImageError('The image must be under 1MB.');
                return;
            }
            setImageError(null);
            previewImage(file);
        }
    };

    const previewImage = (file: Blob) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setPreviewSource(reader.result);
        };
    };

    const removePreviewImage = () => {
        setPreviewSource(null);
    };

    // blog submission and validation
    const handleSubmit = () => {
        if (!blogTitle) {
            setEditorError('Your blog must have a title.');
            console.log(editorError);
        } else if (!previewSource) {
            setEditorError('You must upload an image.');
            console.log(editorError);
        } else if (!selectedTopic) {
            setEditorError('You must select a topic.');
            console.log(editorError);
        } else if (!editorHTML) {
            setEditorError('Your blog cannot be empty.');
            console.log(editorError);
        } else {
            setEditorError(null);
            dispatch(openModal('uploadBlog'));
        }
    };

    useEffect(() => {
        (async function () {
            const res = await fetch('topic/getTopics');
            const data = await res.json();
            setBlogTopics(data.data);
        })();
    }, []);

    return (
        <div className="editor-page">
            <input
                type="text"
                className="story-title"
                placeholder="Title your Story..."
                onChange={e => {
                    setBlogTitle(e.target.value);
                }}
            />

            <input
                type="file"
                name="image"
                ref={imageUpload}
                style={{ display: 'none' }}
                onChange={handleFileInputChange}
            />

            {previewSource ? (
                <div className="header-image">
                    <svg
                        onClick={removePreviewImage}
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                    >
                        <path d="M9 19c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5-17v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.315c0 .901.73 2 1.631 2h5.712zm-3 4v16h-14v-16h-2v18h18v-18h-2z" />
                    </svg>
                    <img src={previewSource} alt="Header Image" />
                </div>
            ) : (
                <div>
                    <div
                        className="header-image-placeholder"
                        onClick={openFileUploader}
                    >
                        <p>Click here to upload a header.</p>
                    </div>
                    <p className="error-message">{imageError && imageError}</p>
                </div>
            )}

            <label className="topic-label" htmlFor="blog-topic">
                Select a topic for your blog:{' '}
            </label>
            <select
                id="blog-topic"
                onChange={(e: any) => {
                    setSelectedTopic(+e.target.value);
                }}
            >
                <option id="blog-option" selected disabled>
                    Select a topic
                </option>
                {blogTopics.map(topic => (
                    <option key={topic.topic_id} value={topic.topic_id}>
                        {topic.topic_title}
                    </option>
                ))}
            </select>

            <p className="error-message">{editorError && editorError}</p>

            <Wysiwyg
                setEditorHTML={setEditorHTML}
                editorHTML={editorHTML}
                handleSubmit={handleSubmit}
            />
        </div>
    );
};

export default EditorPage;

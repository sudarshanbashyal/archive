import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { loadingAnimation } from 'src/assets/SVGs';
import { RootStore } from 'src/redux/store';
import { draftsType } from '../Profile';
import './profileDrafts.css';

interface draftInterface {
    draftId: number;
    draftTitle: string;
    draftContent: string;
    lastModified: Date;
}

const ProfileDrafts = () => {
    const userState = useSelector((state: RootStore) => state.client);
    const applicationState = useSelector(
        (state: RootStore) => state.application
    );

    const [loading, setLoading] = useState<boolean>(false);
    const [draftBlogs, setDraftBlogs] = useState<draftInterface[]>([]);

    useEffect(() => {
        (async function getDrafts() {
            setLoading(true);
            const res = await fetch(`/blog/getDrafts`, {
                headers: {
                    authorization: `bearer ${
                        userState && userState.client?.accessToken
                    }`,
                },
            });

            const data = await res.json();
            if (data.ok) {
                setDraftBlogs(data.drafts);
                setLoading(false);
            } else {
                setLoading(false);
            }
        })();
    }, []);

    return loading ? (
        loadingAnimation
    ) : (
        <div
            className={
                'drafts ' +
                (applicationState &&
                applicationState.applicationTheme === 'dark'
                    ? 'drafts-dark'
                    : '')
            }
        >
            {draftBlogs.length === 0 ? (
                <h2>You do not have any drafts.</h2>
            ) : (
                draftBlogs.map((draft, index) => (
                    <div key={draft.draftId} className="draft">
                        <h2 className="index">
                            {index < 10 ? '0' + (index + 1) : index}
                        </h2>

                        <div className="draft-info">
                            <Link
                                className="link"
                                to={`/editor/${draft.draftId}`}
                            >
                                <h2>{draft.draftTitle}</h2>
                            </Link>

                            <div className="last-modified">
                                Last Modified:{' '}
                                <strong>
                                    {moment(draft.lastModified).format(
                                        'MMM Do'
                                    )}
                                </strong>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default ProfileDrafts;

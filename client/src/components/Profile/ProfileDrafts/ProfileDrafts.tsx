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
        <div className="drafts">
            {draftBlogs.length === 0 ? (
                <h2>You do not have any drafts.</h2>
            ) : (
                draftBlogs.map(draft => (
                    <div key={draft.draftId} className="draft">
                        <Link
                            style={{
                                textDecoration: 'none',
                                color: 'black',
                            }}
                            to={`/editor/${draft.draftId}`}
                        >
                            <h2>{draft.draftTitle}</h2>
                        </Link>

                        <div className="last-modified">
                            Last Modified:{' '}
                            <strong>
                                {moment(draft.lastModified).format('MMM Do')}
                            </strong>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default ProfileDrafts;

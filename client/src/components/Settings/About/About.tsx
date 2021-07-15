import React from 'react';
import {
    githubIcon,
    nodeIcon,
    postgresIcon,
    reactIcon,
    sassIcon,
    typescriptIcon,
} from 'src/assets/SVGs';
import './about.css';

const About = () => {
    return (
        <div className="about-settings">
            <div className="setting-section">
                <h2 className="section-title">About</h2>

                <p>This application was made as a practice.</p>

                <p className="github-link">
                    You can find the code for this application here:{' '}
                    <a
                        target="blank"
                        href="https://github.com/sudarshanbashyal/archive"
                    >
                        <span>{githubIcon}</span>
                    </a>
                </p>
            </div>

            <div className="setting-section">
                <h2 className="section-title">the stack</h2>
                <p>The technologies used for this project are listed below:</p>

                <div className="tech-icons">
                    <span>{reactIcon}</span>
                    <span>{typescriptIcon}</span>
                    <span>{sassIcon}</span>
                    <span>{nodeIcon}</span>
                    <span>{postgresIcon}</span>
                </div>
            </div>
        </div>
    );
};

export default About;

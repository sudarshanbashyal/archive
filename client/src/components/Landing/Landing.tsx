import React from 'react';
import './landing.css';
import typewriter from '../../assets/images/typewriter.png';
import yellowSwiggle from '../../assets/yellow-swiggle.svg';
import redSwiggle from '../../assets/red-swiggle.svg';
import whiteSwiggle from '../../assets/white-swiggle.svg';
import formSwiggle from '../../assets/form-red-swiggle.svg';
import LoginForm from './LoginForm/LoginForm';
import { useSelector } from 'react-redux';
import { RootStore } from 'src/redux/store';
import { motion } from 'framer-motion';
import { duration } from 'moment';

const Landing = () => {
    const userState = useSelector((state: RootStore) => state.client);

    return (
        <div className="landing">
            <div className="image-section">
                <h3 className="logo-gradient">Archive.</h3>

                <motion.svg
                    className="swiggle yellow-swiggle"
                    data-name="Layer 1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 3307.87 2008.76"
                >
                    <motion.path
                        initial={{
                            pathLength: 0,
                        }}
                        animate={{
                            pathLength: 1,
                        }}
                        transition={{
                            duration: 1,
                            ease: 'easeInOut',
                        }}
                        d="M3.89.94c135.67 558.35-39.14 2311.67 923.62 1956.84S1882.44 473.19 3307 162.71"
                        fill="none"
                        stroke="#ffc94a"
                        strokeMiterlimit={10}
                        strokeWidth={9}
                    />
                </motion.svg>

                <motion.svg
                    className="swiggle white-swiggle"
                    data-name="Layer 1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 3810.79 2110.73"
                >
                    <motion.path
                        initial={{
                            pathLength: 0,
                        }}
                        animate={{
                            pathLength: 1,
                        }}
                        transition={{
                            duration: 1,
                            ease: 'easeInOut',
                        }}
                        d="M3810.57 4c-915.8 52.19-2100.34 814.05-2463 1294.12S1.27 2106.93 1.27 2106.93"
                        fill="none"
                        stroke="#fff"
                        strokeMiterlimit={10}
                        strokeWidth={9}
                    />
                </motion.svg>

                <motion.svg
                    className="swiggle red-swiggle"
                    data-name="Layer 1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 3109.57 676.17"
                >
                    <motion.path
                        initial={{
                            pathLength: 0,
                        }}
                        animate={{
                            pathLength: 1,
                        }}
                        transition={{
                            duration: 0.5,
                            ease: 'easeInOut',
                        }}
                        d="M2.51 163.19C371.14-134.65 945.45 2.92 1404.94 430.32s1302.18 251.09 1701.53-237.74"
                        fill="none"
                        stroke="#f27a7f"
                        strokeMiterlimit={10}
                        strokeWidth={9}
                    />
                </motion.svg>

                <img className="typewriter" src={typewriter} />
            </div>

            <div className="login-section">
                <LoginForm />

                <motion.svg
                    className="swiggle form-swiggle"
                    data-name="Layer 1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 1240.62 1721.25"
                >
                    <motion.path
                        initial={{
                            pathLength: 0,
                        }}
                        animate={{
                            pathLength: 1,
                        }}
                        transition={{
                            duration: 1,
                            ease: 'easeInOut',
                        }}
                        d="M290.41 0c0 266.13-10.12 477.63-93.93 641.84C3.41 1020.16-414.05 1894.21 1240.12 1685.48"
                        fill="none"
                        stroke="#de3b40"
                        strokeMiterlimit={10}
                        strokeWidth={9}
                    />
                </motion.svg>
            </div>
        </div>
    );
};

export default Landing;

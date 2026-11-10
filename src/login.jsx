import React from 'react';
import './styles/login-styles.css';
import useLoginEffects from './scripts/useLoginEffects';

const Login = () => {
    useLoginEffects();

    return (
        <div className="login-page">
            <div className="background-animation">
                <div className="floating-shapes">
                    <div className="shape shape-1"></div>
                    <div className="shape shape-2"></div>
                    <div className="shape shape-3"></div>
                    <div className="shape shape-4"></div>
                    <div className="shape shape-5"></div>
                    <div className="shape shape-6"></div>
                </div>
            </div>

            <div className="container">
                <div className="login-card" id="loginCard">
                    <div className="card-header">
                        <div className="logo-container">
                            <div className="logo-icon">
                                <i className="fas fa-cube"></i>
                            </div>
                            <h1 className="logo-text">Cresoma</h1>
                        </div>
                        <p className="welcome-text">Welcome Back</p>
                        <p className="subtitle">Enter your credentials to continue</p>
                    </div>

                    <form className="login-form" id="loginForm">
                        <div className="input-group">
                            <div className="input-wrapper">
                                <i className="fas fa-envelope input-icon"></i>
                                <input type="email" id="email" placeholder="Email Address" required />
                                <div className="input-focus-border"></div>
                            </div>
                        </div>

                        <div className="input-group">
                            <div className="input-wrapper">
                                <i className="fas fa-lock input-icon"></i>
                                <input type="password" id="password" placeholder="Password" required />
                                <div className="input-focus-border"></div>
                                <button type="button" className="password-toggle" id="passwordToggle">
                                    <i className="fas fa-eye"></i>
                                </button>
                            </div>
                        </div>

                        <div className="form-options">
                            <label className="checkbox-container">
                                <input type="checkbox" id="remember" />
                                <span className="checkmark"></span>
                                Remember me
                            </label>
                            <a href="#" className="forgot-password">Forgot Password?</a>
                        </div>

                        <button type="submit" className="login-btn">
                            <span className="btn-text">Sign In</span>
                            <div className="btn-icon">
                                <i className="fas fa-arrow-right"></i>
                            </div>
                            <div className="btn-glow"></div>
                        </button>
                    </form>

                    <div className="divider">
                        <span>or</span>
                    </div>

                    <div className="social-login">
                        <button className="social-btn google-btn">
                            <i className="fab fa-google"></i>
                            <span>Continue with Google</span>
                        </button>
                        <button className="social-btn github-btn">
                            <i className="fab fa-github"></i>
                            <span>Continue with GitHub</span>
                        </button>
                    </div>

                    <div className="signup-link">
                        <p>Don't have an account? <a href="/signup">Sign Up</a></p>
                    </div>
                </div>

                <div className="floating-elements">
                    <div className="floating-element element-1">
                        <i className="fas fa-star"></i>
                    </div>
                    <div className="floating-element element-2">
                        <i className="fas fa-heart"></i>
                    </div>
                    <div className="floating-element element-3">
                        <i className="fas fa-diamond"></i>
                    </div>
                </div>
            </div>

            <div className="particles-container">
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
            </div>
        </div>
    );
};

export default Login;
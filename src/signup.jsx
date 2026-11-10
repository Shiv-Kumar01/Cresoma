import React from 'react';
import { Link } from 'react-router-dom';
import useSignupEffects from './scripts/useSignupEffects';
import './styles/signup-styles.css';

const Signup = () => {
    useSignupEffects();

    return (
        <div className="signup-page">
            <div className="cosmic-background">
                <div className="stars"></div>
                <div className="twinkling"></div>
                <div className="clouds"></div>
            </div>

            <div className="container">
                <div className="signup-card" id="signupCard">
                    <div className="card-header">
                        <div className="logo-container">
                            <div className="logo-icon">
                                <i className="fas fa-rocket"></i>
                            </div>
                            <h1 className="logo-text">Cresoma</h1>
                        </div>
                        <p className="welcome-text">Join the Adventure</p>
                        <p className="subtitle">Create your account and start exploring</p>
                    </div>

                    <form className="signup-form" id="signupForm">

                        <div className="input-row">
                            <div className="input-group">
                                <div className="input-wrapper">
                                    <i className="fas fa-user input-icon"></i>
                                    <input type="text" id="firstName" placeholder="First Name" required />
                                    <div className="input-focus-border"></div>
                                </div>
                            </div>

                            <div className="input-group">
                                <div className="input-wrapper">
                                    <i className="fas fa-user input-icon"></i>
                                    <input type="text" id="lastName" placeholder="Last Name" required />
                                    <div className="input-focus-border"></div>
                                </div>
                            </div>
                        </div>

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

                        <div className="input-group">
                            <div className="input-wrapper">
                                <i className="fas fa-lock input-icon"></i>
                                <input type="password" id="confirmPassword" placeholder="Confirm Password" required />
                                <div className="input-focus-border"></div>
                                <button type="button" className="password-toggle" id="confirmPasswordToggle">
                                    <i className="fas fa-eye"></i>
                                </button>
                            </div>
                        </div>


                        <div className="form-options">
                            <label className="checkbox-container">
                                <input type="checkbox" id="terms" required />
                                <span className="checkmark"></span>
                                I agree to the <a href="#" className="terms-link">Terms & Conditions</a>
                            </label>
                            <label className="checkbox-container">
                                <input type="checkbox" id="newsletter" />
                                <span className="checkmark"></span>
                                Subscribe to newsletter
                            </label>
                        </div>

                        <button type="submit" className="signup-btn">
                            <span className="btn-text">Create Account</span>
                            <div className="btn-icon">
                                <i className="fas fa-rocket"></i>
                            </div>
                            <div className="btn-glow"></div>
                        </button>
                    </form>

                    <div className="divider">
                        <span>or</span>
                    </div>

                    <div className="social-signup">
                        <button className="social-btn google-btn">
                            <i className="fab fa-google"></i>
                            <span>Sign up with Google</span>
                        </button>
                        <button className="social-btn github-btn">
                            <i className="fab fa-github"></i>
                            <span>Sign up with GitHub</span>
                        </button>
                        <button className="social-btn facebook-btn">
                            <i className="fab fa-facebook"></i>
                            <span>Sign up with Facebook</span>
                        </button>
                    </div>

                    <div className="login-link">
                        <p>Already have an account? <Link to="/login">Sign In</Link></p>
                    </div>
                </div>

                <div className="floating-elements">
                    <div className="floating-element element-1">
                        <i className="fas fa-meteor"></i>
                    </div>
                    <div className="floating-element element-2">
                        <i className="fas fa-satellite"></i>
                    </div>
                    <div className="floating-element element-3">
                        <i className="fas fa-planet-ringed"></i>
                    </div>
                    <div className="floating-element element-4">
                        <i className="fas fa-galaxy"></i>
                    </div>
                </div>
            </div>

            <div className="cosmic-particles">
                <div className="cosmic-particle"></div>
                <div className="cosmic-particle"></div>
                <div className="cosmic-particle"></div>
                <div className="cosmic-particle"></div>
                <div className="cosmic-particle"></div>
                <div className="cosmic-particle"></div>
                <div className="cosmic-particle"></div>
                <div className="cosmic-particle"></div>
                <div className="cosmic-particle"></div>
                <div className="cosmic-particle"></div>
            </div>

            <div className="nebula-effect">
                <div className="nebula nebula-1"></div>
                <div className="nebula nebula-2"></div>
                <div className="nebula nebula-3"></div>
            </div>
        </div>
    );
};

export default Signup;
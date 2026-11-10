import React from "react";
// Import useNavigate
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { Canvas } from "@react-three/fiber";

// Pages
import Login from "./login";
import Signup from "./signup";
import Games from "./game";

// FIXED → correct path + correct file name
import LiveDashboard from "./Livedashboard/LiveDashboard";

// Components for landing page
import HeroScene from "./components/HeroScene";
import useDomEffects from "./components/DomEffects";

// Global styles
import "./styles/styles.css";


// ---------------------------------------------------
// Main Landing Page Component
// ---------------------------------------------------
const MainLandingPage = () => {
    // 1. Get the navigate function
    const navigate = useNavigate();
    useDomEffects();

    return (
        <>
            <nav className="navbar">
                <div className="nav-container">
                    <div className="nav-logo">
                        <span className="logo-text">CRESOMA</span>
                    </div>

                    <ul className="nav-menu">
                        <li><a href="#home">Home</a></li>
                        <li><a href="#features">Features</a></li>
                        <li><Link to="/game">Games</Link></li>
                        <li><Link to="/LiveDashboard">Live Dashboard</Link></li>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/signup">Sign Up</Link></li>
                        <li><a href="#contact">Contact</a></li>
                    </ul>

                    <div className="nav-toggle">
                        <span></span><span></span><span></span>
                    </div>
                </div>
            </nav>

            <section id="home" className="hero">
                <div className="hero-background">
                    <Canvas>
                        <HeroScene />
                    </Canvas>
                </div>

                <div className="hero-content">
                    <div className="hero-text">
                        <h1 className="hero-title">
                            <span className="title-line">Welcome to the Future</span>
                            <span className="title-line">of Collaboration</span>
                        </h1>

                        <p className="hero-subtitle">
                            Experience immersive 3D whiteboarding, interactive games, and AI-powered holograms in real-time.
                        </p>

                        <div className="hero-buttons">
                            <button
                                className="btn btn-primary"
                                // 2. The existing onClick should now work
                                onClick={() => navigate("/LiveDashboard")}
                            >
                                Start Creating
                            </button>

                            <button className="btn btn-secondary">Watch Demo</button>
                        </div>

                    </div>

                    <div className="hero-visual">
                        <div className="floating-elements">
                            <div className="element element-1">🎨</div>
                            <div className="element element-2">🤖</div>
                            <div className="element element-3">🎮</div>
                            <div className="element element-4">✨</div>
                        </div>
                    </div>
                </div>

                <div className="scroll-indicator">
                    <div className="scroll-arrow"></div>
                </div>
            </section>

            <section id="features" className="features">
                <div className="container">
                    <h2 className="section-title">Revolutionary Features</h2>

                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">🎨</div>
                            <h3>Live 3D Whiteboard</h3>
                            <p>Collaborate in real-time with immersive tools.</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">🎮</div>
                            <h3>Interactive Games</h3>
                            <p>Take a break and stay connected.</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">👥</div>
                            <h3>Real-time Collaboration</h3>
                            <p>Work together seamlessly with multiple users.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section id="games" className="games">
                <div className="container">
                    <h2 className="section-title">Built-in Entertainment</h2>

                    <div className="games-showcase">
                        <div className="game-preview">
                            <div className="game-window">
                                <div className="game-header">
                                    <span className="game-title">Flappy Bird</span>

                                    <div className="game-controls">
                                        <span className="control-dot"></span>
                                        <span className="control-dot"></span>
                                        <span className="control-dot"></span>
                                    </div>
                                </div>

                                <div className="game-screen">
                                    <div className="bird"></div>
                                    <div className="pipe pipe-1"></div>
                                    <div className="pipe pipe-2"></div>
                                    <div className="score">0</div>
                                </div>
                            </div>
                        </div>

                        <div className="games-info">
                            <h3>Take a Break, Stay Connected</h3>

                            <p>
                                Our platform includes various mini-games.
                                Perfect for creative breaks.
                            </p>

                            <ul className="games-list">
                                <li>🎮 Flappy Bird</li>
                                <li>🧩 Puzzle Games</li>
                                <li>🎯 Target Practice</li>
                                <li>🏓 Pong</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <section id="contact" className="contact">
                <div className="container">
                    <h2 className="section-title">Ready to Experience the Future?</h2>

                    <div className="contact-content">
                        <div className="contact-info">
                            <h3>Join Cresoma Today</h3>
                            <p>
                                Be part of the next generation of collaboration.
                            </p>

                            <div className="contact-details">
                                <div className="contact-item">
                                    <span className="contact-icon">📧</span>
                                    <span>hello@cresoma.com</span>
                                </div>

                                <div className="contact-item">
                                    <span className="contact-icon">🌐</span>
                                    <span>www.cresoma.com</span>
                                </div>
                            </div>
                        </div>

                        <div className="contact-form">
                            <form>
                                <div className="form-group">
                                    <input type="text" placeholder="Your Name" required />
                                </div>

                                <div className="form-group">
                                    <input type="email" placeholder="Your Email" required />
                                </div>

                                <div className="form-group">
                                    <textarea placeholder="Tell us about your project" rows="4"></textarea>
                                </div>

                                <button type="submit" className="btn btn-primary">
                                    Get Started
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="footer">
                <div className="container">
                    <div className="footer-content">
                        <div className="footer-logo">
                            <span className="logo-text">CRESOMA</span>
                            <p>Shaping the future of collaboration</p>
                        </div>

                        <div className="footer-links">
                            <div className="footer-section">
                                <h4>Product</h4>
                                <ul>
                                    <li><a href="#">Features</a></li>
                                    <li><a href="#">Pricing</a></li>
                                </ul>
                            </div>

                            <div className="footer-section">
                                <h4>Company</h4>
                                <ul>
                                    <li><a href="#">About</a></li>
                                    <li><a href="#">Blog</a></li>
                                </ul>
                            </div>

                            <div className="footer-section">
                                <h4>Support</h4>
                                <ul>
                                    <li><a href="#">Help Center</a></li>
                                    <li><a href="#">Contact</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="footer-bottom">
                        <p>© 2025 Cresoma. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </>
    );
};


// ---------------------------------------------------
// APP ROUTING ENTRY POINT
// ---------------------------------------------------
const App = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/game" element={<Games />} />

            {/* Correct route + correct component */}
            <Route path="/LiveDashboard" element={<LiveDashboard />} />
            <Route path="/LiveDashboard/:boardId" element={<LiveDashboard />} />

            {/* This route renders MainLandingPage which contains the button */}
            <Route path="/" element={<MainLandingPage />} />
        </Routes>
    );
};

export default App;
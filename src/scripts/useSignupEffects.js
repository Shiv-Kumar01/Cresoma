import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const togglePasswordVisibility = (input, toggle) => {
    const toggleIcon = toggle.querySelector('i');

    if (input.type === 'password') {
        input.type = 'text';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    }
};

const showInputError = (input, message) => {
    const wrapper = input.closest('.input-wrapper');
    if (!wrapper) return;
    wrapper.classList.add('error');

    let existingError = wrapper.querySelector('.error-message');
    if (existingError) { existingError.remove(); }

    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.textContent = message;
    errorMessage.style.cssText = `
        color: #ff6b6b; font-size: 12px; margin-top: 5px; animation: slideInDown 0.3s ease;
    `;
    wrapper.appendChild(errorMessage);
};

const showInputSuccess = (input) => {
    const wrapper = input.closest('.input-wrapper');
    if (!wrapper) return;
    wrapper.classList.remove('error');

    let errorMessage = wrapper.querySelector('.error-message');
    if (errorMessage) { errorMessage.remove(); }
};

const createRipple = (event, element) => {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.cssText = `
        position: absolute; width: ${size}px; height: ${size}px; left: ${x}px; top: ${y}px;
        background: rgba(255, 255, 255, 0.3); border-radius: 50%; transform: scale(0);
        animation: ripple 0.6s linear; pointer-events: none;
    `;
    element.appendChild(ripple);
    setTimeout(() => { ripple.remove(); }, 600);
};

const showNotification = (message, type, provider = null) => {
    let bgColor, iconClass, duration = 3000;

    if (type === 'success') {
        bgColor = 'linear-gradient(135deg, #8A2BE2, #4B0082)';
        iconClass = 'fas fa-rocket';
    } else if (type === 'terms') {
        bgColor = 'linear-gradient(135deg, #ff6b6b, #ee5a52)';
        iconClass = 'fas fa-exclamation-triangle';
        duration = 3000;
    } else if (provider) {
        bgColor = 'linear-gradient(135deg, #8A2BE2, #4B0082)';
        iconClass = `fab fa-${provider.toLowerCase()}`;
        duration = 2000;
    } else {
        return;
    }

    const notification = document.createElement('div');
    notification.className = `${type}-notification`;
    notification.innerHTML = `<i class="${iconClass}"></i><span>${message}</span>`;
    notification.style.cssText = `
        position: fixed; top: 20px; right: 20px; background: ${bgColor}; color: white;
        padding: 15px 25px; border-radius: 10px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        display: flex; align-items: center; gap: 10px; z-index: 1000; animation: slideInRight 0.5s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.5s ease';
        setTimeout(() => { notification.remove(); }, 500);
    }, duration);
};

const showLoadingState = (signupBtn) => {
    const btnText = signupBtn.querySelector('.btn-text');
    const btnIcon = signupBtn.querySelector('.btn-icon i');
    signupBtn.dataset.originalText = btnText.textContent;
    signupBtn.dataset.originalIcon = btnIcon.className;

    btnText.textContent = 'Creating Account...';
    btnIcon.className = 'fas fa-spinner fa-spin';
    signupBtn.disabled = true;
};

const hideLoadingState = (signupBtn) => {
    const btnText = signupBtn.querySelector('.btn-text');
    const btnIcon = signupBtn.querySelector('.btn-icon i');

    btnText.textContent = signupBtn.dataset.originalText;
    btnIcon.className = signupBtn.dataset.originalIcon;
    signupBtn.disabled = false;
};

const validateName = (input, fieldName) => {
    const name = input.value.trim();
    if (name === '') {
        showInputError(input, `${fieldName} is required`);
        return false;
    } else if (name.length < 2) {
        showInputError(input, `${fieldName} must be at least 2 characters`);
        return false;
    } else if (!/^[a-zA-Z\s]+$/.test(name)) {
        showInputError(input, `${fieldName} can only contain letters and spaces`);
        return false;
    } else {
        showInputSuccess(input);
        return true;
    }
};

const validatePassword = (input) => {
    const password = input.value;

    if (password === '') {
        showInputError(input, 'Password is required');
        return false;
    } else if (password.length < 8) {
        showInputError(input, 'Password must be at least 8 characters');
        return false;
    } else if (!/(?=.*[a-z])/.test(password)) {
        showInputError(input, 'Must contain a lowercase letter');
        return false;
    } else if (!/(?=.*[A-Z])/.test(password)) {
        showInputError(input, 'Must contain an uppercase letter');
        return false;
    } else if (!/(?=.*\d)/.test(password)) {
        showInputError(input, 'Must contain a number');
        return false;
    } else {
        showInputSuccess(input);
        return true;
    }
};

const validateConfirmPassword = (input, passwordInput) => {
    const confirmPassword = input.value;
    const password = passwordInput.value;

    if (confirmPassword === '') {
        showInputError(input, 'Please confirm your password');
        return false;
    } else if (confirmPassword !== password) {
        showInputError(input, 'Passwords do not match');
        return false;
    } else {
        showInputSuccess(input);
        return true;
    }
};

const useSignupEffects = () => {
    const navigate = useNavigate();

    const validateForm = useCallback(() => {
        const firstNameInput = document.getElementById('firstName');
        const lastNameInput = document.getElementById('lastName');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirmPassword');
        const termsCheckbox = document.getElementById('terms');

        const firstNameValid = validateName(firstNameInput, 'First name');
        const lastNameValid = validateName(lastNameInput, 'Last name');
        const emailValid = validateEmail(emailInput);
        const passwordValid = validatePassword(passwordInput);
        const confirmPasswordValid = validateConfirmPassword(confirmPasswordInput, passwordInput);
        const termsAccepted = termsCheckbox.checked;

        if (!termsAccepted) {
            showNotification('Please accept the Terms & Conditions to continue', 'terms');
        }

        return firstNameValid && lastNameValid && emailValid && passwordValid && confirmPasswordValid && termsAccepted;
    }, []);

    const simulateSignup = (signupBtn) => {
        setTimeout(() => {
            hideLoadingState(signupBtn);
            showNotification('Account created successfully! Launching...', 'success');

            setTimeout(() => {
                navigate('/login');
            }, 2000);
        }, 2000);
    };

    useEffect(() => {
        const card = document.getElementById('signupCard');
        if (!card) return;

        let time = 0;
        let animationFrameId;

        function animate() {
            time += 0.01;
            const angleX = Math.sin(time) * 8;
            const angleY = Math.cos(time / 2) * 8;
            card.style.transform = `perspective(1000px) translateZ(15px) rotateX(${angleX}deg) rotateY(${angleY}deg)`;
            animationFrameId = requestAnimationFrame(animate);
        }

        animate();

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    useEffect(() => {
        const cosmicParticlesContainer = document.querySelector('.cosmic-particles');
        if (!cosmicParticlesContainer) return;

        const timers = [];
        let intervalId;

        const createCosmicParticle = (container) => {
            const particle = document.createElement('div');
            particle.className = 'cosmic-particle';

            const startX = Math.random() * window.innerWidth;
            const size = Math.random() * 4 + 2;
            const duration = Math.random() * 8 + 8;
            const delay = Math.random() * 3;

            particle.style.cssText = `
                left: ${startX}px;
                width: ${size}px;
                height: ${size}px;
                animation: cosmicParticleFloat ${duration}s linear ${delay}s infinite;
            `;

            container.appendChild(particle);

            const removalTimer = setTimeout(() => {
                if (particle.parentNode) {
                    particle.remove();
                }
            }, (duration + delay) * 1000);
            timers.push(removalTimer);
        };

        for (let i = 0; i < 5; i++) {
            createCosmicParticle(cosmicParticlesContainer);
        }

        intervalId = setInterval(() => {
            createCosmicParticle(cosmicParticlesContainer);
        }, 4000);

        return () => {
            clearInterval(intervalId);
            timers.forEach(clearTimeout);
        };
    }, []);

    useEffect(() => {
        const signupForm = document.getElementById('signupForm');
        const firstNameInput = document.getElementById('firstName');
        const lastNameInput = document.getElementById('lastName');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirmPassword');
        const passwordToggle = document.getElementById('passwordToggle');
        const confirmPasswordToggle = document.getElementById('confirmPasswordToggle');
        const signupBtn = document.querySelector('.signup-btn');
        const socialButtons = document.querySelectorAll('.social-btn');
        const buttons = document.querySelectorAll('button');
        const inputs = document.querySelectorAll('input');

        if (!signupForm || !passwordToggle || !confirmPasswordToggle || !signupBtn) return;

        const handlePasswordToggle = () => togglePasswordVisibility(passwordInput, passwordToggle);
        const handleConfirmToggle = () => togglePasswordVisibility(confirmPasswordInput, confirmPasswordToggle);

        passwordToggle.addEventListener('click', handlePasswordToggle);
        confirmPasswordToggle.addEventListener('click', handleConfirmToggle);

        const handleSubmit = (e) => {
            e.preventDefault();
            if (validateForm()) {
                showLoadingState(signupBtn);
                simulateSignup(signupBtn);
            }
        };
        signupForm.addEventListener('submit', handleSubmit);

        const handleFirstName = () => validateName(firstNameInput, 'First name');
        const handleLastName = () => validateName(lastNameInput, 'Last name');
        const handleEmail = () => validateEmail(emailInput);
        const handlePassword = () => {
            validatePassword(passwordInput);
            updatePasswordStrength(passwordInput.value);
            validateConfirmPassword(confirmPasswordInput, passwordInput);
        };
        const handleConfirm = () => validateConfirmPassword(confirmPasswordInput, passwordInput);

        firstNameInput.addEventListener('input', handleFirstName);
        lastNameInput.addEventListener('input', handleLastName);
        emailInput.addEventListener('input', handleEmail);
        passwordInput.addEventListener('input', handlePassword);
        confirmPasswordInput.addEventListener('input', handleConfirm);

        const handleSocialClick = function(e) {
            e.preventDefault();
            this.style.transform = 'scale(0.95)';
            setTimeout(() => { this.style.transform = ''; }, 150);
            const provider = this.classList.contains('google-btn') ? 'Google' :
                             this.classList.contains('github-btn') ? 'GitHub' : 'Facebook';
            showNotification(`Connecting to ${provider}...`, 'social', provider);
        };
        socialButtons.forEach(button => button.addEventListener('click', handleSocialClick));

        inputs.forEach(input => {
            const handleFocus = () => input.parentElement.style.transform = 'translateY(-2px)';
            const handleBlur = () => input.parentElement.style.transform = 'translateY(0)';
            input.addEventListener('focus', handleFocus);
            input.addEventListener('blur', handleBlur);
        });

        buttons.forEach(button => {
            const handleClick = (e) => createRipple(e, button);
            button.addEventListener('click', handleClick);
        });

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                document.querySelectorAll('input').forEach(input => {
                    input.value = '';
                    input.blur();
                });
            }
        };
        document.addEventListener('keydown', handleKeyDown);

        inputs.forEach(input => input.setAttribute('aria-label', input.placeholder || input.id));
        passwordToggle.setAttribute('aria-label', 'Toggle main password visibility');
        confirmPasswordToggle.setAttribute('aria-label', 'Toggle confirmation password visibility');

        return () => {
            passwordToggle.removeEventListener('click', handlePasswordToggle);
            confirmPasswordToggle.removeEventListener('click', handleConfirmToggle);
            signupForm.removeEventListener('submit', handleSubmit);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [validateForm]);

    useEffect(() => {
        const passwordInput = document.getElementById('password');
        if (!passwordInput) return;

        const strengthIndicator = document.createElement('div');
        strengthIndicator.className = 'password-strength';
        strengthIndicator.innerHTML = `
            <div class="strength-bar">
                <div class="strength-fill"></div>
            </div>
            <span class="strength-text">Password strength</span>
        `;
        strengthIndicator.style.cssText = `margin-top: 10px; font-size: 12px; color: rgba(255, 255, 255, 0.7);`;

        const strengthBar = strengthIndicator.querySelector('.strength-fill');

        strengthBar.style.cssText = `
            width: 0%; height: 4px; background: linear-gradient(90deg, #ff6b6b, #ffa500, #ffff00, #90EE90, #00ff00);
            border-radius: 2px; transition: width 0.3s ease;
        `;

        const parentWrapper = passwordInput.closest('.input-wrapper');
        if (parentWrapper) {
            parentWrapper.appendChild(strengthIndicator);
        }

        strengthIndicator.style.display = 'none';

        const handleFocus = () => strengthIndicator.style.display = 'block';
        const handleBlur = () => strengthIndicator.style.display = 'none';

        passwordInput.addEventListener('focus', handleFocus);
        passwordInput.addEventListener('blur', handleBlur);

        const updatePasswordStrength = (password) => {
            const strengthText = strengthIndicator.querySelector('.strength-text');

            let strength = 0;
            let strengthLabel = '';
            let strengthColor = '';

            if (password.length >= 8) strength += 20;
            if (/[a-z]/.test(password)) strength += 20;
            if (/[A-Z]/.test(password)) strength += 20;
            if (/\d/.test(password)) strength += 20;
            if (/[^A-Za-z0-9]/.test(password)) strength += 20;

            if (strength <= 20) {
                strengthLabel = 'Very Weak';
                strengthColor = '#ff6b6b';
            } else if (strength <= 40) {
                strengthLabel = 'Weak';
                strengthColor = '#ffa500';
            } else if (strength <= 60) {
                strengthLabel = 'Fair';
                strengthColor = '#ffff00';
            } else if (strength <= 80) {
                strengthLabel = 'Good';
                strengthColor = '#90EE90';
            } else {
                strengthLabel = 'Strong';
                strengthColor = '#00ff00';
            }

            strengthBar.style.width = strength + '%';
            strengthText.textContent = `Password strength: ${strengthLabel}`;
            strengthText.style.color = strengthColor;
        };

        const handleInput = () => updatePasswordStrength(passwordInput.value);
        passwordInput.addEventListener('input', handleInput);

        return () => {
            passwordInput.removeEventListener('focus', handleFocus);
            passwordInput.removeEventListener('blur', handleBlur);
            passwordInput.removeEventListener('input', handleInput);
            if (strengthIndicator.parentNode) {
                parentWrapper.removeChild(strengthIndicator);
            }
        };
    }, []);

    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
            @keyframes slideInRight { from { opacity: 0; transform: translateX(100%); } to { opacity: 1; transform: translateX(0); } }
            @keyframes slideOutRight { from { opacity: 1; transform: translateX(0); } to { opacity: 0; transform: translateX(100%); } }
            @keyframes ripple { to { transform: scale(4); opacity: 0; } }
            @keyframes cosmicParticleFloat {
                0% { transform: translateY(100vh) scale(0); opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { transform: translateY(-100px) scale(1); opacity: 0; }
            }
        `;
        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
        };
    }, []);

    return null;
};

export default useSignupEffects;
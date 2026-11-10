import { useEffect, useCallback } from 'react';

const showNotification = (message, type, isSocial = false) => {
    let bgColor, iconClass, duration;

    if (type === 'success') {
        bgColor = 'linear-gradient(135deg, #4CAF50, #45a049)';
        iconClass = 'fas fa-check-circle';
        duration = 3000;
    } else if (isSocial) {
        bgColor = 'linear-gradient(135deg, #667eea, #764ba2)';
        iconClass = `fab fa-${type.toLowerCase()}`;
        duration = 2000;
    } else {
        return;
    }

    const notification = document.createElement('div');
    notification.className = `${type}-notification`;
    notification.innerHTML = `
        <i class="${iconClass}"></i>
        <span>${message}</span>
    `;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 1000;
        animation: slideInRight 0.5s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.5s ease';
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, duration);
};

const showLoadingState = (loginBtn) => {
    const btnText = loginBtn.querySelector('.btn-text');
    const btnIcon = loginBtn.querySelector('.btn-icon i');

    loginBtn.dataset.originalText = btnText.textContent;
    loginBtn.dataset.originalIcon = btnIcon.className;

    btnText.textContent = 'Signing In...';
    btnIcon.className = 'fas fa-spinner fa-spin';
    loginBtn.disabled = true;
};

const hideLoadingState = (loginBtn) => {
    const btnText = loginBtn.querySelector('.btn-text');
    const btnIcon = loginBtn.querySelector('.btn-icon i');

    btnText.textContent = loginBtn.dataset.originalText;
    btnIcon.className = loginBtn.dataset.originalIcon;
    loginBtn.disabled = false;
};

const simulateLogin = (loginBtn) => {
    setTimeout(() => {
        hideLoadingState(loginBtn);
        showNotification('Login successful! Redirecting...', 'success');

        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }, 2000);
};

function createRipple(event, element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    `;

    element.appendChild(ripple);

    setTimeout(() => {
        ripple.remove();
    }, 600);
}


function showInputError(input, message) {
    const wrapper = input.closest('.input-wrapper');
    wrapper.classList.add('error');

    const existingError = wrapper.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.textContent = message;
    errorMessage.style.cssText = `
        color: #ff6b6b;
        font-size: 12px;
        margin-top: 5px;
        animation: slideInDown 0.3s ease;
    `;

    wrapper.appendChild(errorMessage);
}

function showInputSuccess(input) {
    const wrapper = input.closest('.input-wrapper');
    wrapper.classList.remove('error');

    const errorMessage = wrapper.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

const validateEmail = (input) => {
    const email = input.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email === '') {
        showInputError(input, 'Email is required');
        return false;
    } else if (!emailRegex.test(email)) {
        showInputError(input, 'Please enter a valid email');
        return false;
    } else {
        showInputSuccess(input);
        return true;
    }
}

const validatePassword = (input) => {
    const password = input.value;

    if (password === '') {
        showInputError(input, 'Password is required');
        return false;
    } else if (password.length < 6) {
        showInputError(input, 'Password must be at least 6 characters');
        return false;
    } else {
        showInputSuccess(input);
        return true;
    }
}


const useLoginEffects = () => {

    const validateForm = useCallback(() => {
        const emailValid = validateEmail(document.getElementById('email'));
        const passwordValid = validatePassword(document.getElementById('password'));

        return emailValid && passwordValid;
    }, []);

    useEffect(() => {
        const card = document.getElementById('loginCard');
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
        const loginForm = document.getElementById('loginForm');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const passwordToggle = document.getElementById('passwordToggle');
        const loginBtn = document.querySelector('.login-btn');
        const socialButtons = document.querySelectorAll('.social-btn');
        const inputs = document.querySelectorAll('input');
        const buttons = document.querySelectorAll('button');

        if (!loginForm || !passwordInput || !passwordToggle || !loginBtn) return;

        const handleToggle = () => {
            const toggleIcon = passwordToggle.querySelector('i');
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                toggleIcon.classList.remove('fa-eye');
                toggleIcon.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                toggleIcon.type = 'password';
                toggleIcon.classList.remove('fa-eye-slash');
                toggleIcon.classList.add('fa-eye');
            }
        };
        passwordToggle.addEventListener('click', handleToggle);

        const handleSubmit = (e) => {
            e.preventDefault();
            if (validateForm()) {
                showLoadingState(loginBtn);
                simulateLogin(loginBtn);
            }
        };
        loginForm.addEventListener('submit', handleSubmit);

        const handleEmailInput = () => validateEmail(emailInput);
        const handlePasswordInput = () => validatePassword(passwordInput);
        emailInput.addEventListener('input', handleEmailInput);
        passwordInput.addEventListener('input', handlePasswordInput);

        const handleSocialClick = function(e) {
            e.preventDefault();
            this.style.transform = 'scale(0.95)';
            setTimeout(() => { this.style.transform = ''; }, 150);
            const provider = this.classList.contains('google-btn') ? 'Google' : 'GitHub';
            showNotification(`Connecting to ${provider}...`, provider, true);
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

        emailInput.setAttribute('aria-label', 'Email address');
        passwordInput.setAttribute('aria-label', 'Password');
        passwordToggle.setAttribute('aria-label', 'Toggle password visibility');

        return () => {
            passwordToggle.removeEventListener('click', handleToggle);
            loginForm.removeEventListener('submit', handleSubmit);
            emailInput.removeEventListener('input', handleEmailInput);
            passwordInput.removeEventListener('input', handlePasswordInput);
            socialButtons.forEach(button => button.removeEventListener('click', handleSocialClick));
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [validateForm]);

    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInDown {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes slideInRight {
                from { opacity: 0; transform: translateX(100%); }
                to { opacity: 1; transform: translateX(0); }
            }
            @keyframes slideOutRight {
                from { opacity: 1; transform: translateX(0); }
                to { opacity: 0; transform: translateX(100%); }
            }
            @keyframes ripple {
                to { transform: scale(4); opacity: 0; }
            }
            .input-wrapper.error input { border-color: #ff6b6b; box-shadow: 0 0 0 2px rgba(255, 107, 107, 0.2); }
            .input-wrapper.error .input-icon { color: #ff6b6b; }
        `;
        document.head.appendChild(style);

        const particlesContainer = document.querySelector('.particles-container');
        if (!particlesContainer) return;

        const timers = [];
        const createParticle = (container) => {
            const particle = document.createElement('div');
            particle.className = 'particle';

            const startX = Math.random() * window.innerWidth;
            const size = Math.random() * 3 + 2;
            const duration = Math.random() * 5 + 5;
            const delay = Math.random() * 2;

            particle.style.cssText = `
                left: ${startX}px;
                width: ${size}px;
                height: ${size}px;
                animation: particleFloat ${duration}s linear ${delay}s infinite;
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
            createParticle(particlesContainer);
        }

        const intervalId = setInterval(() => {
            createParticle(particlesContainer);
        }, 3000);

        return () => {
            document.head.removeChild(style);
            clearInterval(intervalId);
            timers.forEach(clearTimeout);
        };
    }, []);

    return null;
};

export default useLoginEffects;
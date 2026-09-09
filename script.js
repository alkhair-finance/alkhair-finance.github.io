'use strict';

const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbwaWngWYLhQqVBvMmr1wQAZyjplGq_O46klvtLb-aTGpNSQNAxnQue_7DB5UXIiNFfZ/exec";

const loanForm = document.getElementById('loanForm');
const formSpinner = document.getElementById('formSpinner');
const successMessage = document.getElementById('successMessage');
const formMessage = document.getElementById('formMessage');
const submitBtn = document.getElementById('submitBtn');
const mobileToggle = document.getElementById('mobileToggle');
const navMenu = document.getElementById('navMenu');

if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
        const isActive = navMenu.classList.toggle('active');
        mobileToggle.setAttribute('aria-expanded', isActive);
        mobileToggle.innerHTML = isActive ? '<i class="fas fa-times" aria-hidden="true"></i>' : '<i class="fas fa-bars" aria-hidden="true"></i>';
    });
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileToggle.setAttribute('aria-expanded', 'false');
            mobileToggle.innerHTML = '<i class="fas fa-bars" aria-hidden="true"></i>';
        });
    });
}

if (loanForm) {
    loanForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> Submitting...';
        formSpinner.style.display = 'block';
        if (formMessage) formMessage.style.display = 'none';

        const refNum = Math.floor(1000 + Math.random() * 9000);
        const refNumberElement = document.getElementById('refNumber');
        if (refNumberElement) refNumberElement.textContent = refNum;

        const formData = new URLSearchParams();
        formData.append('name', document.getElementById('name').value.trim());
        formData.append('phone', document.getElementById('phone').value.trim());
        formData.append('email', document.getElementById('email').value.trim());
        formData.append('city', document.getElementById('city').value.trim());
        formData.append('loanType', document.getElementById('loanType').value);
        formData.append('amount', document.getElementById('amount').value);
        formData.append('income', document.getElementById('income').value);
        formData.append('purpose', document.getElementById('purpose').value.trim());
        formData.append('reference', 'ALK-' + refNum);

        try {
            await fetch(GOOGLE_SHEET_URL, { method: 'POST', body: formData, mode: 'no-cors' });
            loanForm.style.display = 'none';
            successMessage.style.display = 'block';
            setTimeout(() => {
                loanForm.reset();
                loanForm.style.display = 'block';
                successMessage.style.display = 'none';
            }, 6000);
        } catch (error) {
            if (formMessage) {
                formMessage.style.display = 'block';
                formMessage.className = 'form-message error';
                formMessage.textContent = '❌ Error submitting form. Please try again or contact us on WhatsApp.';
            } else {
                alert('Error submitting. Please try again or contact us directly.');
            }
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane" aria-hidden="true"></i> Submit Application';
            formSpinner.style.display = 'none';
            setTimeout(() => { if (formMessage) formMessage.style.display = 'none'; }, 5000);
        }
    });
}

if (loanForm) {
    const phoneInput = document.getElementById('phone');
    const amountInput = document.getElementById('amount');
    if (phoneInput) phoneInput.addEventListener('input', () => { phoneInput.value = phoneInput.value.replace(/[^0-9]/g, '').slice(0, 10); });
    if (amountInput) amountInput.addEventListener('input', () => {
        const val = parseInt(amountInput.value);
        if (val < 10000) amountInput.setCustomValidity('Minimum loan amount is ₹10,000');
        else if (val > 10000000) amountInput.setCustomValidity('Maximum loan amount is ₹1 Crore');
        else amountInput.setCustomValidity('');
    });
}

function initScrollAnimations() {
    const animateElements = document.querySelectorAll('[data-animate]');
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
        animateElements.forEach((el) => observer.observe(el));
    } else {
        animateElements.forEach((el) => el.classList.add('animated'));
    }
}

if (document.readyState === 'complete') initScrollAnimations();
else window.addEventListener('load', initScrollAnimations);
setTimeout(() => {
    document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('animated'));
}, 3000);

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            e.preventDefault();
            const headerOffset = 80;
            const elementPosition = targetElement.offsetTop - headerOffset;
            window.scrollTo({ top: elementPosition, behavior: 'smooth' });
            history.pushState(null, null, targetId);
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
});
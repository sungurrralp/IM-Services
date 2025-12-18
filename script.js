/**
 * IM-Services Website - JavaScript
 * 
 * Funktionen:
 * - Mobile Navigation Toggle
 * - Smooth Scrolling
 * - Formular-Handling mit E-Mail-Versand
 * - Navbar Scroll-Effekt
 */

// ============================================
// FormSubmit Konfiguration
// ============================================

// Die Formulare senden direkt an FormSubmit (https://formsubmit.co)
// E-Mails werden an: sunguralperenyavuz@icloud.com gesendet
// Keine weitere Konfiguration nötig!

// ============================================
// DOM Content Loaded
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initForms();
    initScrollEffects();
    setActiveNavLink();
    checkSuccessMessage();
});

/**
 * Prüft ob eine Erfolgsmeldung angezeigt werden soll (nach FormSubmit Redirect)
 */
function checkSuccessMessage() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
        // Erfolgsmeldung anzeigen
        const bookingSuccess = document.getElementById('bookingSuccess');
        const contactSuccess = document.getElementById('contactSuccess');
        const bookingForm = document.getElementById('bookingForm');
        const contactForm = document.getElementById('contactForm');
        const contactContent = document.querySelector('.contact-wrapper');
        
        if (bookingSuccess && bookingForm) {
            bookingForm.style.display = 'none';
            bookingSuccess.style.display = 'block';
            bookingSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        if (contactSuccess && contactContent) {
            contactContent.style.display = 'none';
            contactSuccess.style.display = 'block';
            contactSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        // URL bereinigen (ohne Reload)
        window.history.replaceState({}, document.title, window.location.pathname);
    }
}

// ============================================
// Navigation
// ============================================

/**
 * Initialisiert die Navigation (Mobile Menu & Smooth Scrolling)
 */
function initNavigation() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Mobile Menu Toggle
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
    }
    
    // Schließe Mobile Menu beim Klick auf einen Link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        });
    });
    
    // Schließe Mobile Menu beim Klick außerhalb
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navMenu.contains(event.target) || 
                                 mobileMenuToggle.contains(event.target);
        
        if (!isClickInsideNav && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        }
    });
}

// ============================================
// Scroll-Effekte
// ============================================

/**
 * Initialisiert Scroll-Effekte (z. B. Navbar Shadow)
 */
function initScrollEffects() {
    const navbar = document.getElementById('navbar');
    
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
    
    // Aktiviere aktiven Nav-Link basierend auf Scroll-Position
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// ============================================
// Formular-Handling
// ============================================

/**
 * Initialisiert alle Formulare auf der Website
 */
function initForms() {
    const bookingForm = document.getElementById('bookingForm');
    const contactForm = document.getElementById('contactForm');
    
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleBookingSubmit);
    }
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
}

/**
 * Behandelt die Buchungsformular-Submission
 * @param {Event} event - Das Submit-Event
 */
function handleBookingSubmit(event) {
    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');
    
    // Validierung
    if (!validateForm(form)) {
        event.preventDefault();
        return;
    }
    
    // Button während des Versands deaktivieren
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerHTML = '<span>Sende...</span>';
    }
    
    // FormSubmit sendet das Formular automatisch
    // Die Erfolgsmeldung wird nach dem Submit angezeigt
    // (FormSubmit leitet zu _next weiter, aber wir zeigen die Meldung trotzdem)
}

/**
 * Behandelt die Kontaktformular-Submission
 * @param {Event} event - Das Submit-Event
 */
function handleContactSubmit(event) {
    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const subjectInput = form.querySelector('#contactSubject');
    const subjectHidden = form.querySelector('#contactSubjectHidden');
    
    // Validierung
    if (!validateForm(form)) {
        event.preventDefault();
        return;
    }
    
    // Betreff für verstecktes Feld setzen
    if (subjectHidden && subjectInput) {
        const subject = subjectInput.value || 'Kontaktanfrage von IM-Services Website';
        subjectHidden.value = subject;
    }
    
    // Button während des Versands deaktivieren
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerHTML = '<span>Sende...</span>';
    }
    
    // FormSubmit sendet das Formular automatisch
    // Die Erfolgsmeldung wird nach dem Submit angezeigt
}

/**
 * Validiert ein Formular
 * @param {HTMLFormElement} form - Das zu validierende Formular
 * @returns {boolean} - True wenn valide, sonst False
 */
function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        // Entferne vorherige Fehlermeldungen
        removeFieldError(field);
        
        // Validiere Feld
        if (!field.value.trim()) {
            showFieldError(field, 'Dieses Feld ist erforderlich.');
            isValid = false;
        } else if (field.type === 'email' && !isValidEmail(field.value)) {
            showFieldError(field, 'Bitte gib eine gültige E-Mail-Adresse ein.');
            isValid = false;
        }
    });
    
    // Validiere Checkboxen
    const checkboxes = form.querySelectorAll('input[type="checkbox"][required]');
    checkboxes.forEach(checkbox => {
        removeFieldError(checkbox);
        if (!checkbox.checked) {
            showFieldError(checkbox, 'Dieses Feld muss ausgefüllt werden.');
            isValid = false;
        }
    });
    
    return isValid;
}

/**
 * Validiert eine E-Mail-Adresse
 * @param {string} email - Die zu validierende E-Mail
 * @returns {boolean} - True wenn valide
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Zeigt eine Fehlermeldung für ein Feld an
 * @param {HTMLElement} field - Das Feld mit dem Fehler
 * @param {string} message - Die Fehlermeldung
 */
function showFieldError(field, message) {
    field.style.borderColor = '#ef4444';
    
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.color = '#ef4444';
    errorElement.style.fontSize = '0.875rem';
    errorElement.style.marginTop = '0.25rem';
    
    field.parentElement.appendChild(errorElement);
}

/**
 * Entfernt Fehlermeldungen von einem Feld
 * @param {HTMLElement} field - Das Feld
 */
function removeFieldError(field) {
    field.style.borderColor = '';
    const errorElement = field.parentElement.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

/**
 * Zeigt die Erfolgsmeldung für die Buchung an
 */
function showBookingSuccess() {
    const form = document.getElementById('bookingForm');
    const successMessage = document.getElementById('bookingSuccess');
    
    if (form && successMessage) {
        form.style.display = 'none';
        successMessage.style.display = 'block';
        
        // Nach 10 Sekunden Formular wieder anzeigen (optional)
        setTimeout(() => {
            form.style.display = 'block';
            successMessage.style.display = 'none';
        }, 10000);
    }
}

/**
 * Zeigt die Erfolgsmeldung für den Kontakt an
 */
function showContactSuccess() {
    const form = document.getElementById('contactForm');
    const successMessage = document.getElementById('contactSuccess');
    const contactContent = document.querySelector('.contact-content');
    
    if (form && successMessage && contactContent) {
        contactContent.style.display = 'none';
        successMessage.style.display = 'block';
        
        // Nach 10 Sekunden Formular wieder anzeigen (optional)
        setTimeout(() => {
            contactContent.style.display = 'grid';
            successMessage.style.display = 'none';
        }, 10000);
    }
}

// ============================================
// Active Navigation Link
// ============================================

/**
 * Setzt den aktiven Nav-Link basierend auf der aktuellen Seite
 */
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkHref = link.getAttribute('href');
        
        // Entferne 'index.html' für die Startseite
        if (currentPage === 'index.html' || currentPage === '') {
            if (linkHref === 'index.html' || linkHref === '/') {
                link.classList.add('active');
            }
        } else if (linkHref === currentPage) {
            link.classList.add('active');
        }
    });
}

// ============================================
// Utility Functions
// ============================================

/**
 * Setzt das minimale Datum für Datumsfelder auf heute
 */
function setMinDateForDateInputs() {
    const dateInputs = document.querySelectorAll('input[type="date"]');
    const today = new Date().toISOString().split('T')[0];
    
    dateInputs.forEach(input => {
        input.setAttribute('min', today);
    });
}

// Setze minimale Datum beim Laden
document.addEventListener('DOMContentLoaded', setMinDateForDateInputs);

/**
 * Smooth Scroll zu einem Element
 * @param {string} targetId - Die ID des Ziel-Elements
 */
function scrollToSection(targetId) {
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
        const offsetTop = targetElement.offsetTop - 70; // Navbar-Höhe berücksichtigen
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// ============================================
// Erweiterte Features (für zukünftige Nutzung)
// ============================================

/**
 * Sendet Buchungsdaten an einen Server (Platzhalter für zukünftige Implementierung)
 * @param {Object} data - Die Buchungsdaten
 * @returns {Promise} - Promise mit Server-Antwort
 */
async function sendBookingToServer(data) {
    // TODO: Implementiere Server-Anbindung
    // Beispiel:
    // const response = await fetch('/api/booking', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(data)
    // });
    // return response.json();
}

/**
 * Sendet Kontaktdaten an einen Server (Platzhalter für zukünftige Implementierung)
 * @param {Object} data - Die Kontaktdaten
 * @returns {Promise} - Promise mit Server-Antwort
 */
async function sendContactToServer(data) {
    // TODO: Implementiere Server-Anbindung
    // Beispiel:
    // const response = await fetch('/api/contact', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(data)
    // });
    // return response.json();
}


```javascript
/* =====================================================
   SAMVAAD MUN 2026
   JavaScript
   ===================================================== */


/* ================= COUNTDOWN TIMER ================= */

/*
   Event date:
   14 November 2026, 9:00 AM, India Standard Time.

   Change the time if the organisers confirm a different
   official starting time.

   This is a fixed IST timestamp, so the countdown uses
   the correct Indian Standard Time regardless of the
   visitor's device timezone.
*/

const eventDate = new Date("2026-11-14T09:00:00+05:30").getTime();

const daysElement = document.getElementById("days");
const hoursElement = document.getElementById("hours");
const minutesElement = document.getElementById("minutes");
const secondsElement = document.getElementById("seconds");

const countdownMessage = document.getElementById("countdownMessage");


function updateCountdown() {

    const now = Date.now();

    const distance = eventDate - now;


    // If the event has started or the date has passed.

    if (distance <= 0) {

        daysElement.textContent = "00";
        hoursElement.textContent = "00";
        minutesElement.textContent = "00";
        secondsElement.textContent = "00";

        if (countdownMessage) {

            if (distance > -2 * 24 * 60 * 60 * 1000) {

                countdownMessage.textContent =
                    "Samvaad MUN is underway!";

            } else {

                countdownMessage.textContent =
                    "Samvaad MUN 2026 has concluded. Thank you for being part of the journey.";

            }
        }

        clearInterval(countdownInterval);

        return;
    }


    const days = Math.floor(
        distance / (1000 * 60 * 60 * 24)
    );

    const hours = Math.floor(
        (distance / (1000 * 60 * 60)) % 24
    );

    const minutes = Math.floor(
        (distance / (1000 * 60)) % 60
    );

    const seconds = Math.floor(
        (distance / 1000) % 60
    );


    daysElement.textContent = String(days).padStart(2, "0");

    hoursElement.textContent = String(hours).padStart(2, "0");

    minutesElement.textContent = String(minutes).padStart(2, "0");

    secondsElement.textContent = String(seconds).padStart(2, "0");


    if (countdownMessage) {
        countdownMessage.textContent = "";
    }

}


updateCountdown();

const countdownInterval = setInterval(updateCountdown, 1000);


/* ================= MOBILE NAVIGATION ================= */

const menuToggle = document.getElementById("menuToggle");

const navLinks = document.getElementById("navLinks");


function closeMobileMenu() {

    navLinks.classList.remove("open");

    menuToggle.setAttribute("aria-expanded", "false");

    menuToggle.setAttribute(
        "aria-label",
        "Open navigation menu"
    );

}


menuToggle.addEventListener("click", function () {

    const isOpen = navLinks.classList.toggle("open");

    menuToggle.setAttribute(
        "aria-expanded",
        String(isOpen)
    );

    menuToggle.setAttribute(
        "aria-label",
        isOpen
            ? "Close navigation menu"
            : "Open navigation menu"
    );

});


// Close the menu after a navigation link is selected.

navLinks.querySelectorAll("a").forEach(function (link) {

    link.addEventListener("click", closeMobileMenu);

});


// Close the menu when the user clicks outside it.

document.addEventListener("click", function (event) {

    const clickedInsideMenu = navLinks.contains(event.target);

    const clickedToggle = menuToggle.contains(event.target);

    if (!clickedInsideMenu && !clickedToggle) {

        closeMobileMenu();

    }

});


// Close the mobile menu when switching back to desktop.

window.addEventListener("resize", function () {

    if (window.innerWidth > 820) {

        closeMobileMenu();

    }

});


/* ================= COMMITTEE SEARCH & FILTER ================= */

const committeeSearch = document.getElementById("committeeSearch");

const committeeCards = Array.from(
    document.querySelectorAll(".committee-card")
);

const filterButtons = document.querySelectorAll(".filter-btn");

const noResults = document.getElementById("noResults");


let activeCategory = "all";


function filterCommittees() {

    const query = committeeSearch.value
        .trim()
        .toLowerCase();

    let visibleCount = 0;


    committeeCards.forEach(function (card) {

        const name = card.dataset.name.toLowerCase();

        const description = card.dataset.description.toLowerCase();

        const category = card.dataset.category;


        const matchesSearch =
            name.includes(query) ||
            description.includes(query);

        const matchesCategory =
            activeCategory === "all" ||
            category === activeCategory;


        const shouldShow =
            matchesSearch && matchesCategory;


        card.hidden = !shouldShow;


        if (shouldShow) {

            visibleCount++;

        }

    });


    noResults.hidden = visibleCount !== 0;

}


// Search while typing.

committeeSearch.addEventListener("input", filterCommittees);


// Category filter buttons.

filterButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        activeCategory = button.dataset.filter;


        filterButtons.forEach(function (item) {

            item.classList.remove("active");

        });


        button.classList.add("active");


        filterCommittees();

    });

});


/* ================= COMMITTEE REGISTRATION LINKS ================= */

const committeeSelect = document.getElementById("committee");


document.querySelectorAll("[data-committee]").forEach(function (link) {

    link.addEventListener("click", function () {

        const committeeName = link.dataset.committee;

        committeeSelect.value = committeeName;

    });

});


/* ================= FORM VALIDATION HELPERS ================= */


// Display an error beside a field.

function showFieldError(field, errorElement, message) {

    field.classList.add("invalid");

    field.setAttribute("aria-invalid", "true");

    errorElement.textContent = message;

}


// Clear the error beside a field.

function clearFieldError(field, errorElement) {

    field.classList.remove("invalid");

    field.removeAttribute("aria-invalid");

    errorElement.textContent = "";

}


// Check whether an email address has a plausible format.

function isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);

}


// Validate a person's name or institution name.

function isValidText(value) {

    return value.trim().length >= 2;

}


// Validate an Indian mobile number.

function isValidIndianPhone(phone) {

    const digits = phone.replace(/\D/g, "");

    return /^[6-9]\d{9}$/.test(digits);

}


// Common helper for required text inputs.

function validateRequiredText(field, errorElement, label) {

    const value = field.value.trim();

    if (!isValidText(value)) {

        showFieldError(
            field,
            errorElement,
            label + " must contain at least 2 characters."
        );

        return false;
    }

    clearFieldError(field, errorElement);

    return true;

}


// Common helper for required dropdowns.

function validateRequiredSelect(field, errorElement, label) {

    if (!field.value) {

        showFieldError(
            field,
            errorElement,
            "Please select " + label + "."
        );

        return false;
    }

    clearFieldError(field, errorElement);

    return true;

}


// Validate longer text responses.

function validateLongText(field, errorElement, label, minimum) {

    const value = field.value.trim();

    if (value.length < minimum) {

        showFieldError(
            field,
            errorElement,
            label + " must contain at least " + minimum + " characters."
        );

        return false;
    }

    clearFieldError(field, errorElement);

    return true;

}


// Display a success or error message for an entire form.

function showFormMessage(element, message, type) {

    element.textContent = message;

    element.className = "form-feedback " + type;

}


// Attach inline validation and clear an old error when
// a user starts correcting a field.

function enableErrorClearing(form) {

    form.querySelectorAll("input, select, textarea").forEach(function (field) {

        const errorElement = document.getElementById(
            field.id + "Error"
        );

        if (!errorElement) {
            return;
        }

        const eventName =
            field.tagName === "SELECT"
                ? "change"
                : "input";


        field.addEventListener(eventName, function () {

            clearFieldError(field, errorElement);

        });

    });

}


/* ================= REGISTRATION FORM ================= */

const registrationForm = document.getElementById("registrationForm");

const registrationMessage = document.getElementById("registrationMessage");


enableErrorClearing(registrationForm);


registrationForm.addEventListener("submit", function (event) {

    event.preventDefault();


    let isValid = true;


    // Clear the previous form-level message.

    registrationMessage.textContent = "";

    registrationMessage.className = "form-feedback";


    // FIELD 1: FULL NAME

    const fullName = document.getElementById("fullName");

    const fullNameError = document.getElementById("fullNameError");


    if (!validateRequiredText(
        fullName,
        fullNameError,
        "Full name"
    )) {

        isValid = false;

    }


    // FIELD 2: EMAIL

    const email = document.getElementById("email");

    const emailError = document.getElementById("emailError");


    if (!isValidEmail(email.value.trim())) {

        showFieldError(
            email,
            emailError,
            "Please enter a valid email address."
        );

        isValid = false;

    } else {

        clearFieldError(email, emailError);

    }


    // FIELD 3: PHONE

    const phone = document.getElementById("phone");

    const phoneError = document.getElementById("phoneError");


    if (!isValidIndianPhone(phone.value)) {

        showFieldError(
            phone,
            phoneError,
            "Enter a valid 10-digit Indian mobile number."
        );

        isValid = false;

    } else {

        clearFieldError(phone, phoneError);

    }


    // FIELD 4: COLLEGE / SCHOOL

    const college = document.getElementById("college");

    const collegeError = document.getElementById("collegeError");


    if (!validateRequiredText(
        college,
        collegeError,
        "College / school"
    )) {

        isValid = false;

    }


    // FIELD 5: YEAR OF STUDY

    const year = document.getElementById("year");

    const yearError = document.getElementById("yearError");


    if (!validateRequiredSelect(
        year,
        yearError,
        "your year of study"
    )) {

        isValid = false;

    }


    // FIELD 6: COMMITTEE

    const committee = document.getElementById("committee");

    const committeeError = document.getElementById("committeeError");


    if (!validateRequiredSelect(
        committee,
        committeeError,
        "a preferred committee"
    )) {

        isValid = false;

    }


    // FIELD 7: MUN EXPERIENCE

    const experience = document.getElementById("experience");

    const experienceError = document.getElementById("experienceError");


    if (!validateRequiredSelect(
        experience,
        experienceError,
        "your previous MUN experience"
    )) {

        isValid = false;

    }


    // FIELD 8: MOTIVATION

    const motivation = document.getElementById("motivation");

    const motivationError = document.getElementById("motivationError");


    if (!validateLongText(
        motivation,
        motivationError,
        "Your response",
        10
    )) {

        isValid = false;

    }


    // Focus the first invalid field.

    if (!isValid) {

        showFormMessage(
            registrationMessage,
            "Please correct the highlighted fields and try again.",
            "error"
        );

        const firstInvalidField = registrationForm.querySelector(".invalid");

        if (firstInvalidField) {

            firstInvalidField.focus();

        }

        return;

    }


    /*
       DEMO MODE:
       This front-end example does not send the registration
       to a server or save it to a shared database.

       Connect a backend or form service before collecting
       actual delegate registrations.
    */


    showFormMessage(
        registrationMessage,
        "Thank you, " +
            fullName.value.trim() +
            "! Your form passed validation for " +
            committee.value +
            ". This is a demo confirmation; your registration has not been sent to the organisers.",
        "success"
    );


    // Clear the form after showing the demonstration message.

    registrationForm.reset();


    // Return focus to the form's heading area.

    registrationMessage.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
    });

});


/* ================= FEEDBACK FORM ================= */

const feedbackForm = document.getElementById("feedbackForm");

const feedbackStatus = document.getElementById("feedbackStatus");


enableErrorClearing(feedbackForm);


feedbackForm.addEventListener("submit", function (event) {

    event.preventDefault();


    let isValid = true;


    feedbackStatus.textContent = "";

    feedbackStatus.className = "form-feedback";


    // FEEDBACK NAME

    const feedbackName = document.getElementById("feedbackName");

    const feedbackNameError = document.getElementById("feedbackNameError");


    if (!validateRequiredText(
        feedbackName,
        feedbackNameError,
        "Your name"
    )) {

        isValid = false;

    }


    // FEEDBACK EMAIL

    const feedbackEmail = document.getElementById("feedbackEmail");

    const feedbackEmailError = document.getElementById("feedbackEmailError");


    if (!isValidEmail(feedbackEmail.value.trim())) {

        showFieldError(
            feedbackEmail,
            feedbackEmailError,
            "Please enter a valid email address."
        );

        isValid = false;

    } else {

        clearFieldError(feedbackEmail, feedbackEmailError);

    }


    // FEEDBACK SUBJECT

    const feedbackSubject = document.getElementById("feedbackSubject");

    const feedbackSubjectError = document.getElementById("feedbackSubjectError");


    if (!validateRequiredSelect(
        feedbackSubject,
        feedbackSubjectError,
        "a subject"
    )) {

        isValid = false;

    }


    // FEEDBACK MESSAGE

    const feedbackText = document.getElementById("feedbackMessage");

    const feedbackTextError = document.getElementById("feedbackMessageError");


    if (!validateLongText(
        feedbackText,
        feedbackTextError,
        "Your message",
        10
    )) {

        isValid = false;

    }


    if (!isValid) {

        showFormMessage(
            feedbackStatus,
            "Please correct the highlighted fields before submitting.",
            "error"
        );

        const firstInvalidField = feedbackForm.querySelector(".invalid");

        if (firstInvalidField) {

            firstInvalidField.focus();

        }

        return;

    }


    /*
       DEMO MODE:
       The feedback is validated locally but is not emailed,
       stored, or delivered to the organisers.
    */


    showFormMessage(
        feedbackStatus,
        "Thank you, " +
            feedbackName.value.trim() +
            "! Your feedback passed validation. This is a demo confirmation; your message has not been sent to the organisers.",
        "success"
    );


    feedbackForm.reset();


    feedbackStatus.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
    });

});

/* ================= END OF SCRIPT ================= */
```
```javascript
// Samvaad MUN 2026 Event Countdown

// Conference begins on 14 November 2026 at 9:00 AM IST.
const eventDate = new Date("2026-11-14T09:00:00+05:30").getTime();

function updateCountdown() {
    const now = Date.now();
    const timeRemaining = eventDate - now;

    const daysElement = document.getElementById("days");
    const hoursElement = document.getElementById("hours");
    const minutesElement = document.getElementById("minutes");
    const secondsElement = document.getElementById("seconds");
    const messageElement = document.getElementById("countdown-message");

    // Stop the countdown if the required HTML elements are missing.
    if (
        !daysElement ||
        !hoursElement ||
        !minutesElement ||
        !secondsElement ||
        !messageElement
    ) {
        return;
    }

    if (timeRemaining <= 0) {
        daysElement.textContent = "00";
        hoursElement.textContent = "00";
        minutesElement.textContent = "00";
        secondsElement.textContent = "00";

        messageElement.textContent =
            "🎉 Samvaad MUN 2026 has begun! Let the debates begin!";

        clearInterval(countdownInterval);
        return;
    }

    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));

    const hours = Math.floor(
        (timeRemaining / (1000 * 60 * 60)) % 24
    );

    const minutes = Math.floor(
        (timeRemaining / (1000 * 60)) % 60
    );

    const seconds = Math.floor(
        (timeRemaining / 1000) % 60
    );

    daysElement.textContent = String(days).padStart(2, "0");
    hoursElement.textContent = String(hours).padStart(2, "0");
    minutesElement.textContent = String(minutes).padStart(2, "0");
    secondsElement.textContent = String(seconds).padStart(2, "0");

    messageElement.textContent =
        "📅 14–15 November 2026 | Kolkata, India";
}

// Display the countdown immediately.
updateCountdown();

// Refresh the countdown every second.
const countdownInterval = setInterval(updateCountdown, 1000);
```

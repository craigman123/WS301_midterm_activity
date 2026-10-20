const form = document.querySelector(".login_form");
const field = document.querySelector(".login_field");
const input = document.querySelector(".login_input");
const error = document.querySelector(".login_error");

const pattern = /^(\+?\d[\d\s-]{6,}|[^\s@]+@[^\s@]+\.[^\s@]+)$/;

form.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = input.value.trim();
    const valid = pattern.test(value);

    error.textContent = value
        ? "Enter a valid phone number or email."
        : "Phone number or email is required.";
    field.classList.toggle("invalid", !valid);

    if (valid) {
        input.blur();
    }
});

input.addEventListener("input", () => {
    field.classList.remove("invalid");
});
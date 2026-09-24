document.addEventListener("DOMContentLoaded", function () {

    const navToggle = document.getElementById("nav-toggle");
    const navigation = document.getElementById("primary-navigation");
    const currentYear = document.getElementById("current-year");

    // Always start at the top
    window.scrollTo(0, 0);

    // Mobile navigation
    if (navToggle && navigation) {
        navToggle.addEventListener("click", function () {

            navigation.classList.toggle("is-open");

            const menuIsOpen =
                navigation.classList.contains("is-open");

            navToggle.setAttribute(
                "aria-expanded",
                menuIsOpen ? "true" : "false"
            );

            navToggle.setAttribute(
                "aria-label",
                menuIsOpen
                    ? "Close navigation menu"
                    : "Open navigation menu"
            );
        });
    }

    // Current year
    if (currentYear) {
        currentYear.textContent =
            new Date().getFullYear();
    }

});
function toggleDropdown(el) {
    // Close all other dropdowns
    document.querySelectorAll(".dropdown-menu").forEach(menu => {
      if (menu !== el.nextElementSibling) menu.style.display = "none";
    });
  
    const menu = el.nextElementSibling;
    if (menu) {
      menu.style.display = (menu.style.display === "block") ? "none" : "block";
    }
  }
  
  // Add click listeners
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".dropdown-toggle").forEach(toggle => {
      toggle.addEventListener("click", function (event) {
        event.preventDefault();
        toggleDropdown(this);
      });
    });
  
    // Close dropdown if you click outside
    document.addEventListener("click", function (event) {
      const isDropdown = event.target.closest('.dropdown');
      if (!isDropdown) {
        document.querySelectorAll(".dropdown-menu").forEach(menu => {
          menu.style.display = "none";
        });
      }
    });
  });
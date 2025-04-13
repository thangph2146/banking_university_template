/**
 * Blog Page JavaScript
 * Banking University Event Management System
 * 
 * This file implements interactive features for the blog listing page
 * using a functional programming approach.
 */

// Wait for DOM content to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Initialize AOS
  AOS.init({
    duration: 800,
    once: true,
    offset: 50
  });

  // Initialize components
  initSearch();
  initCategoryFilters();
  initPagination();
  initMobileMenu();
  initBackToTopButton();
});

// Mobile menu functionality
const initMobileMenu = () => {
  const menuButton = document.querySelector("#mobile-menu-button");
  const mobileMenu = document.querySelector("#mobile-menu");
  const closeButton = document.querySelector("#mobile-menu-close");
  
  if (!menuButton || !mobileMenu || !closeButton) return;
  
  // Open menu
  menuButton.addEventListener("click", () => {
    mobileMenu.classList.remove("translate-x-full");
    document.body.classList.add("overflow-hidden");
    menuButton.setAttribute("aria-expanded", "true");
    
    const icon = menuButton.querySelector("i");
    if (icon) {
      icon.className = "ri-close-line ri-lg";
    }
  });
  
  // Close menu
  closeButton.addEventListener("click", () => {
    mobileMenu.classList.add("translate-x-full");
    document.body.classList.remove("overflow-hidden");
    menuButton.setAttribute("aria-expanded", "false");
    
    const icon = menuButton.querySelector("i");
    if (icon) {
      icon.className = "ri-menu-line ri-lg";
    }
  });
  
  // Close when clicking outside
  document.addEventListener("click", (e) => {
    if (!mobileMenu.contains(e.target) && 
        !menuButton.contains(e.target) && 
        !mobileMenu.classList.contains("translate-x-full")) {
      mobileMenu.classList.add("translate-x-full");
      document.body.classList.remove("overflow-hidden");
      menuButton.setAttribute("aria-expanded", "false");
      
      const icon = menuButton.querySelector("i");
      if (icon) {
        icon.className = "ri-menu-line ri-lg";
      }
    }
  });
  
  // Close menu on escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !mobileMenu.classList.contains("translate-x-full")) {
      mobileMenu.classList.add("translate-x-full");
      document.body.classList.remove("overflow-hidden");
      menuButton.setAttribute("aria-expanded", "false");
      
      const icon = menuButton.querySelector("i");
      if (icon) {
        icon.className = "ri-menu-line ri-lg";
      }
    }
  });
};

// Search functionality with debounce
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Search functionality
const initSearch = () => {
  const searchInput = document.querySelector('input[placeholder="Tìm bài viết..."]');
  const blogCards = document.querySelectorAll('.scale-hover');
  const noResultsMsg = document.getElementById('no-results-message');
  
  if (!searchInput || !blogCards.length) return;
  
  const performSearch = () => {
    const searchValue = searchInput.value.toLowerCase().trim();
    let hasResults = false;
    
    blogCards.forEach(card => {
      const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
      const content = card.querySelector('p')?.textContent.toLowerCase() || '';
      const category = card.querySelector('.absolute.top-3.left-3')?.textContent.toLowerCase() || '';
      
      if (title.includes(searchValue) || content.includes(searchValue) || category.includes(searchValue) || !searchValue) {
        card.style.display = 'block';
        hasResults = true;
      } else {
        card.style.display = 'none';
      }
    });

    if (noResultsMsg) {
      noResultsMsg.style.display = hasResults ? 'none' : 'block';
    }
  };
  
  searchInput.addEventListener('input', debounce(performSearch, 300));
};

// Category filter functionality
const initCategoryFilters = () => {
  const categoryLinks = document.querySelectorAll('.bg-white .space-y-2 a');
  const blogCards = document.querySelectorAll('.scale-hover');
  const noResultsMsg = document.getElementById('no-results-message');
  
  if (!categoryLinks.length || !blogCards.length) return;
  
  categoryLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      const categoryText = link.querySelector('span:first-child')?.textContent.trim();
      if (!categoryText) return;
      
      // Update active state
      categoryLinks.forEach(catLink => {
        catLink.classList.remove('text-primary');
        catLink.classList.add('text-gray-600');
      });
      
      link.classList.remove('text-gray-600');
      link.classList.add('text-primary');
      
      // Filter cards
      let hasResults = false;
      blogCards.forEach(card => {
        const cardCategory = card.querySelector('.absolute.top-3.left-3')?.textContent.trim();
        const shouldShow = (cardCategory === categoryText || categoryText === 'Tất cả');
        card.style.display = shouldShow ? 'block' : 'none';
        if (shouldShow) hasResults = true;
      });

      if (noResultsMsg) {
        noResultsMsg.style.display = hasResults ? 'none' : 'block';
      }
    });
  });
};

// Pagination functionality
const initPagination = () => {
  const paginationLinks = document.querySelectorAll('.pagination a[data-page]');
  const prevButton = document.querySelector('.pagination a[aria-label="Previous page"]');
  const nextButton = document.querySelector('.pagination a[aria-label="Next page"]');
  
  if (!paginationLinks.length) return;
  
  let currentPage = 1;
  const totalPages = paginationLinks.length;
  
  const updatePaginationUI = (newPage) => {
    // Update page links
    paginationLinks.forEach(link => {
      const pageNum = parseInt(link.getAttribute('data-page'));
      if (pageNum === newPage) {
        link.classList.remove('text-gray-700');
        link.classList.add('bg-primary', 'text-white');
      } else {
        link.classList.remove('bg-primary', 'text-white');
        link.classList.add('text-gray-700');
      }
    });
    
    // Update prev/next buttons
    if (prevButton) {
      prevButton.classList.toggle('opacity-50', newPage === 1);
    }
    if (nextButton) {
      nextButton.classList.toggle('opacity-50', newPage === totalPages);
    }
  };
  
  // Handle number page clicks
  paginationLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const pageNum = parseInt(link.getAttribute('data-page'));
      if (pageNum !== currentPage) {
        currentPage = pageNum;
        updatePaginationUI(currentPage);
        // Thêm logic load dữ liệu trang mới ở đây nếu cần
      }
    });
  });
  
  // Handle prev/next clicks
  if (prevButton) {
    prevButton.addEventListener('click', (e) => {
      e.preventDefault();
      if (currentPage > 1) {
        currentPage--;
        updatePaginationUI(currentPage);
        // Thêm logic load dữ liệu trang mới ở đây nếu cần
      }
    });
  }
  
  if (nextButton) {
    nextButton.addEventListener('click', (e) => {
      e.preventDefault();
      if (currentPage < totalPages) {
        currentPage++;
        updatePaginationUI(currentPage);
        // Thêm logic load dữ liệu trang mới ở đây nếu cần
      }
    });
  }
  
  // Initialize first page
  updatePaginationUI(currentPage);
};

// Back to top button
const initBackToTopButton = () => {
  const button = document.createElement('button');
  button.innerHTML = '<i class="ri-arrow-up-line"></i>';
  button.className = 'fixed bottom-6 right-6 bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg z-40 opacity-0 invisible transition-all duration-300 hover:bg-primary/90';
  button.setAttribute('aria-label', 'Lên đầu trang');
  document.body.appendChild(button);
  
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      button.classList.add('opacity-100', 'visible');
    } else {
      button.classList.remove('opacity-100', 'visible');
    }
  });
  
  button.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}; 
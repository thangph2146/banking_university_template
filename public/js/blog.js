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
  
  const toggleMenu = (show) => {
    mobileMenu.classList.toggle("translate-x-full", !show);
    document.body.classList.toggle("overflow-hidden", show);
    menuButton.setAttribute("aria-expanded", show);
    
    const icon = menuButton.querySelector("i");
    if (icon) {
      icon.className = show ? "ri-close-line ri-lg" : "ri-menu-line ri-lg";
    }
  };

  menuButton.addEventListener("click", () => toggleMenu(true));
  closeButton.addEventListener("click", () => toggleMenu(false));
  
  document.addEventListener("click", (e) => {
    if (!mobileMenu.contains(e.target) && 
        !menuButton.contains(e.target) && 
        !mobileMenu.classList.contains("translate-x-full")) {
      toggleMenu(false);
    }
  });
  
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !mobileMenu.classList.contains("translate-x-full")) {
      toggleMenu(false);
    }
  });
};

// Search functionality with debounce
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
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
      
      const isVisible = title.includes(searchValue) || 
                       content.includes(searchValue) || 
                       category.includes(searchValue) || 
                       !searchValue;
                       
      card.style.display = isVisible ? 'block' : 'none';
      if (isVisible) hasResults = true;
    });

    if (noResultsMsg) {
      noResultsMsg.style.display = hasResults ? 'none' : 'block';
    }
  };
  
  searchInput.addEventListener('input', debounce(performSearch, 300));
};

// Category filter functionality
const initCategoryFilters = () => {
  const categoryLinks = document.querySelectorAll('.bg-white ul a');
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
  const blogCards = document.querySelectorAll('.scale-hover');
  
  if (!paginationLinks.length || !blogCards.length) return;
  
  const ITEMS_PER_PAGE = 4; // Số bài viết mỗi trang
  let currentPage = 1;
  const totalPages = Math.ceil(blogCards.length / ITEMS_PER_PAGE);
  
  const showPage = (pageNum) => {
    const start = (pageNum - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    
    blogCards.forEach((card, index) => {
      card.style.display = (index >= start && index < end) ? 'block' : 'none';
    });
  };
  
  const updatePaginationUI = (newPage) => {
    paginationLinks.forEach(link => {
      const pageNum = parseInt(link.getAttribute('data-page'));
      link.classList.toggle('bg-primary', pageNum === newPage);
      link.classList.toggle('text-white', pageNum === newPage);
      link.classList.toggle('text-gray-700', pageNum !== newPage);
    });
    
    if (prevButton) {
      prevButton.classList.toggle('opacity-50', newPage === 1);
    }
    if (nextButton) {
      nextButton.classList.toggle('opacity-50', newPage === totalPages);
    }
    
    showPage(newPage);
  };
  
  paginationLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const pageNum = parseInt(link.getAttribute('data-page'));
      if (pageNum !== currentPage) {
        currentPage = pageNum;
        updatePaginationUI(currentPage);
      }
    });
  });
  
  if (prevButton) {
    prevButton.addEventListener('click', (e) => {
      e.preventDefault();
      if (currentPage > 1) {
        currentPage--;
        updatePaginationUI(currentPage);
      }
    });
  }
  
  if (nextButton) {
    nextButton.addEventListener('click', (e) => {
      e.preventDefault();
      if (currentPage < totalPages) {
        currentPage++;
        updatePaginationUI(currentPage);
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
    button.classList.toggle('opacity-100', window.pageYOffset > 300);
    button.classList.toggle('visible', window.pageYOffset > 300);
  });
  
  button.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}; 
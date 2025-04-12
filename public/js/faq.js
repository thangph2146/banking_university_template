/**
 * FAQ Page JavaScript
 * Banking University Event Management System
 * 
 * This file implements the interactive features for the FAQ page
 * using a functional programming approach.
 */

// Wait for DOM to fully load before initializing
document.addEventListener("DOMContentLoaded", () => {
  // Initialize all components
  initMobileMenu();
  initAccordion();
  initCategoryFilter();
  initSearch();
  initScrollToHash();
  initAnimations();
  initBackToTopButton();
  setActiveMenuItems();
});

/**
 * Mobile menu functionality
 * Handles mobile menu opening/closing and related transitions
 */
const initMobileMenu = () => {
  try {
    const menuButton = document.querySelector("button#mobile-menu-button");
    const mobileMenu = document.getElementById("mobile-menu");
    const closeButton = document.getElementById("mobile-menu-close");
    
    if (!menuButton || !mobileMenu || !closeButton) return;
    
    // Open menu
    menuButton.addEventListener("click", () => {
      mobileMenu.classList.remove("translate-x-full");
      document.body.classList.add("overflow-hidden");
      menuButton.setAttribute("aria-expanded", "true");
      
      // Toggle icon
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
    
    // Animate menu items with staggered entrance
    const menuItems = mobileMenu.querySelectorAll('.mobile-menu-item');
    menuItems.forEach((item, index) => {
      item.style.setProperty('--index', index);
      item.classList.add('animate-fade-in-up-delayed');
    });
  } catch (error) {
    console.error("Error initializing mobile menu:", error);
  }
};

/**
 * Initialize accordion functionality for FAQ items
 */
const initAccordion = () => {
  try {
    const accordionHeaders = document.querySelectorAll('.faq-item-header');
    
    if (!accordionHeaders.length) return;
    
    // Add click event to each accordion header
    accordionHeaders.forEach(header => {
      // Set initial state - all closed
      const parent = header.closest('.faq-item');
      const body = parent.querySelector('.faq-item-body');
      body.style.maxHeight = "0";
      body.style.overflow = "hidden";
      
      // Add click event
      header.addEventListener('click', () => {
        const parent = header.closest('.faq-item');
        const body = parent.querySelector('.faq-item-body');
        const icon = header.querySelector('i');
        
        // Toggle this accordion
        const isOpen = parent.classList.contains('active');
        
        if (!isOpen) {
          // Open this accordion
          parent.classList.add('active');
          body.style.maxHeight = body.scrollHeight + "px";
          icon.className = 'ri-arrow-up-s-line text-gray-500 text-xl';
        } else {
          // Close this accordion
          parent.classList.remove('active');
          body.style.maxHeight = "0";
          icon.className = 'ri-arrow-down-s-line text-gray-500 text-xl';
        }
      });
    });
  } catch (error) {
    console.error("Error initializing accordion:", error);
  }
};

/**
 * Initialize category filter functionality
 */
const initCategoryFilter = () => {
  try {
    const categorySelect = document.getElementById('faq-category');
    const categories = document.querySelectorAll('.faq-category');
    
    if (!categorySelect || !categories.length) return;
    
    categorySelect.addEventListener('change', () => {
      const selectedCategory = categorySelect.value;
      
      // Show/hide categories based on selection
      categories.forEach(category => {
        const categoryName = category.getAttribute('data-category');
        
        if (selectedCategory === 'all' || selectedCategory === categoryName) {
          category.style.display = 'block';
        } else {
          category.style.display = 'none';
        }
      });
      
      // If a category is selected, reset search
      if (selectedCategory !== 'all') {
        const searchInput = document.getElementById('faq-search');
        if (searchInput && searchInput.value) {
          searchInput.value = '';
          resetSearch();
        }
      }
    });
  } catch (error) {
    console.error("Error initializing category filter:", error);
  }
};

/**
 * Initialize search functionality
 */
const initSearch = () => {
  try {
    const searchInput = document.getElementById('faq-search');
    
    if (!searchInput) return;
    
    // Create and add clear button to search input
    const clearButton = document.createElement('button');
    clearButton.className = 'absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors hidden';
    clearButton.type = 'button';
    clearButton.setAttribute('aria-label', 'Xóa tìm kiếm');
    clearButton.innerHTML = '<i class="ri-close-circle-line ri-lg"></i>';
    
    const searchInputParent = searchInput.parentElement;
    searchInputParent.style.position = 'relative';
    searchInputParent.insertBefore(clearButton, searchInput.nextSibling);
    
    // Handle clear button click
    clearButton.addEventListener('click', () => {
      searchInput.value = '';
      clearButton.classList.add('hidden');
      resetSearch();
      searchInput.focus();
    });
    
    // Toggle clear button visibility based on input content
    searchInput.addEventListener('input', () => {
      if (searchInput.value.trim() !== '') {
        clearButton.classList.remove('hidden');
      } else {
        clearButton.classList.add('hidden');
      }
    });
    
    // Handle key events
    searchInput.addEventListener('keydown', (e) => {
      // Clear on Escape
      if (e.key === 'Escape') {
        searchInput.value = '';
        clearButton.classList.add('hidden');
        resetSearch();
        searchInput.blur();
      }
      
      // Search on Enter
      if (e.key === 'Enter') {
        const searchTerm = searchInput.value.toLowerCase().trim();
        if (searchTerm.length > 1) {
          searchFAQs(searchTerm);
        } else if (searchTerm.length === 0) {
          resetSearch();
        }
      }
    });
    
    // Debounce search to avoid excessive filtering while typing
    searchInput.addEventListener('input', debounce(() => {
      const searchTerm = searchInput.value.toLowerCase().trim();
      
      if (searchTerm.length > 1) {
        searchFAQs(searchTerm);
      } else if (searchTerm.length === 0) {
        resetSearch();
      }
    }, 300));
  } catch (error) {
    console.error("Error initializing search:", error);
  }
};

/**
 * Search FAQ items based on the provided search term
 * @param {string} searchTerm - The term to search for
 */
const searchFAQs = (searchTerm) => {
  try {
    // Don't perform search for very short terms unless they're numbers
    if (searchTerm.length < 2 && !/^\d+$/.test(searchTerm)) {
      return;
    }
    
    // Reset previous search first
    resetSearch();
    
    // Reset category filter
    const categorySelect = document.getElementById('faq-category');
    if (categorySelect) {
      categorySelect.value = 'all';
    }
    
    // Show all categories
    const categories = document.querySelectorAll('.faq-category');
    categories.forEach(category => {
      category.style.display = 'block';
    });
    
    // Hide all questions first
    const allQuestions = document.querySelectorAll('.faq-item');
    allQuestions.forEach(item => {
      item.style.display = 'none';
    });
    
    // Then show those that match
    const faqItems = document.querySelectorAll('.faq-item');
    let hasMatch = false;
    
    // Track matched categories
    const matchedCategories = new Set();
    
    faqItems.forEach(faqItem => {
      const question = faqItem.querySelector('.faq-item-header h3');
      const faqBody = faqItem.querySelector('.faq-item-body');
      
      if (!question || !faqBody) return;
      
      const questionText = question.textContent.toLowerCase();
      const bodyText = faqBody.textContent.toLowerCase();
      
      // Check if the item contains the search term
      if (questionText.includes(searchTerm.toLowerCase()) || 
          bodyText.includes(searchTerm.toLowerCase())) {
        
        // Make the item visible
        faqItem.style.display = 'block';
        hasMatch = true;
        
        // Open the item to show match
        faqItem.classList.add('active');
        faqBody.style.maxHeight = faqBody.scrollHeight + "px";
        
        // Update icon
        const icon = faqItem.querySelector('.faq-item-header i');
        if (icon) {
          icon.className = 'ri-arrow-up-s-line text-gray-500 text-xl';
        }
        
        // Highlight matches
        highlightMatches(question, searchTerm);
        highlightMatches(faqBody, searchTerm);
        
        // Track the category this item belongs to
        const category = faqItem.closest('.faq-category');
        if (category) {
          matchedCategories.add(category);
        }
      }
    });
    
    // Only show categories with matches
    categories.forEach(category => {
      if (!matchedCategories.has(category)) {
        category.style.display = 'none';
      }
    });
    
    // Show message if no results
    displayNoResults(!hasMatch, searchTerm);
    
    // Scroll to first result if any
    if (hasMatch) {
      const firstMatch = document.querySelector('.faq-item[style*="display: block"]');
      if (firstMatch) {
        setTimeout(() => {
          window.scrollTo({
            top: firstMatch.offsetTop - 100,
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  } catch (error) {
    console.error("Error performing search:", error);
    // If search fails, reset everything to a usable state
    resetSearch();
  }
};

/**
 * Highlight search term matches in the provided element
 * @param {HTMLElement} element - The element to search in
 * @param {string} searchTerm - The term to highlight
 */
const highlightMatches = (element, searchTerm) => {
  try {
    // Store original content to restore later if not already stored
    if (!element.dataset.originalContent) {
      element.dataset.originalContent = element.innerHTML;
    }
    
    const originalContent = element.dataset.originalContent;
    
    // Escape special regex characters in the search term
    const escapedSearchTerm = searchTerm.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    
    // Create case-insensitive regular expression for the search term
    const regex = new RegExp(`(${escapedSearchTerm})`, 'gi');
    
    // Replace matches with highlighted version but only in text nodes
    // This avoids breaking HTML structure
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = originalContent;
    
    const highlightText = (node) => {
      if (node.nodeType === 3) { // Text node
        const content = node.nodeValue;
        if (content.toLowerCase().includes(searchTerm.toLowerCase())) {
          const highlightedContent = content.replace(regex, 
            '<span class="bg-yellow-200 text-gray-900 rounded px-1">$1</span>');
          const wrapper = document.createElement('span');
          wrapper.innerHTML = highlightedContent;
          node.parentNode.replaceChild(wrapper, node);
        }
      } else if (node.nodeType === 1) { // Element node
        // Skip if this is already a highlight
        if (node.classList && node.classList.contains('bg-yellow-200')) {
          return;
        }
        
        // Process child nodes
        Array.from(node.childNodes).forEach(child => {
          highlightText(child);
        });
      }
    };
    
    // Simple fallback method if the advanced one fails
    try {
      // Try the advanced method
      const tempElement = document.createElement('div');
      tempElement.innerHTML = originalContent;
      Array.from(tempElement.childNodes).forEach(node => {
        highlightText(node);
      });
      element.innerHTML = tempElement.innerHTML;
    } catch (error) {
      // Fallback to simple method if advanced fails
      console.log("Using simple highlight method due to:", error);
      element.innerHTML = originalContent.replace(regex, 
        '<span class="bg-yellow-200 text-gray-900 rounded px-1">$1</span>');
    }
  } catch (error) {
    console.error("Error highlighting matches:", error);
    // Ensure original content is restored in case of error
    if (element.dataset.originalContent) {
      element.innerHTML = element.dataset.originalContent;
    }
  }
};

/**
 * Reset the search and display all questions
 */
const resetSearch = () => {
  try {
    // Show all questions
    const allQuestions = document.querySelectorAll('.faq-item');
    allQuestions.forEach(item => {
      item.style.display = 'block';
      item.classList.remove('active');
      
      const body = item.querySelector('.faq-item-body');
      if (body) {
        body.style.maxHeight = "0";
      }
      
      const icon = item.querySelector('.faq-item-header i');
      if (icon) {
        icon.className = 'ri-arrow-down-s-line text-gray-500 text-xl';
      }
    });
    
    // Reset highlights
    const allElements = document.querySelectorAll('[data-original-content]');
    allElements.forEach(element => {
      try {
        // Restore original content
        if (element.dataset.originalContent) {
          element.innerHTML = element.dataset.originalContent;
          delete element.dataset.originalContent;
        }
      } catch (elementError) {
        console.error("Error resetting element:", elementError);
      }
    });
    
    // Hide no results message
    displayNoResults(false);
    
    // Reset category filter if it exists
    const categorySelect = document.getElementById('faq-category');
    if (categorySelect) {
      categorySelect.value = 'all';
      
      // Show all categories
      const categories = document.querySelectorAll('.faq-category');
      categories.forEach(category => {
        category.style.display = 'block';
      });
    }
  } catch (error) {
    console.error("Error resetting search:", error);
  }
};

/**
 * Display or hide "no results" message
 * @param {boolean} show - Whether to show the message
 * @param {string} searchTerm - The search term that was used
 */
const displayNoResults = (show, searchTerm = '') => {
  let noResultsMessage = document.getElementById('no-results-message');
  
  if (show) {
    if (!noResultsMessage) {
      noResultsMessage = document.createElement('div');
      noResultsMessage.id = 'no-results-message';
      noResultsMessage.className = 'py-10 text-center bg-gray-50 rounded-lg shadow-sm my-8';
      
      // Include search term in the message if provided
      const searchTermDisplay = searchTerm ? 
        `<p class="text-gray-600 mb-3">Không tìm thấy kết quả cho: <span class="font-medium">"${searchTerm}"</span></p>` :
        '';
      
      noResultsMessage.innerHTML = `
        <div class="text-4xl text-gray-300 mb-3"><i class="ri-search-line"></i></div>
        <h3 class="text-xl font-semibold text-gray-700 mb-2">Không tìm thấy kết quả</h3>
        ${searchTermDisplay}
        <p class="text-gray-600">Vui lòng thử từ khóa khác hoặc liên hệ với chúng tôi để được hỗ trợ.</p>
        <div class="mt-4">
          <a href="contact.html" class="text-primary hover:underline">Liên hệ bộ phận hỗ trợ</a>
        </div>
      `;
      
      // Find a valid container
      let container = document.querySelector('.faq-category')?.parentElement;
      if (!container) {
        container = document.querySelector('.max-w-4xl');
      }
      if (!container) {
        container = document.querySelector('.container');
      }
      
      if (container) {
        container.appendChild(noResultsMessage);
      }
    } else {
      // Update existing message with new search term if provided
      if (searchTerm) {
        const searchTermParagraph = noResultsMessage.querySelector('p.text-gray-600.mb-3');
        if (searchTermParagraph) {
          searchTermParagraph.innerHTML = `Không tìm thấy kết quả cho: <span class="font-medium">"${searchTerm}"</span>`;
        } else {
          const heading = noResultsMessage.querySelector('h3');
          if (heading) {
            const searchTermElement = document.createElement('p');
            searchTermElement.className = 'text-gray-600 mb-3';
            searchTermElement.innerHTML = `Không tìm thấy kết quả cho: <span class="font-medium">"${searchTerm}"</span>`;
            heading.insertAdjacentElement('afterend', searchTermElement);
          }
        }
      }
      
      noResultsMessage.style.display = 'block';
    }
  } else if (noResultsMessage) {
    noResultsMessage.style.display = 'none';
  }
};

/**
 * Scroll to hash if URL contains one
 */
const initScrollToHash = () => {
  try {
    if (window.location.hash) {
      setTimeout(() => {
        const id = window.location.hash;
        const element = document.querySelector(id);
        if (element) {
          scrollToTarget(id);
          
          // If it's an FAQ item, open it
          const faqItem = element.closest('.faq-item');
          if (faqItem) {
            const body = faqItem.querySelector('.faq-item-body');
            const icon = faqItem.querySelector('.faq-item-header i');
            
            faqItem.classList.add('active');
            body.style.maxHeight = body.scrollHeight + "px";
            if (icon) icon.className = 'ri-arrow-up-s-line text-gray-500 text-xl';
          }
        }
      }, 300);
    }
  } catch (error) {
    console.error("Error initializing scroll to hash:", error);
  }
};

/**
 * Scroll to a target element by ID with smooth animation
 * @param {string} targetId - The ID of the target element
 */
const scrollToTarget = (targetId) => {
  const targetElement = document.querySelector(targetId);
  if (targetElement) {
    window.scrollTo({
      top: targetElement.offsetTop - 80, // Account for sticky header
      behavior: 'smooth'
    });
  }
};

/**
 * Initialize animations for page elements
 */
const initAnimations = () => {
  try {
    // Add entrance animations to section headings
    const sectionHeadings = document.querySelectorAll('.faq-category h2');
    sectionHeadings.forEach((heading, index) => {
      heading.style.opacity = '0';
      heading.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        heading.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        heading.style.opacity = '1';
        heading.style.transform = 'translateY(0)';
      }, 100 + (index * 150));
    });
    
    // Animate search box entrance
    const searchBox = document.getElementById('faq-search');
    if (searchBox) {
      searchBox.style.opacity = '0';
      searchBox.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        searchBox.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        searchBox.style.opacity = '1';
        searchBox.style.transform = 'translateY(0)';
      }, 100);
    }
  } catch (error) {
    console.error("Error initializing animations:", error);
  }
};

/**
 * Initialize "back to top" button
 */
const initBackToTopButton = () => {
  try {
    const backToTopBtn = createBackToTopButton();
    document.body.appendChild(backToTopBtn);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
      toggleBackToTopButton(backToTopBtn);
    });
    
    // Scroll to top when button is clicked
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  } catch (error) {
    console.error("Error initializing back to top button:", error);
  }
};

/**
 * Creates the back to top button element
 * @returns {HTMLElement} The created button
 */
const createBackToTopButton = () => {
  const button = document.createElement('button');
  button.innerHTML = '<i class="ri-arrow-up-line"></i>';
  button.className = 'fixed bottom-6 right-6 bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg z-40 opacity-0 invisible transition-all duration-300 hover:bg-primary/90';
  button.setAttribute('aria-label', 'Lên đầu trang');
  return button;
};

/**
 * Toggle back to top button visibility based on scroll position
 * @param {HTMLElement} button - The back to top button
 */
const toggleBackToTopButton = (button) => {
  if (window.pageYOffset > 300) {
    button.classList.add('opacity-100', 'visible');
  } else {
    button.classList.remove('opacity-100', 'visible');
  }
};

/**
 * Debounce function to limit how often a function is called
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
const debounce = (func, wait) => {
  let timeout;
  return function() {
    const context = this;
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
};

/**
 * Set active menu items based on current page
 */
const setActiveMenuItems = () => {
  try {
    const currentPath = window.location.pathname;
    const desktopLinks = document.querySelectorAll('header nav.hidden.md\\:flex a');
    const mobileLinks = document.querySelectorAll('#mobile-menu nav ul li a');
    
    // Get current page name from path
    const pageName = currentPath.split('/').pop() || 'index.html';
    
    // Update desktop menu
    updateActiveLinks(desktopLinks, pageName);
    
    // Update mobile menu
    updateActiveLinks(mobileLinks, pageName, true);
  } catch (error) {
    console.error("Error setting active menu items:", error);
  }
};

/**
 * Update active state of navigation links
 * @param {NodeList} links - The navigation links
 * @param {string} currentPage - The current page name
 * @param {boolean} isMobile - Whether these are mobile menu links
 */
const updateActiveLinks = (links, currentPage, isMobile = false) => {
  links.forEach(link => {
    // Reset all links
    if (isMobile) {
      link.classList.remove('border-l-4', 'border-white', 'pl-2', 'text-white');
      link.classList.add('text-white/80');
    } else {
      link.classList.remove('border-b-2', 'border-white', 'text-white');
      link.classList.add('text-white/80');
    }
    link.removeAttribute('aria-current');
    
    // Check if link matches current page
    const linkHref = link.getAttribute('href');
    const isActive = linkHref === currentPage || 
                    (currentPage === 'faq.html' && linkHref === './faq.html') ||
                    (currentPage === '' && linkHref === 'index.html');
    
    if (isActive) {
      if (isMobile) {
        link.classList.add('border-l-4', 'border-white', 'pl-2', 'text-white');
      } else {
        link.classList.add('border-b-2', 'border-white', 'text-white');
      }
      link.classList.remove('text-white/80');
      link.setAttribute('aria-current', 'page');
    }
  });
}; 
/**
 * Blog Page JavaScript
 * Banking University Event Management System
 * 
 * This file implements interactive features for the blog listing page
 * using a functional programming approach.
 */

// Initialize AOS animation library
const initAOS = () => {
  try {
    AOS.init({
      duration: 800,
      once: true,
      offset: 50,
      delay: 50,
      easing: 'ease-in-out'
    });
  } catch (error) {
    console.error('Error initializing AOS:', error);
  }
};

// Mobile menu functionality
const initMobileMenu = () => {
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  const closeButton = document.querySelector('#mobile-menu button');
  
  if (!mobileMenuButton || !mobileMenu || !closeButton) {
    return;
  }
  
  // Function to open mobile menu with animation
  const openMobileMenu = () => {
    mobileMenu.classList.remove('hidden');
    // Trigger reflow to ensure the animation works
    void mobileMenu.offsetWidth;
    mobileMenu.classList.remove('translate-x-full');
    document.body.classList.add('overflow-hidden');
  };
  
  // Function to close mobile menu with animation
  const closeMobileMenu = () => {
    mobileMenu.classList.add('translate-x-full');
    setTimeout(() => {
      mobileMenu.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    }, 300); // Match the duration in the CSS transition
  };
  
  // Add event listeners for open/close buttons
  mobileMenuButton.addEventListener('click', openMobileMenu);
  closeButton.addEventListener('click', closeMobileMenu);
  
  // Close the menu when clicking outside of it
  document.addEventListener('click', (event) => {
    if (
      !mobileMenu.classList.contains('hidden') &&
      !mobileMenu.contains(event.target) &&
      !mobileMenuButton.contains(event.target)
    ) {
      closeMobileMenu();
    }
  });
};

// Function to handle category filter toggle
const initCategoryFilters = () => {
  const categoryLinks = document.querySelectorAll('.bg-white ul a');
  const blogCards = document.querySelectorAll('.scale-hover');
  
  if (!categoryLinks.length || !blogCards.length) {
    return;
  }
  
  // Add data attributes to blog cards based on category labels for filtering
  blogCards.forEach(card => {
    const categoryLabel = card.querySelector('.absolute.top-3.left-3');
    if (categoryLabel) {
      const category = categoryLabel.textContent.trim();
      card.setAttribute('data-category', category);
    }
  });
  
  // Add click event listeners to category links
  categoryLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Get category from the link's text content
      const categoryText = link.querySelector('span:first-child').textContent.trim();
      const category = categoryText.replace(/^[\s\u00A0]+|[\s\u00A0]+$/g, '');
      
      // Reset all links to default style
      categoryLinks.forEach(catLink => {
        catLink.classList.remove('text-primary');
        catLink.classList.add('text-gray-600');
      });
      
      // Highlight the selected link
      link.classList.remove('text-gray-600');
      link.classList.add('text-primary');
      
      // Filter blog posts by category
      filterBlogPosts(blogCards, category);
    });
  });
};

// Filter blog posts based on selected category
const filterBlogPosts = (cards, selectedCategory) => {
  let visibleCount = 0;
  
  cards.forEach(card => {
    const cardCategory = card.getAttribute('data-category');
    
    // Add fade-out animation for hiding cards
    if (cardCategory === selectedCategory || selectedCategory === 'Tất cả' || selectedCategory === '') {
      card.style.opacity = '0';
      setTimeout(() => {
        card.style.display = 'block';
        setTimeout(() => {
          card.style.opacity = '1';
        }, 50);
      }, 300);
      visibleCount++;
    } else {
      card.style.opacity = '0';
      setTimeout(() => {
        card.style.display = 'none';
      }, 300);
    }
  });
  
  // Update the pagination based on filtered results
  updatePagination(visibleCount);
};

// Initialize search functionality
const initSearch = () => {
  const searchInput = document.querySelector('input[placeholder="Tìm bài viết..."]');
  const blogCards = document.querySelectorAll('.scale-hover');
  
  if (!searchInput || !blogCards.length) {
    return;
  }
  
  // Create search button and reset button
  const searchContainer = searchInput.parentElement;
  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'flex mt-3 gap-2';
  
  const searchButton = document.createElement('button');
  searchButton.className = 'bg-primary text-white px-3 py-2 rounded-md flex items-center justify-center flex-1 hover:bg-red-800 transition-colors';
  searchButton.innerHTML = '<i class="ri-search-line mr-2"></i> Tìm kiếm';
  
  const resetButton = document.createElement('button');
  resetButton.className = 'bg-gray-200 text-gray-700 px-3 py-2 rounded-md flex items-center justify-center hover:bg-gray-300 transition-colors';
  resetButton.innerHTML = '<i class="ri-refresh-line"></i>';
  
  buttonContainer.appendChild(searchButton);
  buttonContainer.appendChild(resetButton);
  searchContainer.parentNode.appendChild(buttonContainer);
  
  // Add event listeners for search
  const performSearch = () => {
    const searchValue = searchInput.value.toLowerCase().trim();
    
    // If search field is empty, show all cards
    if (!searchValue) {
      blogCards.forEach(card => {
        card.style.display = 'block';
        setTimeout(() => {
          card.style.opacity = '1';
        }, 50);
      });
      return;
    }
    
    let visibleCount = 0;
    
    // Filter cards based on search input
    blogCards.forEach(card => {
      const title = card.querySelector('h3').textContent.toLowerCase();
      const content = card.querySelector('p').textContent.toLowerCase();
      
      if (title.includes(searchValue) || content.includes(searchValue)) {
        card.style.opacity = '0';
        setTimeout(() => {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
          }, 50);
        }, 300);
        visibleCount++;
      } else {
        card.style.opacity = '0';
        setTimeout(() => {
          card.style.display = 'none';
        }, 300);
      }
    });
    
    // Update pagination based on search results
    updatePagination(visibleCount);
  };
  
  // Reset search function
  const resetSearch = () => {
    searchInput.value = '';
    blogCards.forEach(card => {
      card.style.display = 'block';
      setTimeout(() => {
        card.style.opacity = '1';
      }, 50);
    });
    updatePagination(blogCards.length);
  };
  
  // Add event listeners
  searchButton.addEventListener('click', performSearch);
  resetButton.addEventListener('click', resetSearch);
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      performSearch();
    }
  });
};

// Initialize back to top button
const initBackToTopButton = () => {
  // Create back to top button if it doesn't exist
  let backToTopButton = document.getElementById('back-to-top');
  
  if (!backToTopButton) {
    backToTopButton = document.createElement('button');
    backToTopButton.id = 'back-to-top';
    backToTopButton.className = 'fixed bottom-6 right-6 bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg z-40 transition-all duration-300 opacity-0 translate-y-10 scale-90';
    backToTopButton.innerHTML = '<i class="ri-arrow-up-line text-xl"></i>';
    backToTopButton.setAttribute('aria-label', 'Lên đầu trang');
    document.body.appendChild(backToTopButton);
  }
  
  // Show/hide back to top button based on scroll position
  const toggleBackToTopButton = () => {
    if (window.scrollY > 300) {
      backToTopButton.classList.remove('opacity-0', 'translate-y-10', 'scale-90');
    } else {
      backToTopButton.classList.add('opacity-0', 'translate-y-10', 'scale-90');
    }
  };
  
  // Scroll to top when button is clicked
  backToTopButton.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  // Add scroll event listener
  window.addEventListener('scroll', toggleBackToTopButton);
  
  // Initial check
  toggleBackToTopButton();
};

// Initialize newsletter subscription
const initNewsletterForm = () => {
  const newsletterForms = document.querySelectorAll('form');
  
  if (!newsletterForms.length) {
    return;
  }
  
  newsletterForms.forEach(form => {
    const emailInput = form.querySelector('input[type="email"]');
    const submitButton = form.querySelector('button[type="submit"]');
    
    if (!emailInput || !submitButton) {
      return;
    }
    
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const email = emailInput.value.trim();
      
      // Basic email validation
      if (!isValidEmail(email)) {
        showToast('Vui lòng nhập địa chỉ email hợp lệ', 'error');
        emailInput.focus();
        return;
      }
      
      // Show loading state
      const originalButtonText = submitButton.innerHTML;
      submitButton.innerHTML = '<i class="ri-loader-2-line animate-spin"></i>';
      submitButton.disabled = true;
      
      // Simulate API call
      setTimeout(() => {
        // Reset button
        submitButton.innerHTML = originalButtonText;
        submitButton.disabled = false;
        
        // Show success message
        showToast('Đăng ký nhận tin thành công!', 'success');
        
        // Reset form
        emailInput.value = '';
      }, 1500);
    });
  });
};

// Validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Show toast notification
const showToast = (message, type = 'success') => {
  // Create toast element if it doesn't exist
  let toast = document.getElementById('toast-notification');
  
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-notification';
    toast.className = 'fixed top-6 right-6 z-50 transform translate-y-[-100%] opacity-0 transition-all duration-300';
    document.body.appendChild(toast);
  }
  
  // Set toast content based on type
  let bgColor = 'bg-primary';
  let icon = '<i class="ri-check-line"></i>';
  
  if (type === 'error') {
    bgColor = 'bg-red-600';
    icon = '<i class="ri-error-warning-line"></i>';
  }
  
  toast.className = `fixed top-6 right-6 z-50 transform translate-y-[-100%] opacity-0 transition-all duration-300 ${bgColor} text-white px-4 py-3 rounded-lg shadow-xl flex items-center`;
  toast.innerHTML = `
    <span class="flex items-center justify-center w-6 h-6 mr-2">${icon}</span>
    <span>${message}</span>
  `;
  
  // Show toast
  setTimeout(() => {
    toast.classList.remove('translate-y-[-100%]', 'opacity-0');
  }, 10);
  
  // Hide toast after delay
  setTimeout(() => {
    toast.classList.add('translate-y-[-100%]', 'opacity-0');
  }, 3000);
};

// Initialize hover effects for blog cards
const initCardHoverEffects = () => {
  const blogCards = document.querySelectorAll('.scale-hover');
  
  if (!blogCards.length) {
    return;
  }
  
  blogCards.forEach(card => {
    // Add hover effect for image zoom
    const image = card.querySelector('img');
    
    if (image) {
      image.addEventListener('mouseover', () => {
        image.style.transform = 'scale(1.05)';
      });
      
      image.addEventListener('mouseout', () => {
        image.style.transform = 'scale(1)';
      });
    }
    
    // Add click event to the whole card to navigate to blog detail
    card.addEventListener('click', (e) => {
      // Don't trigger if clicking on a link or button inside the card
      if (e.target.closest('a') || e.target.closest('button')) {
        return;
      }
      
      const titleLink = card.querySelector('h3 a');
      if (titleLink) {
        window.location.href = titleLink.getAttribute('href');
      }
    });
  });
};

// Initialize pagination functionality
const initPagination = () => {
  const paginationLinks = document.querySelectorAll('.mt-8 nav a');
  
  if (!paginationLinks.length) {
    return;
  }
  
  paginationLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Remove active class from all links
      paginationLinks.forEach(pl => {
        pl.classList.remove('bg-primary', 'text-white');
        pl.classList.add('text-gray-700', 'hover:bg-primary', 'hover:text-white');
      });
      
      // Add active class to clicked link
      link.classList.remove('text-gray-700', 'hover:bg-primary', 'hover:text-white');
      link.classList.add('bg-primary', 'text-white');
      
      // Scroll to top of blog section
      const blogSection = document.querySelector('.py-8.md\\:py-16.bg-gray-50');
      if (blogSection) {
        blogSection.scrollIntoView({ behavior: 'smooth' });
      }
      
      // In a real application, this would fetch new blog posts for the selected page
      // For now, we'll just simulate that with a visual effect
      const blogCards = document.querySelectorAll('.scale-hover');
      
      blogCards.forEach(card => {
        card.style.opacity = '0';
        
        setTimeout(() => {
          card.style.opacity = '1';
        }, 500);
      });
    });
  });
};

// Update pagination based on number of visible items
const updatePagination = (visibleCount) => {
  const pagination = document.querySelector('.mt-8.flex.justify-center');
  
  if (!pagination) {
    return;
  }
  
  // Show/hide pagination based on number of visible items
  if (visibleCount > 0) {
    pagination.style.display = 'flex';
  } else {
    pagination.style.display = 'none';
  }
};

// Initialize smooth scrolling
const initSmoothScrolling = () => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Only apply smooth scroll to anchors pointing to elements on the page
      if (href !== '#' && document.querySelector(href)) {
        e.preventDefault();
        
        document.querySelector(href).scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
};

// Initialize all functionality when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  initAOS();
  initMobileMenu();
  initCategoryFilters();
  initSearch();
  initBackToTopButton();
  initNewsletterForm();
  initCardHoverEffects();
  initPagination();
  initSmoothScrolling();
  
  // For demo purposes, assign random categories to blog cards
  assignRandomCategoriesToCards();
});

/**
 * Assign random categories to blog cards for demo purposes
 * This would be removed in a real application where categories come from the backend
 */
const assignRandomCategoriesToCards = () => {
  const blogCards = document.querySelectorAll('.scale-hover');
  const categories = ['Học thuật', 'Tài chính', 'Công nghệ', 'Sự kiện', 'Đời sống', 'Nghiên cứu'];
  
  blogCards.forEach(card => {
    const categoryElement = card.querySelector('.absolute.top-3.left-3');
    if (categoryElement && !card.hasAttribute('data-category')) {
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      card.setAttribute('data-category', randomCategory);
    }
  });
}; 
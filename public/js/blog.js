/**
 * Blog Page JavaScript
 * Banking University Event Management System
 * 
 * This file implements interactive features for the blog listing page
 * using a functional programming approach.
 */

// Wait for DOM content to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Initialize components in order of priority 
  initAOS();
  // Initialize core interactions first
  initSearch();
  initCategoryFilters();
  initCardHoverEffects();
  initPagination();
  
  // Init lazy loaded components or lower priority
  initNewsletterForm();
  initSmoothScrolling();
  initBackToTopButton();
  
  // Initialize mobile menu last (only when needed)
  initMobileMenu();
  
  // For demo purposes only - would be removed in production 
  assignRandomCategoriesToCards();
});

// Initialize AOS animation library
const initAOS = () => {
  try {
    AOS.init({
      duration: 800,
      once: true,
      offset: 50,
      delay: 50,
      easing: 'ease-in-out',
      // Disable AOS on mobile for better performance
      disable: window.innerWidth < 768
    });
  } catch (error) {
    console.error('Error initializing AOS:', error);
  }
};

// Mobile menu functionality - lazy loaded
const initMobileMenu = () => {
  try {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    let mobileMenu = document.getElementById('mobile-menu');
    
    if (!mobileMenuButton) {
      return;
    }
    
    // Lazy load mobile menu - only create/initialize when user clicks button
    let menuInitialized = false;
    
    // Function to create mobile menu on first click
    const createMobileMenu = () => {
      // If already in DOM but hidden
      if (mobileMenu) {
        openMobileMenu();
        return;
      }
      
      // Create the mobile menu dynamically
      mobileMenu = document.createElement('div');
      mobileMenu.id = 'mobile-menu';
      mobileMenu.className = 'md:hidden bg-primary/95 fixed inset-0 z-50 transform translate-x-full transition-transform duration-300 ease-in-out backdrop-blur-sm';
      mobileMenu.setAttribute('aria-hidden', 'true');
      
      // Create mobile menu content
      mobileMenu.innerHTML = `
        <div class="p-4 flex justify-between items-center border-b border-red-900/30">
          <a href="index.html" class="text-2xl font-pacifico text-white flex items-center">
            <img src="../images/logo/logo-white-vertical.png" alt="Đại học Ngân hàng TP.HCM logo" class="w-12 h-12">
          </a>
          <button class="w-10 h-10 flex items-center justify-center text-white" aria-label="Đóng menu">
            <i class="ri-close-line ri-lg"></i>
          </button>
        </div>
        <nav class="p-4" aria-label="Mobile navigation">
          <ul class="space-y-4">
            <li><a href="index.html" class="font-medium text-white/80 hover:text-white py-2 block transition-all duration-300 hover:translate-x-1">Trang chủ</a></li>
            <li><a href="events.html" class="font-medium text-white/80 hover:text-white py-2 block transition-all duration-300 hover:translate-x-1">Sự kiện</a></li>
            <li><a href="blog.html" class="font-medium text-white border-l-4 border-white pl-2 py-2 block transition-all duration-300 hover:translate-x-1" aria-current="page">Blog</a></li>
            <li><a href="news.html" class="font-medium text-white/80 hover:text-white py-2 block transition-all duration-300 hover:translate-x-1">Giới thiệu</a></li>
            <li><a href="contact.html" class="font-medium text-white/80 hover:text-white py-2 block transition-all duration-300 hover:translate-x-1">Liên hệ</a></li>
            <li class="pt-4">
              <a href="login.html" class="bg-white text-primary px-4 py-2 !rounded-button whitespace-nowrap block text-center hover:bg-gray-100 transition-colors shadow-sm">Đăng nhập</a>
            </li>
            <li class="pt-2">
              <a href="register.html" class="bg-white text-primary px-4 py-2 !rounded-button whitespace-nowrap block text-center hover:bg-gray-100 transition-colors shadow-sm">Đăng ký</a>
            </li>
          </ul>
        </nav>
      `;
      
      // Append to body
      document.body.appendChild(mobileMenu);
      
      // Get the close button and add event listener
      const closeButton = mobileMenu.querySelector('button');
      closeButton.addEventListener('click', closeMobileMenu);
      
      // Add click outside listener
      document.addEventListener('click', handleClickOutside);
      
      // Add escape key listener
      document.addEventListener('keydown', handleEscKey);
      
      // Open the menu after creation
      requestAnimationFrame(() => {
        openMobileMenu();
      });
      
      menuInitialized = true;
    };
    
    // Function to open mobile menu with animation
    const openMobileMenu = () => {
      document.body.classList.add('overflow-hidden');
      mobileMenu.classList.remove('translate-x-full');
      mobileMenu.setAttribute('aria-hidden', 'false');
    };
    
    // Function to close mobile menu with animation
    const closeMobileMenu = () => {
      mobileMenu.classList.add('translate-x-full');
      mobileMenu.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('overflow-hidden');
    };
    
    // Handle click outside of menu
    const handleClickOutside = (event) => {
      if (
        mobileMenu && 
        !mobileMenu.classList.contains('translate-x-full') &&
        !mobileMenu.contains(event.target) &&
        !mobileMenuButton.contains(event.target)
      ) {
        closeMobileMenu();
      }
    };
    
    // Handle escape key press
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && mobileMenu && !mobileMenu.classList.contains('translate-x-full')) {
        closeMobileMenu();
      }
    };
    
    // Add click event to the menu button - lazy loads the menu
    mobileMenuButton.addEventListener('click', (e) => {
      e.preventDefault();
      if (!menuInitialized) {
        createMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  } catch (error) {
    console.error('Error initializing mobile menu:', error);
  }
};

// Function to handle category filter toggle
const initCategoryFilters = () => {
  try {
    const categoryLinks = document.querySelectorAll('.bg-white .space-y-2 a');
    const blogCards = document.querySelectorAll('.scale-hover');
    
    if (!categoryLinks.length || !blogCards.length) {
      console.warn('Không tìm thấy các phần tử category hoặc blog cards');
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
        const categorySpan = link.querySelector('span:first-child');
        if (!categorySpan) return;
        
        const categoryText = categorySpan.textContent.trim();
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
  } catch (error) {
    console.error('Error initializing category filters:', error);
  }
};

// Filter blog posts based on selected category
const filterBlogPosts = (cards, selectedCategory) => {
  try {
    let visibleCount = 0;
    
    // Thêm class để xử lý animation
    cards.forEach(card => {
      card.classList.add('transition-all', 'duration-300', 'ease-in-out');
    });

    cards.forEach(card => {
      const cardCategory = card.getAttribute('data-category');
      
      if (cardCategory === selectedCategory || selectedCategory === 'Tất cả' || !selectedCategory) {
        // Hiển thị card phù hợp với category
        card.style.opacity = '0';
        card.style.display = 'block';
        
        // Sử dụng setTimeout để tạo animation mượt mà
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 50);
        
        visibleCount++;
      } else {
        // Ẩn card không phù hợp
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
          card.style.display = 'none';
        }, 300);
      }
    });
    
    // Cập nhật phân trang và hiển thị thông báo
    updatePagination(visibleCount);
    displayNoResults(visibleCount === 0, selectedCategory);

    // Log để debug
    console.log(`Đã lọc: ${visibleCount} bài viết cho danh mục "${selectedCategory}"`);
  } catch (error) {
    console.error('Lỗi khi lọc bài viết:', error);
  }
};

// Display no results message
const displayNoResults = (show, category) => {
  try {
    // Xóa thông báo cũ nếu có
    const existingMessage = document.getElementById('no-results-message');
    if (existingMessage) {
      existingMessage.remove();
    }
    
    if (show) {
      const blogContainer = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2');
      
      if (blogContainer) {
        const message = document.createElement('div');
        message.id = 'no-results-message';
        message.className = 'col-span-full p-8 text-center bg-white rounded-lg shadow-sm transition-all duration-300';
        message.innerHTML = `
          <div class="text-5xl text-gray-300 mb-4 flex justify-center">
            <i class="ri-search-line"></i>
          </div>
          <h3 class="text-xl font-bold text-gray-700 mb-2">Không tìm thấy kết quả</h3>
          <p class="text-gray-600">Không có bài viết nào trong danh mục "${category || 'đã chọn'}"</p>
          <button class="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-red-700 transition-colors" onclick="resetFilters()">
            <i class="ri-refresh-line mr-2"></i>Xem tất cả bài viết
          </button>
        `;
        
        // Thêm animation khi hiển thị
        message.style.opacity = '0';
        message.style.transform = 'translateY(20px)';
        blogContainer.appendChild(message);
        
        setTimeout(() => {
          message.style.opacity = '1';
          message.style.transform = 'translateY(0)';
        }, 50);
      }
    }
  } catch (error) {
    console.error('Lỗi khi hiển thị thông báo không có kết quả:', error);
  }
};

// Thêm hàm resetFilters để xử lý nút reset
const resetFilters = () => {
  try {
    const blogCards = document.querySelectorAll('.scale-hover');
    const categoryLinks = document.querySelectorAll('.bg-white .space-y-2 a');
    
    // Reset tất cả card về trạng thái hiển thị
    blogCards.forEach(card => {
      card.style.opacity = '0';
      card.style.display = 'block';
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, 50);
    });
    
    // Reset style của các category link
    categoryLinks.forEach(link => {
      link.classList.remove('text-primary');
      link.classList.add('text-gray-600');
    });
    
    // Cập nhật phân trang
    updatePagination(blogCards.length);
    
    // Xóa thông báo không có kết quả
    const noResultsMessage = document.getElementById('no-results-message');
    if (noResultsMessage) {
      noResultsMessage.remove();
    }
  } catch (error) {
    console.error('Lỗi khi reset bộ lọc:', error);
  }
};

// Initialize search functionality with debounce
const initSearch = () => {
  try {
    const searchInput = document.querySelector('input[placeholder="Tìm bài viết..."]');
    const blogCards = document.querySelectorAll('.scale-hover');
    
    if (!searchInput || !blogCards.length) {
      return;
    }
    
    // Create search button and reset button if not already present
    let buttonContainer = searchInput.parentElement.nextElementSibling;
    
    if (!buttonContainer || !buttonContainer.classList.contains('flex')) {
      // Create search UI elements
      const searchContainer = searchInput.parentElement;
      buttonContainer = document.createElement('div');
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
      searchButton.addEventListener('click', () => performSearch(searchInput, blogCards));
      resetButton.addEventListener('click', () => resetSearch(searchInput, blogCards));
    }
    
    // Add keypress event with debounce
    const debouncedSearch = debounce(() => {
      performSearch(searchInput, blogCards);
    }, 300);
    
    searchInput.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        performSearch(searchInput, blogCards);
      } else if (searchInput.value.length >= 3 || searchInput.value.length === 0) {
        debouncedSearch();
      }
    });
  } catch (error) {
    console.error('Error initializing search:', error);
  }
};

// Perform search on blog cards
const performSearch = (searchInput, blogCards) => {
  try {
    const searchValue = searchInput.value.toLowerCase().trim();
    
    // If search field is empty, show all cards
    if (!searchValue) {
      blogCards.forEach(card => {
        card.style.display = 'block';
        requestAnimationFrame(() => {
          card.style.opacity = '1';
        });
      });
      updatePagination(blogCards.length);
      displayNoResults(false);
      return;
    }
    
    let visibleCount = 0;
    
    // Filter cards based on search input
    blogCards.forEach(card => {
      const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
      const content = card.querySelector('p')?.textContent.toLowerCase() || '';
      const category = card.getAttribute('data-category')?.toLowerCase() || '';
      
      if (title.includes(searchValue) || content.includes(searchValue) || category.includes(searchValue)) {
        card.style.opacity = '0';
        requestAnimationFrame(() => {
          card.style.display = 'block';
          requestAnimationFrame(() => {
            card.style.opacity = '1';
          });
        });
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
    
    // Display no results message if needed
    displayNoResults(visibleCount === 0, searchValue);
  } catch (error) {
    console.error('Error performing search:', error);
  }
};

// Reset search function
const resetSearch = (searchInput, blogCards) => {
  try {
    searchInput.value = '';
    blogCards.forEach(card => {
      card.style.display = 'block';
      requestAnimationFrame(() => {
        card.style.opacity = '1';
      });
    });
    updatePagination(blogCards.length);
    displayNoResults(false);
  } catch (error) {
    console.error('Error resetting search:', error);
  }
};

// Initialize back to top button
const initBackToTopButton = () => {
  try {
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
    
    // Show/hide back to top button based on scroll position with throttle
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
    
    // Add scroll event listener with throttle
    window.addEventListener('scroll', debounce(toggleBackToTopButton, 100));
    
    // Initial check
    toggleBackToTopButton();
  } catch (error) {
    console.error('Error initializing back to top button:', error);
  }
};

// Initialize newsletter subscription
const initNewsletterForm = () => {
  try {
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
  } catch (error) {
    console.error('Error initializing newsletter form:', error);
  }
};

// Validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Show toast notification
const showToast = (message, type = 'success') => {
  try {
    // Remove any existing notifications first
    const existingNotifications = document.querySelectorAll('#toast-notification');
    existingNotifications.forEach(notification => {
      notification.remove();
    });
    
    // Create toast element
    const toast = document.createElement('div');
    toast.id = 'toast-notification';
    
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
      <button class="ml-4 text-white/80 hover:text-white">
        <i class="ri-close-line"></i>
      </button>
    `;
    
    // Add to DOM
    document.body.appendChild(toast);
    
    // Add close button functionality
    const closeButton = toast.querySelector('button');
    closeButton.addEventListener('click', () => {
      toast.classList.add('translate-y-[-100%]', 'opacity-0');
      setTimeout(() => {
        toast.remove();
      }, 300);
    });
    
    // Show toast
    requestAnimationFrame(() => {
      toast.classList.remove('translate-y-[-100%]', 'opacity-0');
    });
    
    // Auto hide after delay
    setTimeout(() => {
      if (toast && document.body.contains(toast)) {
        toast.classList.add('translate-y-[-100%]', 'opacity-0');
        setTimeout(() => {
          if (toast && document.body.contains(toast)) {
            toast.remove();
          }
        }, 300);
      }
    }, 3000);
  } catch (error) {
    console.error('Error showing toast notification:', error);
  }
};

// Initialize hover effects for blog cards
const initCardHoverEffects = () => {
  try {
    const blogCards = document.querySelectorAll('.scale-hover');
    
    if (!blogCards.length) {
      return;
    }
    
    blogCards.forEach(card => {
      // Add hover effect for image zoom
      const image = card.querySelector('img');
      
      if (image) {
        // Use CSS transitions instead of JS for better performance
        image.classList.add('transition-transform', 'duration-500');
        
        card.addEventListener('mouseenter', () => {
          image.style.transform = 'scale(1.05)';
        });
        
        card.addEventListener('mouseleave', () => {
          image.style.transform = '';
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
  } catch (error) {
    console.error('Error initializing card hover effects:', error);
  }
};

// Initialize pagination functionality
const initPagination = () => {
  try {
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
  } catch (error) {
    console.error('Error initializing pagination:', error);
  }
};

// Update pagination based on number of visible items
const updatePagination = (visibleCount) => {
  try {
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
  } catch (error) {
    console.error('Error updating pagination:', error);
  }
};

// Initialize smooth scrolling
const initSmoothScrolling = () => {
  try {
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
  } catch (error) {
    console.error('Error initializing smooth scrolling:', error);
  }
};

// Debounce function to limit how often a function can be called
const debounce = (func, wait = 300) => {
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

/**
 * Assign random categories to blog cards for demo purposes
 * This would be removed in a real application where categories come from the backend
 */
const assignRandomCategoriesToCards = () => {
  try {
    const blogCards = document.querySelectorAll('.scale-hover');
    const categories = ['Học thuật', 'Tài chính', 'Công nghệ', 'Sự kiện', 'Đời sống', 'Nghiên cứu'];
    
    blogCards.forEach(card => {
      const categoryElement = card.querySelector('.absolute.top-3.left-3');
      if (categoryElement && !card.hasAttribute('data-category')) {
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        card.setAttribute('data-category', randomCategory);
      }
    });
  } catch (error) {
    console.error('Error assigning random categories:', error);
  }
}; 
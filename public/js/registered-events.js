/**
 * Registered Events Page JavaScript
 * Banking University Event Management System
 * 
 * This file implements interactive features for the registered events page
 * following functional programming principles.
 */

// Wait for DOM to fully load before initializing
document.addEventListener("DOMContentLoaded", () => {
  // Initialize all components
  initMobileMenu();
  initFilters();
  initPagination();
  initCancelEventModal();
  initCalendarIntegration();
  initAnimations();
  setActiveMenuItems();
});

/**
 * Mobile menu functionality
 * Handles mobile menu opening/closing and related transitions
 */
const initMobileMenu = () => {
  try {
    const menuButton = document.getElementById("mobile-menu-button");
    const mobileMenu = document.getElementById("mobile-menu");
    const closeButton = mobileMenu.querySelector("button[aria-label='Đóng menu']");
    
    if (!menuButton || !mobileMenu || !closeButton) {
      console.error("Mobile menu elements not found");
      return;
    }
    
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
  } catch (error) {
    console.error("Error initializing mobile menu:", error);
  }
};

/**
 * Initialize search and filter functionality
 */
const initFilters = () => {
  try {
    const searchInput = document.getElementById('search-input');
    const statusFilter = document.getElementById('status-filter');
    const typeFilter = document.getElementById('type-filter');
    const eventsContainer = document.querySelector('.space-y-6');
    
    if (!searchInput || !statusFilter || !typeFilter || !eventsContainer) {
      console.error("Filter elements not found");
      return;
    }
    
    // Add event listeners with debounced search
    searchInput.addEventListener('input', debounce(handleFilterChange, 500));
    statusFilter.addEventListener('change', handleFilterChange);
    typeFilter.addEventListener('change', handleFilterChange);
    
    /**
     * Handle changes to any filter
     */
    function handleFilterChange() {
      // Get filter values
      const searchTerm = searchInput.value.toLowerCase().trim();
      const statusValue = statusFilter.value;
      const typeValue = typeFilter.value;
      
      // Show loading state
      eventsContainer.classList.add('opacity-50');
      
      // In a real app, we would fetch filtered data from the server
      // For demo, we'll simulate filtering with existing events
      setTimeout(() => {
        filterEvents(searchTerm, statusValue, typeValue);
        eventsContainer.classList.remove('opacity-50');
        
        // Reset pagination to first page
        resetPaginationToFirstPage();
        
        // Show notification about filter application
        if (searchTerm || statusValue !== 'all' || typeValue !== 'all') {
          let filterMessage = 'Đã lọc sự kiện';
          if (searchTerm) filterMessage += ` với từ khóa "${searchTerm}"`;
          showNotification(filterMessage, 'blue');
        }
      }, 500);
    }
    
    /**
     * Filter events based on search term and filter selections
     * @param {string} searchTerm - The search term
     * @param {string} statusValue - The selected status filter value
     * @param {string} typeValue - The selected type filter value
     */
    function filterEvents(searchTerm, statusValue, typeValue) {
      // Get all event items
      const eventItems = document.querySelectorAll('.border.border-gray-200');
      
      // Track if any items match the filters
      let hasMatches = false;
      
      eventItems.forEach(item => {
        // Get event details for filtering
        const title = item.querySelector('h3') ? 
                      item.querySelector('h3').textContent : 
                      item.querySelector('.text-base.font-bold').textContent;
        const description = item.querySelector('p.text-gray-600.mb-4').textContent;
        
        // Get event type from badge
        const typeBadge = item.querySelector('.text-xs.font-medium.text-primary');
        const type = typeBadge ? typeBadge.textContent.toLowerCase() : '';
        
        // Get event status from badge
        const statusBadge = item.querySelector('.text-xs.font-medium:not(.text-primary)');
        const status = statusBadge ? statusBadge.textContent.toLowerCase() : '';
        
        // Check if event matches all active filters
        const matchesSearch = searchTerm === '' || 
                             title.toLowerCase().includes(searchTerm) || 
                             description.toLowerCase().includes(searchTerm);
                             
        const matchesStatus = statusValue === 'all' || 
                            (statusValue === 'confirmed' && status.includes('xác nhận')) ||
                            (statusValue === 'pending' && status.includes('chờ')) ||
                            (statusValue === 'cancelled' && status.includes('hủy'));
                            
        const matchesType = typeValue === 'all' || 
                          (typeValue === 'workshop' && type.includes('workshop')) ||
                          (typeValue === 'conference' && type.includes('hội nghị')) ||
                          (typeValue === 'job-fair' && type.includes('tuyển dụng')) ||
                          (typeValue === 'training' && type.includes('đào tạo')) ||
                          (typeValue === 'cultural' && type.includes('văn hóa'));
        
        // Show/hide event based on filter matches
        if (matchesSearch && matchesStatus && matchesType) {
          item.style.display = 'block';
          hasMatches = true;
        } else {
          item.style.display = 'none';
        }
      });
      
      // Show "no results" message if needed
      const noResultsMsg = document.getElementById('no-results-message');
      
      if (!hasMatches) {
        if (!noResultsMsg) {
          showNoResultsMessage(searchTerm);
        } else {
          noResultsMsg.style.display = 'block';
          updateNoResultsMessage(noResultsMsg, searchTerm);
        }
      } else if (noResultsMsg) {
        noResultsMsg.style.display = 'none';
      }
    }
    
    /**
     * Create and show no results message
     * @param {string} searchTerm - The search term used
     */
    function showNoResultsMessage(searchTerm) {
      const noResultsMessage = document.createElement('div');
      noResultsMessage.id = 'no-results-message';
      noResultsMessage.className = 'py-10 text-center bg-gray-50 rounded-lg shadow-sm my-8';
      
      // Include search term in the message if provided
      const searchTermDisplay = searchTerm ? 
        `<p class="text-gray-600 mb-3">Không tìm thấy kết quả cho: <span class="font-medium">"${searchTerm}"</span></p>` :
        '';
      
      noResultsMessage.innerHTML = `
        <div class="text-4xl text-gray-300 mb-3"><i class="ri-search-line"></i></div>
        <h3 class="text-xl font-semibold text-gray-700 mb-2">Không tìm thấy sự kiện</h3>
        ${searchTermDisplay}
        <p class="text-gray-600">Vui lòng thử từ khóa khác hoặc điều chỉnh bộ lọc.</p>
      `;
      
      eventsContainer.appendChild(noResultsMessage);
    }
    
    /**
     * Update existing no results message
     * @param {HTMLElement} element - The no results message element
     * @param {string} searchTerm - The search term
     */
    function updateNoResultsMessage(element, searchTerm) {
      const searchTermParagraph = element.querySelector('p.text-gray-600.mb-3');
      if (searchTerm && searchTermParagraph) {
        searchTermParagraph.innerHTML = `Không tìm thấy kết quả cho: <span class="font-medium">"${searchTerm}"</span>`;
      }
    }
    
    /**
     * Reset all filters to default values
     */
    window.resetFilters = function() {
      searchInput.value = '';
      statusFilter.value = 'all';
      typeFilter.value = 'all';
      handleFilterChange();
    };
  } catch (error) {
    console.error("Error initializing filters:", error);
  }
};

/**
 * Initialize pagination functionality
 */
const initPagination = () => {
  try {
    const paginationLinks = document.querySelectorAll('nav[aria-label="Pagination"] a');
    
    if (!paginationLinks.length) {
      console.error("Pagination elements not found");
      return;
    }
    
    // Add click event listeners to each pagination link
    paginationLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Get the page number from the link text
        const pageNumber = this.textContent.trim();
        
        // Skip if it's a previous/next arrow
        if (pageNumber === '' || isNaN(parseInt(pageNumber))) {
          // Handle previous and next buttons
          const currentActivePage = document.querySelector('nav[aria-label="Pagination"] a[aria-current="page"]');
          if (!currentActivePage) return;
          
          const currentPageNum = parseInt(currentActivePage.textContent.trim());
          
          if (this.querySelector('.ri-arrow-left-s-line') && currentPageNum > 1) {
            // Previous page
            simulatePageChange(currentPageNum - 1);
          } else if (this.querySelector('.ri-arrow-right-s-line')) {
            // Next page 
            simulatePageChange(currentPageNum + 1);
          }
          return;
        }
        
        // Simulate page change
        simulatePageChange(parseInt(pageNumber));
      });
    });
  } catch (error) {
    console.error("Error initializing pagination:", error);
  }
};

/**
 * Simulates changing to a different page
 * @param {number} pageNumber - The page number to change to
 */
const simulatePageChange = (pageNumber) => {
  try {
    // Update pagination UI
    document.querySelectorAll('nav[aria-label="Pagination"] a').forEach(link => {
      const linkText = link.textContent.trim();
      
      // Skip previous/next buttons
      if (linkText === '' || isNaN(parseInt(linkText))) {
        return;
      }
      
      if (linkText === pageNumber.toString()) {
        // Add active state to current page
        link.classList.remove('bg-white', 'text-gray-700');
        link.classList.add('bg-primary', 'text-white');
        link.setAttribute('aria-current', 'page');
      } else {
        // Remove active state from other pages
        link.classList.remove('bg-primary', 'text-white');
        link.classList.add('bg-white', 'text-gray-700');
        link.removeAttribute('aria-current');
      }
    });
    
    // Show loading state
    const eventsContainer = document.querySelector('.space-y-6');
    if (!eventsContainer) return;
    
    eventsContainer.classList.add('opacity-50');
    
    // Simulate loading delay
    setTimeout(() => {
      // In a real app, you would fetch data for the selected page from the server
      eventsContainer.classList.remove('opacity-50');
      
      // Show notification
      showNotification(`Đã chuyển đến trang ${pageNumber}`, 'blue');
      
      // Scroll to top of events section
      const eventsSection = document.querySelector('.py-8.md\\:py-12');
      if (eventsSection) {
        window.scrollTo({
          top: eventsSection.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    }, 500);
  } catch (error) {
    console.error("Error changing page:", error);
  }
};

/**
 * Reset pagination to first page
 */
const resetPaginationToFirstPage = () => {
  try {
    document.querySelectorAll('nav[aria-label="Pagination"] a').forEach(link => {
      const linkText = link.textContent.trim();
      
      // Skip previous/next buttons
      if (linkText === '' || isNaN(parseInt(linkText))) {
        return;
      }
      
      if (linkText === '1') {
        link.classList.remove('bg-white', 'text-gray-700');
        link.classList.add('bg-primary', 'text-white');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('bg-primary', 'text-white');
        link.classList.add('bg-white', 'text-gray-700');
        link.removeAttribute('aria-current');
      }
    });
  } catch (error) {
    console.error("Error resetting pagination:", error);
  }
};

/**
 * Initialize the cancel event modal
 */
const initCancelEventModal = () => {
  try {
    const cancelModal = document.getElementById('cancelModal');
    const cancelButtons = document.querySelectorAll('button:has(.ri-close-circle-line)');
    const cancelYes = document.getElementById('cancelYes');
    const cancelNo = document.getElementById('cancelNo');
    const cancelEventName = document.getElementById('cancelEventName');
    
    if (!cancelModal || !cancelYes || !cancelNo || !cancelEventName) {
      console.error("Cancel modal elements not found");
      return;
    }
    
    let currentEventItem = null;
    
    // Open modal
    cancelButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        // Get event name from closest event item
        const eventItem = this.closest('.border.border-gray-200');
        currentEventItem = eventItem;
        
        const eventName = eventItem.querySelector('h3') ? 
                         eventItem.querySelector('h3').textContent : 
                         eventItem.querySelector('.text-base.font-bold').textContent;
        
        cancelEventName.textContent = `Bạn có chắc chắn muốn hủy đăng ký tham gia "${eventName}"?`;
        
        // Show modal with animation
        cancelModal.style.display = 'flex';
        setTimeout(() => {
          cancelModal.classList.remove('opacity-0', 'invisible');
          cancelModal.querySelector('.modal-content').classList.remove('translate-y-8');
        }, 10);
        
        document.body.style.overflow = 'hidden';
      });
    });
    
    // Close modal function
    const closeModal = () => {
      cancelModal.classList.add('opacity-0', 'invisible');
      cancelModal.querySelector('.modal-content').classList.add('translate-y-8');
      
      // Remove display:flex after animation completes
      setTimeout(() => {
        cancelModal.style.display = '';
        document.body.style.overflow = '';
      }, 300);
    };
    
    // Handle "No" button click
    cancelNo.addEventListener('click', closeModal);
    
    // Handle "Yes" button click
    cancelYes.addEventListener('click', function() {
      // Here you would typically send an AJAX request to cancel the registration
      const eventId = currentEventItem?.querySelector('.ml-6.text-gray-800:last-child')?.textContent || '';
      
      // Show processing state
      cancelYes.disabled = true;
      cancelYes.innerHTML = '<i class="ri-loader-2-line animate-spin mr-1"></i> Đang xử lý...';
      
      // Simulate API call
      setTimeout(() => {
        closeModal();
        
        // Show success notification
        showNotification('Đã hủy đăng ký thành công', 'green');
        
        // For demo purposes, update the UI
        if (currentEventItem) {
          // In a real app you would either remove the item or update its status
          const statusBadge = currentEventItem.querySelector('.text-xs.font-medium:not(.text-primary)');
          if (statusBadge) {
            statusBadge.className = 'text-xs font-medium bg-red-100 text-red-700 px-2 py-1 rounded-full';
            statusBadge.textContent = 'Đã hủy';
          }
          
          // Update action buttons
          const actionButtons = currentEventItem.querySelector('.flex.flex-wrap.items-center.gap-3');
          if (actionButtons) {
            // Remove cancel button
            const cancelButton = actionButtons.querySelector('button:has(.ri-close-circle-line)');
            if (cancelButton) {
              cancelButton.remove();
            }
          }
          
          // Add faded appearance
          currentEventItem.classList.add('opacity-75');
        }
        
        // Reset button state
        cancelYes.disabled = false;
        cancelYes.innerHTML = 'Có, hủy đăng ký';
      }, 1000);
    });
    
    // Close when clicking outside of modal content
    cancelModal.addEventListener('click', function(e) {
      if (e.target === cancelModal) {
        closeModal();
      }
    });
    
    // Close on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && !cancelModal.classList.contains('opacity-0')) {
        closeModal();
      }
    });
  } catch (error) {
    console.error("Error initializing cancel modal:", error);
  }
};

/**
 * Initialize calendar integration functionality
 */
const initCalendarIntegration = () => {
  try {
    const calendarButtons = document.querySelectorAll('a:has(.ri-calendar-todo-line)');
    
    calendarButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Get event details from closest event item
        const eventItem = this.closest('.border.border-gray-200');
        const eventName = eventItem.querySelector('h3') ? 
                        eventItem.querySelector('h3').textContent : 
                        eventItem.querySelector('.text-base.font-bold').textContent;
        
        // Get event date and time
        const dateTimeElement = eventItem.querySelector('.ml-6.text-gray-800');
        const dateTimeText = dateTimeElement?.textContent || '';
        
        // Get location information
        const locationElement = eventItem.querySelectorAll('.ml-6.text-gray-800')[1];
        const locationText = locationElement?.textContent || '';
        
        // Get description
        const descriptionElement = eventItem.querySelector('p.text-gray-600.mb-4');
        const descriptionText = descriptionElement?.textContent || '';
        
        // In a real app, parse date properly and format for Google Calendar
        // For demo, we'll use hardcoded dates
        const today = new Date();
        // Add a random number of days (1-30) to today
        const eventDate = new Date(today);
        eventDate.setDate(today.getDate() + Math.floor(Math.random() * 30) + 1);
        
        // Format dates for Google Calendar (YYYYMMDDTHHMMSSZ format)
        const startDate = formatDateForGoogleCalendar(eventDate);
        eventDate.setHours(eventDate.getHours() + 3); // Event duration: 3 hours
        const endDate = formatDateForGoogleCalendar(eventDate);
        
        // Create a Google Calendar URL
        const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventName)}&details=${encodeURIComponent(descriptionText)}&location=${encodeURIComponent(locationText)}&dates=${startDate}/${endDate}`;
        
        // Open Google Calendar in a new tab
        window.open(googleCalendarUrl, '_blank');
        
        // Show notification
        showNotification('Đã mở liên kết thêm vào lịch Google', 'blue');
      });
    });
  } catch (error) {
    console.error("Error initializing calendar integration:", error);
  }
};

/**
 * Format a date for Google Calendar URL
 * @param {Date} date - The date to format
 * @returns {string} Formatted date string (YYYYMMDDTHHMMSSZ)
 */
const formatDateForGoogleCalendar = (date) => {
  return date.toISOString().replace(/-|:|\.\d+/g, '');
};

/**
 * Initialize animations for UI elements
 */
const initAnimations = () => {
  try {
    // Initialize AOS library if it exists
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 800,
        once: false,
        mirror: true,
        offset: 50
      });
    }
    
    // Add hover effects to event cards
    const eventCards = document.querySelectorAll('.border.border-gray-200');
    eventCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.classList.add('shadow-md');
      });
      
      card.addEventListener('mouseleave', () => {
        card.classList.remove('shadow-md');
      });
    });
  } catch (error) {
    console.error("Error initializing animations:", error);
  }
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
    // Skip if link doesn't have href attribute
    if (!link.hasAttribute('href')) return;
    
    // Check if link matches current page
    const linkHref = link.getAttribute('href');
    const isActive = linkHref === currentPage || 
                   (currentPage === 'registered-events.html' && linkHref === './registered-events.html');
    
    if (isActive) {
      if (isMobile) {
        link.classList.add('text-white', 'border-l-4', 'border-white', 'pl-2');
        link.classList.remove('text-white/80');
      } else {
        link.classList.add('text-white', 'border-b-2', 'border-white');
        link.classList.remove('text-white/80');
      }
      link.setAttribute('aria-current', 'page');
    } else {
      if (isMobile) {
        link.classList.remove('text-white', 'border-l-4', 'border-white', 'pl-2');
        link.classList.add('text-white/80');
      } else {
        link.classList.remove('text-white', 'border-b-2', 'border-white');
        link.classList.add('text-white/80');
      }
      link.removeAttribute('aria-current');
    }
  });
};

/**
 * Shows a notification message
 * @param {string} message - The message to display
 * @param {string} color - The color theme (green, blue, red, yellow)
 */
const showNotification = (message, color = 'green') => {
  try {
    // Remove any existing notifications first
    const existingNotifications = document.querySelectorAll('.notification-toast');
    existingNotifications.forEach(notification => {
      notification.remove();
    });
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification-toast fixed top-4 right-4 bg-${color}-100 text-${color}-800 rounded-lg px-4 py-3 shadow-lg z-50 transform transition-all duration-300 ease-in-out translate-y-0 opacity-0`;
    notification.innerHTML = `
      <div class="flex items-center">
        <i class="ri-information-line mr-2 text-${color}-600"></i>
        <span>${message}</span>
        <button class="ml-4 text-${color}-600 hover:text-${color}-800 transition-colors">
          <i class="ri-close-line"></i>
        </button>
      </div>
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Add close button functionality
    const closeButton = notification.querySelector('button');
    closeButton.addEventListener('click', () => {
      fadeOutNotification(notification);
    });
    
    // Animate in
    setTimeout(() => {
      notification.classList.remove('opacity-0');
    }, 10);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      fadeOutNotification(notification);
    }, 5000);
  } catch (error) {
    console.error("Error showing notification:", error);
  }
};

/**
 * Fades out and removes a notification
 * @param {HTMLElement} notification - The notification element
 */
const fadeOutNotification = (notification) => {
  notification.classList.add('opacity-0', 'translate-y-2');
  setTimeout(() => {
    notification.remove();
  }, 300);
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
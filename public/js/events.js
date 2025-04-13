/**
 * Events page JavaScript
 * Implements filtering, sorting, search and pagination for Banking University Event Management System
 */

// Wait for DOM to fully load before initializing
document.addEventListener("DOMContentLoaded", () => {
  // Initialize all components and functionality
  initMobileMenu();
  initializeEventFilters();
  initializeSearchFunctionality();
  initializeEventCardEffects();
  initializePagination();
});

/**
 * Mobile menu functionality
 * Handles mobile menu opening/closing with smooth animations
 */
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
  
  // Animate menu items with staggered entrance
  const menuItems = mobileMenu.querySelectorAll('nav ul li a');
  menuItems.forEach((item, index) => {
    item.style.setProperty('--index', index);
    item.classList.add('animate-fade-in-up-delayed');
  });
};

/**
 * Get all DOM elements needed for event filtering and manipulation
 * @returns {Object} Object containing references to all needed DOM elements
 */
const getEventFilterElements = () => {
  return {
    // Filter inputs
    categoryFilter: document.getElementById('category-filter'),
    timeFilter: document.getElementById('time-filter'),
    locationFilter: document.getElementById('location-filter'),
    allEventCards: document.querySelectorAll('.event-card'),
    eventGridContainer: document.querySelector('.grid.grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-3'),
    sortOption: document.getElementById('sort-option'),
    
    // Filter status elements
    filterStatus: document.getElementById('filter-status'),
    categoryTag: document.getElementById('category-tag'),
    timeTag: document.getElementById('time-tag'),
    locationTag: document.getElementById('location-tag'),
    clearAllFilters: document.getElementById('clear-all-filters'),
    
    // No results element
    noResultsElement: document.querySelector('.col-span-full.py-8.text-center') || createNoResultsElement()
  };
};

/**
 * Create "No Results" message element to show when filters return no matches
 * @returns {HTMLElement} The created element
 */
const createNoResultsElement = () => {
  const element = document.createElement('div');
  element.classList.add('col-span-full', 'py-8', 'text-center', 'hidden');
  element.innerHTML = `
    <div class="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg border border-gray-200">
      <i class="ri-search-line text-4xl text-gray-400 mb-3"></i>
      <h3 class="text-lg font-bold text-gray-700 mb-2">Không tìm thấy sự kiện</h3>
      <p class="text-gray-500">Không có sự kiện nào phù hợp với điều kiện lọc của bạn.</p>
      <button id="reset-filters" class="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
        Xóa bộ lọc
      </button>
    </div>
  `;
  
  // Add the No Results element to the container
  const eventGridContainer = document.querySelector('.grid.grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-3');
  if (eventGridContainer) {
    eventGridContainer.appendChild(element);
  }
  
  return element;
};

/**
 * Initialize event filtering functionality
 */
const initializeEventFilters = () => {
  // Cache DOM elements
  const elements = getEventFilterElements();
  if (!elements.categoryFilter || !elements.timeFilter || !elements.locationFilter) return;
  
  // Create mapping objects for display names
  const mappings = {
    // Category name mapping for display
    categoryNames: {
      "academic": "Học thuật",
      "cultural": "Văn hóa",
      "sports": "Thể thao",
      "career": "Việc làm",
      "volunteer": "Tình nguyện",
      "music": "Âm nhạc",
      "contest": "Cuộc thi",
      "startup": "Khởi nghiệp"
    },
    
    // Location name mapping for display
    locationNames: {
      "hall": "Hội trường",
      "library": "Thư viện",
      "stadium": "Sân vận động",
      "campus": "Khuôn viên"
    },
    
    // Time period mapping for display
    timeNames: {
      "today": "Hôm nay",
      "tomorrow": "Ngày mai",
      "week": "Tuần này",
      "month": "Tháng này"
    }
  };
  
  // Event filter operations
  const filterOperations = {
    // Reset all filters
    resetAllFilters: () => {
      elements.categoryFilter.value = '';
      elements.timeFilter.value = '';
      elements.locationFilter.value = '';
      applyFilters(elements, mappings);
    },
    
    // Reset a specific filter
    resetFilter: (filterType) => {
      if (filterType === 'category') {
        elements.categoryFilter.value = '';
      } else if (filterType === 'time') {
        elements.timeFilter.value = '';
      } else if (filterType === 'location') {
        elements.locationFilter.value = '';
      }
      applyFilters(elements, mappings);
    },
    
    // Update the filter status bar
    updateFilterStatusBar: () => {
      const categoryValue = elements.categoryFilter.value;
      const timeValue = elements.timeFilter.value;
      const locationValue = elements.locationFilter.value;
      
      // Update category tag
      if (categoryValue) {
        elements.categoryTag.querySelector('.filter-tag-text').textContent = mappings.categoryNames[categoryValue] || categoryValue;
        elements.categoryTag.classList.remove('hidden');
      } else {
        elements.categoryTag.classList.add('hidden');
      }
      
      // Update time tag
      if (timeValue) {
        elements.timeTag.querySelector('.filter-tag-text').textContent = mappings.timeNames[timeValue] || timeValue;
        elements.timeTag.classList.remove('hidden');
      } else {
        elements.timeTag.classList.add('hidden');
      }
      
      // Update location tag
      if (locationValue) {
        elements.locationTag.querySelector('.filter-tag-text').textContent = mappings.locationNames[locationValue] || locationValue;
        elements.locationTag.classList.remove('hidden');
      } else {
        elements.locationTag.classList.add('hidden');
      }
      
      // Show/hide filter status bar
      if (categoryValue || timeValue || locationValue) {
        elements.filterStatus.classList.remove('hidden');
      } else {
        elements.filterStatus.classList.add('hidden');
      }
    }
  };
  
  // Make filter operations available globally (for other modules)
  window.eventFilters = filterOperations;
  
  // Set up event listeners
  // Event delegation for filter tag removal and reset buttons
  document.addEventListener('click', (e) => {
    // Handle reset filters button
    if (e.target && e.target.id === 'reset-filters') {
      window.eventFilters.resetAllFilters();
    }
    
    // Handle filter tag remove buttons
    if (e.target && e.target.closest('.filter-tag-remove')) {
      const button = e.target.closest('.filter-tag-remove');
      const filterType = button.getAttribute('data-filter');
      window.eventFilters.resetFilter(filterType);
    }
  });
  
  // Add listener to clear all filters button
  if (elements.clearAllFilters) {
    elements.clearAllFilters.addEventListener('click', window.eventFilters.resetAllFilters);
  }
  
  // Add listeners to filter select elements
  if (elements.categoryFilter && elements.timeFilter && elements.locationFilter && elements.sortOption) {
    elements.categoryFilter.addEventListener('change', () => applyFilters(elements, mappings));
    elements.timeFilter.addEventListener('change', () => applyFilters(elements, mappings));
    elements.locationFilter.addEventListener('change', () => applyFilters(elements, mappings));
    elements.sortOption.addEventListener('change', () => sortEventCards(elements));
  }
  
  // Apply filters when page loads (in case of URL parameters)
  applyFilters(elements, mappings);
};

/**
 * Apply all filters to event cards
 * @param {Object} elements DOM elements for filtering
 * @param {Object} mappings Name mappings for display
 */
const applyFilters = (elements, mappings) => {
  // Update filter status bar
  window.eventFilters.updateFilterStatusBar();
  
  const categoryValue = elements.categoryFilter.value;
  const timeValue = elements.timeFilter.value;
  const locationValue = elements.locationFilter.value;
  
  let hasVisibleEvent = false;
  
  // Add animation when filtering
  if (elements.eventGridContainer) {
    elements.eventGridContainer.classList.add('opacity-60');
    setTimeout(() => {
      elements.eventGridContainer.classList.remove('opacity-60');
    }, 300);
  }
  
  // Loop through all event cards
  elements.allEventCards.forEach(card => {
    // Get data attributes
    const cardCategory = card.getAttribute('data-category');
    const cardTime = card.getAttribute('data-time');
    const cardLocation = card.getAttribute('data-location');
    const cardDate = card.getAttribute('data-date');
    
    // Check if card matches all selected filters
    const matchesCategory = categoryValue === '' || cardCategory === categoryValue;
    const matchesLocation = locationValue === '' || cardLocation === locationValue;
    let matchesTime = checkTimeFilter(timeValue, cardDate);
    
    // Show or hide card based on filter matches
    if (matchesCategory && matchesTime && matchesLocation) {
      card.classList.remove('hidden');
      hasVisibleEvent = true;
    } else {
      card.classList.add('hidden');
    }
  });
  
  // Show "No Results" message if no events match
  if (!hasVisibleEvent) {
    elements.noResultsElement.classList.remove('hidden');
  } else {
    elements.noResultsElement.classList.add('hidden');
  }
  
  // Update counter display
  updateEventCounter(elements);
  
  // Sort visible cards
  sortEventCards(elements);
};

/**
 * Check if an event date matches the selected time filter
 * @param {string} timeValue The selected time filter
 * @param {string} cardDate The card date in YYYY-MM-DD format
 * @returns {boolean} Whether the card matches the time filter
 */
const checkTimeFilter = (timeValue, cardDate) => {
  if (timeValue === '') return true;
  
  const eventDate = new Date(cardDate);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);
  
  const nextMonth = new Date();
  nextMonth.setMonth(today.getMonth() + 1);
  
  // Clear time part for accurate date comparison
  today.setHours(0, 0, 0, 0);
  tomorrow.setHours(0, 0, 0, 0);
  
  if (timeValue === 'today') {
    return eventDate.toDateString() === today.toDateString();
  } else if (timeValue === 'tomorrow') {
    return eventDate.toDateString() === tomorrow.toDateString();
  } else if (timeValue === 'week') {
    return eventDate >= today && eventDate <= nextWeek;
  } else if (timeValue === 'month') {
    return eventDate >= today && eventDate <= nextMonth;
  }
  
  return true;
};

/**
 * Update event counter to show visible/total count
 * @param {Object} elements DOM elements including counters
 */
const updateEventCounter = (elements) => {
  const visibleCount = document.querySelectorAll('.event-card:not(.hidden)').length;
  const totalCount = elements.allEventCards.length;
  
  // If there is a counter element, update it
  const counterElement = document.querySelector('.event-counter');
  if (counterElement) {
    if (visibleCount === totalCount) {
      counterElement.textContent = `Hiển thị tất cả ${totalCount} sự kiện`;
    } else {
      counterElement.textContent = `Hiển thị ${visibleCount}/${totalCount} sự kiện`;
    }
  }
};

/**
 * Sort event cards based on the selected sorting option
 * @param {Object} elements DOM elements including sort selector
 */
const sortEventCards = (elements) => {
  // Get selected sort option
  const sortValue = elements.sortOption ? elements.sortOption.value : 'newest';
  
  // Get only visible cards
  const visibleCards = Array.from(document.querySelectorAll('.event-card:not(.hidden)'));
  
  // Sort the cards based on selected option
  visibleCards.sort((a, b) => {
    const dateA = new Date(a.getAttribute('data-date'));
    const dateB = new Date(b.getAttribute('data-date'));
    
    if (sortValue === 'newest') {
      // Sort by date (newest first)
      return dateB - dateA;
    } else if (sortValue === 'upcoming') {
      // Sort by date (upcoming first)
      return dateA - dateB;
    } else if (sortValue === 'popular') {
      // Sort by popularity (participant count)
      const participantsA = parseInt(a.querySelector('[class*="ri-user-line"]').parentNode.nextElementSibling.textContent.match(/\d+/)[0]);
      const participantsB = parseInt(b.querySelector('[class*="ri-user-line"]').parentNode.nextElementSibling.textContent.match(/\d+/)[0]);
      return participantsB - participantsA;
    }
    
    return 0;
  });
  
  // Apply animation classes for sorting effect
  visibleCards.forEach(card => {
    card.classList.add('opacity-0', 'scale-95');
    setTimeout(() => {
      card.classList.remove('opacity-0', 'scale-95');
    }, 50);
  });
  
  // Reorder the cards in the container
  const container = elements.eventGridContainer;
  if (container) {
    visibleCards.forEach(card => {
      container.appendChild(card);
    });
  }
};

/**
 * Initialize search functionality
 */
const initializeSearchFunctionality = () => {
  const searchInput = document.getElementById('search-input');
  const searchButton = document.getElementById('search-button');
  
  if (!searchButton || !searchInput) return;
  
  // Search on button click
  searchButton.addEventListener('click', () => {
    performSearch(searchInput.value);
  });
  
  // Search on Enter key press
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      performSearch(searchInput.value);
    }
  });
  
  // Clear validation styling when typing
  searchInput.addEventListener('input', () => {
    searchInput.classList.remove('ring-2', 'ring-red-500', 'border-red-500');
  });
};

/**
 * Perform search on events based on query text
 * @param {string} query The search query text
 */
const performSearch = (query) => {
  const searchInput = document.getElementById('search-input');
  const elements = getEventFilterElements();
  
  if (!query || query.trim() === '') {
    // Show empty search validation
    searchInput.classList.add('ring-2', 'ring-red-500', 'border-red-500');
    setTimeout(() => {
      searchInput.classList.remove('ring-2', 'ring-red-500', 'border-red-500');
    }, 2000);
    return;
  }
  
  // Reset filters
  window.eventFilters.resetAllFilters();
  
  let hasVisibleEvent = false;
  query = query.toLowerCase();
  
  // Add animation when filtering
  if (elements.eventGridContainer) {
    elements.eventGridContainer.classList.add('opacity-60');
    setTimeout(() => {
      elements.eventGridContainer.classList.remove('opacity-60');
    }, 300);
  }
  
  // Loop through all event cards
  elements.allEventCards.forEach(card => {
    const title = card.querySelector('h3').textContent.toLowerCase();
    const location = card.querySelector('.flex.items-center.text-gray-600.mb-3')?.textContent.toLowerCase() || '';
    const category = card.getAttribute('data-category');
    const categoryText = document.querySelector(`#category-filter option[value="${category}"]`)?.textContent.toLowerCase() || '';
    
    // Check for matches in title, location or category
    const matchesQuery = title.includes(query) || 
                         location.includes(query) || 
                         categoryText.includes(query);
    
    if (matchesQuery) {
      card.classList.remove('hidden');
      hasVisibleEvent = true;
    } else {
      card.classList.add('hidden');
    }
  });
  
  // Show "No Results" message if no events match
  if (!hasVisibleEvent) {
    elements.noResultsElement.classList.remove('hidden');
  } else {
    elements.noResultsElement.classList.add('hidden');
  }
  
  // Update counter display
  updateEventCounter(elements);
};

/**
 * Initialize event card hover effects and animations
 */
const initializeEventCardEffects = () => {
  const eventCards = document.querySelectorAll('.event-card');
  
  eventCards.forEach(card => {
    // Add hover effects
    card.addEventListener('mouseenter', function() {
      this.classList.add('shadow-md');
      
      // Add subtle movement to icons
      const icons = this.querySelectorAll('.ri-calendar-line, .ri-map-pin-line, .ri-user-line');
      icons.forEach(icon => {
        icon.classList.add('animate-pulse-subtle');
      });
    });
    
    card.addEventListener('mouseleave', function() {
      this.classList.remove('shadow-md');
      
      // Remove animation from icons
      const icons = this.querySelectorAll('.ri-calendar-line, .ri-map-pin-line, .ri-user-line');
      icons.forEach(icon => {
        icon.classList.remove('animate-pulse-subtle');
      });
    });
    
    // Add click effect
    card.addEventListener('click', function(e) {
      // Only apply if not clicking on a link or button inside the card
      if (!e.target.closest('a') && !e.target.closest('button')) {
        this.classList.add('scale-98');
        setTimeout(() => {
          this.classList.remove('scale-98');
          
          // Navigate to detail page if clicking the card itself
          const detailLink = this.querySelector('a[href="event-detail.html"]');
          if (detailLink) {
            window.location.href = detailLink.getAttribute('href');
          }
        }, 150);
      }
    });
  });
};

/**
 * Initialize pagination functionality
 */
const initializePagination = () => {
  // Pagination settings
  const eventsPerPage = 9; // Display 9 events per page
  let currentPage = 1;
  const elements = getEventFilterElements();
  const allEventCards = elements.allEventCards;
  const totalEvents = allEventCards.length;
  const totalPages = Math.ceil(totalEvents / eventsPerPage);
  
  // Get pagination elements
  const prevButton = document.getElementById('prev-page');
  const nextButton = document.getElementById('next-page');
  const paginationButtons = document.querySelectorAll('.pagination-button');
  
  // Skip if no pagination elements
  if (!prevButton || !nextButton || paginationButtons.length === 0) return;
  
  // Function to show events for current page
  const showEventsForPage = (page) => {
    // Apply hidden-by-pagination class strategically
    allEventCards.forEach((card, index) => {
      // Skip cards hidden by filtering
      if (card.classList.contains('hidden') && !card.classList.contains('hidden-by-pagination')) {
        return;
      }
      
      const startIndex = (page - 1) * eventsPerPage;
      const endIndex = startIndex + eventsPerPage;
      
      if (index >= startIndex && index < endIndex) {
        card.classList.remove('hidden-by-pagination', 'hidden');
      } else {
        card.classList.add('hidden-by-pagination', 'hidden');
      }
    });
    
    // Update counter display
    updateEventCounter(elements);
    
    // Scroll to top of events section
    const eventsSection = document.querySelector('.lg\\:w-3\\/4');
    if (eventsSection) {
      eventsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  
  // Update pagination UI to reflect current page
  const updatePaginationUI = (page) => {
    // Update buttons active state
    paginationButtons.forEach(button => {
      const buttonPage = parseInt(button.getAttribute('data-page'));
      if (buttonPage === page) {
        button.classList.remove('bg-white', 'text-gray-700', 'border-gray-300');
        button.classList.add('bg-primary', 'text-white', 'border-primary');
        button.setAttribute('aria-current', 'page');
      } else {
        button.classList.remove('bg-primary', 'text-white', 'border-primary');
        button.classList.add('bg-white', 'text-gray-700', 'border-gray-300');
        button.removeAttribute('aria-current');
      }
    });
    
    // Update prev/next buttons
    prevButton.disabled = page === 1;
    nextButton.disabled = page === totalPages;
    
    // Add visual indication for disabled buttons
    if (prevButton.disabled) {
      prevButton.classList.add('opacity-50', 'cursor-not-allowed');
    } else {
      prevButton.classList.remove('opacity-50', 'cursor-not-allowed');
    }
    
    if (nextButton.disabled) {
      nextButton.classList.add('opacity-50', 'cursor-not-allowed');
    } else {
      nextButton.classList.remove('opacity-50', 'cursor-not-allowed');
    }
  };
  
  // Go to a specific page
  const goToPage = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    
    currentPage = page;
    showEventsForPage(currentPage);
    updatePaginationUI(currentPage);
  };
  
  // Add pagination classes for dual-filtering system
  allEventCards.forEach(card => {
    // Mark cards for pagination control
    card.classList.add('pagination-controlled');
  });
  
  // Set up pagination event listeners
  paginationButtons.forEach(button => {
    button.addEventListener('click', () => {
      const page = parseInt(button.getAttribute('data-page'));
      goToPage(page);
    });
  });
  
  prevButton.addEventListener('click', () => {
    if (!prevButton.disabled) {
      goToPage(currentPage - 1);
    }
  });
  
  nextButton.addEventListener('click', () => {
    if (!nextButton.disabled) {
      goToPage(currentPage + 1);
    }
  });
  
  // Initialize first page
  showEventsForPage(1);
  updatePaginationUI(1);
}; 
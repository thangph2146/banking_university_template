/**
 * Events page JavaScript
 * Implements filtering, sorting, search and pagination for Banking University Event Management System
 */

// Wait for DOM to fully load before initializing
document.addEventListener("DOMContentLoaded", () => {
  // Initialize all components and functionality
  initMobileMenu();
  initFilters();
  initSearch();
  initPagination();
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
  });
  
  // Close menu
  closeButton.addEventListener("click", () => {
    mobileMenu.classList.add("translate-x-full");
    document.body.classList.remove("overflow-hidden"); 
    menuButton.setAttribute("aria-expanded", "false");
  });
};

/**
 * Get all DOM elements needed for event filtering and manipulation
 */
const getEventFilterElements = () => {
  return {
    categoryFilter: document.getElementById('category-filter'),
    timeFilter: document.getElementById('time-filter'),
    locationFilter: document.getElementById('location-filter'),
    allEventCards: document.querySelectorAll('.event-card'),
    eventGridContainer: document.querySelector('.grid.grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-3'),
    sortOption: document.getElementById('sort-option'),
    filterStatus: document.getElementById('filter-status'),
    categoryTag: document.getElementById('category-tag'),
    timeTag: document.getElementById('time-tag'),
    locationTag: document.getElementById('location-tag'),
    clearAllFilters: document.getElementById('clear-all-filters'),
    noResultsElement: document.querySelector('.col-span-full.py-8.text-center') || createNoResultsElement()
  };
};

/**
 * Create "No Results" message element
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
  
  const eventGridContainer = document.querySelector('.grid.grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-3');
  if (eventGridContainer) {
    eventGridContainer.appendChild(element);
  }
  
  return element;
};

/**
 * Initialize event filtering functionality
 */
const initFilters = () => {
  const elements = getEventFilterElements();
  if (!elements.categoryFilter || !elements.timeFilter || !elements.locationFilter) return;

  // Create mapping objects for display names
  const mappings = {
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
    locationNames: {
      "hall": "Hội trường",
      "library": "Thư viện",
      "stadium": "Sân vận động", 
      "campus": "Khuôn viên"
    },
    timeNames: {
      "today": "Hôm nay",
      "tomorrow": "Ngày mai",
      "week": "Tuần này",
      "month": "Tháng này"
    }
  };

  // Event filter operations
  const filterOperations = {
    resetAllFilters: () => {
      elements.categoryFilter.value = '';
      elements.timeFilter.value = '';
      elements.locationFilter.value = '';
      applyFilters(elements, mappings);
    },
    
    resetFilter: (filterType) => {
      if (filterType === 'category') elements.categoryFilter.value = '';
      if (filterType === 'time') elements.timeFilter.value = '';
      if (filterType === 'location') elements.locationFilter.value = '';
      applyFilters(elements, mappings);
    },
    
    updateFilterStatusBar: () => {
      const categoryValue = elements.categoryFilter.value;
      const timeValue = elements.timeFilter.value;
      const locationValue = elements.locationFilter.value;
      
      // Update category tag
      if (categoryValue) {
        elements.categoryTag.querySelector('.filter-tag-text').textContent = mappings.categoryNames[categoryValue];
        elements.categoryTag.classList.remove('hidden');
      } else {
        elements.categoryTag.classList.add('hidden');
      }
      
      // Update time tag  
      if (timeValue) {
        elements.timeTag.querySelector('.filter-tag-text').textContent = mappings.timeNames[timeValue];
        elements.timeTag.classList.remove('hidden');
      } else {
        elements.timeTag.classList.add('hidden');
      }
      
      // Update location tag
      if (locationValue) {
        elements.locationTag.querySelector('.filter-tag-text').textContent = mappings.locationNames[locationValue];
        elements.locationTag.classList.remove('hidden');
      } else {
        elements.locationTag.classList.add('hidden');
      }
      
      // Show/hide filter status bar
      elements.filterStatus.classList.toggle('hidden', !(categoryValue || timeValue || locationValue));
    }
  };

  // Make filter operations available globally
  window.eventFilters = filterOperations;

  // Set up event listeners
  document.addEventListener('click', (e) => {
    if (e.target.id === 'reset-filters') {
      filterOperations.resetAllFilters();
    }
    
    if (e.target.closest('.filter-tag-remove')) {
      const button = e.target.closest('.filter-tag-remove');
      filterOperations.resetFilter(button.getAttribute('data-filter'));
    }
  });

  if (elements.clearAllFilters) {
    elements.clearAllFilters.addEventListener('click', filterOperations.resetAllFilters);
  }

  // Add filter change listeners
  [elements.categoryFilter, elements.timeFilter, elements.locationFilter].forEach(filter => {
    if (filter) {
      filter.addEventListener('change', () => applyFilters(elements, mappings));
    }
  });

  // Initial filter application
  applyFilters(elements, mappings);
};

/**
 * Apply filters to event cards
 */
const applyFilters = (elements, mappings) => {
  window.eventFilters.updateFilterStatusBar();
  
  const categoryValue = elements.categoryFilter.value;
  const timeValue = elements.timeFilter.value;
  const locationValue = elements.locationFilter.value;
  
  let hasVisibleEvent = false;
  
  // Add animation
  if (elements.eventGridContainer) {
    elements.eventGridContainer.classList.add('opacity-60');
    setTimeout(() => elements.eventGridContainer.classList.remove('opacity-60'), 300);
  }

  // Filter cards
  elements.allEventCards.forEach(card => {
    const cardCategory = card.getAttribute('data-category');
    const cardLocation = card.getAttribute('data-location');
    const cardDate = card.getAttribute('data-date');
    
    const matchesCategory = !categoryValue || cardCategory === categoryValue;
    const matchesLocation = !locationValue || cardLocation === locationValue;
    const matchesTime = !timeValue || checkTimeFilter(timeValue, cardDate);
    
    const isVisible = matchesCategory && matchesLocation && matchesTime;
    card.classList.toggle('hidden', !isVisible);
    hasVisibleEvent = hasVisibleEvent || isVisible;
  });

  // Show/hide no results message
  elements.noResultsElement.classList.toggle('hidden', hasVisibleEvent);
  
  // Update counter and sort
  updateEventCounter(elements);
  if (elements.sortOption) sortEventCards(elements);
};

/**
 * Check if event date matches time filter
 */
const checkTimeFilter = (timeValue, cardDate) => {
  if (!timeValue || !cardDate) return true;
  
  const eventDate = new Date(cardDate);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);
  
  const nextMonth = new Date(today);
  nextMonth.setMonth(today.getMonth() + 1);
  
  // Reset hours for accurate date comparison
  [today, tomorrow, nextWeek, nextMonth, eventDate].forEach(date => {
    date.setHours(0, 0, 0, 0);
  });
  
  switch(timeValue) {
    case 'today': 
      return eventDate.getTime() === today.getTime();
    case 'tomorrow':
      return eventDate.getTime() === tomorrow.getTime();
    case 'week':
      return eventDate >= today && eventDate <= nextWeek;
    case 'month':
      return eventDate >= today && eventDate <= nextMonth;
    default:
      return true;
  }
};

/**
 * Update event counter display
 */
const updateEventCounter = (elements) => {
  const visibleCount = document.querySelectorAll('.event-card:not(.hidden)').length;
  const totalCount = elements.allEventCards.length;
  
  const counterElement = document.querySelector('.event-counter');
  if (counterElement) {
    counterElement.textContent = visibleCount === totalCount 
      ? `Hiển thị tất cả ${totalCount} sự kiện`
      : `Hiển thị ${visibleCount}/${totalCount} sự kiện`;
  }
};

/**
 * Sort event cards
 */
const sortEventCards = (elements) => {
  const sortValue = elements.sortOption.value;
  const visibleCards = Array.from(document.querySelectorAll('.event-card:not(.hidden)'));
  
  visibleCards.sort((a, b) => {
    const dateA = new Date(a.getAttribute('data-date'));
    const dateB = new Date(b.getAttribute('data-date'));
    
    switch(sortValue) {
      case 'newest':
        return dateB - dateA;
      case 'upcoming':
        return dateA - dateB;
      case 'popular':
        const participantsA = parseInt(a.querySelector('[class*="ri-user-line"]').parentNode.nextElementSibling.textContent.match(/\d+/)[0]);
        const participantsB = parseInt(b.querySelector('[class*="ri-user-line"]').parentNode.nextElementSibling.textContent.match(/\d+/)[0]);
        return participantsB - participantsA;
      default:
        return 0;
    }
  });

  // Animate cards
  visibleCards.forEach(card => {
    card.classList.add('opacity-0', 'scale-95');
    setTimeout(() => card.classList.remove('opacity-0', 'scale-95'), 50);
  });

  // Reorder cards
  if (elements.eventGridContainer) {
    visibleCards.forEach(card => elements.eventGridContainer.appendChild(card));
  }
};

/**
 * Initialize search functionality
 */
const initSearch = () => {
  const searchInput = document.getElementById('search-input');
  const searchButton = document.getElementById('search-button');
  
  if (!searchButton || !searchInput) return;
  
  const performSearch = () => {
    const query = searchInput.value.trim().toLowerCase();
    
    if (!query) {
      searchInput.classList.add('ring-2', 'ring-red-500', 'border-red-500');
      setTimeout(() => {
        searchInput.classList.remove('ring-2', 'ring-red-500', 'border-red-500');
      }, 2000);
      return;
    }

    // Reset filters
    window.eventFilters.resetAllFilters();
    
    const elements = getEventFilterElements();
    let hasVisibleEvent = false;

    elements.allEventCards.forEach(card => {
      const title = card.querySelector('h3').textContent.toLowerCase();
      const location = card.querySelector('.flex.items-center.text-gray-600.mb-3')?.textContent.toLowerCase() || '';
      const category = card.getAttribute('data-category');
      const categoryText = document.querySelector(`#category-filter option[value="${category}"]`)?.textContent.toLowerCase() || '';
      
      const matchesQuery = [title, location, categoryText].some(text => text.includes(query));
      card.classList.toggle('hidden', !matchesQuery);
      hasVisibleEvent = hasVisibleEvent || matchesQuery;
    });

    elements.noResultsElement.classList.toggle('hidden', hasVisibleEvent);
    updateEventCounter(elements);
  };

  searchButton.addEventListener('click', performSearch);
  searchInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') performSearch();
  });
};

/**
 * Initialize pagination
 */
const initPagination = () => {
  const paginationLinks = document.querySelectorAll('.pagination a[data-page]');
  const prevButton = document.querySelector('.pagination a[aria-label="Previous page"]');
  const nextButton = document.querySelector('.pagination a[aria-label="Next page"]');
  const eventCards = document.querySelectorAll('.event-card');
  
  if (!paginationLinks.length || !eventCards.length) return;
  
  const ITEMS_PER_PAGE = 9; // Số sự kiện mỗi trang
  let currentPage = 1;
  const totalPages = Math.ceil(eventCards.length / ITEMS_PER_PAGE);
  
  const showPage = (pageNum) => {
    const start = (pageNum - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    
    // Chỉ ẩn/hiện các card không bị ẩn bởi bộ lọc
    const visibleCards = Array.from(eventCards).filter(card => 
      !card.classList.contains('hidden') || card.classList.contains('hidden-by-pagination')
    );
    
    visibleCards.forEach((card, index) => {
      const shouldShow = index >= start && index < end;
      card.classList.toggle('hidden-by-pagination', !shouldShow);
      card.classList.toggle('hidden', !shouldShow);
    });

    // Cập nhật số lượng sự kiện hiển thị
    updateEventCounter({
      allEventCards: eventCards
    });
    
    // Cuộn lên đầu danh sách sự kiện
    const eventsSection = document.querySelector('.lg\\:w-3\\/4');
    if (eventsSection) {
      eventsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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
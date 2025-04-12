/**
 * Event Detail Page JavaScript
 * Banking University Event Management System
 * 
 * This file implements interactive features for the event detail page
 * using a functional programming approach.
 */

// Wait for DOM to fully load before initializing
document.addEventListener("DOMContentLoaded", () => {
  // Initialize all components
  initTabNavigation();
  initMobileMenu();
  initModals();
  initRegistrationHandlers();
  initShareFunctionality();
  initTimelineAnimations();
  initProgressAnimations();
  initSpeakerAnimations();
  initToastNotifications();
});

/**
 * Initialize tab navigation functionality
 * Handles tab switching and content display
 */
const initTabNavigation = () => {
  try {
    const tabButtons = document.querySelectorAll(".tab-button");
    const tabContents = document.querySelectorAll(".tab-content");
    
    if (!tabButtons.length || !tabContents.length) return;
    
    // Function to show active tab
    const showTab = (tabId) => {
      // Hide all tab contents with transition
      tabContents.forEach(content => {
        if (content.id !== tabId) {
          content.classList.add("opacity-0");
          
          // Use setTimeout to ensure smooth transition
          setTimeout(() => {
            content.classList.add("hidden");
            content.classList.remove("block", "opacity-0");
            content.setAttribute("aria-hidden", "true");
          }, 200);
        }
      });
      
      // Remove active state from all tab buttons
      tabButtons.forEach(btn => {
        btn.classList.remove("text-primary", "border-b-2", "border-primary");
        btn.classList.add("text-gray-500");
        btn.setAttribute("aria-selected", "false");
      });
      
      // Show the selected tab content
      const selectedTab = document.getElementById(tabId);
      if (selectedTab) {
        selectedTab.classList.remove("hidden");
        // Force reflow before adding opacity to ensure transition works
        void selectedTab.offsetWidth;
        selectedTab.classList.add("block");
        selectedTab.setAttribute("aria-hidden", "false");
        
        // Use setTimeout to ensure smooth transition
        setTimeout(() => {
          selectedTab.classList.remove("opacity-0");
          
          // Animate timeline items if schedule tab is selected
          if (tabId === 'schedule-tab') {
            animateTimelineItems();
          }
          
          // Add loading animation to tab content
          const tabContent = selectedTab.querySelector('.tab-content > div');
          if (tabContent) {
            tabContent.classList.add('animate-fade-in');
          }
        }, 10);
      }
      
      // Set active state for the clicked tab button
      const activeButton = document.querySelector(`[data-tab="${tabId}"]`);
      if (activeButton) {
        activeButton.classList.remove("text-gray-500");
        activeButton.classList.add("text-primary", "border-b-2", "border-primary");
        activeButton.setAttribute("aria-selected", "true");
      }
      
      // Update URL hash for direct linking
      history.replaceState(null, null, `#${tabId}`);
    };
    
    // Add click event listeners to tab buttons
    tabButtons.forEach(button => {
      button.addEventListener("click", () => {
        const tabId = button.getAttribute("data-tab");
        showTab(tabId);
      });
    });
    
    // Check for hash in URL and show corresponding tab
    // Otherwise show default tab
    setTimeout(() => {
      const initialTabId = window.location.hash ? 
        window.location.hash.substring(1) : 'info-tab';
      
      // Find the tab and show it if it exists
      const tabElement = document.getElementById(initialTabId);
      if (tabElement && tabElement.classList.contains('tab-content')) {
        showTab(initialTabId);
      } else {
        showTab('info-tab');
      }
    }, 100);
  } catch (error) {
    console.error("Error initializing tab navigation:", error);
  }
};

/**
 * Animate timeline items with staggered delay
 * Used when the schedule tab is selected
 */
const animateTimelineItems = () => {
  try {
    const timelineItems = document.querySelectorAll('.timeline-item');
    if (!timelineItems.length) return;
    
    timelineItems.forEach((item, index) => {
      // Reset classes first (in case of tab switching)
      item.classList.remove('show');
      
      // Add show class with staggered delay
      setTimeout(() => {
        item.classList.add('show');
        
        // Add pulse animation to timeline circle
        const circle = item.querySelector('.rounded-full');
        if (circle) {
          circle.style.animation = 'timelinePulse 0.5s ease';
          // Remove animation after it completes
          setTimeout(() => {
            circle.style.animation = '';
          }, 500);
        }
      }, 100 * index);
    });
  } catch (error) {
    console.error("Error animating timeline items:", error);
  }
};

/**
 * Initialize mobile menu functionality
 */
const initMobileMenu = () => {
  try {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenuCloseButton = document.getElementById('mobile-menu-close');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (!mobileMenuButton || !mobileMenu || !mobileMenuCloseButton) return;
    
    // Function to toggle icon between menu and close
    const toggleMenuIcon = (isOpen) => {
      const icon = mobileMenuButton.querySelector("i");
      if (icon) {
        icon.className = isOpen ? "ri-close-line ri-lg" : "ri-menu-line ri-lg";
      }
    };
    
    // Function to close the mobile menu
    const closeMenu = () => {
      mobileMenu.classList.add("translate-x-full");
      document.body.classList.remove("overflow-hidden");
      mobileMenuButton.setAttribute("aria-expanded", "false");
      toggleMenuIcon(false);
    };
    
    // Open mobile menu
    mobileMenuButton.addEventListener('click', () => {
      mobileMenu.classList.remove('translate-x-full');
      document.body.classList.add('overflow-hidden');
      mobileMenuButton.setAttribute("aria-expanded", "true");
      toggleMenuIcon(true);
    });
    
    // Close mobile menu with button
    mobileMenuCloseButton.addEventListener('click', closeMenu);
    
    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!mobileMenu.contains(e.target) && 
          !mobileMenuButton.contains(e.target) && 
          !mobileMenu.classList.contains("translate-x-full")) {
        closeMenu();
      }
    });
    
    // Close menu on escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !mobileMenu.classList.contains("translate-x-full")) {
        closeMenu();
      }
    });
  } catch (error) {
    console.error("Error initializing mobile menu:", error);
  }
};

/**
 * Initialize modals (success and error)
 */
const initModals = () => {
  try {
    const successModal = document.getElementById('success-modal');
    const errorModal = document.getElementById('error-modal');
    const successModalClose = document.getElementById('success-modal-close');
    const errorModalClose = document.getElementById('error-modal-close');
    const successModalBackdrop = document.getElementById('success-modal-backdrop');
    const errorModalBackdrop = document.getElementById('error-modal-backdrop');
    const successModalContent = document.getElementById('success-modal-content');
    const errorModalContent = document.getElementById('error-modal-content');
    
    if (!successModal && !errorModal) return;
    
    // Make the show functions available globally
    window.showSuccessModal = () => {
      if (!successModal) return;
      
      successModal.classList.remove('hidden');
      document.body.classList.add('overflow-hidden');
      
      // Trigger animations after a small delay
      setTimeout(() => {
        successModal.classList.remove('opacity-0');
        if (successModalContent) {
          successModalContent.classList.remove('scale-95', 'opacity-0');
          successModalContent.classList.add('scale-100', 'opacity-100');
        }
      }, 10);
    };
    
    window.showErrorModal = (message) => {
      if (!errorModal) return;
      
      if (message) {
        const errorMessageElement = document.getElementById('error-message');
        if (errorMessageElement) {
          errorMessageElement.textContent = message;
        }
      }
      
      errorModal.classList.remove('hidden');
      document.body.classList.add('overflow-hidden');
      
      // Trigger animations after a small delay
      setTimeout(() => {
        errorModal.classList.remove('opacity-0');
        if (errorModalContent) {
          errorModalContent.classList.remove('scale-95', 'opacity-0');
          errorModalContent.classList.add('scale-100', 'opacity-100');
        }
      }, 10);
    };
    
    // Function to close modals
    const closeModals = () => {
      // Fade out animations
      if (successModal) successModal.classList.add('opacity-0');
      if (errorModal) errorModal.classList.add('opacity-0');
      
      if (successModalContent) {
        successModalContent.classList.remove('scale-100', 'opacity-100');
        successModalContent.classList.add('scale-95', 'opacity-0');
      }
      
      if (errorModalContent) {
        errorModalContent.classList.remove('scale-100', 'opacity-100');
        errorModalContent.classList.add('scale-95', 'opacity-0');
      }
      
      // Wait for animation to complete before hiding
      setTimeout(() => {
        if (successModal) successModal.classList.add('hidden');
        if (errorModal) errorModal.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
      }, 300);
    };
    
    // Close modal with close button
    if (successModalClose) successModalClose.addEventListener('click', closeModals);
    if (errorModalClose) errorModalClose.addEventListener('click', closeModals);
    
    // Close modal when clicking outside
    if (successModalBackdrop) successModalBackdrop.addEventListener('click', closeModals);
    if (errorModalBackdrop) errorModalBackdrop.addEventListener('click', closeModals);
    
    // Escape key to close modals
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeModals();
      }
    });
  } catch (error) {
    console.error("Error initializing modals:", error);
  }
};

/**
 * Initialize registration handlers for quick register and sidebar register buttons
 */
const initRegistrationHandlers = () => {
  try {
    const quickRegisterBtn = document.getElementById('quick-register-btn');
    const sidebarRegisterBtn = document.getElementById('sidebar-register-btn');
    
    if (!quickRegisterBtn && !sidebarRegisterBtn) return;
    
    // Function to handle registration
    const handleRegistration = () => {
      // Simulate registration with a random success/failure
      // In a real app, this would be an API call
      const isSuccess = Math.random() > 0.2; // 80% success rate for demo
      
      if (isSuccess) {
        window.showSuccessModal();
      } else {
        window.showErrorModal('Hệ thống đang bảo trì hoặc sự kiện đã hết chỗ.');
      }
    };
    
    // Add click handlers to register buttons
    if (quickRegisterBtn) {
      quickRegisterBtn.addEventListener('click', handleRegistration);
    }
    
    if (sidebarRegisterBtn) {
      sidebarRegisterBtn.addEventListener('click', handleRegistration);
    }
  } catch (error) {
    console.error("Error initializing registration handlers:", error);
  }
};

/**
 * Initialize share functionality
 */
const initShareFunctionality = () => {
  try {
    const shareButton = document.querySelector('.group button');
    if (!shareButton) return;
    
    shareButton.addEventListener('click', (e) => {
      e.preventDefault();
      
      const eventTitle = 'Hội thảo Công nghệ và Tương lai nghề nghiệp';
      const eventDescription = 'Tham gia Hội thảo Công nghệ và Tương lai nghề nghiệp tại Đại học Ngân hàng TP.HCM ngày 15/04/2025';
      const shareUrl = window.location.href;
      
      // Check if Navigator Share API is supported
      if (navigator.share) {
        navigator.share({
          title: eventTitle,
          text: eventDescription,
          url: shareUrl
        })
        .then(() => console.log('Shared successfully'))
        .catch((error) => console.log('Error sharing:', error));
      } else {
        // Fallback for browsers that don't support the Share API
        const tempInput = document.createElement('input');
        document.body.appendChild(tempInput);
        tempInput.value = shareUrl;
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        
        // Show a toast notification
        showToast('Đã sao chép đường dẫn vào clipboard!');
      }
    });
  } catch (error) {
    console.error("Error initializing share functionality:", error);
  }
};

/**
 * Initialize timeline animations
 */
const initTimelineAnimations = () => {
  try {
    // Add animation classes to timeline
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(20px)';
      item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      item.style.transitionDelay = `${index * 0.1}s`;
    });
    
    // Observe timeline items for scroll effects
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            entry.target.classList.add('show');
            observer.unobserve(entry.target);
          }
        });
      }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
      });
      
      timelineItems.forEach(item => {
        observer.observe(item);
      });
    } else {
      // Fallback for browsers that don't support IntersectionObserver
      timelineItems.forEach(item => {
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
      });
    }
  } catch (error) {
    console.error("Error initializing timeline animations:", error);
  }
};

/**
 * Initialize progress bar animations
 */
const initProgressAnimations = () => {
  try {
    const progressBars = document.querySelectorAll('.animate-progress');
    progressBars.forEach(bar => {
      // Force reflow to ensure animation starts properly
      void bar.offsetWidth;
      bar.style.animationPlayState = 'running';
    });
  } catch (error) {
    console.error("Error initializing progress animations:", error);
  }
};

/**
 * Initialize speaker card animations
 */
const initSpeakerAnimations = () => {
  try {
    const speakerCards = document.querySelectorAll('.animate-speakers');
    
    // Function to check if element is in viewport
    const isInViewport = (element) => {
      const rect = element.getBoundingClientRect();
      return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.bottom >= 0
      );
    };
    
    // Function to animate speakers when in viewport
    const animateSpeakers = () => {
      speakerCards.forEach((card, index) => {
        if (isInViewport(card)) {
          setTimeout(() => {
            card.classList.add('opacity-100', 'translate-y-0');
            card.classList.remove('opacity-0', 'translate-y-4');
          }, index * 100);
        }
      });
    };
    
    // Check if speakers tab is active initially
    const speakersTab = document.getElementById('speakers-tab');
    if (speakersTab && !speakersTab.classList.contains('hidden')) {
      animateSpeakers();
    }
    
    // Add scroll listener for speaker animations
    window.addEventListener('scroll', debounce(animateSpeakers, 100));
    
    // Listen for tab changes to trigger animations
    const speakersTabButton = document.querySelector('[data-tab="speakers-tab"]');
    if (speakersTabButton) {
      speakersTabButton.addEventListener('click', () => {
        setTimeout(animateSpeakers, 300);
      });
    }
  } catch (error) {
    console.error("Error initializing speaker animations:", error);
  }
};

/**
 * Toast notification system
 */
const initToastNotifications = () => {
  try {
    // Create toast element if it doesn't exist
    let toast = document.getElementById('toast-notification');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast-notification';
      toast.className = 'fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg opacity-0 transition-opacity duration-300 z-50';
      document.body.appendChild(toast);
    }
    
    // Make the showToast function available globally
    window.showToast = (message, duration = 3000) => {
      if (!message) return;
      
      // Set message and show toast
      toast.textContent = message;
      toast.classList.remove('opacity-0');
      toast.classList.add('opacity-100');
      
      // Clear any existing timeout
      if (window.toastTimeout) {
        clearTimeout(window.toastTimeout);
      }
      
      // Hide toast after duration
      window.toastTimeout = setTimeout(() => {
        toast.classList.remove('opacity-100');
        toast.classList.add('opacity-0');
      }, duration);
    };
  } catch (error) {
    console.error("Error initializing toast notifications:", error);
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
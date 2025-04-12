/**
 * Blog Detail JavaScript
 * Implements interactive features for blog detail page with functional programming approach
 */

// Wait for DOM to fully load before initializing
document.addEventListener("DOMContentLoaded", () => {
  // Initialize all functionality
  initAOS();
  setupReadingProgress();
  setupTableOfContents();
  setupTabs();
  setupFontSizeAdjustment();
  initMobileMenu();
  setupSharing();
  setupPrinting();
  setupDarkMode();
  setupToastNotification();
  setupSaveArticle();
  setupCommentForm();
  setupImageEffects();
  setupStickyElements();
  setupBottomButtons();
});

/**
 * Initialize AOS (Animate On Scroll) library
 */
const initAOS = () => {
  try {
    // Check if AOS is available
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
      });
    }
  } catch (error) {
    console.error('Error initializing AOS:', error);
  }
};

/**
 * Setup reading progress bar with enhanced visual effect
 */
const setupReadingProgress = () => {
  const progressBar = document.getElementById('readingProgressBar');
  const progressContainer = document.querySelector('.reading-progress-container');
  
  if (!progressBar) return;

  // Add transition effect to progress bar
  progressBar.style.transition = 'width 0.2s ease-out';
  
  // Update progress bar width based on scroll position
  const updateReadingProgress = () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    
    // Update progress bar
    progressBar.style.width = scrolled + '%';
    
    // Add shadow to container when scrolled
    if (scrolled > 2 && progressContainer) {
      if (!progressContainer.classList.contains('with-shadow')) {
        progressContainer.classList.add('with-shadow');
      }
    } else if (progressContainer) {
      progressContainer.classList.remove('with-shadow');
    }
    
    // Update progress percentage if element exists
    const progressPercentage = document.getElementById('reading-percentage');
    if (progressPercentage) {
      progressPercentage.textContent = `${Math.floor(scrolled)}%`;
    }
  };

  // Add scroll event listener with debounce for performance
  window.addEventListener('scroll', debounce(updateReadingProgress, 10));
  
  // Run once on initial load
  updateReadingProgress();
};

/**
 * Setup table of contents with smooth scrolling and highlight
 */
const setupTableOfContents = () => {
  const tocLinks = document.querySelectorAll('#table-of-contents a');
  if (tocLinks.length === 0) return;

  try {
    // Setup scroll behavior for each TOC link
    tocLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        if (!targetId) return;
        
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          // Smooth scroll to target with offset for header
          window.scrollTo({
            top: targetElement.offsetTop - 100,
            behavior: 'smooth'
          });
          
          // Update URL without page reload
          history.pushState(null, null, targetId);
        }
      });
    });

    // Collect all headings for tracking
    const headings = Array.from(document.querySelectorAll('h2[id], h3[id]'));
    if (headings.length === 0) return;
    
    const highlightActiveTocItem = () => {
      // Get current scroll position with a buffer
      const scrollPosition = window.scrollY + 150;
      
      // Find the current heading
      let currentHeading = headings[0];
      
      headings.forEach(heading => {
        if (heading.offsetTop <= scrollPosition) {
          currentHeading = heading;
        }
      });
      
      // Remove active class from all links
      tocLinks.forEach(link => {
        link.classList.remove('text-primary', 'font-medium', 'bg-primary/5');
      });
      
      // Add active class to current link
      if (currentHeading) {
        const activeLink = document.querySelector(`#table-of-contents a[href="#${currentHeading.id}"]`);
        if (activeLink) {
          activeLink.classList.add('text-primary', 'font-medium', 'bg-primary/5');
        }
      }
    };
    
    // Highlight initial TOC item
    highlightActiveTocItem();
    
    // Update on scroll with debounce to improve performance
    window.addEventListener('scroll', debounce(highlightActiveTocItem, 100));
  } catch (error) {
    console.error('Error setting up table of contents:', error);
  }
};

/**
 * Setup tabs functionality for article sections
 */
const setupTabs = () => {
  try {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    if (!tabButtons.length || !tabContents.length) {
      console.warn('Tab elements not found');
      return;
    }

    // Function to activate a tab
    const activateTab = (tabId) => {
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
          
          // Trigger tab-specific animations
          if (tabId === 'comments-tab') {
            animateComments();
          } else if (tabId === 'author-tab') {
            // Author tab animations are managed via CSS with delays
          } else if (tabId === 'related-tab') {
            // Related articles animations are managed via CSS with delays
          } else if (tabId === 'references-tab') {
            animateReferences();
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
        activateTab(tabId);
      });
    });
    
    // Check for hash in URL and show corresponding tab
    // Otherwise show default tab
    setTimeout(() => {
      const initialTabId = window.location.hash ? 
        window.location.hash.substring(1) : 'content-tab';
      
      // Find the tab and show it if it exists
      const tabElement = document.getElementById(initialTabId);
      if (tabElement && tabElement.classList.contains('tab-content')) {
        activateTab(initialTabId);
      } else {
        activateTab('content-tab');
      }
    }, 100);
  } catch (error) {
    console.error("Error initializing tab navigation:", error);
  }
};

/**
 * Animate comments with staggered delay
 * Used when the comments tab is selected
 */
const animateComments = () => {
  try {
    const commentItems = document.querySelectorAll('.comments-list .animate-comment');
    if (!commentItems.length) return;
    
    commentItems.forEach((item, index) => {
      // Reset animation first
      item.style.opacity = '0';
      item.style.transform = 'translateY(20px)';
      
      // Add animation with staggered delay
      setTimeout(() => {
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
      }, 100 * index);
    });
  } catch (error) {
    console.error("Error animating comments:", error);
  }
};

/**
 * Setup font size adjustment controls
 */
const setupFontSizeAdjustment = () => {
  const articleContent = document.getElementById('article-content');
  if (!articleContent) return;
  
  try {
    // Default font size in pixels (computed from browser)
    const defaultSize = parseFloat(window.getComputedStyle(articleContent).fontSize);
    let currentSize = defaultSize;
    
    // Minimum and maximum size limits
    const minSize = defaultSize * 0.8;
    const maxSize = defaultSize * 1.5;
    
    // Steps for increment/decrement
    const step = 1;
    
    // Get font control buttons
    const decreaseBtn = document.getElementById('font-size-decrease');
    const resetBtn = document.getElementById('font-size-reset');
    const increaseBtn = document.getElementById('font-size-increase');
    
    if (!decreaseBtn || !resetBtn || !increaseBtn) return;
    
    // Apply font size to article content
    const updateFontSize = (size) => {
      articleContent.style.fontSize = `${size}px`;
      
      // Disable buttons at limits
      decreaseBtn.disabled = size <= minSize;
      increaseBtn.disabled = size >= maxSize;
      
      // Add visual indication of disabled state
      decreaseBtn.classList.toggle('opacity-50', size <= minSize);
      increaseBtn.classList.toggle('opacity-50', size >= maxSize);
    };
    
    // Decrease font size
    decreaseBtn.addEventListener('click', () => {
      if (currentSize > minSize) {
        currentSize -= step;
        updateFontSize(currentSize);
      }
    });
    
    // Reset font size
    resetBtn.addEventListener('click', () => {
      currentSize = defaultSize;
      updateFontSize(currentSize);
    });
    
    // Increase font size
    increaseBtn.addEventListener('click', () => {
      if (currentSize < maxSize) {
        currentSize += step;
        updateFontSize(currentSize);
      }
    });
    
    // Initialize buttons state
    updateFontSize(currentSize);
  } catch (error) {
    console.error('Error setting up font size adjustment:', error);
  }
};

/**
 * Update estimated reading time based on content
 */
const updateReadingTime = () => {
  const readingTimeElement = document.querySelector('.reading-time');
  const articleContent = document.getElementById('article-content');
  
  if (!readingTimeElement || !articleContent) return;
  
  // Calculate reading time (average 225 words per minute)
  const text = articleContent.textContent || articleContent.innerText;
  const wordCount = text.trim().split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 225);
  
  // Update display
  readingTimeElement.textContent = `${readingTime} phút đọc`;
};

/**
 * Setup image effects for article images
 */
const setupImageEffects = () => {
  const articleImages = document.querySelectorAll('#article-content img');
  
  articleImages.forEach(img => {
    // Add hover classes if not already present
    if (!img.classList.contains('transition-all')) {
      img.classList.add('transition-all', 'duration-700');
      
      // Add hover effects to parent container if it exists
      const parent = img.parentElement;
      if (parent && parent.tagName === 'FIGURE' || parent.tagName === 'DIV') {
        parent.classList.add('overflow-hidden', 'group');
        img.classList.add('group-hover:scale-105', 'group-hover:brightness-105');
      } else {
        // Wrap image in a container for effects
        const wrapper = document.createElement('div');
        wrapper.classList.add('overflow-hidden', 'group', 'rounded-lg');
        img.parentNode.insertBefore(wrapper, img);
        wrapper.appendChild(img);
        img.classList.add('group-hover:scale-105', 'group-hover:brightness-105');
      }
    }
  });
};

/**
 * Setup sticky elements for better navigation
 */
const setupStickyElements = () => {
  const sidebar = document.querySelector('.blog-sidebar');
  const tableOfContents = document.getElementById('table-of-contents');
  
  if (sidebar) {
    // Make sidebar sticky on desktop
    if (window.innerWidth >= 1024) { // lg breakpoint
      sidebar.classList.add('lg:sticky', 'lg:top-24');
    }
  }
  
  if (tableOfContents) {
    // Add max height and scrolling for long TOCs
    tableOfContents.classList.add('max-h-[70vh]', 'overflow-y-auto', 'scrollbar-thin');
  }
  
  // Re-check on resize
  window.addEventListener('resize', debounce(() => {
    if (sidebar) {
      if (window.innerWidth >= 1024) {
        sidebar.classList.add('lg:sticky', 'lg:top-24');
      } else {
        sidebar.classList.remove('lg:sticky', 'lg:top-24');
      }
    }
  }, 200));
};

/**
 * Initialize mobile menu functionality with enhanced transitions
 */
const initMobileMenu = () => {
  const menuButton = document.querySelector("#mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");
  const closeButton = document.getElementById("mobile-menu-close");
  
  if (!menuButton || !mobileMenu || !closeButton) return;
  
  // Add smooth slide-in animation with backdrop blur
  const addBackdrop = () => {
    // Check if backdrop already exists
    if (document.getElementById('mobile-menu-backdrop')) return;
    
    const backdrop = document.createElement('div');
    backdrop.id = 'mobile-menu-backdrop';
    backdrop.className = 'fixed inset-0 bg-black/0 z-40 pointer-events-none transition-all duration-300';
    document.body.appendChild(backdrop);
    
    // Trigger animation after element is in DOM
    setTimeout(() => {
      backdrop.classList.remove('bg-black/0', 'pointer-events-none');
      backdrop.classList.add('bg-black/30', 'backdrop-blur-sm', 'pointer-events-auto');
    }, 10);
    
    // Close menu when clicking backdrop
    backdrop.addEventListener('click', () => {
      closeMobileMenu();
    });
  };
  
  // Remove backdrop with animation
  const removeBackdrop = () => {
    const backdrop = document.getElementById('mobile-menu-backdrop');
    if (!backdrop) return;
    
    backdrop.classList.remove('bg-black/30', 'pointer-events-auto');
    backdrop.classList.add('bg-black/0', 'pointer-events-none');
    
    setTimeout(() => {
      backdrop.remove();
    }, 300);
  };
  
  // Open menu with enhanced animation
  const openMobileMenu = () => {
    // Add backdrop
    addBackdrop();
    
    // Animate menu sliding in
    mobileMenu.classList.remove('translate-x-full');
    mobileMenu.classList.add('translate-x-0');
    
    // Prevent body scrolling
    document.body.classList.add('overflow-hidden');
    
    // Update accessibility attributes
    menuButton.setAttribute("aria-expanded", "true");
    
    // Toggle icon with animation
    const icon = menuButton.querySelector("i");
    if (icon) {
      icon.classList.add('animate-spin-once');
      setTimeout(() => {
        icon.className = "ri-close-line ri-lg";
        icon.classList.remove('animate-spin-once');
      }, 200);
    }
  };
  
  // Close menu with enhanced animation
  const closeMobileMenu = () => {
    // Remove backdrop
    removeBackdrop();
    
    // Animate menu sliding out
    mobileMenu.classList.remove('translate-x-0');
    mobileMenu.classList.add('translate-x-full');
    
    // Re-enable body scrolling
    document.body.classList.remove('overflow-hidden');
    
    // Update accessibility attributes
    menuButton.setAttribute("aria-expanded", "false");
    
    // Toggle icon with animation
    const icon = menuButton.querySelector("i");
    if (icon) {
      icon.classList.add('animate-spin-once');
      setTimeout(() => {
        icon.className = "ri-menu-line ri-lg";
        icon.classList.remove('animate-spin-once');
      }, 200);
    }
  };
  
  // Open menu on button click
  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });
  
  // Close menu on close button click
  closeButton.addEventListener("click", () => {
    closeMobileMenu();
  });
  
  // Close menu on escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
      closeMobileMenu();
    }
  });
  
  // Add animation keyframes if not already in stylesheet
  if (!document.getElementById('mobile-menu-animations')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'mobile-menu-animations';
    styleSheet.textContent = `
      @keyframes spin-once {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(180deg); }
      }
      .animate-spin-once {
        animation: spin-once 0.3s ease-in-out forwards;
      }
    `;
    document.head.appendChild(styleSheet);
  }
};

/**
 * Setup sharing functionality
 */
const setupSharing = () => {
  const shareButton = document.getElementById('share-article-btn');
  const shareDialog = document.getElementById('share-dialog');
  
  if (!shareButton) return;
  
  try {
    // Fallback copy to clipboard function
    const fallbackCopyLink = () => {
      const articleUrl = window.location.href;
      navigator.clipboard.writeText(articleUrl)
        .then(() => {
          showToast("Đã sao chép liên kết bài viết vào bộ nhớ tạm!");
        })
        .catch(err => {
          console.warn('Failed to copy:', err);
          alert("Không thể sao chép liên kết tự động. URL: " + articleUrl);
        });
    };
    
    // If share dialog exists, use it
    if (shareDialog) {
      shareButton.addEventListener('click', () => {
        shareDialog.classList.remove('hidden');
        
        // Make sure to apply backdrop
        let backdrop = document.getElementById('dialog-backdrop');
        if (!backdrop) {
          backdrop = document.createElement('div');
          backdrop.id = 'dialog-backdrop';
          backdrop.className = 'fixed inset-0 bg-black/50 z-40';
          document.body.appendChild(backdrop);
        }
        
        // Close on backdrop click
        backdrop.addEventListener('click', () => {
          shareDialog.classList.add('hidden');
          backdrop.remove();
        });
      });
      
      // Setup close button if it exists
      const closeButton = shareDialog.querySelector('.close-dialog');
      if (closeButton) {
        closeButton.addEventListener('click', () => {
          shareDialog.classList.add('hidden');
          document.getElementById('dialog-backdrop')?.remove();
        });
      }
      
      // Setup copy link button
      const copyLinkBtn = document.getElementById('copy-article-link');
      if (copyLinkBtn) {
        copyLinkBtn.addEventListener('click', () => {
          const articleUrl = window.location.href;
          navigator.clipboard.writeText(articleUrl)
            .then(() => {
              showToast("Đã sao chép liên kết bài viết vào bộ nhớ tạm!");
              
              // Close dialog after copying
              shareDialog.classList.add('hidden');
              document.getElementById('dialog-backdrop')?.remove();
            })
            .catch(error => {
              console.error('Error copying to clipboard:', error);
              alert("Không thể sao chép liên kết tự động. URL: " + articleUrl);
            });
        });
      }
    } else {
      // Fallback to Web Share API if available
      shareButton.addEventListener('click', () => {
        if (navigator.share) {
          navigator.share({
            title: document.title,
            url: window.location.href
          }).catch(err => {
            console.warn('Error sharing:', err);
            fallbackCopyLink();
          });
        } else {
          fallbackCopyLink();
        }
      });
    }
    
    // Setup social sharing buttons
    const socialButtons = document.querySelectorAll('.social-share-btn');
    socialButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const platform = button.getAttribute('data-platform');
        if (!platform) return;
        
        const articleUrl = encodeURIComponent(window.location.href);
        const articleTitle = encodeURIComponent(document.title);
        
        let shareUrl = '';
        
        switch (platform) {
          case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${articleUrl}`;
            break;
          case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${articleUrl}&text=${articleTitle}`;
            break;
          case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${articleUrl}`;
            break;
          case 'email':
            shareUrl = `mailto:?subject=${articleTitle}&body=${articleUrl}`;
            break;
        }
        
        if (shareUrl) {
          window.open(shareUrl, '_blank', 'width=600,height=400');
        }
        
        // Close dialog if it exists
        if (shareDialog) {
          shareDialog.classList.add('hidden');
          document.getElementById('dialog-backdrop')?.remove();
        }
      });
    });
  } catch (error) {
    console.error('Error setting up sharing functionality:', error);
  }
};

/**
 * Setup printing functionality with enhanced preview
 */
const setupPrinting = () => {
  const printButton = document.getElementById('print-article');
  if (!printButton) return;
  
  // Add visual feedback on hover
  printButton.classList.add('transition-transform', 'duration-300', 'hover:-translate-y-0.5', 'relative');
  
  // Handle print button click with visual feedback
  printButton.addEventListener('click', () => {
    // Add loading spinner
    const originalHTML = printButton.innerHTML;
    printButton.innerHTML = '<i class="ri-loader-4-line animate-spin"></i>';
    printButton.disabled = true;
    
    // Prepare content for printing
    const articleTitle = document.querySelector('h1')?.textContent || 'Article';
    const articleContent = document.getElementById('article-content');
    const authorElement = document.querySelector('a[href="#author-section"]');
    const dateElement = document.querySelector('.article-date') || document.querySelector('.published-date');
    
    // Get author and date
    const authorName = authorElement?.textContent || 'Đại học Ngân hàng TP.HCM';
    const publishDate = dateElement?.textContent || new Date().toLocaleDateString('vi-VN');
    
    // Format current date
    const today = new Date().toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    
    // Generate QR code URL for the article
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(window.location.href)}`;
    
    if (articleContent) {
      // Show toast notification
      showToast('Đang chuẩn bị bản in...', 'info');
      
      setTimeout(() => {
        // Create a new window for printing
        const printWindow = window.open('', '_blank');
        
        if (printWindow) {
          // Get any featured image
          const featuredImage = document.querySelector('.featured-image img, .article-featured-image img');
          const featuredImageSrc = featuredImage?.src || '';
          
          // Get category tag if exists
          const categoryElement = document.querySelector('.article-category, .category-tag');
          const category = categoryElement?.textContent.trim() || 'Blog';
          
          printWindow.document.write(`
            <html>
              <head>
                <title>${articleTitle} | Đại học Ngân hàng TP.HCM</title>
                <meta charset="UTF-8">
                <style>
                  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');
                  
                  body {
                    font-family: 'Roboto', Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 20px;
                    font-size: 14px;
                  }
                  .print-header {
                    text-align: center;
                    margin-bottom: 30px;
                    padding-bottom: 20px;
                    border-bottom: 1px solid #eee;
                  }
                  .print-logo {
                    max-width: 150px;
                    margin-bottom: 10px;
                  }
                  .print-title {
                    margin-top: 40px;
                  }
                  h1 {
                    font-size: 24px;
                    margin-bottom: 20px;
                    line-height: 1.3;
                  }
                  h2 {
                    font-size: 20px;
                    margin-top: 30px;
                    margin-bottom: 15px;
                  }
                  h3 {
                    font-size: 18px;
                    margin-top: 25px;
                    margin-bottom: 10px;
                  }
                  img {
                    max-width: 100%;
                    height: auto;
                    margin: 20px 0;
                  }
                  .featured-image {
                    max-width: 100%;
                    height: auto;
                    display: block;
                    margin: 20px auto;
                  }
                  p {
                    margin-bottom: 15px;
                  }
                  .article-meta {
                    color: #666;
                    font-size: 14px;
                    margin-bottom: 30px;
                    display: flex;
                    justify-content: space-between;
                    flex-wrap: wrap;
                  }
                  .article-meta-left {
                    margin-right: 20px;
                  }
                  .category {
                    display: inline-block;
                    background-color: #f1f5f9;
                    color: #334155;
                    padding: 4px 12px;
                    border-radius: 50px;
                    font-size: 12px;
                    margin-bottom: 15px;
                  }
                  .qr-code {
                    text-align: center;
                    margin: 30px 0;
                    font-size: 12px;
                    color: #666;
                  }
                  .qr-code img {
                    margin: 10px auto;
                    display: block;
                  }
                  .print-footer {
                    margin-top: 50px;
                    border-top: 1px solid #ddd;
                    padding-top: 20px;
                    font-size: 12px;
                    color: #666;
                    text-align: center;
                  }
                  code, pre {
                    background-color: #f5f5f5;
                    padding: 2px 5px;
                    border-radius: 4px;
                    font-family: Consolas, Monaco, 'Andale Mono', monospace;
                    font-size: 13px;
                  }
                  pre {
                    padding: 15px;
                    overflow-x: auto;
                    margin: 20px 0;
                  }
                  blockquote {
                    border-left: 4px solid #ddd;
                    padding-left: 15px;
                    margin-left: 0;
                    color: #555;
                    font-style: italic;
                  }
                  table {
                    border-collapse: collapse;
                    width: 100%;
                    margin: 20px 0;
                  }
                  table, th, td {
                    border: 1px solid #ddd;
                  }
                  th, td {
                    padding: 10px;
                    text-align: left;
                  }
                  th {
                    background-color: #f5f5f5;
                  }
                  @media print {
                    @page {
                      margin: 1.5cm;
                    }
                    .no-print {
                      display: none;
                    }
                    body {
                      font-size: 12pt;
                    }
                    h1 {
                      font-size: 18pt;
                    }
                    h2 {
                      font-size: 16pt;
                    }
                  }
                </style>
              </head>
              <body>
                <div class="print-header">
                  <img src="/images/logo/logo.png" alt="Logo Đại học Ngân hàng TP.HCM" class="print-logo">
                  <div>Đại học Ngân hàng TP.HCM</div>
                </div>
                
                <div class="category">${category}</div>
                <h1 class="print-title">${articleTitle}</h1>
                
                <div class="article-meta">
                  <div class="article-meta-left">
                    <div>Tác giả: ${authorName}</div>
                    <div>Ngày đăng: ${publishDate}</div>
                  </div>
                  <div class="article-meta-right">
                    <div>In ngày: ${today}</div>
                    <div>Nguồn: ${window.location.href}</div>
                  </div>
                </div>
                
                ${featuredImageSrc ? `<img src="${featuredImageSrc}" alt="${articleTitle}" class="featured-image">` : ''}
                
                ${articleContent.innerHTML}
                
                <div class="qr-code">
                  <img src="${qrCodeUrl}" alt="QR code" width="100">
                  <div>Quét mã QR để đọc trực tuyến</div>
                </div>
                
                <div class="print-footer">
                  <p>Bài viết được in từ website Đại học Ngân hàng TP.HCM</p>
                  <p>Copyright © ${new Date().getFullYear()} Đại học Ngân hàng TP.HCM. Tất cả quyền được bảo lưu.</p>
                </div>
                
                <div class="no-print" style="text-align: center; margin-top: 30px;">
                  <button onclick="window.print()" style="padding: 10px 20px; background-color: #0066cc; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;">
                    In trang này
                  </button>
                </div>
              </body>
            </html>
          `);
          
          // Reset print button after window is created
          printButton.innerHTML = originalHTML;
          printButton.disabled = false;
          
          // Add a small delay to ensure content is loaded
          setTimeout(() => {
            printWindow.print();
            printWindow.onafterprint = () => {
              printWindow.close();
            };
          }, 500);
        } else {
          // Reset print button if window creation fails
          printButton.innerHTML = originalHTML;
          printButton.disabled = false;
          
          alert('Không thể mở cửa sổ in. Vui lòng kiểm tra cài đặt trình duyệt của bạn.');
        }
      }, 800); // Short delay to show loading spinner
    }
  });
};

/**
 * Setup dark mode toggle with enhanced transitions
 */
const setupDarkMode = () => {
  const darkModeToggle = document.getElementById('toggle-dark-mode');
  if (!darkModeToggle) return;
  
  // Check for saved user preference
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Add animation classes
  darkModeToggle.classList.add('transition-transform', 'duration-300', 'hover:rotate-12');
  
  // Function to toggle dark mode with enhanced transitions
  const toggleDarkMode = (isDark) => {
    // Add transition to document element
    document.documentElement.classList.add('transition-colors', 'duration-300');
    
    if (isDark) {
      // Apply dark mode with animation
      darkModeToggle.classList.add('animate-spin-once');
      
      setTimeout(() => {
        document.documentElement.classList.add('dark-mode');
        darkModeToggle.innerHTML = '<i class="ri-sun-line"></i>';
        darkModeToggle.setAttribute('title', 'Chế độ sáng');
        localStorage.setItem('theme', 'dark');
        
        darkModeToggle.classList.remove('animate-spin-once');
        darkModeToggle.classList.add('text-yellow-400');
        darkModeToggle.classList.remove('text-gray-600');
      }, 150);
    } else {
      // Remove dark mode with animation
      darkModeToggle.classList.add('animate-spin-once');
      
      setTimeout(() => {
        document.documentElement.classList.remove('dark-mode');
        darkModeToggle.innerHTML = '<i class="ri-moon-line"></i>';
        darkModeToggle.setAttribute('title', 'Chế độ tối');
        localStorage.setItem('theme', 'light');
        
        darkModeToggle.classList.remove('animate-spin-once');
        darkModeToggle.classList.remove('text-yellow-400');
        darkModeToggle.classList.add('text-gray-600');
      }, 150);
    }
    
    // Remove transition classes after animation completes
    setTimeout(() => {
      document.documentElement.classList.remove('transition-colors', 'duration-300');
    }, 300);
  };
  
  // Set initial state
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    toggleDarkMode(true);
  } else {
    // Make sure toggle has the right classes for light mode
    darkModeToggle.classList.remove('text-yellow-400');
    darkModeToggle.classList.add('text-gray-600');
  }
  
  // Handle toggle click with enhanced feedback
  darkModeToggle.addEventListener('click', () => {
    const isDarkMode = document.documentElement.classList.contains('dark-mode');
    toggleDarkMode(!isDarkMode);
    
    // Add ripple effect on click
    const ripple = document.createElement('span');
    ripple.className = 'absolute inset-0 bg-current opacity-25 rounded-full scale-0';
    ripple.style.animation = 'ripple 0.6s ease-out';
    
    darkModeToggle.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  });
  
  // Add ripple animation if not already in stylesheet
  if (!document.getElementById('dark-mode-animations')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'dark-mode-animations';
    styleSheet.textContent = `
      @keyframes ripple {
        to {
          transform: scale(2);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(styleSheet);
  }
};

/**
 * Setup toast notification system with enhanced styling
 */
const setupToastNotification = () => {
  const toast = document.getElementById('toast-notification');
  if (!toast) return;
  
  // Add enhanced styling
  toast.classList.add('flex', 'items-center', 'gap-2', 'drop-shadow-lg');
  
  // Create toast icon container
  const iconContainer = document.createElement('div');
  iconContainer.className = 'w-6 h-6 flex-shrink-0 flex items-center justify-center';
  iconContainer.innerHTML = '<i class="ri-checkbox-circle-line"></i>';
  
  // Insert icon at beginning of toast
  if (!toast.querySelector('i')) {
    toast.insertBefore(iconContainer, toast.firstChild);
  }
  
  // Show toast with message and icon type
  window.showToast = (message, type = 'success', duration = 3000) => {
    let icon = 'ri-checkbox-circle-line';
    let bgColor = 'bg-gray-800';
    
    switch (type) {
      case 'success':
        icon = 'ri-checkbox-circle-line';
        bgColor = 'bg-green-700';
        break;
      case 'warning':
        icon = 'ri-error-warning-line';
        bgColor = 'bg-amber-600';
        break;
      case 'error':
        icon = 'ri-close-circle-line';
        bgColor = 'bg-red-600';
        break;
      case 'info':
      default:
        icon = 'ri-information-line';
        bgColor = 'bg-gray-800';
    }
    
    // Remove all background classes and add the new one
    toast.className = toast.className.replace(/bg-\w+-\d+/g, '');
    toast.classList.add(bgColor, 'fixed', 'bottom-4', 'left-1/2', 'transform', '-translate-x-1/2', 
                       'text-white', 'px-4', 'py-2', 'rounded-lg', 'shadow-lg', 'z-50',
                       'flex', 'items-center', 'gap-2', 'drop-shadow-lg');
    
    // Update icon and message
    const iconElement = toast.querySelector('i');
    if (iconElement) {
      iconElement.className = icon;
    }
    
    // Set message text (without icon)
    const textElement = toast.querySelector('.toast-text');
    if (textElement) {
      textElement.textContent = message;
    } else {
      // If text element doesn't exist, create it
      const textSpan = document.createElement('span');
      textSpan.className = 'toast-text';
      textSpan.textContent = message;
      toast.appendChild(textSpan);
    }
    
    // Show toast with animation
    toast.classList.remove('opacity-0', 'translate-y-4');
    toast.classList.add('opacity-100', 'translate-y-0');
    
    // Hide toast after duration with animation
    clearTimeout(window.toastTimeout);
    window.toastTimeout = setTimeout(() => {
      toast.classList.remove('opacity-100', 'translate-y-0');
      toast.classList.add('opacity-0', 'translate-y-4');
    }, duration);
  };
};

/**
 * Setup save article functionality with improved interactions
 */
const setupSaveArticle = () => {
  const saveButton = document.getElementById('save-article-btn');
  if (!saveButton) return;
  
  // Get article ID from URL or data attribute
  const articleId = saveButton.getAttribute('data-article-id') || 
                   window.location.pathname.split('/').pop() || 
                   'blog-article-1';
  
  // Add hover animation
  saveButton.classList.add('transition-all', 'duration-300', 'hover:-translate-y-0.5');
  
  // Check if article is already saved
  const checkSavedStatus = () => {
    const savedArticles = JSON.parse(localStorage.getItem('saved-articles') || '[]');
    const isSaved = savedArticles.includes(articleId);
    
    if (isSaved) {
      saveButton.innerHTML = '<i class="ri-bookmark-fill mr-1"></i><span>Đã lưu</span>';
      saveButton.classList.add('text-primary');
      // Add a subtle animation when already saved
      saveButton.classList.add('saved-animation');
    } else {
      saveButton.innerHTML = '<i class="ri-bookmark-line mr-1"></i><span>Lưu bài viết</span>';
      saveButton.classList.remove('text-primary', 'saved-animation');
    }
  };
  
  // Initialize saved status
  checkSavedStatus();
  
  // Handle save button click with animation
  saveButton.addEventListener('click', () => {
    const savedArticles = JSON.parse(localStorage.getItem('saved-articles') || '[]');
    const isSaved = savedArticles.includes(articleId);
    
    if (isSaved) {
      // Remove from saved
      const newSavedArticles = savedArticles.filter(id => id !== articleId);
      localStorage.setItem('saved-articles', JSON.stringify(newSavedArticles));
      
      // Update button with animation
      saveButton.classList.add('animate-bounce-once');
      saveButton.innerHTML = '<i class="ri-bookmark-line mr-1"></i><span>Lưu bài viết</span>';
      saveButton.classList.remove('text-primary', 'saved-animation');
      
      // Remove animation class after it completes
      setTimeout(() => {
        saveButton.classList.remove('animate-bounce-once');
      }, 1000);
      
      showToast('Đã xóa khỏi danh sách bài viết đã lưu', 'info');
    } else {
      // Add to saved
      savedArticles.push(articleId);
      localStorage.setItem('saved-articles', JSON.stringify(savedArticles));
      
      // Update button with animation
      saveButton.classList.add('animate-bounce-once');
      saveButton.innerHTML = '<i class="ri-bookmark-fill mr-1"></i><span>Đã lưu</span>';
      saveButton.classList.add('text-primary', 'saved-animation');
      
      // Remove animation class after it completes
      setTimeout(() => {
        saveButton.classList.remove('animate-bounce-once');
      }, 1000);
      
      showToast('Đã lưu bài viết để đọc sau', 'success');
    }
  });
  
  // Add keyframe animation for saved state if not already in stylesheet
  if (!document.getElementById('save-button-animation')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'save-button-animation';
    styleSheet.textContent = `
      @keyframes savedPulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }
      .saved-animation i {
        animation: savedPulse 2s infinite;
      }
      .animate-bounce-once {
        animation: bounce 0.5s;
      }
      @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-5px); }
      }
    `;
    document.head.appendChild(styleSheet);
  }
};

/**
 * Setup comment form validation and submission with enhanced UI
 */
const setupCommentForm = () => {
  const commentForm = document.getElementById('comment-form');
  if (!commentForm) return;
  
  // Add enhanced styling to form elements
  const formInputs = commentForm.querySelectorAll('input, textarea');
  formInputs.forEach(input => {
    // Add focus effects
    input.addEventListener('focus', function() {
      this.parentElement.classList.add('ring-2', 'ring-primary/30', 'ring-offset-1');
    });
    
    input.addEventListener('blur', function() {
      this.parentElement.classList.remove('ring-2', 'ring-primary/30', 'ring-offset-1');
      
      // Show validation state after user interaction
      validateInput(this);
    });
    
    // Add real-time validation for email
    if (input.type === 'email') {
      input.addEventListener('input', function() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(this.value);
        
        if (this.value && !isValid) {
          this.parentElement.classList.add('border-red-300');
          const errorMsg = this.parentElement.querySelector('.error-message') || 
                          document.createElement('span');
          
          if (!this.parentElement.querySelector('.error-message')) {
            errorMsg.className = 'error-message text-xs text-red-500 absolute -bottom-5 left-0';
            errorMsg.textContent = 'Email không hợp lệ';
            this.parentElement.appendChild(errorMsg);
          }
        } else {
          this.parentElement.classList.remove('border-red-300');
          const errorMsg = this.parentElement.querySelector('.error-message');
          if (errorMsg) errorMsg.remove();
        }
      });
    }
  });
  
  // Input validation function
  const validateInput = (input) => {
    // Required validation
    if (input.required && !input.value.trim()) {
      input.parentElement.classList.add('border-red-300');
      
      const errorMsg = input.parentElement.querySelector('.error-message') || 
                      document.createElement('span');
      
      if (!input.parentElement.querySelector('.error-message')) {
        errorMsg.className = 'error-message text-xs text-red-500 absolute -bottom-5 left-0';
        errorMsg.textContent = 'Trường này không được để trống';
        input.parentElement.appendChild(errorMsg);
      }
      
      return false;
    } else {
      input.parentElement.classList.remove('border-red-300');
      const errorMsg = input.parentElement.querySelector('.error-message');
      if (errorMsg) errorMsg.remove();
      
      // Email validation
      if (input.type === 'email' && input.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input.value)) {
          input.parentElement.classList.add('border-red-300');
          
          const emailError = document.createElement('span');
          emailError.className = 'error-message text-xs text-red-500 absolute -bottom-5 left-0';
          emailError.textContent = 'Email không hợp lệ';
          input.parentElement.appendChild(emailError);
          
          return false;
        }
      }
      
      return true;
    }
  };
  
  // Submit handler with enhanced feedback
  commentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const nameInput = commentForm.querySelector('input[name="commenter-name"]');
    const emailInput = commentForm.querySelector('input[name="commenter-email"]');
    const commentInput = commentForm.querySelector('textarea[name="comment-text"]');
    
    // Validate all inputs
    const nameValid = validateInput(nameInput);
    const emailValid = validateInput(emailInput);
    const commentValid = validateInput(commentInput);
    
    // If any validation fails, stop submission
    if (!nameValid || !emailValid || !commentValid) {
      showToast('Vui lòng điền đầy đủ thông tin', 'error');
      return;
    }
    
    // Show loading state
    const submitButton = commentForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="ri-loader-4-line animate-spin mr-1"></i> Đang gửi...';
    
    // Simulate comment submission with a delay
    setTimeout(() => {
      const commentData = {
        name: nameInput.value,
        email: emailInput.value,
        comment: commentInput.value,
        date: new Date().toISOString()
      };
      
      // For demo purposes, show a success message
      showToast('Bình luận của bạn đã được gửi và đang chờ phê duyệt', 'success');
      
      // Reset form with animation
      formInputs.forEach(input => {
        input.style.transition = 'all 0.3s ease';
        input.style.backgroundColor = '#f0fff4';
        setTimeout(() => {
          input.style.backgroundColor = '';
          input.style.transition = '';
        }, 1000);
      });
      
      commentForm.reset();
      
      // Reset button
      submitButton.disabled = false;
      submitButton.innerHTML = originalButtonText;
      
      // In a real application, you would send this data to the server
      console.log('Comment submitted:', commentData);
      
      // Add a visual temporary comment preview if a comments section exists
      addTemporaryCommentPreview(commentData);
    }, 1500);
  });
  
  // Function to add a temporary comment preview to the page
  const addTemporaryCommentPreview = (commentData) => {
    const commentsContainer = document.querySelector('.comments-list');
    if (!commentsContainer) return;
    
    // Create a temporary comment element
    const commentElement = document.createElement('div');
    commentElement.className = 'bg-green-50 border border-green-100 rounded-lg p-4 mb-4 animate-fade-in relative';
    
    // Add "Pending" badge
    const pendingBadge = document.createElement('div');
    pendingBadge.className = 'absolute top-2 right-2 bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full';
    pendingBadge.textContent = 'Đang xét duyệt';
    commentElement.appendChild(pendingBadge);
    
    // Format date
    const date = new Date(commentData.date);
    const formattedDate = date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    // Set comment content
    commentElement.innerHTML += `
      <div class="flex items-start">
        <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3">
          ${commentData.name.charAt(0).toUpperCase()}
        </div>
        <div class="flex-1">
          <div class="flex items-baseline justify-between">
            <h4 class="font-medium text-gray-900">${commentData.name}</h4>
            <span class="text-xs text-gray-500">${formattedDate}</span>
          </div>
          <p class="text-gray-700 mt-1">${commentData.comment}</p>
        </div>
      </div>
    `;
    
    // Add to the beginning of the comments list
    commentsContainer.insertBefore(commentElement, commentsContainer.firstChild);
    
    // Scroll to the new comment
    commentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };
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
 * Setup additional bottom action buttons
 */
const setupBottomButtons = () => {
  const shareBottomBtn = document.getElementById('share-article-btn-bottom');
  
  if (shareBottomBtn) {
    // Link bottom share button to main share functionality
    shareBottomBtn.addEventListener('click', () => {
      // Find and click the main share button
      const mainShareBtn = document.getElementById('share-article-btn');
      if (mainShareBtn) {
        mainShareBtn.click();
      } else {
        // Fallback if main button not found
        const articleUrl = window.location.href;
        if (navigator.share) {
          navigator.share({
            title: document.title,
            url: articleUrl
          }).catch(err => {
            console.warn('Error sharing:', err);
            navigator.clipboard.writeText(articleUrl)
              .then(() => showToast("Đã sao chép liên kết bài viết vào bộ nhớ tạm!", "success"));
          });
        } else {
          navigator.clipboard.writeText(articleUrl)
            .then(() => showToast("Đã sao chép liên kết bài viết vào bộ nhớ tạm!", "success"));
        }
      }
      
      // Add ripple effect
      const ripple = document.createElement('span');
      ripple.className = 'absolute inset-0 bg-primary/10 rounded-full scale-0';
      ripple.style.animation = 'ripple 0.6s ease-out';
      
      if (shareBottomBtn.style.position !== 'relative') {
        shareBottomBtn.style.position = 'relative';
      }
      
      shareBottomBtn.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  }
  
  // Connect mobile font size controls to desktop ones
  const decreaseMobileBtn = document.getElementById('font-size-decrease-mobile');
  const resetMobileBtn = document.getElementById('font-size-reset-mobile');
  const increaseMobileBtn = document.getElementById('font-size-increase-mobile');
  
  if (decreaseMobileBtn && resetMobileBtn && increaseMobileBtn) {
    const decreaseBtn = document.getElementById('font-size-decrease');
    const resetBtn = document.getElementById('font-size-reset');
    const increaseBtn = document.getElementById('font-size-increase');
    
    if (decreaseBtn && resetBtn && increaseBtn) {
      decreaseMobileBtn.addEventListener('click', () => decreaseBtn.click());
      resetMobileBtn.addEventListener('click', () => resetBtn.click());
      increaseMobileBtn.addEventListener('click', () => increaseBtn.click());
    }
  }
};

/**
 * Animate references with staggered delay
 * Used when the references tab is selected
 */
const animateReferences = () => {
  try {
    const referenceItems = document.querySelectorAll('.references-list .animate-reference');
    if (!referenceItems.length) return;
    
    referenceItems.forEach((item, index) => {
      // Reset animation first
      item.style.opacity = '0';
      item.style.transform = 'translateY(20px)';
      
      // Add animation with staggered delay
      setTimeout(() => {
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
      }, 100 * index);
    });
  } catch (error) {
    console.error("Error animating references:", error);
  }
}; 
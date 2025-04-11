// Function to load HTML components
async function loadComponent(elementId, componentPath) {
    try {
        const response = await fetch(componentPath);
        if (!response.ok) {
            throw new Error(`Error loading component: ${response.statusText}`);
        }
        const html = await response.text();
        document.getElementById(elementId).innerHTML = html;
    } catch (error) {
        console.error('Failed to load component:', error);
    }
}

// Function to initialize all components
async function initComponents() {
    // Load header
    await loadComponent('header-component', '/components/header.html');
    
    // Load footer
    await loadComponent('footer-component', '/components/footer.html');
    
    // Initialize any component-specific JavaScript
    initHeader();
    initFooter();
}

// Header-specific initialization
function initHeader() {
    const userBtn = document.querySelector('.header-right .btn-primary');
    if (userBtn) {
        userBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Add your user menu logic here
        });
    }
}

// Footer-specific initialization
function initFooter() {
    const currentYear = new Date().getFullYear();
    const copyrightYear = document.querySelector('.footer-bottom .copyright-year');
    if (copyrightYear) {
        copyrightYear.textContent = currentYear;
    }
}

// Initialize components when DOM is loaded
document.addEventListener('DOMContentLoaded', initComponents);

// Component Loader
document.addEventListener('DOMContentLoaded', function() {
    // Load Header
    fetch('../components/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-component').innerHTML = data;
        });

    // Load Footer
    fetch('../components/footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-component').innerHTML = data;
        });
}); 
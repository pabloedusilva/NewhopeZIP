// Dashboard JavaScript - Enhanced Responsive
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Dashboard
    initializeDashboard();
    initializeCharts();
    setupEventListeners();
    setupResponsiveFeatures();
});

// Dashboard State
const dashboardState = {
    activeSection: 'dashboard',
    sidebarCollapsed: false,
    mobileMenuOpen: false,
    isMobile: false,
    isTablet: false
};

// Initialize Dashboard
function initializeDashboard() {
    // Set active section
    showSection('dashboard');
    
    // Load initial data
    loadDashboardData();
    
    // Setup mobile detection
    handleMobileLayout();
    
    // Setup responsive tables
    setupResponsiveTables();
}

// Setup Responsive Features
function setupResponsiveFeatures() {
    // Detect device type
    updateDeviceType();
    
    // Setup touch events for mobile
    if (dashboardState.isMobile) {
        setupTouchEvents();
    }
    
    // Setup responsive charts
    setupResponsiveCharts();
    
    // Setup responsive tables
    setupResponsiveTables();
}

// Update Device Type
function updateDeviceType() {
    const width = window.innerWidth;
    dashboardState.isMobile = width <= 768;
    dashboardState.isTablet = width > 768 && width <= 1024;
    
    // Add device class to body
    document.body.classList.remove('mobile', 'tablet', 'desktop');
    if (dashboardState.isMobile) {
        document.body.classList.add('mobile');
    } else if (dashboardState.isTablet) {
        document.body.classList.add('tablet');
    } else {
        document.body.classList.add('desktop');
    }
}

// Setup Touch Events
function setupTouchEvents() {
    // Add touch-friendly interactions
    const buttons = document.querySelectorAll('.btn, .action-btn, .action-btn-sm');
    buttons.forEach(btn => {
        btn.addEventListener('touchstart', function() {
            this.classList.add('touching');
        });
        
        btn.addEventListener('touchend', function() {
            setTimeout(() => {
                this.classList.remove('touching');
            }, 150);
        });
    });
    
    // Prevent double-tap zoom on touch without hijacking all clicks
    let lastTouchTime = 0;
    document.addEventListener('touchend', function(e) {
        const now = Date.now();
        if (now - lastTouchTime <= 300) {
            e.preventDefault();
        }
        lastTouchTime = now;
    }, { passive: false });
}

// Setup Responsive Charts
function setupResponsiveCharts() {
    // Chart.js responsive options will be handled in individual chart functions
    const chartContainers = document.querySelectorAll('.chart-container');
    
    chartContainers.forEach(container => {
        // Adjust height based on device
        if (dashboardState.isMobile) {
            container.style.height = '180px';
        } else if (dashboardState.isTablet) {
            container.style.height = '220px';
        } else {
            container.style.height = '300px';
        }
    });
}

// Setup Responsive Tables
function setupResponsiveTables() {
    const tables = document.querySelectorAll('.data-table');
    
    tables.forEach(table => {
        // Add data labels for mobile view
        const headers = table.querySelectorAll('th');
        const rows = table.querySelectorAll('tbody tr');
        
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            cells.forEach((cell, index) => {
                if (headers[index]) {
                    cell.setAttribute('data-label', headers[index].textContent);
                }
            });
        });
        
        // Ensure table is inside proper responsive wrappers; avoid double wrapping
        const containerDiv = table.closest('.table-container');
        const wrapperDiv = table.closest('.table-responsive-wrapper') || containerDiv?.closest('.table-responsive-wrapper');

        if (containerDiv && !wrapperDiv) {
            // Wrap the existing container with a new wrapper
            const wrapper = document.createElement('div');
            wrapper.className = 'table-responsive-wrapper';
            containerDiv.parentNode.insertBefore(wrapper, containerDiv);
            wrapper.appendChild(containerDiv);
        } else if (!containerDiv && !wrapperDiv) {
            // Create both wrapper and container and move table
            const wrapper = document.createElement('div');
            wrapper.className = 'table-responsive-wrapper';
            const newContainer = document.createElement('div');
            newContainer.className = 'table-container';
            table.parentNode.insertBefore(wrapper, table);
            wrapper.appendChild(newContainer);
            newContainer.appendChild(table);
        }
    });
}

// Event Listeners
function setupEventListeners() {
    // Sidebar navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavigation);
    });

    // Sidebar toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', toggleSidebar);
    }
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }

    // Search functionality
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }

    // Filter functionality
    const filterSearches = document.querySelectorAll('.filter-search');
    filterSearches.forEach(input => {
        input.addEventListener('input', handleFilterSearch);
    });

    // Table action buttons
    setupTableActions();

    // Form submissions
    setupFormHandlers();

    // Toggle switches
    setupToggleSwitches();

    // Enhanced responsive handling
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);
    
    // Handle swipe gestures on mobile
    if (dashboardState.isMobile) {
        setupSwipeGestures();
    }
}

// Handle Orientation Change
function handleOrientationChange() {
    setTimeout(() => {
        updateDeviceType();
        setupResponsiveCharts();
        
    // Refresh charts on orientation change
    refreshAllCharts();
    }, 100);
}

// Setup Swipe Gestures
function setupSwipeGestures() {
    let startX = 0;
    let startY = 0;
    let isScrolling = false;
    
    document.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isScrolling = false;
    }, { passive: true });
    
    document.addEventListener('touchmove', function(e) {
        if (!startX || !startY) return;
        
        const diffX = Math.abs(e.touches[0].clientX - startX);
        const diffY = Math.abs(e.touches[0].clientY - startY);
        
        if (diffY > diffX) {
            isScrolling = true;
        }
    }, { passive: true });
    
    document.addEventListener('touchend', function(e) {
        if (!startX || !startY || isScrolling) return;
        
        const endX = e.changedTouches[0].clientX;
        const diffX = startX - endX;
        
        // Swipe left to open menu
        if (diffX < -50 && !dashboardState.mobileMenuOpen) {
            toggleMobileMenu();
        }
        
        // Swipe right to close menu
        if (diffX > 50 && dashboardState.mobileMenuOpen) {
            toggleMobileMenu();
        }
        
        startX = 0;
        startY = 0;
    }, { passive: true });
}

// Navigation Handler
function handleNavigation(event) {
    event.preventDefault();
    
    const link = event.currentTarget;
    const section = link.getAttribute('data-section');
    
    if (section) {
        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        // Show section
        showSection(section);
        
        // Update page title
        updatePageTitle(section);
        
        // Close mobile menu if open
        if (dashboardState.mobileMenuOpen) {
            toggleMobileMenu();
        }
    }
}

// Show Section
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(`${sectionName}-section`);
    if (targetSection) {
        targetSection.classList.add('active');
        dashboardState.activeSection = sectionName;
    }
    
    // Load section-specific data
    loadSectionData(sectionName);
}

// Update Page Title
function updatePageTitle(section) {
    const pageTitle = document.querySelector('.page-title');
    const titles = {
        'dashboard': 'Dashboard',
        'products': 'Produtos',
        'orders': 'Pedidos',
        'customers': 'Clientes',
        'categories': 'Categorias',
        'analytics': 'Relatórios',
        'settings': 'Configurações'
    };
    
    if (pageTitle && titles[section]) {
        pageTitle.textContent = titles[section];
    }
}

// Sidebar Toggle
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.querySelector('.main-content');
    
    sidebar.classList.toggle('collapsed');
    dashboardState.sidebarCollapsed = !dashboardState.sidebarCollapsed;
    
    // Store preference
    localStorage.setItem('sidebarCollapsed', dashboardState.sidebarCollapsed);
}

// Mobile Menu Toggle
function toggleMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    let overlay = document.querySelector('.sidebar-overlay');
    
    // Create overlay if it doesn't exist
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        document.body.appendChild(overlay);
        
        // Close menu when clicking overlay
        overlay.addEventListener('click', toggleMobileMenu);
    }
    
    sidebar.classList.toggle('mobile-open');
    overlay.classList.toggle('active');
    dashboardState.mobileMenuOpen = !dashboardState.mobileMenuOpen;
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = dashboardState.mobileMenuOpen ? 'hidden' : '';
}

// Handle Mobile Layout
function handleMobileLayout() {
    const savedCollapsed = localStorage.getItem('sidebarCollapsed');
    if (savedCollapsed === 'true' && window.innerWidth > 768) {
        toggleSidebar();
    }
}

// Handle Resize
function handleResize() {
    // Update device type
    updateDeviceType();
    
    // Close mobile menu if switching to desktop
    if (window.innerWidth > 768 && dashboardState.mobileMenuOpen) {
        toggleMobileMenu();
    }
    
    // Auto-collapse sidebar on tablet
    if (window.innerWidth <= 1024 && window.innerWidth > 768) {
        if (!dashboardState.sidebarCollapsed) {
            toggleSidebar();
        }
    }
    
    // Setup responsive features for new size
    setupResponsiveCharts();
    
    // Refresh charts (Chart.js v3/v4 safe)
    setTimeout(refreshAllCharts, 100);
    
    // Re-setup responsive tables
    setupResponsiveTables();
}

// Load Dashboard Data
function loadDashboardData() {
    // Simulate loading data
    updateStatsCards();
    updateRecentOrders();
}

// Load Section Data
function loadSectionData(section) {
    switch(section) {
        case 'products':
            loadProductsData();
            break;
        case 'orders':
            loadOrdersData();
            break;
        case 'customers':
            loadCustomersData();
            break;
        case 'categories':
            loadCategoriesData();
            break;
        case 'analytics':
            loadAnalyticsData();
            break;
        default:
            break;
    }
}

// Update Stats Cards
function updateStatsCards() {
    // Simulate real-time data updates
    const statsData = {
        sales: { current: 1247, change: 12.5 },
        revenue: { current: 45670, change: 8.2 },
        customers: { current: 892, change: 5.1 },
        products: { current: 156, change: -2.1 }
    };
    
    // You can update the cards with real data here
    animateCounters();
}

// Animate Counters
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace(/[^\d]/g, ''));
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                if (counter.textContent.includes('R$')) {
                    counter.textContent = `R$ ${Math.floor(current).toLocaleString('pt-BR')}`;
                } else {
                    counter.textContent = Math.floor(current).toLocaleString('pt-BR');
                }
                requestAnimationFrame(updateCounter);
            } else {
                if (counter.textContent.includes('R$')) {
                    counter.textContent = `R$ ${target.toLocaleString('pt-BR')}`;
                } else {
                    counter.textContent = target.toLocaleString('pt-BR');
                }
            }
        };
        
        updateCounter();
    });
}

// Initialize Charts
function initializeCharts() {
    // Performance optimizations for mobile
    if (dashboardState.isMobile) {
        // Lazy load charts
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const chartId = entry.target.id;
                    initializeChartById(chartId);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });

        // Observe chart containers
        document.querySelectorAll('canvas').forEach(canvas => {
            observer.observe(canvas);
        });
    } else {
        // Initialize all charts immediately on desktop
        initializeSalesChart();
        initializeProductsChart();
        initializeRevenueChart();
        initializeCategoryChart();
    }
}

// Refresh all Chart.js instances safely across versions
function refreshAllCharts() {
    if (typeof Chart === 'undefined' || !Chart.instances) return;
    const charts = [];
    if (typeof Chart.instances.forEach === 'function') {
        // v3/v4 Map-like
        Chart.instances.forEach(inst => charts.push(inst));
    } else {
        // v2 plain object
        for (const id in Chart.instances) charts.push(Chart.instances[id]);
    }
    charts.forEach(c => {
        try { c.resize && c.resize(); } catch (e) {}
    });
}

// Helper function to initialize chart by ID
function initializeChartById(chartId) {
    switch(chartId) {
        case 'salesChart':
            initializeSalesChart();
            break;
        case 'productsChart':
            initializeProductsChart();
            break;
        case 'revenueChart':
            initializeRevenueChart();
            break;
        case 'categoryChart':
            initializeCategoryChart();
            break;
    }
}

// Sales Chart
function initializeSalesChart() {
    const ctx = document.getElementById('salesChart');
    if (!ctx) return;
    
    const isMobile = window.innerWidth <= 768;
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set'],
            datasets: [{
                label: 'Vendas',
                data: [120, 190, 300, 500, 200, 300, 450, 680, 920],
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                borderWidth: isMobile ? 2 : 3,
                fill: true,
                tension: 0.4,
                pointRadius: isMobile ? 3 : 4,
                pointHoverRadius: isMobile ? 5 : 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: !isMobile,
                    labels: {
                        font: {
                            size: isMobile ? 10 : 12
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#e5e7eb'
                    },
                    ticks: {
                        font: {
                            size: isMobile ? 10 : 12
                        }
                    }
                },
                x: {
                    grid: {
                        color: '#e5e7eb'
                    },
                    ticks: {
                        font: {
                            size: isMobile ? 10 : 12
                        },
                        maxRotation: isMobile ? 45 : 0
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

// Products Chart
function initializeProductsChart() {
    const ctx = document.getElementById('productsChart');
    if (!ctx) return;
    
    const isMobile = window.innerWidth <= 768;
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Camisetas', 'Moletons', 'Calças', 'Tênis', 'Acessórios'],
            datasets: [{
                data: [30, 25, 20, 15, 10],
                backgroundColor: [
                    '#10b981',
                    '#f59e0b',
                    '#ef4444',
                    '#111111',
                    '#9ca3af'
                ],
                borderWidth: 0,
                cutout: isMobile ? '60%' : '50%'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: isMobile ? 'bottom' : 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: isMobile ? 10 : 20,
                        font: {
                            size: isMobile ? 10 : 12
                        }
                    }
                }
            }
        }
    });
}

// Revenue Chart
function initializeRevenueChart() {
    const ctx = document.getElementById('revenueChart');
    if (!ctx) return;
    
    const isMobile = window.innerWidth <= 768;
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: isMobile ? ['S1', 'S2', 'S3', 'S4'] : ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
            datasets: [
                {
                    label: 'Receita',
                    data: [12000, 15000, 18000, 14500],
                    backgroundColor: '#10b981',
                    borderRadius: isMobile ? 4 : 8,
                    borderSkipped: false
                },
                {
                    label: 'Meta',
                    data: [15000, 15000, 15000, 15000],
                    backgroundColor: '#e5e7eb',
                    borderRadius: isMobile ? 4 : 8,
                    borderSkipped: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        font: {
                            size: isMobile ? 10 : 12
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        font: {
                            size: isMobile ? 9 : 11
                        },
                        callback: function(value) {
                            return isMobile ? 'R$' + (value/1000) + 'k' : 'R$' + value.toLocaleString();
                        }
                    }
                },
                x: {
                    ticks: {
                        font: {
                            size: isMobile ? 9 : 11
                        }
                    }
                }
            }
        }
    });
}

// Category Chart
function initializeCategoryChart() {
    const ctx = document.getElementById('categoryChart');
    if (!ctx) return;
    
    const isMobile = window.innerWidth <= 768;
    
    new Chart(ctx, {
        type: 'polarArea',
        data: {
            labels: isMobile ? ['Camisas', 'Bonés', 'Bermudas', 'Chronic', 'Blessed'] : 
                             ['Camisas de Time', 'Bonés', 'Bermudas', 'Chronic', 'Blessed Choice'],
            datasets: [{
                data: [40, 25, 20, 30, 15],
                backgroundColor: [
                    'rgba(16, 185, 129, 0.7)',
                    'rgba(245, 158, 11, 0.7)',
                    'rgba(239, 68, 68, 0.7)',
                    'rgba(17, 17, 17, 0.7)',
                    'rgba(156, 163, 175, 0.7)'
                ],
                borderColor: [
                    '#10b981',
                    '#f59e0b',
                    '#ef4444',
                    '#111111',
                    '#9ca3af'
                ],
                borderWidth: isMobile ? 1 : 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        font: {
                            size: isMobile ? 9 : 11
                        },
                        padding: isMobile ? 8 : 15
                    }
                }
            },
            scales: {
                r: {
                    ticks: {
                        display: !isMobile,
                        font: {
                            size: isMobile ? 8 : 10
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                }
            }
        }
    });
}

// Table Actions Setup
function setupTableActions() {
    // View buttons
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', handleViewAction);
    });
    
    // Edit buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', handleEditAction);
    });
    
    // Delete buttons
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', handleDeleteAction);
    });
    
    // Add product button
    const addProductBtn = document.getElementById('addProductBtn');
    if (addProductBtn) {
        addProductBtn.addEventListener('click', handleAddProduct);
    }
}

// Action Handlers
function handleViewAction(event) {
    const button = event.currentTarget;
    const row = button.closest('tr');
    const id = row.querySelector('td').textContent;
    
    showNotification(`Visualizando item ${id}`, 'info');
}

function handleEditAction(event) {
    const button = event.currentTarget;
    const row = button.closest('tr');
    const id = row.querySelector('td').textContent;
    
    showNotification(`Editando item ${id}`, 'info');
}

function handleDeleteAction(event) {
    const button = event.currentTarget;
    const row = button.closest('tr');
    const id = row.querySelector('td').textContent;
    
    if (confirm(`Tem certeza que deseja excluir o item ${id}?`)) {
        row.remove();
        showNotification(`Item ${id} excluído com sucesso`, 'success');
    }
}

function handleAddProduct() {
    showNotification('Abrindo formulário de novo produto', 'info');
    // Here you would open a modal or navigate to add product page
}

// Search Handler
function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    console.log('Searching for:', searchTerm);
    // Implement global search functionality here
}

// Filter Search Handler
function handleFilterSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    const table = event.target.closest('.filters-bar').nextElementSibling.querySelector('table');
    
    if (table) {
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    }
}

// Form Handlers
function setupFormHandlers() {
    // Settings form
    const settingsForm = document.querySelector('#settings-section form');
    if (settingsForm) {
        settingsForm.addEventListener('submit', handleSettingsSubmit);
    }
    
    // Save buttons
    document.querySelectorAll('.btn-primary').forEach(btn => {
        if (btn.textContent.includes('Salvar')) {
            btn.addEventListener('click', handleSaveAction);
        }
    });
}

function handleSettingsSubmit(event) {
    event.preventDefault();
    showNotification('Configurações salvas com sucesso!', 'success');
}

function handleSaveAction(event) {
    event.preventDefault();
    showNotification('Dados salvos com sucesso!', 'success');
}

// Toggle Switches
function setupToggleSwitches() {
    const toggles = document.querySelectorAll('.toggle-switch input');
    toggles.forEach(toggle => {
        toggle.addEventListener('change', function() {
            const setting = this.closest('.setting-item').querySelector('.setting-info span').textContent;
            const status = this.checked ? 'ativada' : 'desativada';
            showNotification(`${setting} ${status}`, 'info');
        });
    });
}

// Load Section-specific Data
function loadProductsData() {
    // Simulate loading products data
    console.log('Loading products data...');
}

function loadOrdersData() {
    // Simulate loading orders data
    console.log('Loading orders data...');
}

function loadCustomersData() {
    // Simulate loading customers data
    console.log('Loading customers data...');
}

function loadCategoriesData() {
    // Simulate loading categories data
    console.log('Loading categories data...');
}

function loadAnalyticsData() {
    // Simulate loading analytics data
    console.log('Loading analytics data...');
}

// Update Recent Orders
function updateRecentOrders() {
    // Simulate real-time order updates
    const orderStatuses = ['pending', 'processing', 'completed'];
    const rows = document.querySelectorAll('.data-table tbody tr');
    
    rows.forEach(row => {
        const statusBadge = row.querySelector('.status-badge');
        if (statusBadge && Math.random() > 0.95) { // 5% chance to update
            const newStatus = orderStatuses[Math.floor(Math.random() * orderStatuses.length)];
            statusBadge.className = `status-badge status-${newStatus}`;
            statusBadge.textContent = capitalizeFirst(newStatus);
        }
    });
}

// Utility Functions
function capitalizeFirst(str) {
    const translations = {
        'pending': 'Pendente',
        'processing': 'Processando',
        'completed': 'Concluído',
        'cancelled': 'Cancelado'
    };
    return translations[str] || str;
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 15px;
        min-width: 300px;
        animation: slideInRight 0.3s ease;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 5px;
        opacity: 0.8;
    `;
    
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        'success': 'check-circle',
        'error': 'exclamation-triangle',
        'warning': 'exclamation-circle',
        'info': 'info-circle'
    };
    return icons[type] || 'info-circle';
}

function getNotificationColor(type) {
    const colors = {
        'success': '#10b981',
        'error': '#ef4444',
        'warning': '#f59e0b',
        'info': '#111111'
    };
    return colors[type] || '#111111';
}

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
`;
document.head.appendChild(style);

// Real-time updates simulation
setInterval(() => {
    if (dashboardState.activeSection === 'dashboard') {
        updateRecentOrders();
    }
}, 30000); // Update every 30 seconds

// Performance monitoring for mobile
function monitorPerformance() {
    if (dashboardState.isMobile && 'performance' in window) {
        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach(entry => {
                if (entry.entryType === 'paint' && entry.name === 'first-contentful-paint') {
                    console.log('FCP:', entry.startTime);
                }
            });
        });
        
        try {
            observer.observe({ entryTypes: ['paint'] });
        } catch (e) {
            // Performance observer not supported
        }
    }
}

// Responsive image loading
function setupResponsiveImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        images.forEach(img => {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
        });
    }
}

// Memory cleanup
function cleanup() {
    // Clean up charts
    if (typeof Chart !== 'undefined' && Chart.instances) {
        const charts = [];
        if (typeof Chart.instances.forEach === 'function') {
            Chart.instances.forEach(inst => charts.push(inst));
        } else {
            for (const id in Chart.instances) charts.push(Chart.instances[id]);
        }
        charts.forEach(c => { try { c.destroy && c.destroy(); } catch (e) {} });
    }
    
    // Remove event listeners
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('orientationchange', handleOrientationChange);
    
    // Clear intervals
    clearInterval(dashboardState.updateInterval);
}

// Add cleanup on page unload
window.addEventListener('beforeunload', cleanup);

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + M to toggle sidebar
    if ((e.ctrlKey || e.metaKey) && e.key === 'm') {
        e.preventDefault();
        toggleSidebar();
    }
    
    // Escape to close mobile menu
    if (e.key === 'Escape' && dashboardState.mobileMenuOpen) {
        toggleMobileMenu();
    }
    
    // Alt + number keys for quick navigation
    if (e.altKey && e.key >= '1' && e.key <= '7') {
        e.preventDefault();
        const sections = ['dashboard', 'products', 'orders', 'customers', 'categories', 'analytics', 'settings'];
        const index = parseInt(e.key) - 1;
        if (sections[index]) {
            showSection(sections[index]);
        }
    }
});

// Add refresh functionality
function refreshDashboard() {
    cleanup();
    
    setTimeout(() => {
        initializeDashboard();
        showNotification('Dashboard atualizado!', 'success');
    }, 100);
}

// Initialize performance monitoring
monitorPerformance();

// Export functions for potential external use
window.dashboardAPI = {
    showSection,
    showNotification,
    toggleSidebar,
    loadSectionData,
    refreshDashboard,
    cleanup
};

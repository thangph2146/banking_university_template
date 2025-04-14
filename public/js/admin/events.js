document.addEventListener('DOMContentLoaded', function() {
    // Initialize date range picker
    const dateInput = document.getElementById('filter-date');
    if (dateInput) {
        $(dateInput).daterangepicker({
            autoUpdateInput: false, // Don't auto-update the input value
            opens: 'left', // Open the picker to the left
            locale: {
                format: 'DD/MM/YYYY',
                separator: ' - ',
                applyLabel: 'Áp dụng',
                cancelLabel: 'Hủy',
                fromLabel: 'Từ',
                toLabel: 'Đến',
                customRangeLabel: 'Tùy chỉnh',
                weekLabel: 'T',
                daysOfWeek: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
                monthNames: [
                    'Tháng 1',
                    'Tháng 2',
                    'Tháng 3',
                    'Tháng 4',
                    'Tháng 5',
                    'Tháng 6',
                    'Tháng 7',
                    'Tháng 8',
                    'Tháng 9',
                    'Tháng 10',
                    'Tháng 11',
                    'Tháng 12'
                ],
                firstDay: 1 // Monday
            },
            ranges: {
               'Hôm nay': [moment(), moment()],
               'Hôm qua': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
               '7 ngày qua': [moment().subtract(6, 'days'), moment()],
               '30 ngày qua': [moment().subtract(29, 'days'), moment()],
               'Tháng này': [moment().startOf('month'), moment().endOf('month')],
               'Tháng trước': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            },
            alwaysShowCalendars: true, // Show two calendars
        });

        // Event handler for applying the date range
        $(dateInput).on('apply.daterangepicker', function(ev, picker) {
            $(this).val(picker.startDate.format('DD/MM/YYYY') + ' - ' + picker.endDate.format('DD/MM/YYYY'));
            // Add logic here to trigger filtering based on the selected date range
            console.log('Date range selected:', $(this).val()); 
            applyFilters(); // Apply filters when date is selected
        });

        // Event handler for canceling/clearing the date range
        $(dateInput).on('cancel.daterangepicker', function(ev, picker) {
            $(this).val('');
             // Add logic here to clear date filter and reload data
            console.log('Date range cleared');
            applyFilters(); // Apply filters when date is cleared
        });
    }

    // --- Mobile Sidebar Toggle --- 
    const sidebar = document.getElementById('sidebar');
    const sidebarOpenBtn = document.getElementById('sidebar-open');
    const sidebarCloseBtn = document.getElementById('sidebar-close');
    const sidebarBackdrop = document.getElementById('sidebar-backdrop');

    function openSidebar() {
        if (sidebar && sidebarBackdrop) {
            sidebar.classList.remove('-translate-x-full');
            sidebarBackdrop.classList.remove('hidden');
            sidebarBackdrop.classList.add('opacity-100'); // Ensure opacity transition starts correctly
        }
    }

    function closeSidebar() {
        if (sidebar && sidebarBackdrop) {
            sidebar.classList.add('-translate-x-full');
            sidebarBackdrop.classList.add('hidden');
            sidebarBackdrop.classList.remove('opacity-100');
        }
    }

    if (sidebarOpenBtn) {
        sidebarOpenBtn.addEventListener('click', openSidebar);
    }

    if (sidebarCloseBtn) {
        sidebarCloseBtn.addEventListener('click', closeSidebar);
    }

    if (sidebarBackdrop) {
        sidebarBackdrop.addEventListener('click', closeSidebar);
    }
    // --- End Mobile Sidebar Toggle --- 

    // --- Add other event listeners and functions for events page below --- 

    // Example: Handle filter form submission
    const filterForm = document.getElementById('filter-form');
    if (filterForm) {
        filterForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent default form submission
            applyFilters();
        });
    }

    // Example: Handle filter reset
    const resetFilterBtn = document.getElementById('reset-filter-btn');
    if (resetFilterBtn) {
        resetFilterBtn.addEventListener('click', function() {
             // Clear date picker input specifically
            $(dateInput).val(''); 
            // Optionally trigger cancel event to reset picker state if needed
            // $(dateInput).trigger('cancel.daterangepicker');
            
            // Reset other form fields
            filterForm.reset(); 
            
            // Reload data or apply default filters
            console.log('Filters reset');
            applyFilters(); // Re-apply empty filters
        });
    }
    
    // Placeholder function to apply filters (you'll need to implement the actual logic)
    function applyFilters() {
        const nameFilter = document.getElementById('filter-name').value;
        const typeFilter = document.getElementById('filter-type').value;
        const statusFilter = document.getElementById('filter-status').value;
        const dateFilter = document.getElementById('filter-date').value; // Value is 'DD/MM/YYYY - DD/MM/YYYY' or empty
        
        console.log('Applying filters:', {
            name: nameFilter,
            type: typeFilter,
            status: statusFilter,
            dateRange: dateFilter
        });

        // TODO: Add your AJAX call or logic here to fetch and display filtered events
        // based on the filter values.
        // Remember to handle the dateFilter string (split it into start/end dates if needed).
    }

});

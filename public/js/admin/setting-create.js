/**
 * Module quản lý tạo mới cài đặt hệ thống
 * 
 * Sử dụng phong cách lập trình hàm (functional programming)
 */
(function() {
    'use strict';
// Dữ liệu mẫu dựa trên cấu trúc bảng settings trong hanet.sql
const settingsMockData = [
    {
      "id": 1,
      "class": "Config\\App",
      "key": "GOOGLE_CLIENT_ID",
      "value": "YOUR_GOOGLE_CLIENT_ID_PLACEHOLDER",
      "type": "string",
      "context": null,
      "status": 1,
      "created_at": "2024-03-11 11:01:10",
      "updated_at": "2024-03-11 11:01:10",
      "deleted_at": null
    },
    {
      "id": 2,
      "class": "Config\\App",
      "key": "GOOGLE_CLIENT_SECRET",
      "value": "YOUR_GOOGLE_CLIENT_SECRET_PLACEHOLDER",
      "type": "string",
      "context": null,
      "status": 1,
      "created_at": "2024-03-11 11:01:23",
      "updated_at": "2024-03-11 11:01:23",
      "deleted_at": null
    },
    {
      "id": 3,
      "class": "Config\\App",
      "key": "GOOGLE_REDIRECT_URI",
      "value": "YOUR_GOOGLE_REDIRECT_URI_PLACEHOLDER",
      "type": "string",
      "context": null,
      "status": 1,
      "created_at": "2024-03-11 11:01:33",
      "updated_at": "2024-03-11 11:01:33",
      "deleted_at": null
    },
    {
      "id": 4,
      "class": "Config\\App",
      "key": "resetPassWord",
      "value": "123456",
      "type": "string",
      "context": null,
      "status": 1,
      "created_at": "2024-03-12 08:32:41",
      "updated_at": "2024-03-12 08:34:31",
      "deleted_at": null
    },
    {
      "id": 5,
      "class": "Config\\App",
      "key": "classTable",
      "value": "table_id",
      "type": "string",
      "context": null,
      "status": 1,
      "created_at": "2024-03-12 11:11:09",
      "updated_at": "2024-03-12 11:14:15",
      "deleted_at": null
    },
    {
      "id": 6,
      "class": "Config\\App",
      "key": "table_id",
      "value": "example2_wrapper",
      "type": "string",
      "context": null,
      "status": 1,
      "created_at": "2024-03-12 11:14:46",
      "updated_at": "2024-03-12 11:14:46",
      "deleted_at": null
    },
    {
      "id": 7,
      "class": "Config\\Email",
      "key": "fromEmail",
      "value": "noreply@buh.edu.vn",
      "type": "string",
      "context": null,
      "status": 1,
      "created_at": "2024-03-13 09:15:20",
      "updated_at": "2024-03-13 09:15:20",
      "deleted_at": null
    },
    {
      "id": 8,
      "class": "Config\\Email",
      "key": "fromName",
      "value": "HUB - Trường Đại học Ngân hàng TP.HCM",
      "type": "string",
      "context": null,
      "status": 1, 
      "created_at": "2024-03-13 09:16:10",
      "updated_at": "2024-03-13 09:16:10",
      "deleted_at": null
    },
    {
      "id": 9,
      "class": "Config\\App",
      "key": "maintenance_mode",
      "value": "false",
      "type": "boolean",
      "context": null,
      "status": 1,
      "created_at": "2024-03-14 10:20:30",
      "updated_at": "2024-03-14 10:20:30",
      "deleted_at": null
    },
    {
      "id": 10,
      "class": "Config\\App",
      "key": "site_name",
      "value": "HUB - Trường Đại học Ngân hàng TP.HCM",
      "type": "string",
      "context": null,
      "status": 1,
      "created_at": "2024-03-14 10:25:00",
      "updated_at": "2024-03-14 10:25:00",
      "deleted_at": null
    },
    {
      "id": 11,
      "class": "Config\\App",
      "key": "site_description",
      "value": "Hệ thống quản lý sự kiện của Trường Đại học Ngân hàng TP.HCM",
      "type": "string",
      "context": null,
      "status": 1,
      "created_at": "2024-03-14 10:26:15",
      "updated_at": "2024-03-14 10:26:15",
      "deleted_at": null
    },
    {
      "id": 12,
      "class": "Config\\Security",
      "key": "min_password_length",
      "value": "8",
      "type": "number",
      "context": null,
      "status": 1,
      "created_at": "2024-03-15 14:30:00",
      "updated_at": "2024-03-15 14:30:00",
      "deleted_at": null
    },
    {
      "id": 13,
      "class": "Config\\Security",
      "key": "password_policy",
      "value": "{\"require_uppercase\":true,\"require_number\":true,\"require_special\":true}",
      "type": "json",
      "context": null,
      "status": 1,
      "created_at": "2024-03-15 14:32:00",
      "updated_at": "2024-03-15 14:32:00",
      "deleted_at": null
    },
    {
      "id": 14,
      "class": "Config\\Event",
      "key": "max_attendees",
      "value": "500",
      "type": "number",
      "context": null,
      "status": 1,
      "created_at": "2024-03-16 09:00:00",
      "updated_at": "2024-03-16 09:00:00",
      "deleted_at": null
    },
    {
      "id": 15,
      "class": "Config\\Event",
      "key": "checkin_window",
      "value": "30",
      "type": "number",
      "context": "Thời gian (phút) cho phép check-in trước khi sự kiện diễn ra",
      "status": 1,
      "created_at": "2024-03-16 09:05:00",
      "updated_at": "2024-03-16 09:05:00",
      "deleted_at": null
    },
    {
      "id": 16,
      "class": "Config\\Media",
      "key": "allowed_file_types",
      "value": "[\"jpg\",\"jpeg\",\"png\",\"pdf\",\"doc\",\"docx\"]",
      "type": "json",
      "context": null,
      "status": 1,
      "created_at": "2024-03-17 11:20:00",
      "updated_at": "2024-03-17 11:20:00",
      "deleted_at": null
    },
    {
      "id": 17,
      "class": "Config\\Media",
      "key": "max_file_size",
      "value": "10485760",
      "type": "number",
      "context": "Kích thước tối đa cho phép tải lên (byte)",
      "status": 1,
      "created_at": "2024-03-17 11:25:00",
      "updated_at": "2024-03-17 11:25:00",
      "deleted_at": null
    },
    {
      "id": 18,
      "class": "Config\\Social",
      "key": "facebook_url",
      "value": "https://facebook.com/buh.edu.vn",
      "type": "string",
      "context": null,
      "status": 1,
      "created_at": "2024-03-18 13:00:00",
      "updated_at": "2024-03-18 13:00:00",
      "deleted_at": null
    },
    {
      "id": 19,
      "class": "Config\\Social",
      "key": "youtube_url",
      "value": "https://youtube.com/buh_edu_vn",
      "type": "string",
      "context": null,
      "status": 1,
      "created_at": "2024-03-18 13:05:00",
      "updated_at": "2024-03-18 13:05:00",
      "deleted_at": null
    },
    {
      "id": 20,
      "class": "Config\\App",
      "key": "debug_mode",
      "value": "false",
      "type": "boolean",
      "context": null,
      "status": 0,
      "created_at": "2024-03-19 09:30:00",
      "updated_at": "2024-03-19 09:30:00",
      "deleted_at": null
    }
  ];
    // Constants
    const API_BASE_URL = '/api/settings'; // TODO: Cập nhật endpoint thực tế
    const AVAILABLE_TYPES = ['string', 'number', 'boolean', 'json', 'array'];
    const AVAILABLE_CLASSES = ['app', 'system', 'mail', 'notification'];

    // Cache DOM Elements
    const $elements = {
        // Form và trường dữ liệu
        form: document.getElementById('create-form'),
        keyField: document.getElementById('key'),
        classField: document.getElementById('class'),
        typeField: document.getElementById('type'),
        valueField: document.getElementById('value'),
        jsonValueContainer: document.getElementById('json-value-container'),
        jsonEditor: null, // Sẽ được khởi tạo sau
        descriptionField: document.getElementById('description'),
        statusField: document.getElementById('status'),
        
        // Các container
        valueStringContainer: document.getElementById('value-string-container'),
        valueNumberContainer: document.getElementById('value-number-container'),
        valueBooleanContainer: document.getElementById('value-boolean-container'),
        valueJsonContainer: document.getElementById('value-json-container'),
        
        // Các trường giá trị theo loại
        valueStringField: document.getElementById('value-string'),
        valueNumberField: document.getElementById('value-number'),
        valueBooleanField: document.getElementById('value-boolean'),
        
        // Các nút tác vụ
        submitButton: document.getElementById('submit-button'),
        cancelButton: document.getElementById('cancel-button'),
        
        // Thông báo
        successAlert: document.getElementById('success-alert'),
        successMessage: document.getElementById('success-message'),
        errorAlert: document.getElementById('error-alert'),
        errorMessage: document.getElementById('error-message'),
        
        // Hiệu ứng tải
        pageLoader: document.getElementById('page-loader'),
        
        // Sidebar và header
        sidebar: document.getElementById('sidebar'),
        sidebarOpen: document.getElementById('sidebar-open'),
        sidebarClose: document.getElementById('sidebar-close'),
        sidebarBackdrop: document.getElementById('sidebar-backdrop'),
        userMenuButton: document.getElementById('user-menu-button'),
        userMenu: document.getElementById('user-menu'),
        headerAvatar: document.getElementById('header-avatar'),
        headerFullname: document.getElementById('header-fullname'),
    };

    // State
    let state = {
        submitting: false
    };

    /**
     * Hiển thị thông báo thành công
     * @param {string} message - Nội dung thông báo
     */
    const showSuccessMessage = (message) => {
        if ($elements.successMessage) {
            $elements.successMessage.textContent = message || 'Thao tác thành công!';
        }
        
        if ($elements.successAlert) {
            $elements.successAlert.classList.remove('hidden');
        }
        
        // Tự động ẩn thông báo sau 5 giây
        setTimeout(() => {
            if ($elements.successAlert) {
                $elements.successAlert.classList.add('hidden');
            }
        }, 5000);
        
        // Cuộn lên đầu trang
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    /**
     * Hiển thị thông báo lỗi
     * @param {string} message - Nội dung thông báo lỗi
     */
    const showErrorMessage = (message) => {
        if ($elements.errorMessage) {
            $elements.errorMessage.textContent = message || 'Đã có lỗi xảy ra khi xử lý dữ liệu.';
        }
        
        if ($elements.errorAlert) {
            $elements.errorAlert.classList.remove('hidden');
        }
        
        // Tự động ẩn thông báo sau 5 giây
        setTimeout(() => {
            if ($elements.errorAlert) {
                $elements.errorAlert.classList.add('hidden');
            }
        }, 5000);
        
        // Cuộn lên đầu trang
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    /**
     * Hiển thị hoặc ẩn loader
     * @param {boolean} show - Trạng thái hiển thị
     */
    const togglePageLoader = (show) => {
        if (!$elements.pageLoader) return;
        
        if (show) {
            $elements.pageLoader.classList.remove('hidden');
        } else {
            $elements.pageLoader.classList.add('hidden');
        }
    };

    /**
     * Khởi tạo JSON Editor
     */
    const setupJsonEditor = () => {
        if (!$elements.jsonValueContainer) return;
        
        // Import thư viện JsonEditor nếu chưa có
        if (typeof JSONEditor === 'undefined') {
            console.error('JSONEditor library not found');
            return;
        }
        
        // Các tùy chọn cho JSON Editor
        const options = {
            mode: 'code',
            modes: ['code', 'tree'],
            onError: function(err) {
                console.error('JSON Editor error:', err);
            },
            onChange: function() {
                // Validate JSON
                try {
                    const json = $elements.jsonEditor.get();
                    console.log('Valid JSON:', json);
                } catch (error) {
                    console.error('Invalid JSON:', error);
                }
            }
        };
        
        // Khởi tạo editor
        $elements.jsonEditor = new JSONEditor($elements.jsonValueContainer, options);
        
        // Đặt giá trị mặc định
        $elements.jsonEditor.set({});
    };

    /**
     * Chuyển đổi hiển thị trường dữ liệu theo loại
     * @param {string} type - Loại dữ liệu
     */
    const switchValueFieldsByType = (type) => {
        // Ẩn tất cả các container
        if ($elements.valueStringContainer) {
            $elements.valueStringContainer.classList.add('hidden');
        }
        
        if ($elements.valueNumberContainer) {
            $elements.valueNumberContainer.classList.add('hidden');
        }
        
        if ($elements.valueBooleanContainer) {
            $elements.valueBooleanContainer.classList.add('hidden');
        }
        
        if ($elements.valueJsonContainer) {
            $elements.valueJsonContainer.classList.add('hidden');
        }
        
        // Hiển thị container tương ứng với loại
        switch (type) {
            case 'string':
                if ($elements.valueStringContainer) {
                    $elements.valueStringContainer.classList.remove('hidden');
                }
                break;
                
            case 'number':
                if ($elements.valueNumberContainer) {
                    $elements.valueNumberContainer.classList.remove('hidden');
                }
                break;
                
            case 'boolean':
                if ($elements.valueBooleanContainer) {
                    $elements.valueBooleanContainer.classList.remove('hidden');
                }
                break;
                
            case 'json':
            case 'array':
                if ($elements.valueJsonContainer) {
                    $elements.valueJsonContainer.classList.remove('hidden');
                }
                break;
        }
    };

    /**
     * Xử lý sự kiện thay đổi loại dữ liệu
     * @param {Event} e - Sự kiện change
     */
    const handleTypeChange = (e) => {
        const type = e.target.value;
        
        // Chuyển đổi hiển thị trường dữ liệu
        switchValueFieldsByType(type);
    };

    /**
     * Lấy giá trị từ trường nhập liệu theo loại
     * @param {string} type - Loại dữ liệu
     * @returns {*} - Giá trị
     */
    const getValueByType = (type) => {
        switch (type) {
            case 'string':
                return $elements.valueStringField ? $elements.valueStringField.value : '';
                
            case 'number':
                return $elements.valueNumberField ? $elements.valueNumberField.value : '';
                
            case 'boolean':
                return $elements.valueBooleanField ? $elements.valueBooleanField.value : 'false';
                
            case 'json':
            case 'array':
                if ($elements.jsonEditor) {
                    try {
                        return JSON.stringify($elements.jsonEditor.get());
                    } catch (error) {
                        console.error('Error getting JSON value:', error);
                        return '{}';
                    }
                }
                return '{}';
                
            default:
                return '';
        }
    };

    /**
     * Validate dữ liệu form
     * @returns {Object} - Kết quả validation
     */
    const validateForm = () => {
        const errors = [];
        
        // Lấy giá trị từ form
        const key = $elements.keyField ? $elements.keyField.value.trim() : '';
        const classValue = $elements.classField ? $elements.classField.value.trim() : '';
        const type = $elements.typeField ? $elements.typeField.value.trim() : '';
        
        // Validate khóa
        if (!key) {
            errors.push('Khóa cài đặt không được để trống');
        } else if (!/^[a-zA-Z0-9_\.]+$/.test(key)) {
            errors.push('Khóa cài đặt chỉ được chứa chữ cái, số, dấu gạch dưới và dấu chấm');
        }
        
        // Validate nhóm
        if (!classValue) {
            errors.push('Nhóm cài đặt không được để trống');
        } else if (!AVAILABLE_CLASSES.includes(classValue)) {
            errors.push('Nhóm cài đặt không hợp lệ');
        }
        
        // Validate loại
        if (!type) {
            errors.push('Loại dữ liệu không được để trống');
        } else if (!AVAILABLE_TYPES.includes(type)) {
            errors.push('Loại dữ liệu không hợp lệ');
        }
        
        // Validate giá trị theo loại
        switch (type) {
            case 'number':
                const numberValue = $elements.valueNumberField ? $elements.valueNumberField.value.trim() : '';
                if (numberValue && isNaN(parseFloat(numberValue))) {
                    errors.push('Giá trị phải là số hợp lệ');
                }
                break;
                
            case 'json':
            case 'array':
                if ($elements.jsonEditor) {
                    try {
                        $elements.jsonEditor.get();
                    } catch (error) {
                        errors.push('Giá trị JSON không hợp lệ');
                    }
                }
                break;
        }
        
        return {
            valid: errors.length === 0,
            errors
        };
    };

    /**
     * Thu thập dữ liệu từ form
     * @returns {Object} - Dữ liệu form
     */
    const collectFormData = () => {
        const type = $elements.typeField ? $elements.typeField.value.trim() : 'string';
        
        return {
            key: $elements.keyField ? $elements.keyField.value.trim() : '',
            class: $elements.classField ? $elements.classField.value.trim() : '',
            type: type,
            value: getValueByType(type),
            description: $elements.descriptionField ? $elements.descriptionField.value.trim() : '',
            status: $elements.statusField ? parseInt($elements.statusField.value) : 1
        };
    };

    /**
     * Kiểm tra xem khóa cài đặt đã tồn tại chưa
     * @param {string} key - Khóa cài đặt
     * @returns {Promise<boolean>} - Kết quả kiểm tra
     */
    const checkKeyExists = async (key) => {
        try {
            // Trong môi trường thực, đây sẽ là API call
            /*
            const response = await fetch(`${API_BASE_URL}/check-key?key=${encodeURIComponent(key)}`);
            
            if (!response.ok) {
                throw new Error('Không thể kiểm tra khóa cài đặt');
            }
            
            const data = await response.json();
            return data.exists;
            */
            
            // Mô phỏng API call với độ trễ
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Mô phỏng dữ liệu
            const mockSettings = [
                'app.name',
                'app.debug',
                'mail.from',
                'notification.channels',
                'system.settings'
            ];
            
            return mockSettings.includes(key);
        } catch (error) {
            console.error('Lỗi khi kiểm tra khóa cài đặt:', error);
            throw error;
        }
    };

    /**
     * Xử lý gửi form
     * @param {Event} e - Sự kiện submit
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            // Validate form
            const validation = validateForm();
            
            if (!validation.valid) {
                showErrorMessage(validation.errors.join('<br>'));
                return;
            }
            
            // Collect data
            const formData = collectFormData();
            
            // Set loading state
            state.submitting = true;
            if ($elements.submitButton) {
                $elements.submitButton.disabled = true;
                $elements.submitButton.innerHTML = '<i class="ri-loader-4-line animate-spin mr-1"></i> Đang xử lý...';
            }
            
            // Kiểm tra khóa cài đặt đã tồn tại chưa
            const keyExists = await checkKeyExists(formData.key);
            
            if (keyExists) {
                showErrorMessage(`Khóa cài đặt "${formData.key}" đã tồn tại`);
                
                // Reset button
                if ($elements.submitButton) {
                    $elements.submitButton.disabled = false;
                    $elements.submitButton.innerHTML = 'Tạo mới';
                }
                
                state.submitting = false;
                return;
            }
            
            // Trong môi trường thực, đây sẽ là API call
            /*
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            if (!response.ok) {
                throw new Error('Không thể tạo cài đặt');
            }
            
            const data = await response.json();
            */
            
            // Mô phỏng API call với độ trễ
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Mô phỏng dữ liệu phản hồi
            const responseData = {
                success: true,
                data: {
                    ...formData,
                    id: Math.floor(Math.random() * 1000) + 10, // Mô phỏng ID được tạo từ server
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }
            };
            
            // Redirect to detail page
            window.location.href = `setting-detail.html?id=${responseData.data.id}&created=true`;
        } catch (error) {
            console.error('Lỗi khi tạo cài đặt:', error);
            showErrorMessage(error.message || 'Không thể tạo cài đặt. Vui lòng thử lại sau.');
            
            // Reset button
            if ($elements.submitButton) {
                $elements.submitButton.disabled = false;
                $elements.submitButton.innerHTML = 'Tạo mới';
            }
        } finally {
            state.submitting = false;
        }
    };

    /**
     * Thiết lập sự kiện cho form
     */
    const setupForm = () => {
        // Sự kiện submit form
        if ($elements.form) {
            $elements.form.addEventListener('submit', handleSubmit);
        }
        
        // Sự kiện thay đổi loại dữ liệu
        if ($elements.typeField) {
            $elements.typeField.addEventListener('change', handleTypeChange);
            
            // Kích hoạt sự kiện để hiển thị trường giá trị ban đầu
            const event = new Event('change');
            $elements.typeField.dispatchEvent(event);
        }
        
        // Nút hủy bỏ
        if ($elements.cancelButton) {
            $elements.cancelButton.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = 'settings.html';
            });
        }
    };

    /**
     * Thiết lập sidebar
     */
    const setupSidebar = () => {
        const { sidebar, sidebarOpen, sidebarClose, sidebarBackdrop } = $elements;
        if (!sidebar || !sidebarOpen || !sidebarClose || !sidebarBackdrop) return;

        sidebarOpen.addEventListener('click', () => {
            sidebar.classList.replace('-translate-x-full', 'translate-x-0');
            sidebarBackdrop.classList.remove('hidden');
            setTimeout(() => {
                sidebarBackdrop.classList.replace('opacity-0', 'opacity-100');
            }, 50);
        });

        const closeSidebar = () => {
            sidebar.classList.replace('translate-x-0', '-translate-x-full');
            sidebarBackdrop.classList.replace('opacity-100', 'opacity-0');
            setTimeout(() => {
                sidebarBackdrop.classList.add('hidden');
            }, 300);
        };

        sidebarClose.addEventListener('click', closeSidebar);
        sidebarBackdrop.addEventListener('click', closeSidebar);
    };

    /**
     * Thiết lập menu người dùng
     */
    const setupUserMenu = () => {
        const { userMenuButton, userMenu, headerAvatar, headerFullname } = $elements;

        // TODO: Thay thế bằng dữ liệu người dùng thực tế từ API hoặc session
        const currentUser = {
            FullName: 'Nguyễn Văn A',
            Avatar: 'https://ui-avatars.com/api/?name=N+V+A&background=0D8ABC&color=fff'
        };

        if (headerAvatar) {
            headerAvatar.src = currentUser.Avatar;
            headerAvatar.alt = currentUser.FullName;
        }
        
        if (headerFullname) {
            headerFullname.textContent = currentUser.FullName;
        }

        if (userMenuButton && userMenu) {
            userMenuButton.addEventListener('click', (e) => {
                e.stopPropagation();
                userMenu.classList.toggle('hidden');
            });
            
            // Đóng menu người dùng khi click ra ngoài
            document.addEventListener('click', (e) => {
                if (!userMenuButton.contains(e.target) && !userMenu.contains(e.target)) {
                    userMenu.classList.add('hidden');
                }
            });
        }
    };

    /**
     * Khởi tạo module
     */
    const init = () => {
        // Khởi tạo UI cơ bản
        setupSidebar();
        setupUserMenu();
        setupForm();
        
        // Khởi tạo JSON Editor
        setupJsonEditor();
    };

    // Khởi tạo module khi DOM đã sẵn sàng
    document.addEventListener('DOMContentLoaded', init);
})(); 
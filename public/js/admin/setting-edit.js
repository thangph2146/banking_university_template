/**
 * Module quản lý trang chỉnh sửa cài đặt hệ thống
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
        // Form chỉnh sửa
        editForm: document.getElementById('edit-form'),
        idInput: document.getElementById('setting-id'),
        keyDisplay: document.getElementById('setting-key-display'),
        keyInput: document.getElementById('setting-key'),
        classSelect: document.getElementById('setting-class'),
        typeDisplay: document.getElementById('setting-type-display'),
        valueInput: document.getElementById('setting-value'),
        valueJsonEditor: document.getElementById('setting-value-json'),
        valueBooleanSelect: document.getElementById('setting-value-boolean'),
        descriptionInput: document.getElementById('setting-description'),
        statusSelect: document.getElementById('setting-status'),
        submitButton: document.getElementById('submit-button'),
        cancelButton: document.getElementById('cancel-button'),
        
        // Container của các loại input khác nhau
        stringValueContainer: document.getElementById('string-value-container'),
        numberValueContainer: document.getElementById('number-value-container'),
        booleanValueContainer: document.getElementById('boolean-value-container'),
        jsonValueContainer: document.getElementById('json-value-container'),
        
        // Thông báo
        successAlert: document.getElementById('success-alert'),
        errorAlert: document.getElementById('error-alert'),
        errorMessage: document.getElementById('error-message'),
        loadingIndicator: document.getElementById('loading-indicator'),
        pageLoadingIndicator: document.getElementById('page-loading-indicator'),
        
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

    // JSON Editor instance
    let jsonEditor = null;
    let originalSettingData = null;

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
        
        if ($elements.loadingIndicator) {
            $elements.loadingIndicator.classList.add('hidden');
        }
        
        // Tự động ẩn thông báo sau 5 giây
        setTimeout(() => {
            if ($elements.errorAlert) {
                $elements.errorAlert.classList.add('hidden');
            }
        }, 5000);
    };

    /**
     * Hiển thị thông báo thành công
     */
    const showSuccessMessage = () => {
        if ($elements.successAlert) {
            $elements.successAlert.classList.remove('hidden');
        }
        
        if ($elements.loadingIndicator) {
            $elements.loadingIndicator.classList.add('hidden');
        }
        
        // Tự động ẩn thông báo sau 5 giây
        setTimeout(() => {
            if ($elements.successAlert) {
                $elements.successAlert.classList.add('hidden');
            }
        }, 5000);
    };

    /**
     * Lấy tham số từ URL
     * @returns {Object} - Các tham số từ URL
     */
    const getUrlParams = () => {
        const params = {};
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        
        for (const [key, value] of urlParams.entries()) {
            params[key] = value;
        }
        
        return params;
    };

    /**
     * Thiết lập JSON Editor
     */
    const setupJsonEditor = () => {
        const container = $elements.valueJsonEditor;
        if (!container) return;
        
        const options = {
            mode: 'tree',
            modes: ['code', 'form', 'text', 'tree', 'view'],
            onChangeJSON: function() {
                // Kiểm tra khi giá trị JSON thay đổi
                validateForm();
            }
        };
        
        jsonEditor = new JSONEditor(container, options, {});
    };

    /**
     * Hiển thị input tương ứng với loại dữ liệu đã chọn
     * @param {string} type - Loại dữ liệu (string, number, boolean, json, array)
     */
    const showValueInputByType = (type) => {
        // Ẩn tất cả các container trước
        const valueContainers = [
            $elements.stringValueContainer,
            $elements.numberValueContainer,
            $elements.booleanValueContainer,
            $elements.jsonValueContainer
        ];
        
        valueContainers.forEach(container => {
            if (container) container.classList.add('hidden');
        });
        
        // Hiển thị container tương ứng
        switch (type) {
            case 'string':
                if ($elements.stringValueContainer) {
                    $elements.stringValueContainer.classList.remove('hidden');
                }
                break;
            case 'number':
                if ($elements.numberValueContainer) {
                    $elements.numberValueContainer.classList.remove('hidden');
                }
                break;
            case 'boolean':
                if ($elements.booleanValueContainer) {
                    $elements.booleanValueContainer.classList.remove('hidden');
                }
                break;
            case 'json':
            case 'array':
                if ($elements.jsonValueContainer) {
                    $elements.jsonValueContainer.classList.remove('hidden');
                    
                    // Khởi tạo JSON editor nếu chưa được khởi tạo
                    if (!jsonEditor && typeof JSONEditor !== 'undefined') {
                        setupJsonEditor();
                    } else if (jsonEditor) {
                        // Focus vào editor
                        setTimeout(() => jsonEditor.focus(), 100);
                    }
                }
                break;
        }
    };

    /**
     * Kiểm tra tính hợp lệ của form
     * @returns {boolean} - Form có hợp lệ hay không
     */
    const validateForm = () => {
        const keyInput = $elements.keyInput;
        const typeDisplay = $elements.typeDisplay;
        
        // Kiểm tra các trường bắt buộc
        if (!keyInput || !keyInput.value.trim()) {
            return false;
        }
        
        // Kiểm tra định dạng khóa (chỉ chấp nhận chữ cái, số, dấu chấm và gạch dưới)
        const keyRegex = /^[a-zA-Z0-9_.]+$/;
        if (!keyRegex.test(keyInput.value.trim())) {
            return false;
        }
        
        // Kiểm tra trường giá trị theo từng loại
        if (typeDisplay) {
            const type = typeDisplay.dataset.type;
            
            switch (type) {
                case 'string':
                    // Giá trị chuỗi không cần kiểm tra đặc biệt
                    break;
                case 'number':
                    const numberInput = document.getElementById('setting-value-number');
                    if (numberInput && isNaN(parseFloat(numberInput.value))) {
                        return false;
                    }
                    break;
                case 'boolean':
                    // Giá trị boolean luôn hợp lệ vì dùng select
                    break;
                case 'json':
                case 'array':
                    if (jsonEditor) {
                        try {
                            // Kiểm tra JSON hợp lệ
                            const jsonValue = jsonEditor.get();
                            JSON.stringify(jsonValue);
                            
                            // Kiểm tra thêm cho array
                            if (type === 'array' && !Array.isArray(jsonValue)) {
                                return false;
                            }
                        } catch (e) {
                            return false;
                        }
                    }
                    break;
            }
        }
        
        return true;
    };

    /**
     * Lấy giá trị từ form theo loại dữ liệu
     * @param {string} type - Loại dữ liệu
     * @returns {string} - Giá trị đã chuyển đổi sang chuỗi
     */
    const getValueByType = (type) => {
        switch (type) {
            case 'string':
                return $elements.valueInput ? $elements.valueInput.value : '';
                
            case 'number':
                const numberInput = document.getElementById('setting-value-number');
                return numberInput ? numberInput.value : '';
                
            case 'boolean':
                return $elements.valueBooleanSelect ? $elements.valueBooleanSelect.value : 'false';
                
            case 'json':
            case 'array':
                if (jsonEditor) {
                    try {
                        const jsonValue = jsonEditor.get();
                        return JSON.stringify(jsonValue);
                    } catch (e) {
                        console.error('Lỗi khi lấy giá trị JSON:', e);
                        return '';
                    }
                }
                return '';
                
            default:
                return '';
        }
    };

    /**
     * Thiết lập giá trị cho form theo loại dữ liệu
     * @param {Object} setting - Dữ liệu cài đặt
     */
    const setValueByType = (setting) => {
        const type = setting.type;
        const value = setting.value;
        
        // Hiển thị input tương ứng với loại dữ liệu
        showValueInputByType(type);
        
        // Thiết lập giá trị
        switch (type) {
            case 'string':
                if ($elements.valueInput) {
                    $elements.valueInput.value = value || '';
                }
                break;
                
            case 'number':
                const numberInput = document.getElementById('setting-value-number');
                if (numberInput) {
                    numberInput.value = value || '';
                }
                break;
                
            case 'boolean':
                if ($elements.valueBooleanSelect) {
                    $elements.valueBooleanSelect.value = value && value.toLowerCase() === 'true' ? 'true' : 'false';
                }
                break;
                
            case 'json':
            case 'array':
                if (!jsonEditor && typeof JSONEditor !== 'undefined') {
                    setupJsonEditor();
                }
                
                if (jsonEditor) {
                    try {
                        let jsonValue = value ? JSON.parse(value) : (type === 'array' ? [] : {});
                        jsonEditor.set(jsonValue);
                    } catch (e) {
                        console.error('Lỗi khi đặt giá trị JSON:', e);
                        jsonEditor.set(type === 'array' ? [] : {});
                    }
                }
                break;
        }
    };

    /**
     * Tải dữ liệu cài đặt từ API
     * @param {number} id - ID của cài đặt
     * @returns {Promise<Object>} - Dữ liệu cài đặt
     */
    const loadSettingData = async (id) => {
        try {
            if ($elements.pageLoadingIndicator) {
                $elements.pageLoadingIndicator.classList.remove('hidden');
            }
            
            // Mô phỏng việc gọi API với độ trễ
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Trong môi trường thực, đây sẽ là API call
            /*
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                }
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Không thể tải dữ liệu cài đặt');
            }
            
            const result = await response.json();
            return result.data;
            */
            
            // Mô phỏng dữ liệu
            const mockData = {
                id: parseInt(id),
                key: 'app.name',
                class: 'app',
                type: 'string',
                value: 'Hệ thống quản lý ABC',
                description: 'Tên của ứng dụng',
                status: 1,
                created_at: '2023-05-15T10:30:00Z',
                updated_at: '2023-05-15T10:30:00Z'
            };
            
            // Dữ liệu mẫu khác nhau dựa trên ID
            const mockDataVariants = {
                1: {
                    id: 1,
                    key: 'app.name',
                    class: 'app',
                    type: 'string',
                    value: 'Hệ thống quản lý ABC',
                    description: 'Tên của ứng dụng',
                    status: 1
                },
                2: {
                    id: 2,
                    key: 'app.debug',
                    class: 'system',
                    type: 'boolean',
                    value: 'true',
                    description: 'Chế độ debug',
                    status: 1
                },
                3: {
                    id: 3,
                    key: 'mail.from',
                    class: 'mail',
                    type: 'string',
                    value: 'system@example.com',
                    description: 'Địa chỉ email gửi',
                    status: 1
                },
                4: {
                    id: 4,
                    key: 'notification.channels',
                    class: 'notification',
                    type: 'array',
                    value: '["email", "sms", "push"]',
                    description: 'Các kênh thông báo',
                    status: 1
                },
                5: {
                    id: 5,
                    key: 'system.settings',
                    class: 'system',
                    type: 'json',
                    value: '{"timezone": "Asia/Ho_Chi_Minh", "currency": "VND", "date_format": "d/m/Y"}',
                    description: 'Cài đặt hệ thống',
                    status: 0
                }
            };
            
            // Chọn dữ liệu dựa vào ID
            const data = mockDataVariants[id] || mockData;
            
            // Thêm created_at và updated_at nếu chưa có
            if (!data.created_at) {
                data.created_at = '2023-05-15T10:30:00Z';
            }
            
            if (!data.updated_at) {
                data.updated_at = '2023-05-15T10:30:00Z';
            }
            
            return data;
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu cài đặt:', error);
            throw error;
        } finally {
            if ($elements.pageLoadingIndicator) {
                $elements.pageLoadingIndicator.classList.add('hidden');
            }
        }
    };

    /**
     * Hiển thị dữ liệu cài đặt lên form
     * @param {Object} setting - Dữ liệu cài đặt
     */
    const displaySettingData = (setting) => {
        // Lưu dữ liệu gốc để so sánh khi submit
        originalSettingData = {...setting};
        
        // Thiết lập giá trị cho các trường
        if ($elements.idInput) {
            $elements.idInput.value = setting.id;
        }
        
        if ($elements.keyInput) {
            $elements.keyInput.value = setting.key;
        }
        
        if ($elements.keyDisplay) {
            $elements.keyDisplay.textContent = setting.key;
        }
        
        if ($elements.classSelect) {
            $elements.classSelect.value = setting.class;
        }
        
        if ($elements.typeDisplay) {
            $elements.typeDisplay.textContent = setting.type.charAt(0).toUpperCase() + setting.type.slice(1);
            $elements.typeDisplay.dataset.type = setting.type;
        }
        
        if ($elements.descriptionInput) {
            $elements.descriptionInput.value = setting.description || '';
        }
        
        if ($elements.statusSelect) {
            $elements.statusSelect.value = setting.status.toString();
        }
        
        // Thiết lập giá trị cho input tương ứng với loại dữ liệu
        setValueByType(setting);
    };

    /**
     * Xử lý submit form
     * @param {Event} e - Event submit
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Kiểm tra form hợp lệ
        if (!validateForm()) {
            showErrorMessage('Vui lòng kiểm tra lại các trường thông tin.');
            return;
        }
        
        // Hiển thị loading
        if ($elements.loadingIndicator) {
            $elements.loadingIndicator.classList.remove('hidden');
        }
        
        try {
            const id = $elements.idInput ? $elements.idInput.value : '';
            const key = $elements.keyInput ? $elements.keyInput.value.trim() : '';
            const className = $elements.classSelect ? $elements.classSelect.value : 'system';
            const type = $elements.typeDisplay ? $elements.typeDisplay.dataset.type : 'string';
            const description = $elements.descriptionInput ? $elements.descriptionInput.value : '';
            const status = $elements.statusSelect ? parseInt($elements.statusSelect.value, 10) : 1;
            
            // Lấy giá trị theo loại
            const value = getValueByType(type);
            
            // Dữ liệu gửi lên API
            const settingData = {
                id,
                key,
                class: className,
                type,
                value,
                description,
                status
            };
            
            // Mô phỏng việc gọi API với độ trễ
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Trong môi trường thực, đây sẽ là API call
            /*
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                },
                body: JSON.stringify(settingData)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Không thể cập nhật cài đặt');
            }
            */
            
            // Hiển thị thông báo thành công
            showSuccessMessage();
            
            // Cập nhật dữ liệu gốc để so sánh tiếp
            originalSettingData = {...settingData};
            
            // Chuyển hướng về trang chi tiết sau 2 giây
            setTimeout(() => {
                window.location.href = `setting-detail.html?id=${id}`;
            }, 2000);
        } catch (error) {
            console.error('Lỗi khi cập nhật cài đặt:', error);
            showErrorMessage(error.message);
        } finally {
            // Ẩn loading
            if ($elements.loadingIndicator) {
                $elements.loadingIndicator.classList.add('hidden');
            }
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
     * Thiết lập sự kiện cho form
     */
    const setupForm = () => {
        // Sự kiện submit form
        if ($elements.editForm) {
            $elements.editForm.addEventListener('submit', handleSubmit);
        }
        
        // Sự kiện hủy
        if ($elements.cancelButton) {
            $elements.cancelButton.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = `setting-detail.html?id=${$elements.idInput.value}`;
            });
        }
    };

    /**
     * Tải và hiển thị dữ liệu cài đặt
     */
    const initSettingData = async () => {
        try {
            // Lấy ID từ URL
            const params = getUrlParams();
            const id = params.id;
            
            if (!id) {
                throw new Error('ID cài đặt không hợp lệ');
            }
            
            // Tải dữ liệu
            const setting = await loadSettingData(id);
            
            // Hiển thị dữ liệu lên form
            displaySettingData(setting);
        } catch (error) {
            console.error('Lỗi khi khởi tạo dữ liệu:', error);
            showErrorMessage('Không thể tải dữ liệu cài đặt. Vui lòng thử lại sau.');
        }
    };

    /**
     * Khởi tạo module
     */
    const init = async () => {
        // Khởi tạo UI cơ bản
        setupSidebar();
        setupUserMenu();
        setupForm();
        AOS.init();
        
        // Tải dữ liệu cài đặt
        await initSettingData();
    };

    // Khởi tạo module khi DOM đã sẵn sàng
    document.addEventListener('DOMContentLoaded', init);
})(); 
// Initialize AOS
AOS.init();

// Handle sidebar toggle
const sidebarToggle = document.getElementById('sidebar-toggle');
const sidebar = document.getElementById('sidebar');

sidebarToggle.addEventListener('click', () => {
  sidebar.classList.toggle('-translate-x-full');
});

// Handle user menu toggle
const userMenuButton = document.getElementById('user-menu-button');
const userMenu = document.getElementById('user-menu');

userMenuButton.addEventListener('click', () => {
  userMenu.classList.toggle('hidden');
});

// Close user menu when clicking outside
document.addEventListener('click', (e) => {
  if (!userMenuButton.contains(e.target) && !userMenu.contains(e.target)) {
    userMenu.classList.add('hidden');
  }
});

// Handle category modal
const categoryModal = document.getElementById('category-modal');
const createCategoryBtn = document.getElementById('create-category-btn');
const categoryForm = document.getElementById('category-form');
const modalTitle = document.getElementById('modal-title');

function openCategoryModal(mode = 'create', category = null) {
  categoryModal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  
  if (mode === 'edit' && category) {
    modalTitle.textContent = 'Chỉnh sửa danh mục';
    document.getElementById('category-id').value = category.id;
    document.getElementById('category-name').value = category.name;
    document.getElementById('category-description').value = category.description;
    document.querySelector(`input[name="status"][value="${category.status}"]`).checked = true;
  } else {
    modalTitle.textContent = 'Thêm danh mục mới';
    categoryForm.reset();
  }
}

function closeCategoryModal() {
  categoryModal.classList.add('hidden');
  document.body.style.overflow = 'auto';
  categoryForm.reset();
}

createCategoryBtn.addEventListener('click', () => openCategoryModal());

// Close modal when clicking outside
categoryModal.addEventListener('click', (e) => {
  if (e.target === categoryModal) {
    closeCategoryModal();
  }
});

// Handle form submission
categoryForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  try {
    const formData = new FormData(categoryForm);
    const data = Object.fromEntries(formData);
    const categoryId = data.id;
    const isEdit = !!categoryId;
    
    // TODO: Send data to server
    console.log('Form data:', data);
    
    // Show success message
    alert(isEdit ? 'Cập nhật danh mục thành công!' : 'Thêm danh mục thành công!');
    closeCategoryModal();
    
    // Reload categories list
    loadCategories();
    
  } catch (error) {
    console.error('Error submitting form:', error);
    alert('Có lỗi xảy ra. Vui lòng thử lại!');
  }
});

// Load categories from server
async function loadCategories(page = 1, filters = {}) {
  try {
    // TODO: Fetch categories from server
    const categories = [
      {
        id: 1,
        name: 'Hội thảo',
        description: 'Các sự kiện hội thảo chuyên môn',
        event_count: 5,
        status: 'active'
      },
      {
        id: 2,
        name: 'Workshop',
        description: 'Các buổi thực hành, đào tạo kỹ năng',
        event_count: 3,
        status: 'active'
      },
      {
        id: 3,
        name: 'Talkshow',
        description: 'Các buổi giao lưu, chia sẻ kinh nghiệm',
        event_count: 2,
        status: 'inactive'
      }
    ];
    
    renderCategories(categories);
    
  } catch (error) {
    console.error('Error loading categories:', error);
    alert('Có lỗi xảy ra khi tải danh sách danh mục');
  }
}

// Render categories to table
function renderCategories(categories) {
  const tbody = document.querySelector('#categories-table-body');
  tbody.innerHTML = categories.map(category => `
    <tr>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm font-medium text-gray-900">${category.name}</div>
      </td>
      <td class="px-6 py-4">
        <div class="text-sm text-gray-500">${category.description || '-'}</div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm text-gray-900">${category.event_count}</div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(category.status)}">
          ${getStatusText(category.status)}
        </span>
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div class="flex space-x-2">
          <button class="text-blue-600 hover:text-blue-800" title="Chỉnh sửa" onclick='editCategory(${JSON.stringify(category)})'>
            <i class="ri-edit-line"></i>
          </button>
          <button class="text-red-600 hover:text-red-800" title="Xóa" onclick="deleteCategory(${category.id})">
            <i class="ri-delete-bin-line"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

// Helper functions for status display
function getStatusClass(status) {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'inactive':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

function getStatusText(status) {
  switch (status) {
    case 'active':
      return 'Hoạt động';
    case 'inactive':
      return 'Không hoạt động';
    default:
      return 'Không xác định';
  }
}

// Category actions
function editCategory(category) {
  openCategoryModal('edit', category);
}

async function deleteCategory(id) {
  if (confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
    try {
      // TODO: Send delete request to server
      console.log('Delete category:', id);
      
      // Reload categories list
      loadCategories();
      
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Có lỗi xảy ra khi xóa danh mục');
    }
  }
}

// Handle filters
const searchInput = document.getElementById('search-input');
const statusFilter = document.getElementById('status-filter');

function handleFilters() {
  const filters = {
    search: searchInput.value,
    status: statusFilter.value
  };
  
  loadCategories(1, filters);
}

searchInput.addEventListener('input', handleFilters);
statusFilter.addEventListener('change', handleFilters);

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
  loadCategories();
}); 
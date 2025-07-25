// Admin Users Management JavaScript

document.addEventListener("DOMContentLoaded", () => {
  initializeUsersManagement()
  initializeSearch()
  initializeFilters()
  initializeBulkActions()
  initializeModal()
})

let currentUsers = []
let selectedUsers = []

// Initialize Users Management
function initializeUsersManagement() {
  loadUsers()
  setupEventListeners()
}

// Load Users Data
async function loadUsers() {
  try {
    showLoading()
    const response = await fetch("/api/users")
    const users = await response.json()
    currentUsers = users
    renderUsersTable(users)
    hideLoading()
  } catch (error) {
    console.error("Error loading users:", error)
    showError("Failed to load users")
    hideLoading()
  }
}

// Render Users Table
function renderUsersTable(users) {
  const tbody = document.getElementById("usersTableBody")
  if (!tbody) return

  tbody.innerHTML = users
    .map(
      (user) => `
        <tr data-user-id="${user.id}">
            <td>
                <input type="checkbox" class="user-checkbox" value="${user.id}" 
                       onchange="handleUserSelection(${user.id}, this.checked)">
            </td>
            <td>#${String(user.id).padStart(3, "0")}</td>
            <td>
                <img src="/static/images/clipart/users-management.png" alt="User" class="user-avatar">
            </td>
            <td>${escapeHtml(user.username)}</td>
            <td>${escapeHtml(user.email)}</td>
            <td>
                <span class="badge badge-${user.role}">${capitalizeFirst(user.role)}</span>
            </td>
            <td>
                <span class="badge badge-${user.status}">${capitalizeFirst(user.status)}</span>
            </td>
            <td>${user.booking_count || 0}</td>
            <td>${formatDateTime(user.last_login) || "Never"}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon btn-edit" onclick="editUser(${user.id})" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon btn-view" onclick="viewUser(${user.id})" title="View">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-icon btn-delete" onclick="deleteUser(${user.id})" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `,
    )
    .join("")

  updatePaginationInfo(users.length)
}

// Initialize Search
function initializeSearch() {
  const searchInput = document.getElementById("userSearch")
  if (!searchInput) return

  let searchTimeout
  searchInput.addEventListener("input", () => {
    clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
      filterUsers()
    }, 300)
  })
}

// Initialize Filters
function initializeFilters() {
  const roleFilter = document.getElementById("roleFilter")
  const statusFilter = document.getElementById("statusFilter")

  if (roleFilter) {
    roleFilter.addEventListener("change", filterUsers)
  }

  if (statusFilter) {
    statusFilter.addEventListener("change", filterUsers)
  }
}

// Filter Users
function filterUsers() {
  const searchTerm = document.getElementById("userSearch")?.value.toLowerCase() || ""
  const roleFilter = document.getElementById("roleFilter")?.value || ""
  const statusFilter = document.getElementById("statusFilter")?.value || ""

  const filteredUsers = currentUsers.filter((user) => {
    const matchesSearch =
      !searchTerm ||
      user.username.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm) ||
      String(user.id).includes(searchTerm)

    const matchesRole = !roleFilter || user.role === roleFilter
    const matchesStatus = !statusFilter || user.status === statusFilter

    return matchesSearch && matchesRole && matchesStatus
  })

  renderUsersTable(filteredUsers)
}

// Initialize Bulk Actions
function initializeBulkActions() {
  const selectAllCheckbox = document.getElementById("selectAll")
  if (selectAllCheckbox) {
    selectAllCheckbox.addEventListener("change", function () {
      toggleSelectAll(this.checked)
    })
  }
}

// Handle User Selection
function handleUserSelection(userId, isSelected) {
  if (isSelected) {
    if (!selectedUsers.includes(userId)) {
      selectedUsers.push(userId)
    }
  } else {
    selectedUsers = selectedUsers.filter((id) => id !== userId)
  }

  updateBulkActionsVisibility()
  updateSelectAllState()
}

// Toggle Select All
function toggleSelectAll(selectAll) {
  const checkboxes = document.querySelectorAll(".user-checkbox")
  selectedUsers = []

  checkboxes.forEach((checkbox) => {
    checkbox.checked = selectAll
    if (selectAll) {
      selectedUsers.push(Number.parseInt(checkbox.value))
    }
  })

  updateBulkActionsVisibility()
}

// Update Select All State
function updateSelectAllState() {
  const selectAllCheckbox = document.getElementById("selectAll")
  const checkboxes = document.querySelectorAll(".user-checkbox")

  if (selectAllCheckbox && checkboxes.length > 0) {
    const checkedCount = selectedUsers.length
    const totalCount = checkboxes.length

    selectAllCheckbox.checked = checkedCount === totalCount
    selectAllCheckbox.indeterminate = checkedCount > 0 && checkedCount < totalCount
  }
}

// Update Bulk Actions Visibility
function updateBulkActionsVisibility() {
  const bulkActions = document.getElementById("bulkActions")
  const selectedCount = document.getElementById("selectedCount")

  if (bulkActions && selectedCount) {
    if (selectedUsers.length > 0) {
      bulkActions.style.display = "flex"
      selectedCount.textContent = selectedUsers.length
    } else {
      bulkActions.style.display = "none"
    }
  }
}

// Bulk Actions
function bulkActivate() {
  if (selectedUsers.length === 0) return

  if (confirm(`Activate ${selectedUsers.length} selected users?`)) {
    bulkUpdateStatus("active")
  }
}

function bulkDeactivate() {
  if (selectedUsers.length === 0) return

  if (confirm(`Deactivate ${selectedUsers.length} selected users?`)) {
    bulkUpdateStatus("inactive")
  }
}

function bulkDelete() {
  if (selectedUsers.length === 0) return

  if (confirm(`Delete ${selectedUsers.length} selected users? This action cannot be undone.`)) {
    bulkDeleteUsers()
  }
}

// Bulk Update Status
async function bulkUpdateStatus(status) {
  try {
    showLoading()

    const promises = selectedUsers.map((userId) =>
      fetch("/api/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: userId,
          status: status,
        }),
      }),
    )

    await Promise.all(promises)

    showSuccess(`Successfully ${status === "active" ? "activated" : "deactivated"} ${selectedUsers.length} users`)
    selectedUsers = []
    updateBulkActionsVisibility()
    loadUsers()
    hideLoading()
  } catch (error) {
    console.error("Error updating users:", error)
    showError("Failed to update users")
    hideLoading()
  }
}

// Bulk Delete Users
async function bulkDeleteUsers() {
  try {
    showLoading()

    const promises = selectedUsers.map((userId) =>
      fetch("/api/users", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: userId }),
      }),
    )

    await Promise.all(promises)

    showSuccess(`Successfully deleted ${selectedUsers.length} users`)
    selectedUsers = []
    updateBulkActionsVisibility()
    loadUsers()
    hideLoading()
  } catch (error) {
    console.error("Error deleting users:", error)
    showError("Failed to delete users")
    hideLoading()
  }
}

// User Actions
function editUser(userId) {
  const user = currentUsers.find((u) => u.id === userId)
  if (!user) return

  openUserModal("Edit User", user)
}

function viewUser(userId) {
  const user = currentUsers.find((u) => u.id === userId)
  if (!user) return

  // Create view-only modal
  const modal = document.getElementById("userModal")
  const modalTitle = document.getElementById("modalTitle")
  const form = document.getElementById("userForm")

  if (modal && modalTitle && form) {
    modalTitle.textContent = "View User Details"

    // Populate form with user data
    document.getElementById("userName").value = user.username
    document.getElementById("userEmail").value = user.email
    document.getElementById("userRole").value = user.role
    document.getElementById("userStatus").value = user.status
    document.getElementById("userPassword").value = ""

    // Make form read-only
    const inputs = form.querySelectorAll("input, select")
    inputs.forEach((input) => (input.disabled = true))

    // Hide save button
    const saveButton = form.querySelector('button[type="submit"]')
    if (saveButton) saveButton.style.display = "none"

    modal.classList.add("show")
  }
}

async function deleteUser(userId) {
  const user = currentUsers.find((u) => u.id === userId)
  if (!user) return

  if (confirm(`Delete user "${user.username}"? This action cannot be undone.`)) {
    try {
      showLoading()

      const response = await fetch("/api/users", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: userId }),
      })

      const result = await response.json()

      if (result.success) {
        showSuccess("User deleted successfully")
        loadUsers()
      } else {
        showError(result.message || "Failed to delete user")
      }

      hideLoading()
    } catch (error) {
      console.error("Error deleting user:", error)
      showError("Failed to delete user")
      hideLoading()
    }
  }
}

// Modal Management
function initializeModal() {
  const modal = document.getElementById("userModal")
  const form = document.getElementById("userForm")

  if (form) {
    form.addEventListener("submit", handleUserSubmit)
  }

  // Close modal when clicking outside
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeUserModal()
      }
    })
  }
}

function openAddUserModal() {
  openUserModal("Add New User")
}

function openUserModal(title, user = null) {
  const modal = document.getElementById("userModal")
  const modalTitle = document.getElementById("modalTitle")
  const form = document.getElementById("userForm")

  if (!modal || !modalTitle || !form) return

  modalTitle.textContent = title

  // Reset form
  form.reset()

  // Enable all inputs
  const inputs = form.querySelectorAll("input, select")
  inputs.forEach((input) => (input.disabled = false))

  // Show save button
  const saveButton = form.querySelector('button[type="submit"]')
  if (saveButton) saveButton.style.display = "inline-flex"

  if (user) {
    // Populate form with user data
    document.getElementById("userName").value = user.username
    document.getElementById("userEmail").value = user.email
    document.getElementById("userRole").value = user.role
    document.getElementById("userStatus").value = user.status

    // Store user ID for editing
    form.dataset.userId = user.id
  } else {
    // Remove user ID for new user
    delete form.dataset.userId
  }

  modal.classList.add("show")
}

function closeUserModal() {
  const modal = document.getElementById("userModal")
  if (modal) {
    modal.classList.remove("show")
  }
}

// Handle User Form Submit
async function handleUserSubmit(e) {
  e.preventDefault()

  const form = e.target
  const formData = new FormData(form)
  const userId = form.dataset.userId

  const userData = {
    name: formData.get("name"),
    email: formData.get("email"),
    role: formData.get("role"),
    status: formData.get("status"),
    password: formData.get("password"),
  }

  if (userId) {
    userData.id = Number.parseInt(userId)
  }

  try {
    showLoading()

    const response = await fetch("/api/users", {
      method: userId ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })

    const result = await response.json()

    if (result.success) {
      showSuccess(result.message)
      closeUserModal()
      loadUsers()
    } else {
      showError(result.message || "Failed to save user")
    }

    hideLoading()
  } catch (error) {
    console.error("Error saving user:", error)
    showError("Failed to save user")
    hideLoading()
  }
}

// Export Users
function exportUsers() {
  const searchTerm = document.getElementById("userSearch")?.value || ""
  const roleFilter = document.getElementById("roleFilter")?.value || ""
  const statusFilter = document.getElementById("statusFilter")?.value || ""

  // Create CSV content
  const headers = ["ID", "Username", "Email", "Role", "Status", "Bookings", "Last Login", "Created At"]
  const csvContent = [
    headers.join(","),
    ...currentUsers
      .filter((user) => {
        const matchesSearch =
          !searchTerm ||
          user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesRole = !roleFilter || user.role === roleFilter
        const matchesStatus = !statusFilter || user.status === statusFilter
        return matchesSearch && matchesRole && matchesStatus
      })
      .map((user) =>
        [
          user.id,
          `"${user.username}"`,
          `"${user.email}"`,
          user.role,
          user.status,
          user.booking_count || 0,
          user.last_login ? `"${formatDateTime(user.last_login)}"` : "Never",
          `"${formatDateTime(user.created_at)}"`,
        ].join(","),
      ),
  ].join("\n")

  // Download CSV
  const blob = new Blob([csvContent], { type: "text/csv" })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `users_export_${new Date().toISOString().split("T")[0]}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  window.URL.revokeObjectURL(url)

  showSuccess("Users exported successfully")
}

// Utility Functions
function setupEventListeners() {
  // Keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case "n":
          e.preventDefault()
          openAddUserModal()
          break
        case "f":
          e.preventDefault()
          document.getElementById("userSearch")?.focus()
          break
        case "e":
          e.preventDefault()
          exportUsers()
          break
      }
    }

    if (e.key === "Escape") {
      closeUserModal()
    }
  })
}

function updatePaginationInfo(totalUsers) {
  const paginationInfo = document.querySelector(".pagination-info")
  if (paginationInfo) {
    paginationInfo.textContent = `Showing 1-${Math.min(10, totalUsers)} of ${totalUsers} users`
  }
}

function formatDateTime(dateString) {
  if (!dateString) return null

  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function escapeHtml(text) {
  const div = document.createElement("div")
  div.textContent = text
  return div.innerHTML
}

// Loading and Message Functions
function showLoading() {
  const loadingElement = document.createElement("div")
  loadingElement.id = "loading-overlay"
  loadingElement.innerHTML = `
        <div class="loading-spinner">
            <div class="spinner"></div>
            <p>Loading...</p>
        </div>
    `
  loadingElement.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
    `
  document.body.appendChild(loadingElement)
}

function hideLoading() {
  const loadingElement = document.getElementById("loading-overlay")
  if (loadingElement) {
    loadingElement.remove()
  }
}

function showSuccess(message) {
  showNotification(message, "success")
}

function showError(message) {
  showNotification(message, "error")
}

function showNotification(message, type) {
  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`
  notification.textContent = message
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        background: ${type === "success" ? "#28a745" : "#dc3545"};
    `

  document.body.appendChild(notification)

  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease-in"
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification)
      }
    }, 300)
  }, 3000)
}

// Add CSS for animations
const style = document.createElement("style")
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .loading-spinner {
        text-align: center;
        color: white;
    }
    
    .spinner {
        width: 40px;
        height: 40px;
        border: 4px solid rgba(255,255,255,0.3);
        border-top: 4px solid white;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 15px;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`
document.head.appendChild(style)

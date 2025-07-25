// STARBLUE Admin Dashboard - JavaScript

// Global variables
const currentChart = null
const dashboardData = {}
let refreshInterval = null

// Initialize Admin Dashboard
document.addEventListener("DOMContentLoaded", () => {
  initializeAdminDashboard()
})

function initializeAdminDashboard() {
  initializeSidebar()
  initializeDataTables()
  initializeCharts()
  initializeBulkActions()
  initializeRealTimeUpdates()
  initializeNotificationSystem()
  initializeModalForms()

  console.log("Admin Dashboard initialized successfully")
}

// Sidebar Management
function initializeSidebar() {
  const sidebarToggle = document.querySelector(".sidebar-toggle")
  const sidebar = document.querySelector(".admin-sidebar")
  const overlay = document.querySelector(".sidebar-overlay")

  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", () => {
      sidebar.classList.toggle("show")
      if (overlay) overlay.classList.toggle("show")
    })
  }

  if (overlay) {
    overlay.addEventListener("click", () => {
      sidebar.classList.remove("show")
      overlay.classList.remove("show")
    })
  }

  // Auto-collapse on mobile
  if (window.innerWidth <= 1024) {
    sidebar.classList.remove("show")
  }

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1024) {
      sidebar.classList.remove("show")
      if (overlay) overlay.classList.remove("show")
    }
  })
}

// Data Tables Management
function initializeDataTables() {
  const tables = document.querySelectorAll(".data-table")

  tables.forEach((table) => {
    initializeTableSorting(table)
    initializeTableFiltering(table)
    initializeRowSelection(table)
    initializeRowActions(table)
  })
}

function initializeTableSorting(table) {
  const headers = table.querySelectorAll("th.sortable")

  headers.forEach((header) => {
    header.addEventListener("click", function () {
      const column = this.dataset.column
      const currentSort = this.dataset.sort || "none"
      let newSort = "asc"

      if (currentSort === "asc") {
        newSort = "desc"
      } else if (currentSort === "desc") {
        newSort = "none"
      }

      // Clear other sort indicators
      headers.forEach((h) => {
        h.classList.remove("sort-asc", "sort-desc")
        h.dataset.sort = "none"
      })

      // Set new sort
      if (newSort !== "none") {
        this.classList.add(`sort-${newSort}`)
        this.dataset.sort = newSort
        sortTable(table, column, newSort)
      } else {
        // Reset to original order
        resetTableOrder(table)
      }
    })
  })
}

function sortTable(table, column, direction) {
  const tbody = table.querySelector("tbody")
  const rows = Array.from(tbody.querySelectorAll("tr"))

  rows.sort((a, b) => {
    const aValue = getCellValue(a, column)
    const bValue = getCellValue(b, column)

    if (direction === "asc") {
      return aValue.localeCompare(bValue, undefined, { numeric: true })
    } else {
      return bValue.localeCompare(aValue, undefined, { numeric: true })
    }
  })

  rows.forEach((row) => tbody.appendChild(row))
}

function getCellValue(row, column) {
  const cell = row.querySelector(`[data-column="${column}"]`)
  return cell ? cell.textContent.trim() : ""
}

function resetTableOrder(table) {
  // This would restore the original server-side order
  // For now, we'll just reload the page
  location.reload()
}

function initializeTableFiltering(table) {
  const searchInput = table.closest(".data-table-container")?.querySelector(".data-table-search input")

  if (searchInput) {
    searchInput.addEventListener(
      "input",
      debounce(function () {
        filterTable(table, this.value)
      }, 300),
    )
  }
}

function filterTable(table, searchTerm) {
  const rows = table.querySelectorAll("tbody tr")
  const term = searchTerm.toLowerCase()

  rows.forEach((row) => {
    const text = row.textContent.toLowerCase()
    row.style.display = text.includes(term) ? "" : "none"
  })

  updateTableStats(table)
}

function updateTableStats(table) {
  const totalRows = table.querySelectorAll("tbody tr").length
  const visibleRows = table.querySelectorAll('tbody tr:not([style*="display: none"])').length

  const statsElement = table.closest(".data-table-container")?.querySelector(".table-stats")
  if (statsElement) {
    statsElement.textContent = `Showing ${visibleRows} of ${totalRows} entries`
  }
}

// Row Selection
function initializeRowSelection(table) {
  const selectAllCheckbox = table.querySelector('th input[type="checkbox"]')
  const rowCheckboxes = table.querySelectorAll('tbody input[type="checkbox"]')

  if (selectAllCheckbox) {
    selectAllCheckbox.addEventListener("change", function () {
      rowCheckboxes.forEach((checkbox) => {
        checkbox.checked = this.checked
        updateRowSelection(checkbox.closest("tr"), this.checked)
      })
      updateBulkActions()
    })
  }

  rowCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      updateRowSelection(this.closest("tr"), this.checked)
      updateSelectAllState(table)
      updateBulkActions()
    })
  })
}

function updateRowSelection(row, selected) {
  row.classList.toggle("selected", selected)
}

function updateSelectAllState(table) {
  const selectAllCheckbox = table.querySelector('th input[type="checkbox"]')
  const rowCheckboxes = table.querySelectorAll('tbody input[type="checkbox"]')
  const checkedBoxes = table.querySelectorAll('tbody input[type="checkbox"]:checked')

  if (selectAllCheckbox) {
    selectAllCheckbox.checked = checkedBoxes.length === rowCheckboxes.length
    selectAllCheckbox.indeterminate = checkedBoxes.length > 0 && checkedBoxes.length < rowCheckboxes.length
  }
}

// Row Actions
function initializeRowActions(table) {
  const actionButtons = table.querySelectorAll(".row-action")

  actionButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.stopPropagation()
      const action = this.dataset.action
      const rowId = this.dataset.id
      handleRowAction(action, rowId, this)
    })
  })
}

function handleRowAction(action, id, button) {
  switch (action) {
    case "edit":
      editRecord(id, button)
      break
    case "delete":
      deleteRecord(id, button)
      break
    case "view":
      viewRecord(id, button)
      break
    case "toggle-status":
      toggleRecordStatus(id, button)
      break
    default:
      console.warn("Unknown action:", action)
  }
}

function editRecord(id, button) {
  const editUrl = button.dataset.editUrl || `/admin/edit/${id}`
  window.location.href = editUrl
}

function deleteRecord(id, button) {
  const recordType = button.dataset.type || "record"

  if (!confirm(`Are you sure you want to delete this ${recordType}?`)) {
    return
  }

  const deleteUrl = button.dataset.deleteUrl || `/admin/delete/${id}`

  fetch(deleteUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        button.closest("tr").remove()
        showNotification(`${recordType} deleted successfully`, "success")
      } else {
        showNotification(data.message || "Failed to delete record", "error")
      }
    })
    .catch((error) => {
      console.error("Error:", error)
      showNotification("An error occurred while deleting the record", "error")
    })
}

function viewRecord(id, button) {
  const viewUrl = button.dataset.viewUrl || `/admin/view/${id}`
  window.open(viewUrl, "_blank")
}

function toggleRecordStatus(id, button) {
  const toggleUrl = button.dataset.toggleUrl || `/admin/toggle-status/${id}`

  fetch(toggleUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        // Update status badge
        const statusBadge = button.closest("tr").querySelector(".status-badge")
        if (statusBadge) {
          statusBadge.textContent = data.newStatus
          statusBadge.className = `badge badge-${data.newStatus.toLowerCase()}`
        }
        showNotification("Status updated successfully", "success")
      } else {
        showNotification(data.message || "Failed to update status", "error")
      }
    })
    .catch((error) => {
      console.error("Error:", error)
      showNotification("An error occurred while updating the status", "error")
    })
}

// Bulk Actions
function initializeBulkActions() {
  const bulkActionButtons = document.querySelectorAll(".bulk-action-btn")

  bulkActionButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const action = this.dataset.action
      const selectedIds = getSelectedRowIds()

      if (selectedIds.length === 0) {
        showNotification("Please select at least one item", "warning")
        return
      }

      handleBulkAction(action, selectedIds)
    })
  })
}

function getSelectedRowIds() {
  const checkedBoxes = document.querySelectorAll('tbody input[type="checkbox"]:checked')
  return Array.from(checkedBoxes).map((checkbox) => checkbox.value)
}

function updateBulkActions() {
  const selectedIds = getSelectedRowIds()
  const bulkActionsBar = document.querySelector(".bulk-actions")

  if (bulkActionsBar) {
    if (selectedIds.length > 0) {
      bulkActionsBar.classList.add("show")
      const countElement = bulkActionsBar.querySelector(".selected-count")
      if (countElement) {
        countElement.textContent = selectedIds.length
      }
    } else {
      bulkActionsBar.classList.remove("show")
    }
  }
}

function handleBulkAction(action, ids) {
  const actionText = action.replace("-", " ")

  if (!confirm(`Are you sure you want to ${actionText} ${ids.length} selected items?`)) {
    return
  }

  fetch(`/admin/bulk-${action}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
    },
    body: JSON.stringify({ ids: ids }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        showNotification(`Bulk ${actionText} completed successfully`, "success")
        setTimeout(() => location.reload(), 1500)
      } else {
        showNotification(data.message || `Failed to perform bulk ${actionText}`, "error")
      }
    })
    .catch((error) => {
      console.error("Error:", error)
      showNotification(`An error occurred during bulk ${actionText}`, "error")
    })
}

// Charts Management
function initializeCharts() {
  initializeRevenueChart()
  initializeBookingTrendsChart()
  initializeTransportStatsChart()
}

function initializeRevenueChart() {
  const chartElement = document.getElementById("revenue-chart")
  if (!chartElement) return

  // This would typically use a charting library like Chart.js or D3.js
  // For now, we'll create a simple mock chart
  createMockChart(chartElement, "Revenue Over Time")
}

function initializeBookingTrendsChart() {
  const chartElement = document.getElementById("booking-trends-chart")
  if (!chartElement) return

  createMockChart(chartElement, "Booking Trends")
}

function initializeTransportStatsChart() {
  const chartElement = document.getElementById("transport-stats-chart")
  if (!chartElement) return

  createMockChart(chartElement, "Transport Statistics")
}

function createMockChart(element, title) {
  element.innerHTML = `
        <div style="text-align: center; padding: 40px; color: #666;">
            <h3>${title}</h3>
            <p>Chart visualization would appear here</p>
            <div style="height: 200px; background: linear-gradient(45deg, #f0f0f0, #e0e0e0); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 18px; color: #999;">📊 Chart Data</span>
            </div>
        </div>
    `
}

// Real-time Updates
function initializeRealTimeUpdates() {
  // Start real-time updates every 30 seconds
  refreshInterval = setInterval(updateDashboardData, 30000)

  // Update immediately
  updateDashboardData()
}

function updateDashboardData() {
  fetch("/admin/api/dashboard-stats", {
    headers: {
      "X-Requested-With": "XMLHttpRequest",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      updateStatCards(data.stats)
      updateSystemStatus(data.system)
      updateActivityFeed(data.activities)
    })
    .catch((error) => {
      console.error("Error updating dashboard data:", error)
    })
}

function updateStatCards(stats) {
  Object.keys(stats).forEach((key) => {
    const statElement = document.querySelector(`[data-stat="${key}"]`)
    if (statElement) {
      const valueElement = statElement.querySelector(".stat-card-value")
      const changeElement = statElement.querySelector(".stat-card-change")

      if (valueElement) {
        animateValue(valueElement, Number.parseInt(valueElement.textContent.replace(/,/g, "")), stats[key].value)
      }

      if (changeElement && stats[key].change !== undefined) {
        changeElement.textContent = `${stats[key].change > 0 ? "+" : ""}${stats[key].change}%`
        changeElement.className = `stat-card-change ${stats[key].change >= 0 ? "positive" : "negative"}`
      }
    }
  })
}

function animateValue(element, start, end) {
  const duration = 1000
  const startTime = performance.now()

  function update(currentTime) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)

    const current = Math.floor(start + (end - start) * progress)
    element.textContent = current.toLocaleString()

    if (progress < 1) {
      requestAnimationFrame(update)
    }
  }

  requestAnimationFrame(update)
}

function updateSystemStatus(systemData) {
  const statusElements = document.querySelectorAll(".status-item")

  statusElements.forEach((element) => {
    const service = element.dataset.service
    if (systemData[service]) {
      const indicator = element.querySelector(".status-indicator")
      const text = element.querySelector(".status-text")

      indicator.className = `status-indicator ${systemData[service].status}`
      text.textContent = `${service}: ${systemData[service].message}`
    }
  })
}

function updateActivityFeed(activities) {
  const feedElement = document.querySelector(".activity-feed")
  if (!feedElement || !activities) return

  const feedContent = activities
    .map(
      (activity) => `
        <div class="activity-item">
            <div class="activity-avatar">${activity.user.charAt(0).toUpperCase()}</div>
            <div class="activity-content">
                <div class="activity-text">${activity.message}</div>
                <div class="activity-time">${formatTimeAgo(activity.timestamp)}</div>
            </div>
        </div>
    `,
    )
    .join("")

  feedElement.innerHTML = feedContent
}

function formatTimeAgo(timestamp) {
  const now = new Date()
  const time = new Date(timestamp)
  const diff = now - time

  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`
  return "Just now"
}

// Notification System
function initializeNotificationSystem() {
  // Check for new notifications every minute
  setInterval(checkForNotifications, 60000)
}

function checkForNotifications() {
  fetch("/admin/api/notifications", {
    headers: {
      "X-Requested-With": "XMLHttpRequest",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.notifications && data.notifications.length > 0) {
        data.notifications.forEach((notification) => {
          showAdminNotification(notification)
        })
      }
    })
    .catch((error) => {
      console.error("Error checking notifications:", error)
    })
}

function showAdminNotification(notification) {
  const notificationElement = document.createElement("div")
  notificationElement.className = `notification ${notification.type}`
  notificationElement.innerHTML = `
        <div class="notification-icon ${notification.type}">
            <i class="fas fa-${getNotificationIcon(notification.type)}"></i>
        </div>
        <div class="notification-content">
            <div class="notification-title">${notification.title}</div>
            <div class="notification-message">${notification.message}</div>
        </div>
        <button class="notification-close">×</button>
    `

  const container = document.querySelector(".notifications") || createNotificationContainer()
  container.appendChild(notificationElement)

  // Show notification
  setTimeout(() => notificationElement.classList.add("show"), 100)

  // Auto-hide after 5 seconds
  setTimeout(() => {
    notificationElement.classList.remove("show")
    setTimeout(() => notificationElement.remove(), 300)
  }, 5000)

  // Close button
  notificationElement.querySelector(".notification-close").addEventListener("click", () => {
    notificationElement.classList.remove("show")
    setTimeout(() => notificationElement.remove(), 300)
  })
}

function getNotificationIcon(type) {
  const icons = {
    success: "check",
    warning: "exclamation-triangle",
    error: "times",
    info: "info-circle",
  }
  return icons[type] || "bell"
}

// Modal Forms
function initializeModalForms() {
  const modalForms = document.querySelectorAll(".modal form")

  modalForms.forEach((form) => {
    form.addEventListener("submit", function (e) {
      e.preventDefault()
      handleModalFormSubmit(this)
    })
  })
}

function handleModalFormSubmit(form) {
  const formData = new FormData(form)
  const submitButton = form.querySelector('button[type="submit"]')
  const originalText = submitButton.textContent

  // Show loading state
  submitButton.textContent = "Saving..."
  submitButton.disabled = true

  fetch(form.action, {
    method: "POST",
    body: formData,
    headers: {
      "X-Requested-With": "XMLHttpRequest",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        showNotification(data.message || "Saved successfully", "success")
        const modal = form.closest(".modal-overlay")
        if (modal) {
          window.closeModal(modal.id) // Assuming closeModal is a global function
        }
        // Refresh the page or update the data
        setTimeout(() => location.reload(), 1500)
      } else {
        showNotification(data.message || "Failed to save", "error")
      }
    })
    .catch((error) => {
      console.error("Error:", error)
      showNotification("An error occurred while saving", "error")
    })
    .finally(() => {
      // Reset button
      submitButton.textContent = originalText
      submitButton.disabled = false
    })
}

// Export Functions
function exportData(format, type) {
  const url = `/admin/export/${type}?format=${format}`
  window.open(url, "_blank")
  showNotification(`Exporting data as ${format.toUpperCase()}...`, "info")
}

// Utility Functions
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

function showNotification(message, type = "info", duration = 5000) {
  // Use the same notification system as main.js
  if (window.STARBLUE && window.STARBLUE.showNotification) {
    window.STARBLUE.showNotification(message, type, duration)
  } else {
    // Fallback notification
    alert(message)
  }
}

function createNotificationContainer() {
  const container = document.createElement("div")
  container.className = "notifications"
  document.body.appendChild(container)
  return container
}

// Cleanup on page unload
window.addEventListener("beforeunload", () => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
})

// Export admin functions for global access
window.AdminDashboard = {
  exportData,
  updateDashboardData,
  showAdminNotification,
  handleRowAction,
  handleBulkAction,
}

// Declare closeModal function if not already declared
if (typeof window.closeModal !== "function") {
  window.closeModal = (modalId) => {
    const modal = document.getElementById(modalId)
    if (modal) {
      modal.classList.remove("show")
      setTimeout(() => modal.remove(), 300)
    }
  }
}

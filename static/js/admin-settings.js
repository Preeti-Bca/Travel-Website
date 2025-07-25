// Admin Settings JavaScript

document.addEventListener("DOMContentLoaded", () => {
  initializeSettings()
  initializeSettingsTabs()
  initializeFormHandlers()
  initializeMaintenanceTools()
})

let currentSettings = {}

// Initialize Settings
function initializeSettings() {
  loadSettings()
  setupEventListeners()
}

// Initialize Settings Tabs
function initializeSettingsTabs() {
  const tabButtons = document.querySelectorAll(".settings-tab")
  tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const targetTab = this.getAttribute("onclick").match(/'([^']+)'/)[1]
      showSettingsTab(targetTab)
    })
  })
}

// Show Settings Tab
function showSettingsTab(tabName) {
  // Hide all tab contents
  const tabContents = document.querySelectorAll(".settings-panel")
  tabContents.forEach((content) => {
    content.classList.remove("active")
  })

  // Remove active class from all tab buttons
  const tabButtons = document.querySelectorAll(".settings-tab")
  tabButtons.forEach((button) => {
    button.classList.remove("active")
  })

  // Show selected tab content
  const selectedTab = document.getElementById(tabName)
  if (selectedTab) {
    selectedTab.classList.add("active")
  }

  // Add active class to clicked button
  const activeButton = document.querySelector(`[onclick*="${tabName}"]`)
  if (activeButton) {
    activeButton.classList.add("active")
  }

  // Load tab-specific data
  loadTabData(tabName)
}

// Load Tab Data
function loadTabData(tabName) {
  switch (tabName) {
    case "maintenance":
      updateSystemStatus()
      loadSystemLogs()
      updateCacheStats()
      break
    case "security":
      loadSecuritySettings()
      break
    case "email":
      loadEmailSettings()
      break
  }
}

// Load Settings
async function loadSettings() {
  try {
    // In a real application, you would fetch settings from your API
    currentSettings = await generateSampleSettings()
    populateSettingsForms(currentSettings)
  } catch (error) {
    console.error("Error loading settings:", error)
    showError("Failed to load settings")
  }
}

// Generate Sample Settings
async function generateSampleSettings() {
  return {
    general: {
      companyName: "STARBLUE Travel Management",
      companyEmail: "admin@starblue.com",
      companyPhone: "+1-800-STARBLUE",
      companyAddress: "123 Travel Street, City, Country",
      timezone: "Asia/Kolkata",
      currency: "INR",
      language: "en",
      dateFormat: "DD/MM/YYYY",
    },
    booking: {
      advanceBooking: 365,
      minBookingTime: 2,
      cancellationWindow: 24,
      modificationFee: 5,
      serviceFee: 2.5,
      processingFee: 50,
      gstRate: 18,
      convenienceFee: 25,
      allowGuestBooking: true,
      requirePhoneVerification: true,
      enableWaitlist: false,
      autoConfirmBooking: true,
    },
    payment: {
      enableRazorpay: true,
      enablePaytm: false,
      enableStripe: false,
      paymentTimeout: 15,
      maxRetryAttempts: 3,
      enableSSL: true,
      enable3DSecure: true,
      logPaymentAttempts: true,
    },
    email: {
      smtpHost: "smtp.gmail.com",
      smtpPort: 587,
      smtpUsername: "noreply@starblue.com",
      enableTLS: true,
      enableSSLEmail: true,
    },
    security: {
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      lockoutDuration: 15,
      passwordExpiry: 90,
      minPasswordLength: 8,
      passwordHistory: 5,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      enable2FA: false,
      force2FAAdmin: true,
      enableSMSOTP: false,
      enableEmailOTP: true,
    },
  }
}

// Populate Settings Forms
function populateSettingsForms(settings) {
  // General Settings
  if (settings.general) {
    Object.entries(settings.general).forEach(([key, value]) => {
      const element = document.getElementById(key)
      if (element) {
        if (element.type === "checkbox") {
          element.checked = value
        } else {
          element.value = value
        }
      }
    })
  }

  // Booking Settings
  if (settings.booking) {
    Object.entries(settings.booking).forEach(([key, value]) => {
      const element = document.getElementById(key)
      if (element) {
        if (element.type === "checkbox") {
          element.checked = value
        } else {
          element.value = value
        }
      }
    })
  }

  // Payment Settings
  if (settings.payment) {
    Object.entries(settings.payment).forEach(([key, value]) => {
      const element = document.getElementById(key)
      if (element) {
        if (element.type === "checkbox") {
          element.checked = value
        } else {
          element.value = value
        }
      }
    })

    updatePaymentGatewayStatus()
  }

  // Email Settings
  if (settings.email) {
    Object.entries(settings.email).forEach(([key, value]) => {
      const element = document.getElementById(key)
      if (element) {
        if (element.type === "checkbox") {
          element.checked = value
        } else {
          element.value = value
        }
      }
    })
  }

  // Security Settings
  if (settings.security) {
    Object.entries(settings.security).forEach(([key, value]) => {
      const element = document.getElementById(key)
      if (element) {
        if (element.type === "checkbox") {
          element.checked = value
        } else {
          element.value = value
        }
      }
    })
  }
}

// Initialize Form Handlers
function initializeFormHandlers() {
  // Payment gateway checkboxes
  const paymentCheckboxes = document.querySelectorAll(
    'input[id^="enable"][id$="pay"], input[id^="enable"][id$="Stripe"]',
  )
  paymentCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", updatePaymentGatewayStatus)
  })

  // Form validation
  const forms = document.querySelectorAll(".settings-form")
  forms.forEach((form) => {
    form.addEventListener("submit", function (e) {
      e.preventDefault()
      validateAndSaveForm(this)
    })
  })
}

// Update Payment Gateway Status
function updatePaymentGatewayStatus() {
  const gateways = ["Razorpay", "Paytm", "Stripe"]

  gateways.forEach((gateway) => {
    const checkbox = document.getElementById(`enable${gateway}`)
    const statusElement = document.querySelector(
      `.gateway-header:has(input[id*="${gateway.toLowerCase()}"]) .gateway-status`,
    )

    if (checkbox && statusElement) {
      if (checkbox.checked) {
        statusElement.textContent = "Active"
        statusElement.className = "gateway-status active"
      } else {
        statusElement.textContent = "Inactive"
        statusElement.className = "gateway-status inactive"
      }
    }
  })
}

// Validate and Save Form
function validateAndSaveForm(form) {
  const formData = new FormData(form)
  const settings = {}

  // Convert form data to settings object
  for (const [key, value] of formData.entries()) {
    const element = form.querySelector(`[name="${key}"]`)
    if (element) {
      if (element.type === "checkbox") {
        settings[key] = element.checked
      } else if (element.type === "number") {
        settings[key] = Number.parseFloat(value)
      } else {
        settings[key] = value
      }
    }
  }

  // Validate settings
  if (validateSettings(settings)) {
    saveSettings(settings)
  }
}

// Validate Settings
function validateSettings(settings) {
  // Add validation logic here
  if (settings.minPasswordLength && settings.minPasswordLength < 6) {
    showError("Minimum password length must be at least 6 characters")
    return false
  }

  if (settings.sessionTimeout && settings.sessionTimeout < 5) {
    showError("Session timeout must be at least 5 minutes")
    return false
  }

  return true
}

// Save Settings
async function saveSettings(settings) {
  try {
    showLoading()

    // In a real application, you would send settings to your API
    await simulateApiCall()

    // Update current settings
    Object.assign(currentSettings, settings)

    hideLoading()
    showSuccess("Settings saved successfully")
  } catch (error) {
    console.error("Error saving settings:", error)
    showError("Failed to save settings")
    hideLoading()
  }
}

// Initialize Maintenance Tools
function initializeMaintenanceTools() {
  updateSystemStatus()
  loadSystemLogs()
  updateCacheStats()

  // Set up periodic updates
  setInterval(updateSystemStatus, 30000) // Update every 30 seconds
  setInterval(updateCacheStats, 60000) // Update every minute
}

// Update System Status
function updateSystemStatus() {
  const statusItems = document.querySelectorAll(".status-item")

  statusItems.forEach((item, index) => {
    const indicator = item.querySelector(".status-indicator")
    const statusText = item.querySelector(".status-info p")

    // Simulate status updates
    const statuses = ["online", "warning", "offline"]
    const statusTexts = ["Online", "Slow Response", "Offline"]

    // 90% chance online, 8% warning, 2% offline
    const rand = Math.random()
    let statusIndex = 0
    if (rand < 0.02) statusIndex = 2
    else if (rand < 0.1) statusIndex = 1

    if (indicator) {
      indicator.className = `status-indicator ${statuses[statusIndex]}`
    }

    if (statusText) {
      statusText.textContent = statusTexts[statusIndex]
    }
  })
}

// Load System Logs
function loadSystemLogs() {
  const logViewer = document.getElementById("logViewer")
  if (!logViewer) return

  const sampleLogs = generateSampleLogs()
  logViewer.innerHTML = sampleLogs
    .map(
      (log) => `
        <div class="log-entry">
            <span class="log-time">${log.time}</span>
            <span class="log-level ${log.level}">${log.level.toUpperCase()}</span>
            <span class="log-message">${log.message}</span>
        </div>
    `,
    )
    .join("")
}

// Generate Sample Logs
function generateSampleLogs() {
  const logs = [
    {
      time: new Date().toISOString().replace("T", " ").substring(0, 19),
      level: "info",
      message: "User login successful: admin@starblue.com",
    },
    {
      time: new Date(Date.now() - 120000).toISOString().replace("T", " ").substring(0, 19),
      level: "warning",
      message: "High memory usage detected: 85%",
    },
    {
      time: new Date(Date.now() - 300000).toISOString().replace("T", " ").substring(0, 19),
      level: "error",
      message: "Payment gateway timeout: Razorpay",
    },
    {
      time: new Date(Date.now() - 600000).toISOString().replace("T", " ").substring(0, 19),
      level: "info",
      message: "Database backup completed successfully",
    },
    {
      time: new Date(Date.now() - 900000).toISOString().replace("T", " ").substring(0, 19),
      level: "warning",
      message: "SSL certificate expires in 30 days",
    },
  ]

  return logs
}

// Update Cache Stats
function updateCacheStats() {
  const cacheItems = document.querySelectorAll(".cache-item")

  cacheItems.forEach((item, index) => {
    const cacheInfo = item.querySelector(".cache-info p")
    if (cacheInfo) {
      // Simulate cache stats updates
      const sizes = ["245 MB", "128 MB", "45 MB"]
      const hitRates = ["89%", "92%", "Active Sessions: 156"]

      if (index < sizes.length) {
        const baseText = cacheInfo.textContent.split("|")[0]
        cacheInfo.textContent = `Size: ${sizes[index]} | Hit Rate: ${hitRates[index]}`
      }
    }
  })
}

// Maintenance Tool Functions
function createBackup() {
  showLoading()

  setTimeout(() => {
    hideLoading()
    showSuccess("Database backup created successfully")

    // Update last backup time
    const backupInfo = document.querySelector(".tool-card:first-child .tool-info p")
    if (backupInfo) {
      backupInfo.textContent = "Last backup: Just now"
    }
  }, 3000)
}

function restoreDatabase() {
  if (confirm("Are you sure you want to restore the database? This will overwrite current data.")) {
    showLoading()

    setTimeout(() => {
      hideLoading()
      showSuccess("Database restored successfully")
    }, 5000)
  }
}

function cleanDatabase() {
  if (confirm("Clean database by removing old logs and temporary data?")) {
    showLoading()

    setTimeout(() => {
      hideLoading()
      showSuccess("Database cleaned successfully")
    }, 2000)
  }
}

function viewLogs() {
  const logLevel = document.getElementById("logLevel")?.value || "all"
  const logDate = document.getElementById("logDate")?.value || "today"

  showLoading()

  setTimeout(() => {
    loadSystemLogs()
    hideLoading()
    showSuccess(`Logs filtered by ${logLevel} level for ${logDate}`)
  }, 1000)
}

function downloadLogs() {
  const logLevel = document.getElementById("logLevel")?.value || "all"
  const logDate = document.getElementById("logDate")?.value || "today"

  // Simulate log download
  const filename = `system_logs_${logLevel}_${logDate}_${new Date().toISOString().split("T")[0]}.txt`

  showSuccess(`Logs downloaded: ${filename}`)
}

function clearCache(cacheType) {
  if (confirm(`Clear ${cacheType} cache?`)) {
    showLoading()

    setTimeout(() => {
      hideLoading()
      showSuccess(`${cacheType.charAt(0).toUpperCase() + cacheType.slice(1)} cache cleared successfully`)
      updateCacheStats()
    }, 1500)
  }
}

// Email Template Functions
function editTemplate(templateType) {
  showSuccess(`Opening ${templateType} template editor`)
  // In a real application, this would open a template editor
}

function testTemplate(templateType) {
  showLoading()

  setTimeout(() => {
    hideLoading()
    showSuccess(`Test email sent for ${templateType} template`)
  }, 2000)
}

// Utility Functions
function setupEventListeners() {
  // Keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case "s":
          e.preventDefault()
          saveAllSettings()
          break
        case "r":
          e.preventDefault()
          location.reload()
          break
      }
    }
  })

  // Auto-save on input change (debounced)
  let autoSaveTimeout
  const inputs = document.querySelectorAll(".settings-form input, .settings-form select")
  inputs.forEach((input) => {
    input.addEventListener("change", function () {
      clearTimeout(autoSaveTimeout)
      autoSaveTimeout = setTimeout(() => {
        // Auto-save individual setting
        const form = this.closest(".settings-form")
        if (form) {
          validateAndSaveForm(form)
        }
      }, 2000)
    })
  })
}

// Simulate API Call
function simulateApiCall() {
  return new Promise((resolve) => {
    setTimeout(resolve, 1500)
  })
}

// Loading and Message Functions
function showLoading() {
  const loadingElement = document.createElement("div")
  loadingElement.id = "loading-overlay"
  loadingElement.innerHTML = `
        <div class="loading-spinner">
            <div class="spinner"></div>
            <p>Processing...</p>
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

// Export functions for global access
window.adminSettings = {
  saveAllSettings: () => {
    // Implement saveAllSettings logic here
    console.log("Save all settings")
  },
  createBackup,
  restoreDatabase,
  cleanDatabase,
  viewLogs,
  downloadLogs,
  clearCache,
  editTemplate,
  testTemplate,
  showSettingsTab,
}

// Declare missing functions
function loadSecuritySettings() {
  // Implement loadSecuritySettings logic here
  console.log("Load security settings")
}

function loadEmailSettings() {
  // Implement loadEmailSettings logic here
  console.log("Load email settings")
}

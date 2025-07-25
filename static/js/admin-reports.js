import { Chart } from "@/components/ui/chart"
// Admin Reports JavaScript

let revenueChart,
  bookingChart,
  customerChart,
  performanceCharts = {}

// Initialize Reports
function initializeReports() {
  // Set default date range
  const startDate = document.getElementById("startDate")
  const endDate = document.getElementById("endDate")

  if (startDate && endDate) {
    const today = new Date()
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate())

    startDate.value = lastMonth.toISOString().split("T")[0]
    endDate.value = today.toISOString().split("T")[0]
  }

  // Load initial data
  loadReportData()
}

// Initialize Charts
function initializeCharts() {
  initializeRevenueChart()
  initializeBookingMetrics()
  initializeCustomerSegmentation()
  initializePerformanceCharts()
}

// Initialize Tabs
function initializeTabs() {
  const tabButtons = document.querySelectorAll(".tab-btn")
  tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const targetTab = this.getAttribute("onclick").match(/'([^']+)'/)[1]
      showTab(targetTab)
    })
  })
}

// Show Tab
function showTab(tabName) {
  // Hide all tab contents
  const tabContents = document.querySelectorAll(".tab-content")
  tabContents.forEach((content) => {
    content.classList.remove("active")
  })

  // Remove active class from all tab buttons
  const tabButtons = document.querySelectorAll(".tab-btn")
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

  // Refresh charts when tab becomes visible
  setTimeout(() => {
    refreshChartsInTab(tabName)
  }, 100)
}

// Refresh Charts in Tab
function refreshChartsInTab(tabName) {
  switch (tabName) {
    case "revenue":
      if (revenueChart) revenueChart.resize()
      break
    case "bookings":
      if (bookingChart) bookingChart.resize()
      break
    case "customers":
      if (customerChart) customerChart.resize()
      break
    case "performance":
      Object.values(performanceCharts).forEach((chart) => {
        if (chart) chart.resize()
      })
      break
  }
}

// Load Report Data
async function loadReportData() {
  try {
    showLoading()

    // In a real application, you would fetch data from your API
    // For now, we'll use sample data
    const reportData = await generateSampleReportData()

    updateReportData(reportData)
    hideLoading()
  } catch (error) {
    console.error("Error loading report data:", error)
    showError("Failed to load report data")
    hideLoading()
  }
}

// Generate Sample Report Data
async function generateSampleReportData() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return {
    revenue: {
      total: 125450,
      flight: 78230,
      train: 32120,
      bus: 15100,
      trends: generateRevenueTrends(),
    },
    bookings: {
      total: 2450,
      successRate: 89.5,
      advanceDays: 12.3,
      trends: generateBookingTrends(),
      topRoutes: [
        { route: "Mumbai → Delhi", type: "Flight", count: 450, percentage: 90 },
        { route: "Delhi → Bangalore", type: "Flight", count: 380, percentage: 76 },
        { route: "Mumbai → Pune", type: "Train", count: 320, percentage: 64 },
      ],
    },
    customers: {
      active: 1250,
      avgBookingValue: 102,
      avgBookingsPerCustomer: 3.2,
      retention: 78,
      segments: [
        { label: "Frequent Travelers", value: 35, color: "#667eea" },
        { label: "Occasional Travelers", value: 45, color: "#764ba2" },
        { label: "First-time Travelers", value: 20, color: "#f093fb" },
      ],
    },
    performance: {
      responseTime: 1.2,
      uptime: 99.8,
      errorRate: 0.2,
      activeSessions: 1450,
      trends: generatePerformanceTrends(),
    },
  }
}

// Generate Revenue Trends
function generateRevenueTrends() {
  const data = []
  const today = new Date()

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)

    data.push({
      date: date.toISOString().split("T")[0],
      revenue: Math.floor(Math.random() * 5000) + 2000,
    })
  }

  return data
}

// Generate Booking Trends
function generateBookingTrends() {
  const data = []
  const today = new Date()

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)

    data.push({
      date: date.toISOString().split("T")[0],
      bookings: Math.floor(Math.random() * 100) + 50,
    })
  }

  return data
}

// Generate Performance Trends
function generatePerformanceTrends() {
  const data = []
  const today = new Date()

  for (let i = 23; i >= 0; i--) {
    const date = new Date(today)
    date.setHours(date.getHours() - i)

    data.push({
      time: date.toISOString(),
      responseTime: Math.random() * 2 + 0.5,
      systemLoad: Math.random() * 80 + 20,
    })
  }

  return data
}

// Update Report Data
function updateReportData(data) {
  updateRevenueData(data.revenue)
  updateBookingData(data.bookings)
  updateCustomerData(data.customers)
  updatePerformanceData(data.performance)
}

// Update Revenue Data
function updateRevenueData(revenue) {
  // Update revenue cards
  const revenueCards = document.querySelectorAll(".revenue-card")
  if (revenueCards.length >= 4) {
    revenueCards[0].querySelector("h4").textContent = `$${revenue.total.toLocaleString()}`
    revenueCards[1].querySelector("h4").textContent = `$${revenue.flight.toLocaleString()}`
    revenueCards[2].querySelector("h4").textContent = `$${revenue.train.toLocaleString()}`
    revenueCards[3].querySelector("h4").textContent = `$${revenue.bus.toLocaleString()}`
  }

  // Update revenue chart
  updateRevenueChart(revenue.trends)
}

// Update Booking Data
function updateBookingData(bookings) {
  // Update booking metrics
  const metricCards = document.querySelectorAll(".metric-card")
  if (metricCards.length >= 3) {
    metricCards[0].querySelector("h4").textContent = bookings.total.toLocaleString()
    metricCards[1].querySelector("h4").textContent = `${bookings.successRate}%`
    metricCards[2].querySelector("h4").textContent = bookings.advanceDays.toString()
  }

  // Update top routes
  updateTopRoutes(bookings.topRoutes)

  // Update booking charts
  // Function declaration for updateBookingCharts
  function updateBookingCharts(bookings) {
    // Implementation for updating booking charts
    console.log("Updating booking charts with data:", bookings)
  }
}

// Update Customer Data
function updateCustomerData(customers) {
  // Update customer stats
  const statItems = document.querySelectorAll(".customer-stats .stat-item")
  if (statItems.length >= 4) {
    statItems[0].querySelector("h5").textContent = customers.active.toLocaleString()
    statItems[1].querySelector("h5").textContent = `$${customers.avgBookingValue}`
    statItems[2].querySelector("h5").textContent = customers.avgBookingsPerCustomer.toString()
    statItems[3].querySelector("h5").textContent = `${customers.retention}%`
  }

  // Update customer segmentation chart
  updateCustomerSegmentationChart(customers.segments)
}

// Update Performance Data
function updatePerformanceData(performance) {
  // Update performance metrics
  const performanceCards = document.querySelectorAll(".performance-card")
  if (performanceCards.length >= 4) {
    performanceCards[0].querySelector("h4").textContent = `${performance.responseTime}s`
    performanceCards[1].querySelector("h4").textContent = `${performance.uptime}%`
    performanceCards[2].querySelector("h4").textContent = `${performance.errorRate}%`
    performanceCards[3].querySelector("h4").textContent = performance.activeSessions.toLocaleString()
  }

  // Update performance charts
  updatePerformanceCharts(performance.trends)
}

// Initialize Revenue Chart
function initializeRevenueChart() {
  const ctx = document.getElementById("revenueChart")
  if (!ctx) return

  revenueChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: "Daily Revenue",
          data: [],
          borderColor: "rgb(102, 126, 234)",
          backgroundColor: "rgba(102, 126, 234, 0.1)",
          borderWidth: 3,
          fill: true,
          tension: 0.4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
        },
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => "$" + value.toLocaleString(),
          },
        },
      },
    },
  })
}

// Update Revenue Chart
function updateRevenueChart(trends) {
  if (!revenueChart || !trends) return

  revenueChart.data.labels = trends.map((item) => formatDate(item.date))
  revenueChart.data.datasets[0].data = trends.map((item) => item.revenue)
  revenueChart.update()
}

// Initialize Booking Metrics
function initializeBookingMetrics() {
  // Initialize small charts for booking metrics
  initializeMetricChart("totalBookingsChart", "line")
  initializeMetricChart("successRateChart", "doughnut")
  initializeMetricChart("advanceBookingChart", "bar")
}

// Initialize Metric Chart
function initializeMetricChart(canvasId, type) {
  const ctx = document.getElementById(canvasId)
  if (!ctx) return

  const config = {
    type: type,
    data: {
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor:
            type === "doughnut" ? ["rgb(102, 126, 234)", "rgba(102, 126, 234, 0.3)"] : "rgba(102, 126, 234, 0.8)",
          borderColor: "rgb(102, 126, 234)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales:
        type === "doughnut"
          ? {}
          : {
              x: { display: false },
              y: { display: false },
            },
    },
  }

  new Chart(ctx, config)
}

// Update Top Routes
function updateTopRoutes(routes) {
  const routesList = document.querySelector(".routes-list")
  if (!routesList || !routes) return

  routesList.innerHTML = routes
    .map(
      (route) => `
        <div class="route-item">
            <div class="route-info">
                <span class="route-name">${route.route}</span>
                <span class="route-type">${route.type}</span>
            </div>
            <div class="route-stats">
                <span class="booking-count">${route.count} bookings</span>
                <div class="progress-bar">
                    <div class="progress" style="width: ${route.percentage}%"></div>
                </div>
            </div>
        </div>
    `,
    )
    .join("")
}

// Initialize Customer Segmentation
function initializeCustomerSegmentation() {
  const ctx = document.getElementById("customerSegmentChart")
  if (!ctx) return

  customerChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: [],
          borderColor: "#fff",
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  })
}

// Update Customer Segmentation Chart
function updateCustomerSegmentationChart(segments) {
  if (!customerChart || !segments) return

  customerChart.data.labels = segments.map((s) => s.label)
  customerChart.data.datasets[0].data = segments.map((s) => s.value)
  customerChart.data.datasets[0].backgroundColor = segments.map((s) => s.color)
  customerChart.update()
}

// Initialize Performance Charts
function initializePerformanceCharts() {
  initializeResponseTimeChart()
  initializeSystemLoadChart()
}

// Initialize Response Time Chart
function initializeResponseTimeChart() {
  const ctx = document.getElementById("responseTimeChart")
  if (!ctx) return

  performanceCharts.responseTime = new Chart(ctx, {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: "Response Time (s)",
          data: [],
          borderColor: "rgb(102, 126, 234)",
          backgroundColor: "rgba(102, 126, 234, 0.1)",
          borderWidth: 2,
          fill: true,
          tension: 0.4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          display: false,
        },
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => value + "s",
          },
        },
      },
    },
  })
}

// Initialize System Load Chart
function initializeSystemLoadChart() {
  const ctx = document.getElementById("systemLoadChart")
  if (!ctx) return

  performanceCharts.systemLoad = new Chart(ctx, {
    type: "bar",
    data: {
      labels: [],
      datasets: [
        {
          label: "System Load (%)",
          data: [],
          backgroundColor: "rgba(102, 126, 234, 0.8)",
          borderColor: "rgb(102, 126, 234)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          display: false,
        },
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            callback: (value) => value + "%",
          },
        },
      },
    },
  })
}

// Update Performance Charts
function updatePerformanceCharts(trends) {
  if (!trends) return

  const labels = trends.map((item) => formatTime(item.time))

  if (performanceCharts.responseTime) {
    performanceCharts.responseTime.data.labels = labels
    performanceCharts.responseTime.data.datasets[0].data = trends.map((item) => item.responseTime)
    performanceCharts.responseTime.update()
  }

  if (performanceCharts.systemLoad) {
    performanceCharts.systemLoad.data.labels = labels
    performanceCharts.systemLoad.data.datasets[0].data = trends.map((item) => item.systemLoad)
    performanceCharts.systemLoad.update()
  }
}

// Update Reports
function updateReports() {
  const startDate = document.getElementById("startDate")?.value
  const endDate = document.getElementById("endDate")?.value

  if (!startDate || !endDate) {
    showError("Please select both start and end dates")
    return
  }

  if (new Date(startDate) > new Date(endDate)) {
    showError("Start date cannot be after end date")
    return
  }

  loadReportData()
}

// Initialize Export Functions
function initializeExportFunctions() {
  // Export functions are already defined globally
}

// Export Report
function exportReport(reportType, format) {
  showLoading()

  // Simulate export process
  setTimeout(() => {
    const filename = `${reportType}_report_${new Date().toISOString().split("T")[0]}.${format}`

    if (format === "pdf") {
      exportToPDF(reportType, filename)
    } else if (format === "excel") {
      exportToExcel(reportType, filename)
    }

    hideLoading()
    showSuccess(`${reportType} report exported as ${format.toUpperCase()}`)
  }, 2000)
}

// Export to PDF
function exportToPDF(reportType, filename) {
  // In a real application, you would generate a PDF
  console.log(`Exporting ${reportType} to PDF: ${filename}`)
}

// Export to Excel
function exportToExcel(reportType, filename) {
  // In a real application, you would generate an Excel file
  console.log(`Exporting ${reportType} to Excel: ${filename}`)
}

// Utility Functions
function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })
}

function formatTime(timeString) {
  const date = new Date(timeString)
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

// Loading and Message Functions
function showLoading() {
  const loadingElement = document.createElement("div")
  loadingElement.id = "loading-overlay"
  loadingElement.innerHTML = `
        <div class="loading-spinner">
            <div class="spinner"></div>
            <p>Loading reports...</p>
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

// Keyboard shortcuts
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey || e.metaKey) {
    switch (e.key) {
      case "r":
        e.preventDefault()
        updateReports()
        break
      case "e":
        e.preventDefault()
        const activeTab = document.querySelector(".tab-content.active")
        if (activeTab) {
          const tabId = activeTab.id
          exportReport(tabId, "pdf")
        }
        break
    }
  }
})

// Initialize when page loads
document.addEventListener("DOMContentLoaded", () => {
  initializeReports()
  initializeCharts()
  initializeTabs()
  initializeExportFunctions()
})

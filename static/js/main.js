// STARBLUE Travel Application - Main JavaScript File

// Global variables
let currentUser = null
const searchResults = []
const bookingData = {}

// Import Bootstrap
const bootstrap = window.bootstrap

// Initialize application when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  initializeApp()
  setupEventListeners()
  loadUserSession()
  initializeAnimations()
})

// Initialize the application
function initializeApp() {
  console.log("STARBLUE Travel App Initialized")

  // Set minimum date for date inputs
  setMinimumDates()

  // Initialize tooltips
  initializeTooltips()

  // Initialize modals
  initializeModals()

  // Load saved search preferences
  loadSearchPreferences()

  // Initialize lazy loading for images
  initializeLazyLoading()
}

// Setup event listeners
function setupEventListeners() {
  // Search form submissions
  const searchForms = document.querySelectorAll(".search-form")
  searchForms.forEach((form) => {
    form.addEventListener("submit", handleSearchSubmit)
  })

  // Navigation menu toggle
  const navToggle = document.querySelector(".navbar-toggler")
  if (navToggle) {
    navToggle.addEventListener("click", toggleMobileMenu)
  }

  // Search filters
  const filterElements = document.querySelectorAll('[id$="Filter"], #sortBy')
  filterElements.forEach((element) => {
    element.addEventListener("change", applySearchFilters)
  })

  // Booking buttons
  document.addEventListener("click", (e) => {
    if (e.target.matches('.btn[onclick*="bookNow"]')) {
      e.preventDefault()
      const resultId = e.target.getAttribute("onclick").match(/bookNow$$'(.+?)'$$/)[1]
      handleBookingClick(resultId)
    }

    if (e.target.matches('.btn[onclick*="viewDetails"]')) {
      e.preventDefault()
      const resultId = e.target.getAttribute("onclick").match(/viewDetails$$'(.+?)'$$/)[1]
      toggleResultDetails(resultId)
    }
  })

  // Form validation
  const forms = document.querySelectorAll(".needs-validation")
  forms.forEach((form) => {
    form.addEventListener("submit", handleFormValidation)
  })

  // Password strength checker
  const passwordInputs = document.querySelectorAll('input[type="password"]')
  passwordInputs.forEach((input) => {
    if (input.id === "password") {
      input.addEventListener("input", checkPasswordStrength)
    }
  })

  // Auto-complete for location inputs
  const locationInputs = document.querySelectorAll('input[name*="location"]')
  locationInputs.forEach((input) => {
    setupLocationAutocomplete(input)
  })

  // Scroll to top button
  setupScrollToTop()

  // Window resize handler
  window.addEventListener("resize", handleWindowResize)

  // Online/offline status
  window.addEventListener("online", handleOnlineStatus)
  window.addEventListener("offline", handleOfflineStatus)
}

// Set minimum dates for date inputs
function setMinimumDates() {
  const today = new Date().toISOString().split("T")[0]
  const dateInputs = document.querySelectorAll('input[type="date"]')

  dateInputs.forEach((input) => {
    if (!input.hasAttribute("min")) {
      input.min = today
    }

    // Set return date minimum to departure date
    if (input.name === "departure_date") {
      input.addEventListener("change", function () {
        const returnDateInput = document.querySelector('input[name="return_date"]')
        if (returnDateInput) {
          returnDateInput.min = this.value
        }
      })
    }
  })
}

// Initialize tooltips
function initializeTooltips() {
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
  tooltipTriggerList.map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl))
}

// Initialize modals
function initializeModals() {
  const modalElements = document.querySelectorAll(".modal")
  modalElements.forEach((modal) => {
    modal.addEventListener("shown.bs.modal", () => {
      const firstInput = modal.querySelector("input, select, textarea")
      if (firstInput) {
        firstInput.focus()
      }
    })
  })
}

// Load search preferences from localStorage
function loadSearchPreferences() {
  const savedPreferences = localStorage.getItem("starblue_search_preferences")
  if (savedPreferences) {
    try {
      const preferences = JSON.parse(savedPreferences)
      applySearchPreferences(preferences)
    } catch (error) {
      console.error("Error loading search preferences:", error)
    }
  }
}

// Apply saved search preferences
function applySearchPreferences(preferences) {
  Object.keys(preferences).forEach((key) => {
    const element = document.querySelector(`[name="${key}"]`)
    if (element) {
      element.value = preferences[key]
    }
  })
}

// Save search preferences
function saveSearchPreferences(formData) {
  const preferences = {}
  const importantFields = ["from_location", "to_location", "transport_type", "passengers"]

  importantFields.forEach((field) => {
    if (formData.has(field)) {
      preferences[field] = formData.get(field)
    }
  })

  localStorage.setItem("starblue_search_preferences", JSON.stringify(preferences))
}

// Handle search form submission
function handleSearchSubmit(event) {
  event.preventDefault()

  const form = event.target
  const formData = new FormData(form)

  // Validate form data
  if (!validateSearchForm(formData)) {
    return
  }

  // Save search preferences
  saveSearchPreferences(formData)

  // Show loading state
  showSearchLoading()

  // Submit form
  form.submit()
}

// Validate search form
function validateSearchForm(formData) {
  const fromLocation = formData.get("from_location")
  const toLocation = formData.get("to_location")
  const departureDate = formData.get("departure_date")

  if (!fromLocation || !toLocation || !departureDate) {
    showAlert("Please fill in all required fields.", "warning")
    return false
  }

  if (fromLocation.toLowerCase() === toLocation.toLowerCase()) {
    showAlert("Departure and arrival locations cannot be the same.", "warning")
    return false
  }

  const today = new Date().toISOString().split("T")[0]
  if (departureDate < today) {
    showAlert("Departure date cannot be in the past.", "warning")
    return false
  }

  return true
}

// Show search loading state
function showSearchLoading() {
  const searchButtons = document.querySelectorAll('.search-form button[type="submit"]')
  searchButtons.forEach((button) => {
    button.disabled = true
    button.innerHTML = '<span class="loading"></span> Searching...'
  })
}

// Apply search filters
function applySearchFilters() {
  const sortBy = document.getElementById("sortBy")?.value || "price"
  const priceFilter = document.getElementById("priceFilter")?.value || ""
  const timeFilter = document.getElementById("timeFilter")?.value || ""
  const durationFilter = document.getElementById("durationFilter")?.value || ""
  const stopsFilter = document.getElementById("stopsFilter")?.value || ""

  const resultCards = document.querySelectorAll(".result-card")
  const visibleResults = []

  resultCards.forEach((card) => {
    let showCard = true

    // Apply price filter
    if (priceFilter && !applyPriceFilter(card, priceFilter)) {
      showCard = false
    }

    // Apply time filter
    if (timeFilter && !applyTimeFilter(card, timeFilter)) {
      showCard = false
    }

    // Apply duration filter
    if (durationFilter && !applyDurationFilter(card, durationFilter)) {
      showCard = false
    }

    // Apply stops filter
    if (stopsFilter && !applyStopsFilter(card, stopsFilter)) {
      showCard = false
    }

    // Show/hide card
    card.style.display = showCard ? "block" : "none"

    if (showCard) {
      visibleResults.push(card)
    }
  })

  // Sort visible results
  sortResults(visibleResults, sortBy)

  // Update results count
  updateResultsCount(visibleResults.length)
}

// Apply price filter
function applyPriceFilter(card, priceFilter) {
  const priceElement = card.querySelector(".price")
  if (!priceElement) return true

  const price = Number.parseInt(priceElement.textContent.replace(/[₹,]/g, ""))

  switch (priceFilter) {
    case "0-2000":
      return price <= 2000
    case "2000-5000":
      return price > 2000 && price <= 5000
    case "5000+":
      return price > 5000
    default:
      return true
  }
}

// Apply time filter
function applyTimeFilter(card, timeFilter) {
  const timeElement = card.querySelector(".departure .time")
  if (!timeElement) return true

  const timeText = timeElement.textContent
  const hour = Number.parseInt(timeText.split(":")[0])

  switch (timeFilter) {
    case "morning":
      return hour >= 6 && hour < 12
    case "afternoon":
      return hour >= 12 && hour < 18
    case "evening":
      return hour >= 18 && hour < 24
    case "night":
      return hour >= 0 && hour < 6
    default:
      return true
  }
}

// Apply duration filter
function applyDurationFilter(card, durationFilter) {
  const durationElement = card.querySelector(".duration")
  if (!durationElement) return true

  const durationText = durationElement.textContent
  const hours = parseDuration(durationText)

  switch (durationFilter) {
    case "0-2":
      return hours <= 2
    case "2-5":
      return hours > 2 && hours <= 5
    case "5-10":
      return hours > 5 && hours <= 10
    case "10+":
      return hours > 10
    default:
      return true
  }
}

// Apply stops filter
function applyStopsFilter(card, stopsFilter) {
  const stopsElement = card.querySelector(".stops")
  if (!stopsElement) return stopsFilter === "0"

  const stopsText = stopsElement.textContent
  const stops = Number.parseInt(stopsText) || 0

  switch (stopsFilter) {
    case "0":
      return stops === 0
    case "1":
      return stops === 1
    case "2+":
      return stops >= 2
    default:
      return true
  }
}

// Parse duration string to hours
function parseDuration(durationText) {
  const matches = durationText.match(/(\d+)h?\s*(\d+)?m?/)
  if (!matches) return 0

  const hours = Number.parseInt(matches[1]) || 0
  const minutes = Number.parseInt(matches[2]) || 0

  return hours + minutes / 60
}

// Sort results
function sortResults(results, sortBy) {
  const container = document.querySelector(".results-list")
  if (!container) return

  results.sort((a, b) => {
    switch (sortBy) {
      case "price":
        return getPrice(a) - getPrice(b)
      case "duration":
        return getDuration(a) - getDuration(b)
      case "departure":
        return getDepartureTime(a) - getDepartureTime(b)
      case "rating":
        return getRating(b) - getRating(a) // Descending
      default:
        return 0
    }
  })

  // Reorder DOM elements
  results.forEach((result) => {
    container.appendChild(result)
  })
}

// Get price from result card
function getPrice(card) {
  const priceElement = card.querySelector(".price")
  return priceElement ? Number.parseInt(priceElement.textContent.replace(/[₹,]/g, "")) : 0
}

// Get duration from result card
function getDuration(card) {
  const durationElement = card.querySelector(".duration")
  return durationElement ? parseDuration(durationElement.textContent) : 0
}

// Get departure time from result card
function getDepartureTime(card) {
  const timeElement = card.querySelector(".departure .time")
  if (!timeElement) return 0

  const timeText = timeElement.textContent
  const [hours, minutes] = timeText.split(":").map(Number)
  return hours * 60 + minutes
}

// Get rating from result card
function getRating(card) {
  const ratingElement = card.querySelector(".rating")
  return ratingElement ? Number.parseFloat(ratingElement.textContent) : 0
}

// Update results count
function updateResultsCount(count) {
  const countElement = document.querySelector(".search-header p")
  if (countElement) {
    countElement.textContent =
      count > 0 ? `Found ${count} options for your journey` : "No results found for your search"
  }
}

// Toggle result details
function toggleResultDetails(resultId) {
  const detailsDiv = document.getElementById("details-" + resultId)
  const button = document.querySelector(`[onclick*="viewDetails('${resultId}')"]`)

  if (detailsDiv) {
    if (detailsDiv.style.display === "none" || !detailsDiv.style.display) {
      detailsDiv.style.display = "block"
      if (button) button.innerHTML = '<i class="fas fa-eye-slash me-1"></i>Hide Details'
    } else {
      detailsDiv.style.display = "none"
      if (button) button.innerHTML = '<i class="fas fa-info-circle me-1"></i>Details'
    }
  }
}

// Handle booking click
function handleBookingClick(resultId) {
  // Store booking data
  bookingData.resultId = resultId

  // Check if user is logged in
  if (!currentUser) {
    showLoginModal()
    return
  }

  // Redirect to booking page
  window.location.href = `/book/${resultId}`
}

// Show login modal
function showLoginModal() {
  const loginModal = new bootstrap.Modal(document.getElementById("loginModal") || createLoginModal())
  loginModal.show()
}

// Create login modal dynamically
function createLoginModal() {
  const modalHtml = `
        <div class="modal fade" id="loginModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Login Required</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <p>Please login to continue with your booking.</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <a href="/login" class="btn btn-primary">Login</a>
                    </div>
                </div>
            </div>
        </div>
    `

  document.body.insertAdjacentHTML("beforeend", modalHtml)
  return document.getElementById("loginModal")
}

// Handle form validation
function handleFormValidation(event) {
  const form = event.target

  if (!form.checkValidity()) {
    event.preventDefault()
    event.stopPropagation()

    // Focus on first invalid field
    const firstInvalid = form.querySelector(":invalid")
    if (firstInvalid) {
      firstInvalid.focus()
    }
  }

  form.classList.add("was-validated")
}

// Check password strength
function checkPasswordStrength(event) {
  const password = event.target.value
  const strengthBar = document.getElementById("passwordStrength")
  const strengthText = document.getElementById("passwordStrengthText")

  if (!strengthBar || !strengthText) return

  let strength = 0
  let strengthLabel = ""

  // Check password criteria
  if (password.length >= 8) strength += 25
  if (/[a-z]/.test(password)) strength += 25
  if (/[A-Z]/.test(password)) strength += 25
  if (/[0-9]/.test(password)) strength += 25

  // Update progress bar
  strengthBar.style.width = strength + "%"

  // Update color and text
  if (strength < 50) {
    strengthBar.className = "progress-bar bg-danger"
    strengthLabel = "Weak"
  } else if (strength < 75) {
    strengthBar.className = "progress-bar bg-warning"
    strengthLabel = "Medium"
  } else {
    strengthBar.className = "progress-bar bg-success"
    strengthLabel = "Strong"
  }

  strengthText.textContent = password.length > 0 ? strengthLabel : "Password strength"
}

// Setup location autocomplete
function setupLocationAutocomplete(input) {
  const cities = [
    "Mumbai",
    "Delhi",
    "Bangalore",
    "Hyderabad",
    "Chennai",
    "Kolkata",
    "Pune",
    "Ahmedabad",
    "Jaipur",
    "Surat",
    "Lucknow",
    "Kanpur",
    "Nagpur",
    "Indore",
    "Thane",
    "Bhopal",
    "Visakhapatnam",
    "Pimpri-Chinchwad",
    "Patna",
    "Vadodara",
    "Ghaziabad",
    "Ludhiana",
    "Agra",
    "Nashik",
    "Faridabad",
    "Meerut",
    "Rajkot",
    "Kalyan-Dombivali",
    "Vasai-Virar",
    "Varanasi",
    "Srinagar",
    "Aurangabad",
    "Dhanbad",
    "Amritsar",
    "Navi Mumbai",
    "Allahabad",
    "Ranchi",
    "Howrah",
    "Coimbatore",
    "Jabalpur",
    "Gwalior",
    "Vijayawada",
    "Jodhpur",
    "Madurai",
    "Raipur",
    "Kota",
    "Guwahati",
    "Chandigarh",
    "Solapur",
    "Hubli-Dharwad",
  ]

  let currentFocus = -1

  input.addEventListener("input", function () {
    const value = this.value.toLowerCase()
    closeAllLists()

    if (!value) return

    const matches = cities.filter((city) => city.toLowerCase().includes(value)).slice(0, 5)

    if (matches.length === 0) return

    const listDiv = document.createElement("div")
    listDiv.className = "autocomplete-list"
    listDiv.style.cssText = `
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            border: 1px solid #ddd;
            border-top: none;
            border-radius: 0 0 4px 4px;
            max-height: 200px;
            overflow-y: auto;
            z-index: 1000;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        `

    matches.forEach((city, index) => {
      const itemDiv = document.createElement("div")
      itemDiv.className = "autocomplete-item"
      itemDiv.style.cssText = `
                padding: 10px;
                cursor: pointer;
                border-bottom: 1px solid #eee;
                transition: background-color 0.2s;
            `
      itemDiv.textContent = city

      itemDiv.addEventListener("click", () => {
        input.value = city
        closeAllLists()
      })

      itemDiv.addEventListener("mouseenter", function () {
        removeActive()
        this.classList.add("active")
        this.style.backgroundColor = "#f8f9fa"
      })

      itemDiv.addEventListener("mouseleave", function () {
        this.style.backgroundColor = ""
      })

      listDiv.appendChild(itemDiv)
    })

    input.parentNode.style.position = "relative"
    input.parentNode.appendChild(listDiv)
  })

  input.addEventListener("keydown", function (e) {
    const list = this.parentNode.querySelector(".autocomplete-list")
    if (!list) return

    const items = list.querySelectorAll(".autocomplete-item")

    if (e.keyCode === 40) {
      // Down arrow
      currentFocus++
      addActive(items)
    } else if (e.keyCode === 38) {
      // Up arrow
      currentFocus--
      addActive(items)
    } else if (e.keyCode === 13) {
      // Enter
      e.preventDefault()
      if (currentFocus > -1 && items[currentFocus]) {
        items[currentFocus].click()
      }
    } else if (e.keyCode === 27) {
      // Escape
      closeAllLists()
    }
  })

  function addActive(items) {
    if (!items) return
    removeActive()
    if (currentFocus >= items.length) currentFocus = 0
    if (currentFocus < 0) currentFocus = items.length - 1
    items[currentFocus].classList.add("active")
    items[currentFocus].style.backgroundColor = "#007bff"
    items[currentFocus].style.color = "white"
  }

  function removeActive() {
    const items = document.querySelectorAll(".autocomplete-item")
    items.forEach((item) => {
      item.classList.remove("active")
      item.style.backgroundColor = ""
      item.style.color = ""
    })
  }

  function closeAllLists() {
    const lists = document.querySelectorAll(".autocomplete-list")
    lists.forEach((list) => list.remove())
    currentFocus = -1
  }

  // Close lists when clicking outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".autocomplete-list") && e.target !== input) {
      closeAllLists()
    }
  })
}

// Setup scroll to top button
function setupScrollToTop() {
  const scrollButton = document.createElement("button")
  scrollButton.innerHTML = '<i class="fas fa-arrow-up"></i>'
  scrollButton.className = "scroll-to-top"
  scrollButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        background: #007bff;
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: none;
        z-index: 1000;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        transition: all 0.3s ease;
    `

  document.body.appendChild(scrollButton)

  scrollButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  })

  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 300) {
      scrollButton.style.display = "block"
    } else {
      scrollButton.style.display = "none"
    }
  })
}

// Handle window resize
function handleWindowResize() {
  // Close mobile menu if window is resized to desktop
  if (window.innerWidth > 768) {
    const navbarCollapse = document.querySelector(".navbar-collapse")
    if (navbarCollapse && navbarCollapse.classList.contains("show")) {
      navbarCollapse.classList.remove("show")
    }
  }

  // Adjust search card layout
  adjustSearchCardLayout()
}

// Adjust search card layout
function adjustSearchCardLayout() {
  const searchCard = document.querySelector(".search-card")
  if (!searchCard) return

  if (window.innerWidth < 768) {
    searchCard.style.margin = "1rem"
    searchCard.style.padding = "1.5rem"
  } else {
    searchCard.style.margin = ""
    searchCard.style.padding = "2rem"
  }
}

// Handle online status
function handleOnlineStatus() {
  showAlert("You are back online!", "success")
  // Retry any failed requests
  retryFailedRequests()
}

// Handle offline status
function handleOfflineStatus() {
  showAlert("You are currently offline. Some features may not work.", "warning")
}

// Retry failed requests
function retryFailedRequests() {
  // Implementation for retrying failed requests
  console.log("Retrying failed requests...")
}

// Toggle mobile menu
function toggleMobileMenu() {
  const navbarCollapse = document.querySelector(".navbar-collapse")
  if (navbarCollapse) {
    navbarCollapse.classList.toggle("show")
  }
}

// Load user session
function loadUserSession() {
  const userSession = localStorage.getItem("starblue_user_session")
  if (userSession) {
    try {
      currentUser = JSON.parse(userSession)
      updateUIForLoggedInUser()
    } catch (error) {
      console.error("Error loading user session:", error)
      localStorage.removeItem("starblue_user_session")
    }
  }
}

// Update UI for logged in user
function updateUIForLoggedInUser() {
  if (!currentUser) return

  // Update navigation
  const loginLink = document.querySelector('a[href*="login"]')
  const signupLink = document.querySelector('a[href*="signup"]')

  if (loginLink) loginLink.style.display = "none"
  if (signupLink) signupLink.style.display = "none"

  // Show user menu
  const userMenu = document.querySelector(".dropdown")
  if (userMenu) userMenu.style.display = "block"
}

// Initialize animations
function initializeAnimations() {
  // Intersection Observer for scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-fadeInUp")
        observer.unobserve(entry.target)
      }
    })
  }, observerOptions)

  // Observe elements for animation
  const animateElements = document.querySelectorAll(".feature-card, .destination-card, .result-card")
  animateElements.forEach((element) => {
    observer.observe(element)
  })
}

// Initialize lazy loading
function initializeLazyLoading() {
  const lazyImages = document.querySelectorAll("img[data-src]")

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target
        img.src = img.dataset.src
        img.classList.remove("clipart-lazy")
        img.classList.add("loaded")
        imageObserver.unobserve(img)
      }
    })
  })

  lazyImages.forEach((img) => {
    img.classList.add("clipart-lazy")
    imageObserver.observe(img)
  })
}

// Show alert message
function showAlert(message, type = "info") {
  const alertDiv = document.createElement("div")
  alertDiv.className = `alert alert-${type} alert-dismissible fade show`
  alertDiv.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 1050;
        min-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `

  alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `

  document.body.appendChild(alertDiv)

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (alertDiv.parentNode) {
      alertDiv.remove()
    }
  }, 5000)
}

// Utility functions
const utils = {
  // Format currency
  formatCurrency: (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount),

  // Format date
  formatDate: (date) =>
    new Intl.DateTimeFormat("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(date)),

  // Format time
  formatTime: (time) =>
    new Intl.DateTimeFormat("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(`2000-01-01T${time}`)),

  // Debounce function
  debounce: (func, wait) => {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  },

  // Throttle function
  throttle: (func, limit) => {
    let inThrottle
    return function () {
      const args = arguments
      
      if (!inThrottle) {
        func.apply(this, args)
        inThrottle = true
        setTimeout(() => (inThrottle = false), limit)
      }
    }
  },

  // Generate random ID
  generateId: () => Math.random().toString(36).substr(2, 9),

  // Validate email
  validateEmail: (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  },

  // Validate phone
  validatePhone: (phone) => {
    const re = /^[6-9]\d{9}$/
    return re.test(phone.replace(/\D/g, ""))
  },
}

// Export utils for use in other scripts
window.StarBlueUtils = utils

// Service Worker registration
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("ServiceWorker registration successful")
      })
      .catch((error) => {
        console.log("ServiceWorker registration failed")
      })
  })
}

// Error handling
window.addEventListener("error", (event) => {
  console.error("Global error:", event.error)
  // You can send error reports to your analytics service here
})

window.addEventListener("unhandledrejection", (event) => {
  console.error("Unhandled promise rejection:", event.reason)
  // You can send error reports to your analytics service here
})

// Performance monitoring
window.addEventListener("load", () => {
  setTimeout(() => {
    const perfData = performance.getEntriesByType("navigation")[0]
    console.log("Page load time:", perfData.loadEventEnd - perfData.loadEventStart, "ms")
  }, 0)
})

console.log("STARBLUE Travel App JavaScript loaded successfully!")

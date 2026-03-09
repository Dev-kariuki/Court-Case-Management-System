// DOM Content Loaded Event
document.addEventListener("DOMContentLoaded", function () {
  $.ajax({
    url: "logic/get-dash-legal.php",
    method: "GET",
    dataType: "json",
    success: function (data) {
      loadDashboard(data);
    },
  });
});

// Load Dashboard Content
function loadDashboard(data) {
  const rootElement = document.getElementById("root");

  // Create dashboard structure
  const dashboardHTML = `
    <div class="dashboard-container">
      <header class="dashboard-header">
        <h1>Legal Dashboard</h1>
        <div class="date">${formatDate(new Date())}</div>
      </header>
      
      <div class="stats-container" id="stats-container">
        <!-- Stats cards will be inserted here -->
      </div>
      
      <div class="dashboard-grid">
        <div style="display: flex; flex-direction: column;">
          <div class="cases-section" id="cases-section">
            <!-- Cases section will be inserted here -->
          </div>
            <div id="events-section">
              <!-- Events section will be inserted here -->
            </div>
            <div id="tasks-section">
              <!-- Tasks section will be inserted here -->
            </div>
        </div>
          
          <div class="dashboard-sidebar">
            <div id="court-dates-section">
              <!-- Court dates section will be inserted here -->
            </div>
            <div id="announcements-section">
              <!-- Announcements section will be inserted here -->
            </div>
          </div>
      </div>
    </div>
  `;

  // Add dashboard to DOM
  rootElement.innerHTML = dashboardHTML;

  // Load individual sections
  loadStatsCards(data);
  loadCasesSection(data);
  loadTasksSection(data);
  loadEventsSection(data);
  loadCourtDatesSection(data);
  loadAnnouncementsSection(data);
}

// Format date to locale string
function formatDate(date) {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Load Stats Cards
function loadStatsCards(data) {
  const statsContainer = document.getElementById("stats-container");

  // Create stats cards
  const statsCardsHTML = `
    <div class="stats-card">
      <div class="stats-icon">
        <i class="fas fa-user-group"></i>
      </div>
      <div class="stats-content">
        <h3>${data.members.length}</h3>
        <p>Members</p>
      </div>
    </div>
    <div class="stats-card">
      <div class="stats-icon">
        <i class="fas fa-gavel"></i>
      </div>
      <div class="stats-content">
        <h3>${data.legalCases.length}</h3>
        <p>Legal Cases</p>
      </div>
    </div>
    <div class="stats-card">
      <div class="stats-icon">
        <i class="fas fa-folder"></i>
      </div>
      <div class="stats-content">
        <h3>${data.miscellaneousCases.length}</h3>
        <p>Misc Cases</p>
      </div>
    </div>
    <div class="stats-card">
      <div class="stats-icon">
        <i class="fas fa-home"></i>
      </div>
      <div class="stats-content">
        <h3>${data.conveyancingCases.length}</h3>
        <p>Conveyancing</p>
      </div>
    </div>
  `;

  // Add stats cards to DOM
  statsContainer.innerHTML = statsCardsHTML;
}

// Load Cases Section
function loadCasesSection(data) {
  const casesSection = document.getElementById("cases-section");

  // Create cases section structure
  const casesSectionHTML = `
    <div class="section cases-section">
      <div class="section-header">
        <h2>Latest Cases</h2>
        <div class="tabs">
          <button class="active" data-tab="legal">Legal</button>
          <button data-tab="misc">Miscellaneous</button>
          <button data-tab="conveyancing">Conveyancing</button>
        </div>
      </div>
      
      <div class="section-content">
        <div class="cases-table" id="cases-table">
          <!-- Case table will be inserted here -->
        </div>
      </div>
    </div>
  `;

  // Add cases section to DOM
  casesSection.innerHTML = casesSectionHTML;

  // Set up tab functionality
  const tabButtons = document.querySelectorAll(".tabs button");
  tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Remove active class from all tabs
      tabButtons.forEach((btn) => btn.classList.remove("active"));

      // Add active class to clicked tab
      this.classList.add("active");

      // Update cases table based on selected tab
      const tabName = this.getAttribute("data-tab");
      renderCasesTable(tabName, data);
    });
  });

  // Initialize cases table with legal cases
  renderCasesTable("legal", data);
}

$(document).on("click", ".clickable-row", function () {
  window.location.href = $(this).data("href");
});

$(document).on("click", ".clickable-task", function () {
  window.location.href = $(this).data("href");
});

$(document).on("click", ".clickable-event", function () {
  window.location.href = $(this).data("href");
});

$(document).on("click", ".clickable-announcement", function () {
  window.location.href = $(this).data("href");
});

$(document).on("click", ".clickable-court-date", function () {
  window.location.href = $(this).data("href");
});

// Render cases table based on tab
function renderCasesTable(tabName, data) {
  const casesTableElement = document.getElementById("cases-table");
  let cases;

  // Get cases based on tab name
  switch (tabName) {
    case "legal":
      cases = data.legalCases;
      break;
    case "misc":
      cases = data.miscellaneousCases;
      break;
    case "conveyancing":
      cases = data.conveyancingCases;
      break;
    default:
      cases = [];
  }

  // Get the latest 5 cases
  const latestCases = cases.slice(0, 5);

  // Create cases table
  let casesTableHTML = `
    <table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Status</th>
          <th>Next Court Date</th>
          <th>Advocate</th>
        </tr>
      </thead>
      <tbody>
  `;

  // Add case rows
  if (latestCases.length > 0) {
    latestCases.forEach((caseItem) => {
      const date = new Date(caseItem.nextCourtDate);
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      const formattedDate = date.toLocaleDateString("en-US", options);
      casesTableHTML += `
        <tr class="clickable-row" data-href=${
          tabName == "legal"
            ? "case.php?id=" + caseItem.id
            : tabName == "misc"
            ? "miscellaneous.php?id=" + caseItem.id
            : "conveyancing.php?id=" + caseItem.id
        }>
          <td>${caseItem.title}</td>
          <td>
            <span class="status-badge ${
              caseItem.status == "0" ? "active" : "closed"
            }">
              ${caseItem.status == "0" ? "Active" : "Closed"}
            </span>
          </td>
          <td>${formattedDate != "Invalid Date" ? formattedDate : "N/A"}</td>
          <td>${caseItem.advocate}</td>
        </tr>
      `;
    });
  } else {
    casesTableHTML += `
      <tr>
        <td colspan="4" class="no-data">No cases to display</td>
      </tr>
    `;
  }

  casesTableHTML += `
      </tbody>
    </table>
  `;

  // Add cases table to DOM
  casesTableElement.innerHTML = casesTableHTML;
}

// Update add case button URL
function updateAddCaseButton(tabName) {
  const addCaseButton = document.getElementById("add-case-button");
  addCaseButton.href = `/add-${tabName}-case`;
}

// Load Tasks Section
function loadTasksSection(data) {
  const tasksSection = document.getElementById("tasks-section");

  // Get the latest 5 tasks
  const latestTasks = data.tasks.slice(0, 5);

  // Create tasks section
  let tasksSectionHTML = `
    <div class="section tasks-section">
      <div class="section-header">
        <h2>Latest Tasks</h2>
      </div>
      
      <ul class="task-list">
  `;

  // Add task items
  if (latestTasks.length > 0) {
    latestTasks.forEach((task) => {
      tasksSectionHTML += `
        <li class="task-item clickable-task" data-href="task.php?id=${task.id}">
          <div class="task-title">${task.title}</div>
          <span class="status-badge ${
            task.assigned_to == null
              ? "unassigned"
              : task.completed_by == null
              ? "assigned"
              : "completed"
          }">
            ${
              task.assigned_to == null
                ? "Unassigned"
                : task.completed_by == null
                ? "Assigned"
                : "Completed"
            }
          </span>
        </li>

      `;
    });
  } else {
    tasksSectionHTML += `
      <li class="no-data">No tasks to display</li>
    `;
  }

  tasksSectionHTML += `
      </ul>
    </div>
  `;

  // Add tasks section to DOM
  tasksSection.innerHTML = tasksSectionHTML;
}

// Load Events Section
function loadEventsSection(data) {
  const eventsSection = document.getElementById("events-section");

  // Get the latest 5 events
  const latestEvents = data.events.slice(0, 5);

  // Create events section
  let eventsSectionHTML = `
    <div class="section events-section">
      <div class="section-header">
        <h2>Latest Events</h2>
      </div>
      
      <ul class="event-list">
  `;

  // Add event items
  if (latestEvents.length > 0) {
    latestEvents.forEach((event) => {
      const startDate = new Date(event.startDateTime);
      const endDate = new Date(event.endDateTime);

      eventsSectionHTML += `
        <li class="event-item clickable-event" data-href="calendar.php">
          <div class="event-title">${event.title}</div>
          <div class="event-time">
            <i class="far fa-calendar"></i>
            ${startDate.toLocaleDateString()} | 
            ${startDate.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })} - 
            ${endDate.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </li>

      `;
    });
  } else {
    eventsSectionHTML += `
      <li class="no-data">No events to display</li>
    `;
  }

  eventsSectionHTML += `
      </ul>
    </div>
  `;

  // Add events section to DOM
  eventsSection.innerHTML = eventsSectionHTML;
}

// Load Court Dates Section
function loadCourtDatesSection(data) {
  const courtDatesSection = document.getElementById("court-dates-section");

  // Get the latest 5 court dates
  const latestCourtDates = data.courtDates.slice(0, 5);

  // Create court dates section
  let courtDatesSectionHTML = `
    <div class="section court-dates-section">
      <div class="section-header">
        <h2>Court Dates</h2>
      </div>
      
      <ul class="court-date-list">
  `;

  // Add court date items
  if (latestCourtDates.length > 0) {
    latestCourtDates.forEach((courtDate) => {
      courtDatesSectionHTML += `
        <li class="court-date-item clickable-court-date" data-href="case.php?id=${
          courtDate.case_id
        }#timeline-item-dash${courtDate.id}">
          <div class="court-date-title">${courtDate.title}</div>
          <div class="court-date-info">
            <div>
              <i class="far fa-calendar"></i>
              ${new Date(courtDate.date).toLocaleDateString()}
            </div>
            <div>
              <i class="fas fa-user-tie"></i>
              ${courtDate.advocate}
            </div>
          </div>
          <div class="court-date-description">${courtDate.description}</div>
          <span class="status-badge ${
            courtDate.status == 0 ? "pending" : "completed"
          }">
            ${courtDate.status == 0 ? "Pending" : "Completed"}
          </span>
        </li>

      `;
    });
  } else {
    courtDatesSectionHTML += `
      <li class="no-data">No court dates to display</li>
    `;
  }

  courtDatesSectionHTML += `
      </ul>
    </div>
  `;

  // Add court dates section to DOM
  courtDatesSection.innerHTML = courtDatesSectionHTML;
}

// Load Announcements Section
function loadAnnouncementsSection(data) {
  const announcementsSection = document.getElementById("announcements-section");

  // Get the latest 5 announcements
  const latestAnnouncements = data.announcements.slice(0, 5);

  // Create announcements section
  let announcementsSectionHTML = `
    <div class="section announcements-section">
      <div class="section-header">
        <h2>Latest Announcements</h2>
      </div>
      
      <ul class="announcement-list">
  `;

  // Add announcement items
  if (latestAnnouncements.length > 0) {
    latestAnnouncements.forEach((announcement) => {
      announcementsSectionHTML += `
        <li class="announcement-item clickable-announcement" data-href="announcements.php#${
          announcement.id
        }">
          <div class="announcement-title">${announcement.title}</div>
          <div class="announcement-date">
            <i class="far fa-calendar-alt"></i>
            ${new Date(announcement.date_created).toLocaleDateString()}
          </div>
        </li>

      `;
    });
  } else {
    announcementsSectionHTML += `
      <li class="no-data">No announcements to display</li>
    `;
  }

  announcementsSectionHTML += `
      </ul>
    </div>
  `;

  // Add announcements section to DOM
  announcementsSection.innerHTML = announcementsSectionHTML;
}

<?php require_once 'components/sidebar.php';?>
      <div class="calendar animate-fadeUp">
        <div class="app-container">
          <header class="app-header">
            <div class="header-center">
              <h2 id="current-month-year">February 2025</h2>
              <div class="nav-buttons">
                <button id="prev-btn" class="btn btn-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </button>
                <button id="next-btn" class="btn btn-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              </div>
            </div>
            <div class="header-right">
              <div class="view-options">
                <button data-view="dayGridMonth" class="btn btn-view">
                  Month
                </button>
                <button class="btn btn-view" data-view="listDay">
                  Upcoming
                </button>
                <button data-view="timeGridWeek" class="btn btn-view">
                  Week
                </button>
                <button data-view="timeGridDay" class="btn btn-view">
                  Day
                </button>
              </div>
              <button id="create-event-btn" class="btn btn-primary">
                Create
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
            </div>
          </header>
          <main class="app-content">
            <div class="sidebar">
              <div class="mini-calendar-container" id="mini-calendar"></div>
              <div class="calendar-lists">
                <div class="calendar-section">
                  <div class="section-header">
                    <h3>My Calendars</h3>
                  </div>
                  <div class="calendar-list" id="my-calendars">
                    <div class="calendar-item" data-calendar="my">
                      <label class="checkbox-container">
                        <input
                          type="checkbox"
                          class="calendar-checkbox"
                          data-color="#4285F4"
                          checked
                        />
                        <span
                          class="checkmark"
                          style="background-color: #4285f4"
                        ></span>
                        <span class="calendar-name"><?php echo $_SESSION['name']?></span>
                      </label>
                    </div>
                    <div class="calendar-item" data-calendar="tasks">
                      <label class="checkbox-container">
                        <input
                          type="checkbox"
                          class="calendar-checkbox"
                          data-color="#EA4335"
                          checked
                        />
                        <span
                          class="checkmark"
                          style="background-color: #ea4335"
                        ></span>
                        <span class="calendar-name">My Tasks</span>
                      </label>
                    </div>
                    <div class="calendar-item" data-calendar="other">
                      <label class="checkbox-container">
                        <input
                          type="checkbox"
                          class="calendar-checkbox"
                          data-color="#4285F4"
                          checked
                        />
                        <span
                          class="checkmark"
                          style="background-color: rgb(251, 188, 5)"
                        ></span>
                        <span class="calendar-name">Other tasks</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div class="calendar-section">
                  <div class="section-header">
                    <h3>Public Calendars</h3>
                  </div>
                  <div class="calendar-list" id="public-calendars">
                    <div class="calendar-item" data-calendar="company">
                      <label class="checkbox-container">
                        <input
                          type="checkbox"
                          class="calendar-checkbox"
                          data-color="#34A853"
                          checked
                        />
                        <span
                          class="checkmark"
                          style="background-color: #34a853"
                        ></span>
                        <span class="calendar-name">Company Calendar</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div id="calendar-container">
              <div id="calendar"></div>
              <div id="list-calendar"></div>
            </div>

          </main>
        </div>
        <div class="modal" id="event-modal">
          <div class="modal-content">
            <div class="modal-header">
              <h3 id="modal-title">Create Task</h3>
              <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
              <form id="event-form">
                <div class="form-group">
                  <input
                    type="text"
                    id="event-title"
                    placeholder="Add title"
                    required
                  />
                </div>
                <div class="form-group">
                  <div class="date-time-group">
                    <div>
                      <label for="event-start">Start</label>
                      <input type="datetime-local" id="event-start" required />
                    </div>
                    <div>
                      <label for="event-end">End</label>
                      <input type="datetime-local" id="event-end" required />
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <select id="event-calendar">
                    <option value="my">My Calendar</option>
                    <option value="tasks">My Tasks</option>
                    <option value="other">Other Tasks</option>
                    <option value="company">Company Calendar</option>
                  </select>
                </div>
                <div class="form-group">
                  <textarea
                    id="event-description"
                    placeholder="Add description"
                  ></textarea>
                </div>
                <div
                  class="form-group form-actions"
                  style="flex-direction: row"
                >
                  <button
                    type="button"
                    id="delete-event"
                    class="btn btn-danger"
                  >
                    Delete
                  </button>
                  <button type="submit" class="btn btn-primary">Save</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
    <?php require_once 'components/chat-notification.php';?>
    <script src="https://cdn.jsdelivr.net/npm/fullcalendar@5.11.3/main.min.js"></script>
    <script src="script/app.js"></script>
    <script src="script/calendar.js"></script>
  </body>
</html>

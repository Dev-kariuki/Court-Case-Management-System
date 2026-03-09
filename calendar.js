document.addEventListener("DOMContentLoaded", function () {
  // Initialize variables to store application state
  let calendar;
  let listCalendar;
  let miniCalendar;
  let currentView = "timeGridWeek";
  let eventModal = document.getElementById("event-modal");
  let eventForm = document.getElementById("event-form");
  let modalTitle = document.getElementById("modal-title");
  let deleteEventBtn = document.getElementById("delete-event");
  let currentEventId = null;
  let events = [];

  function fetchEvents(callback) {
    $.ajax({
      url: "logic/get-events.php",
      method: "GET",
      success: function (response) {
        const events = JSON.parse(response);
        callback(events); // this gives you access to the events *after* they're ready
      },
      error: function (error) {
        console.error("Error fetching events:", error);
      },
    });
  }

  fetchEvents(function (events) {
    // Initialize FullCalendar
    initializeCalendars(events);
  });

  // Initialize event listeners
  initializeEventListeners();

  // Calendar initialization function
  function initializeCalendars(events) {
    const today = new Date();
    // Initialize main calendar
    const calendarEl = document.getElementById("calendar");
    const listEl = document.getElementById("list-calendar");
    calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: "dayGridMonth",
      views: {
        listDay: {
          type: "list",
          duration: { days: 365 },
          buttonText: "Upcoming",
        },
      },
      headerToolbar: false, // We're using our custom header
      height: "100%",
      nowIndicator: true,
      allDaySlot: true,
      navLinks: false,
      selectable: true,
      selectMirror: true,
      editable: true,
      dayMaxEvents: true,
      weekNumbers: false,
      slotMinTime: "06:00:00",
      slotMaxTime: "22:00:00",
      events: events,
      dateClick: function (info) {
        updateListCalendar(info, events);
      },
      select: function (info) {
        updateListCalendar(info, events);
      },
      eventClick: handleEventClick,
      eventDrop: handleEventDrop,
      eventResize: handleEventResize,
      eventDidMount: function (info) {
        // Add hover effect to events
        info.el.addEventListener("mouseover", function () {
          info.el.style.boxShadow = "0 2px 6px rgba(0, 0, 0, 0.15)";
        });
        info.el.addEventListener("mouseout", function () {
          info.el.style.boxShadow = "none";
        });
      },
    });

    listCalendar = new FullCalendar.Calendar(listEl, {
      initialView: "listDay",
      initialDate: today,
      headerToolbar: {
        left: "",
        center: "title",
        right: "",
      },
      events: filterEventsByDate(events, today),
    });

    calendar.render();
    listCalendar.render();

    // Initialize mini calendar in sidebar
    const miniCalendarEl = document.getElementById("mini-calendar");
    miniCalendar = new FullCalendar.Calendar(miniCalendarEl, {
      initialView: "dayGridMonth",
      headerToolbar: {
        left: "prev,next",
        center: "title",
        right: "",
      },
      height: "auto",
      dayMaxEvents: 0, // Don't show events
      selectable: true,
      select: function (info) {
        calendar.gotoDate(info.start);
      },
      dateClick: function (info) {
        const clickedDate = new Date(
          info.date.getFullYear(),
          info.date.getMonth(),
          info.date.getDate()
        );

        calendar.gotoDate(clickedDate);
        updateListCalendar(info, events);
        updateHeaderDate();
        // calendar.changeView("listDay", clickedDate);
      },
    });

    miniCalendar.render();

    // Update header title
    updateHeaderDate();
  }

  function updateListCalendar(info, allEvents) {
    const clickedDateStr = info.startStr || info.dateStr;

    const clickedDate = new Date(clickedDateStr);
    clickedDate.setHours(0, 0, 0, 0); // Normalize

    const filtered = allEvents.filter((event) => {
      const eventStart = new Date(event.start);
      const eventEnd = event.end ? new Date(event.end) : eventStart;

      eventStart.setHours(0, 0, 0, 0);
      eventEnd.setHours(0, 0, 0, 0);

      return clickedDate >= eventStart && clickedDate <= eventEnd;
    });

    listCalendar.gotoDate(clickedDate);
    listCalendar.removeAllEvents();
    listCalendar.addEventSource(filtered);
  }

  function filterEventsByDate(events, date) {
    const selected = new Date(date);
    selected.setHours(0, 0, 0, 0);

    return events.filter((event) => {
      const start = new Date(event.start);
      start.setHours(0, 0, 0, 0);
      return start.getTime() === selected.getTime();
    });
  }

  // Initialize event listeners
  function initializeEventListeners() {
    // View option buttons
    document.querySelectorAll(".btn-view").forEach((button) => {
      button.addEventListener("click", function () {
        document.querySelectorAll(".btn-view").forEach((btn) => {
          btn.classList.remove("active");
        });
        this.classList.add("active");

        currentView = this.getAttribute("data-view");

        // Fetch events again and apply filtering only for "listUpcoming"
        fetchEvents(function (events) {
          let filteredEvents = events;

          if (currentView === "listDay") {
            const now = new Date();
            filteredEvents = events.filter(
              (event) => new Date(event.start) >= now
            );
          }

          calendar.removeAllEvents(); // Clear existing events
          calendar.addEventSource(filteredEvents); // Load filtered or full events
          calendar.changeView(currentView); // Change the view
        });
      });
    });

    // //Search date
    // document
    //   .getElementById("search-date-btn")
    //   .addEventListener("click", function () {
    //     const searchDate = document.getElementById("search-date").value;

    //     if (!searchDate) {
    //       showToast("Please select a valid date to search.");
    //       return;
    //     }

    //     const selectedDate = new Date(searchDate);
    //     selectedDate.setHours(0, 0, 0, 0); // Normalize time

    //     fetchEvents(function (events) {
    //       const filtered = events.filter((event) => {
    //         const eventStart = new Date(event.start);
    //         return eventStart >= selectedDate;
    //       });

    //       calendar.removeAllEvents();
    //       calendar.addEventSource(filtered);
    //       calendar.changeView("listUpcoming");
    //     });
    //   });

    // //Reset search
    // document
    //   .getElementById("reset-date-btn")
    //   .addEventListener("click", function () {
    //     fetchEvents(function (events) {
    //       const now = new Date();
    //       const upcoming = events.filter(
    //         (event) => new Date(event.start) >= now
    //       );
    //       calendar.removeAllEvents();
    //       calendar.addEventSource(upcoming);
    //       calendar.changeView("listUpcoming");
    //     });
    //   });

    // // Today button
    // document.getElementById("today-btn").addEventListener("click", function () {
    //   calendar.today();
    //   miniCalendar.today();
    //   updateHeaderDate();
    // });

    // Previous button
    document.getElementById("prev-btn").addEventListener("click", function () {
      calendar.prev();
      miniCalendar.prev();
      updateHeaderDate();
    });

    // Next button
    document.getElementById("next-btn").addEventListener("click", function () {
      calendar.next();
      miniCalendar.next();
      updateHeaderDate();
    });

    // Create event button
    document
      .getElementById("create-event-btn")
      .addEventListener("click", function () {
        openEventModal();
      });

    // Close modal
    document
      .querySelector(".close-modal")
      .addEventListener("click", function () {
        closeEventModal();
      });

    // Close modal when clicking outside
    window.addEventListener("click", function (event) {
      if (event.target === eventModal) {
        closeEventModal();
      }
    });

    // Event form submission
    eventForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const eventData = {
        title: document.getElementById("event-title").value,
        start: document.getElementById("event-start").value,
        end: document.getElementById("event-end").value,
        calendar: document.getElementById("event-calendar").value,
        description: document.getElementById("event-description").value,
      };

      if (currentEventId) {
        // Update existing event
        updateEvent(currentEventId, eventData);
      } else {
        // Create new event
        createEvent(eventData);
      }

      closeEventModal();
    });

    // Delete event button
    deleteEventBtn.addEventListener("click", function () {
      if (currentEventId) {
        deleteEvent(currentEventId);
        closeEventModal();
      }
    });

    // Calendar checkboxes
    document.querySelectorAll(".calendar-checkbox").forEach((checkbox) => {
      checkbox.addEventListener("change", function () {
        const calendarType = this.closest(".calendar-item")
          .querySelector(".calendar-name")
          .textContent.trim();

        // Filter events based on checkboxes
        filterEvents();
      });
    });
  }

  // Handle date selection for creating events

  // function handleDateSelect(info) {
  //   openEventModal({
  //     start: info.startStr,
  //     end: info.endStr,
  //   });

  //   updateListCalendar(info.startStr, events);

  //   calendar.unselect();
  // }

  // Handle event click for editing
  function handleEventClick(info) {
    const event = info.event;

    openEventModal({
      id: event.id,
      title: event.title,
      start: event.startStr,
      end: event.endStr,
      calendar: event.extendedProps.calendar || "my",
      description: event.extendedProps.description || "",
    });
  }

  // Handle event drop (drag and drop)
  function handleEventDrop(info) {
    updateEvent(info.event.id, {
      start: info.event.startStr,
      end: info.event.endStr,
    });
  }

  // Handle event resize
  function handleEventResize(info) {
    updateEvent(info.event.id, {
      start: info.event.startStr,
      end: info.event.endStr,
    });
  }

  // Open event modal
  function openEventModal(eventData = null) {
    // Reset form
    eventForm.reset();

    // Set modal title and show/hide delete button
    if (eventData && eventData.id) {
      modalTitle.textContent = "Edit Task";
      deleteEventBtn.style.display = "block";
      currentEventId = eventData.id;

      // Fill form with event data
      document.getElementById("event-title").value = eventData.title || "";
      document.getElementById("event-start").value = eventData.start
        ? formatDateTimeForInput(eventData.start)
        : "";
      document.getElementById("event-end").value = eventData.end
        ? formatDateTimeForInput(eventData.end)
        : "";
      document.getElementById("event-calendar").value =
        eventData.calendar || "my";
      document.getElementById("event-description").value =
        eventData.description || "";
    } else {
      modalTitle.textContent = "Create Task";
      deleteEventBtn.style.display = "none";
      currentEventId = null;

      // Set start and end time if provided (from date selection)
      if (eventData) {
        document.getElementById("event-start").value = eventData.start
          ? formatDateTimeForInput(eventData.start)
          : "";
        document.getElementById("event-end").value = eventData.end
          ? formatDateTimeForInput(eventData.end)
          : "";
      } else {
        // Default to current time + 1 hour
        const now = new Date();
        const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

        document.getElementById("event-start").value = formatDateTimeForInput(
          now.toISOString()
        );
        document.getElementById("event-end").value = formatDateTimeForInput(
          oneHourLater.toISOString()
        );
      }
    }

    // Show modal
    eventModal.style.display = "flex";
  }

  // Close event modal
  function closeEventModal() {
    eventModal.style.display = "none";
    currentEventId = null;
  }

  // Create new event
  function createEvent(eventData) {
    const color = getCalendarColor(eventData.calendar);
    eventData.backgroundColor = color;
    eventData.borderColor = color;

    $.ajax({
      url: "logic/add-event.php",
      method: "POST",
      data: eventData,
      success: function (response) {
        const newEvent = {
          ...eventData,
          id: response,
        };
        calendar.addEvent(newEvent);
        showToast("Event created successfully!");
      },
      error: function (error) {
        console.error("Error creating event:", error);
      },
    });
  }

  // Update existing event
  function updateEvent(id, eventData) {
    const color = getCalendarColor(eventData.calendar);
    eventData.backgroundColor = color;
    eventData.borderColor = color;

    $.ajax({
      url: "logic/update-event.php",
      method: "POST",
      data: { ...eventData, id },
      success: function (response) {
        const calendarEvent = calendar.getEventById(id);
        if (calendarEvent) {
          calendarEvent.setProp("title", eventData.title);
          calendarEvent.setStart(eventData.start);
          calendarEvent.setEnd(eventData.end);
          calendarEvent.setProp("backgroundColor", color);
          calendarEvent.setProp("borderColor", color);
          calendarEvent.setExtendedProp("calendar", eventData.calendar);
          calendarEvent.setExtendedProp("description", eventData.description);
        }

        showToast("Event updated successfully!");
      },
      error: function (error) {
        console.error("Error updating event:", error);
      },
    });
  }

  // Delete event
  function deleteEvent(id) {
    $.ajax({
      url: "logic/delete-event.php",
      method: "POST",
      data: { id: id },
      success: function (response) {
        console.log(response);
      },
      error: function (error) {
        console.error("Error fetching events:", error);
      },
    });

    // Remove from calendar
    const event = calendar.getEventById(id);
    if (event) {
      event.remove();
    }

    // Show success message
    showToast("Event deleted successfully!");
  }

  // Filter events based on calendar checkboxes
  function filterEvents() {
    const checkedCalendars = {};
    document.querySelectorAll(".calendar-checkbox").forEach((checkbox) => {
      const calendarType =
        checkbox.closest(".calendar-item")?.dataset?.calendar;
      checkedCalendars[calendarType] = checkbox.checked;
    });

    // Remove all current events
    calendar.getEvents().forEach((event) => event.remove());

    fetchEvents(function (events) {
      events.forEach((event) => {
        const calendarType = event.calendar;
        const isVisible = checkedCalendars[calendarType];

        if (isVisible) {
          const color = getCalendarColor(calendarType);
          calendar.addEvent({
            ...event,
            backgroundColor: color,
            borderColor: color,
          });
        }
      });
    });
  }

  // Get calendar color
  function getCalendarColor(calendar) {
    switch (calendar) {
      case "my":
        return "#4285F4"; // Blue
      case "tasks":
        return "#EA4335"; // Red
      case "other":
        return "#FBBC05"; // Yellow
      case "company":
        return "#34A853"; // Green
    }
  }

  // Format date for input fields
  function formatDateTimeForInput(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  // Update header date based on current calendar view
  function updateHeaderDate() {
    const date = calendar.getDate();
    const view = calendar.view;

    let dateText = "";

    if (view.type === "timeGridDay" || view.type === "dayGridDay") {
      dateText = date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    } else if (view.type === "timeGridWeek" || view.type === "dayGridWeek") {
      const start = calendar.view.activeStart;
      const end = calendar.view.activeEnd;
      const startMonth = start.toLocaleDateString("en-US", { month: "long" });
      const endMonth = end.toLocaleDateString("en-US", { month: "long" });

      if (startMonth === endMonth) {
        dateText = `${startMonth} ${start.getFullYear()}`;
      } else {
        dateText = `${startMonth} - ${endMonth} ${start.getFullYear()}`;
      }
    } else {
      dateText = date.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
    }

    document.getElementById("current-month-year").textContent = dateText;
  }

  // Simple toast function
  function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "toast fade-in";
    toast.style.position = "fixed";
    toast.style.bottom = "20px";
    toast.style.left = "50%";
    toast.style.transform = "translateX(-50%)";
    toast.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    toast.style.color = "white";
    toast.style.padding = "12px 24px";
    toast.style.borderRadius = "4px";
    toast.style.zIndex = "9999";
    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  }

  // Handle window resize
  window.addEventListener("resize", function () {
    calendar.updateSize();
    miniCalendar.updateSize();
  });
});

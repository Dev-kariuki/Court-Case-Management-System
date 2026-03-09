// Task page functionality
document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const taskId = urlParams.get("id");
  const admin = localStorage.getItem("admin");
  const uid = localStorage.getItem("uid");
  const deleteBtn = document.getElementById("delete-btn");

  if (deleteBtn) {
    deleteBtn.addEventListener("click", function () {
      const confirmation = confirm(
        "Are you sure you want to delete this task? This action cannot be undone.",
      );
      if (confirmation) {
        $.ajax({
          url: "logic/delete-task.php",
          method: "GET",
          data: { taskId: taskId },
          success: function (response) {
            alert(response);
            setTimeout(() => {
              window.location.href = "index.php";
            }, 500);
          },
          error: function (error) {
            alert("Error deleting task:" + error);
          },
        });
      }
    });
  }

  // Elements
  const completeTaskBtn = document.getElementById("completeTaskBtn");
  const assignBtns = document.querySelectorAll(".assign-btn");
  const taskModal = document.getElementById("taskModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalMessage = document.getElementById("modalMessage");
  const modalConfirm = document.getElementById("modalConfirm");
  const modalCancel = document.getElementById("modalCancel");
  const closeModal = document.querySelector(".close-modal");

  // Current action for the modal
  let currentAction = "";
  let currentUserId = "";

  // Show modal with appropriate content
  function showModal(title, message, actionType, userId = null) {
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    currentAction = actionType;
    currentUserId = userId;
    taskModal.classList.add("show");
  }

  // Hide modal
  function hideModal() {
    taskModal.classList.remove("show");
    currentAction = "";
    currentUserId = "";
  }

  if (completeTaskBtn) {
    // Complete Task button click
    completeTaskBtn.addEventListener("click", function () {
      showModal(
        "Complete Task",
        "Are you sure you want to mark this task as complete? This action will notify the administrator.",
        "complete",
      );
    });
  }

  // Modal confirm button click
  modalConfirm.addEventListener("click", function () {
    switch (currentAction) {
      case "book":
        $.ajax({
          url: "logic/book-task.php",
          method: "POST",
          data: {
            taskId: taskId,
            userId: uid,
          },
          success: function (response) {
            if (response === "success") {
              bookTaskBtn.textContent = "Task Booked";
              bookTaskBtn.disabled = true;
              bookTaskBtn.classList.add("btn-outline");
              bookTaskBtn.classList.remove("btn-primary");
              console.log("Task booked");
            } else {
              alert("Failed to book task");
            }
          },
          error: function (xhr, status, error) {
            console.error("Error booking task:", error);
            alert("Failed to book task");
          },
        });
        break;

      case "complete":
        $.ajax({
          url: "logic/update-task-complete.php",
          method: "POST",
          data: {
            taskId: taskId,
            userId: uid,
          },
          success: function (response) {
            if (response === "success") {
              alert("Task has been marked as complete");
              completeTaskBtn.textContent = "Task Completed";
              completeTaskBtn.disabled = true;
              completeTaskBtn.classList.add("btn-outline");
              completeTaskBtn.classList.remove("btn-primary");
            } else {
              alert("Failed to mark task");
            }
          },
          error: function (xhr, status, error) {
            console.error("Error marking task:", error);
            alert("Failed to mark task");
          },
        });
        break;

      case "assign":
        // Simulate assigning the task
        const assignedBtn = document.querySelector(
          `[data-id="${currentUserId}"]`,
        );

        // Update all buttons first
        assignBtns.forEach((btn) => {
          btn.textContent = "Assign Task";
          btn.classList.remove("btn-primary");
          btn.classList.add("btn-outline");
        });

        // Make AJAX call to update task assignment
        $.ajax({
          url: "logic/update-tasks-assignment.php",
          method: "POST",
          data: {
            taskId: taskId,
            userId: currentUserId,
          },
          success: function (response) {
            if (response === "success") {
              // Update all buttons first
              assignBtns.forEach((btn) => {
                btn.textContent = "Assign Task";
                btn.classList.remove("btn-primary");
                btn.classList.add("btn-outline");
              });
              // Update UI after successful assignment
              assignedBtn.textContent = "Assigned";
              assignedBtn.classList.remove("btn-outline");
              assignedBtn.classList.add("btn-primary");
              alert("Task has been assigned successfully");
              fetchTaskAssignees(taskId);
            } else {
              alert("Failed to assign task");
              // Revert UI changes on error
              assignedBtn.textContent = "Assign Task";
              assignedBtn.classList.add("btn-outline");
              assignedBtn.classList.remove("btn-primary");
            }
          },
          error: function (xhr, status, error) {
            console.error("Error assigning task:", error);
            alert("Failed to assign task");
            // Revert UI changes on error
            assignedBtn.textContent = "Assign Task";
            assignedBtn.classList.add("btn-outline");
            assignedBtn.classList.remove("btn-primary");
          },
        });
        break;
    }

    // Hide the modal after action is taken
    hideModal();
  });

  // Modal cancel and close buttons
  modalCancel.addEventListener("click", hideModal);
  closeModal.addEventListener("click", hideModal);

  // Close modal when clicking outside
  window.addEventListener("click", function (event) {
    if (event.target === taskModal) {
      hideModal();
    }
  });
});

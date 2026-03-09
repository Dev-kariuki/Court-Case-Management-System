// Main application script
document.addEventListener("DOMContentLoaded", () => {
  const searchBar = document.getElementById("search-bar");
  const searchBtn = document.getElementById("search-btn");
  const uid = localStorage.getItem("uid");

  searchBtn.addEventListener("click", function () {
    const searchTerm = searchBar.value.toLowerCase();
    const teamMembers = document.querySelectorAll(".team-member-card");

    teamMembers.forEach((member) => {
      const memberName = member
        .querySelector(".member-name")
        .textContent.toLowerCase();
      if (memberName.includes(searchTerm)) {
        member.style.display = "block";
      } else {
        member.style.display = "none";
      }
    });
  });

  const admin = localStorage.getItem("admin");
  // Render each team member
  const teamGrid = document.getElementById("team-grid");
  function fetchTeam() {
    $.ajax({
      url: "logic/get-users.php",
      method: "GET",
      success: function (response) {
        const users = JSON.parse(response);
        teamGrid.innerHTML = ""; // Clear existing members
        users.forEach((user) => {
          const memberCard = createTeamMemberCard(user);
          teamGrid.appendChild(memberCard);
        });
      },
      error: function (error) {
        console.error("Error fetching users:", error);
      },
    });
  }

  fetchTeam();

  // Create team member card element
  function createTeamMemberCard(member) {
    const memberCard = document.createElement("div");
    memberCard.className = "team-member-card";

    const isAdmin = member.admin == 1 ? true : false;
    member.isAdmin = isAdmin;

    // Admin badge HTML
    const adminBadgeHTML = member.isAdmin
      ? `
      <div class="admin-badge">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shield-icon">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
        Admin
      </div>
    `
      : "";

    // Create card HTML
    memberCard.innerHTML = `
      <div class="member-image-container">
        <img src="logic/uploads/${member.file_name}" alt="${
      member.fname
    }" class="member-image">
        ${adminBadgeHTML}
      </div>
      
      <div class="member-details">
        <h3 class="member-name">${member.fname + " " + member.lname}</h3>
        <p class="member-role">${member.role}</p>
        
        ${
          admin == 1 && member.admin == 0
            ? `
              <button class="access-toggle-button" data-member-id="${member.id}">
                <span>Manage Access</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="chevron-down">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
        
              
                <button class="delete-member-button" data-member-id="${member.id}" style="
                background-color: #e74c3c;
                color: white;
                width: 100%;
                border: none;
                padding: 6px 12px;
                border-radius: 4px;
                margin-top: 8px;
                cursor: pointer;
                transition: background-color 0.3s ease;
              " onmouseover="this.style.backgroundColor='#c0392b'" onmouseout="this.style.backgroundColor='#e74c3c'">
                Delete Member
              </button>
                
        
              <div class="access-panel" id="access-panel-${member.id}">
                <!-- Access toggles will be rendered here -->
              </div>
            `
            : ""
        }
      </div>
    `;

    if (admin == 1) {
      // Add access toggles after the card is added to DOM
      const accessPanel = memberCard.querySelector(
        `#access-panel-${member.id}`
      );

      const pages = [
        { id: "fa_access", name: "Financial Audit" },
        { id: "team_access", name: "Teams" },
        { id: "tasks_access", name: "Tasks" },
        { id: "cases_access", name: "Cases" },
        { id: "calendar_access", name: "Calendar" },
        { id: "announce_access", name: "Notice" },
      ];

      pages.forEach((page) => {
        const hasAccess = member[page.id] == "1";
        const isDisabled = !member.isAdmin && page.id === "financial";

        const accessItem = document.createElement("div");
        accessItem.className = "access-item";
        accessItem.innerHTML = `
          <span class="access-label">${page.name}</span>
          <div class="access-controls">
            <button 
              class="access-button allow ${hasAccess ? "active" : ""}" 
              data-action="allow" 
              data-page="${page.id}" 
              data-member-id="${member.id}"
              ${isDisabled ? "disabled" : ""}
              title="${isDisabled ? "Access restricted" : "Allow access"}"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </button>
            
            <button 
              class="access-button deny ${!hasAccess ? "active" : ""}"
              data-action="deny" 
              data-page="${page.id}" 
              data-member-id="${member.id}"
              ${isDisabled ? "disabled" : ""}
              title="${isDisabled ? "Access restricted" : "Deny access"}"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        `;

        if (member.admin == 0) {
          accessPanel.appendChild(accessItem);
        }
      });

      // Add event listeners to toggle access panel
      const toggleButton = memberCard.querySelector(".access-toggle-button");
      if (toggleButton) {
        toggleButton.addEventListener("click", function () {
          const memberId = this.dataset.memberId;
          const panel = document.getElementById(`access-panel-${memberId}`);
          panel.classList.toggle("active");

          // Toggle chevron icon
          const chevron = this.querySelector("svg");
          if (panel.classList.contains("active")) {
            chevron.innerHTML =
              '<polyline points="18 15 12 9 6 15"></polyline>';
          } else {
            chevron.innerHTML = '<polyline points="6 9 12 15 18 9"></polyline>';
          }
        });
      }

      // Add event listeners for access toggle buttons
      const accessButtons = memberCard.querySelectorAll(".access-button");
      if (accessButtons) {
        accessButtons.forEach((button) => {
          button.addEventListener("click", function () {
            if (this.disabled) return;

            const memberId = parseInt(this.dataset.memberId);
            const page = this.dataset.page;
            const action = this.dataset.action;
            const hasAccess = action === "allow";

            $.ajax({
              url: "logic/page-access.php",
              method: "POST",
              data: { id: memberId, page: page, access: action },
              success: function (response) {
                if (response == "success") {
                  const toast = document.getElementById("success-toast");
                  const toastMessage = document.getElementById("toast-message");

                  toastMessage.textContent = `Page access has been updated successfully`;
                  toast.classList.add("show");

                  // Hide after 3 seconds
                  setTimeout(() => {
                    toast.classList.remove("show");
                  }, 3000);
                }
              },
              error: function (error) {
                console.error("Error fetching events:", error);
              },
            });

            // Update UI
            const allowButton = memberCard.querySelector(
              `.access-button[data-action="allow"][data-page="${page}"]`
            );
            const denyButton = memberCard.querySelector(
              `.access-button[data-action="deny"][data-page="${page}"]`
            );

            if (hasAccess) {
              allowButton.classList.add("active");
              denyButton.classList.remove("active");
            } else {
              allowButton.classList.remove("active");
              denyButton.classList.add("active");
            }
          });
        });
      }

      // Add event listener for delete button
      const deleteButton = memberCard.querySelector(".delete-member-button");
      if (deleteButton) {
        deleteButton.addEventListener("click", function () {
          const memberId = this.dataset.memberId;
          if (!confirm("Are you sure you want to delete this team member?"))
            return;

          $.ajax({
            url: "logic/delete-member.php",
            method: "POST",
            data: { id: memberId },
            success: function (response) {
              if (response.trim() === "success") {
                fetchTeam(); // Refresh the team list
                const toast = document.getElementById("success-toast");
                const toastMessage = document.getElementById("toast-message");
                toastMessage.textContent = `Member has been deleted successfully`;
                toast.classList.add("show");
                // Hide after 3 seconds
                setTimeout(() => {
                  toast.classList.remove("show");
                }, 3000);
              } else {
                alert("Failed to delete member: " + response);
              }
            },
            error: function (error) {
              console.error("Error deleting member:", error);
            },
          });
        });
      }
    }

    return memberCard;
  }
});

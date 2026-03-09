<?php require_once 'components/sidebar.php';?>
      <div>
        <div class="header">
          <h1 class="title">Add New Legal Case</h1>
          <h3
            style="
              color: rgb(255, 77, 77);
              font-size: medium;
              font-weight: bold;
            "
          >
            <i class="fa-solid fa-circle-info"></i> ADD PARTIES AND DOCUMENTS IN THE CASE PAGE
          </h3>
        </div>

        <div class="card">
          <form id="legalTaskForm" class="form">
            <input type="hidden" name="dateAdded" value="" />
            <input type="hidden" name="addedBy" value="current-user" />

            <div class="flex flex-col gap-2">
              <h2 class="text-xl font-semibold">Case Information</h2>
              <p class="text-gray-500 text-sm">
                Enter the basic details about this legal case
              </p>
            </div>

            <div class="form-group">
              <label class="label" for="file_color">File Color</label>
              <input
                class="input"
                id="file_color"
                name="file_color"
                required
                placeholder="Enter the file color"
              />
            </div>
            
            <div class="form-group">
              <label class="label" for="party">Party Type</label>
              <select id="party" name="party" class="input">
              <option value="accused">Accused</option>
                  <option value="complainant">Complainant</option>
                  <option value="republic">Republic</option>
                  <option value="appellant">Appellant</option>
                  <option value="claimant">Claimant</option>
                  <option value="respondent">Respondent</option>
                  <option value="plaintiff">Plaintiff</option>
                  <option value="defendant">Defendant</option>
              </select>
            </div>

            <div class="form-group">
              <label class="label" for="title">Case Title</label>
              <input
                class="input"
                id="title"
                name="title"
                required
                placeholder="e.g., The Republic vs. John Doe"
              />
            </div>

            <div class="form-group">
              <label class="label" for="caseNo">Case Number</label>
              <input
                class="input"
                id="caseNo"
                name="caseNo"
                required
                placeholder="e.g., E001/2025"
              />
            </div>

            <div class="form-group">
              <label class="label" for="description">Description</label>
              <textarea
                class="textarea"
                id="description"
                name="description"
                required
                placeholder="Provide a detailed description of the case..."
              ></textarea>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="form-group">
                <label class="label" for="next-date">Next Court Date</label>
                <input
                  class="input"
                  type="date"
                  id="next-date"
                  name="next-date"
                  required
                />
              </div>
              <div class="form-group">
                <label class="label" for ="advocate">Advocate</label>
                <?php

                  // Fetch all users
                  $sql = "SELECT id, fname, lname FROM users ORDER BY fname ASC";
                  $result = $conn->query($sql);

                  // Start the select element
                  echo '<select id="user-select" name="advocate" class="input">';

                  // Check if there are users
                  if ($result->num_rows > 0) {
                      while ($user = $result->fetch_assoc()) {
                          $userId = htmlspecialchars($user['id']);
                          $fullName = htmlspecialchars($user['fname'] . ' ' . $user['lname']);
                          echo "<option value=\"$fullName\">$fullName</option>";
                      }
                  } else {
                      echo '<option value="">No users found</option>';
                  }

                  echo '</select>';

                  $conn->close();
                  ?>

              </div>
            </div>
            
            
            
            <div class="form-group">
              <label class="label" for="activity-title">Activity title</label>
              <input
                class="input"
                id="activity-title"
                name="activity-title"
                required
                placeholder="Give title for the next court date activity"
              />
            </div>
            
            <div class="form-group">
              <label class="label" for="activity-description">Activity description</label>
              <input
                class="input"
                id="activity-description"
                name="activity-description"
                required
                placeholder="Give detailed description for the next court date activity"
              />
            </div>
            
            <div class="form-group">
              <label class="label" for="court">Court</label>
              <input
                class="input"
                id="court"
                name="court"
                required
                placeholder="Enter court name"
              />
            </div>

            <div class="form-group">
              <label class="label" for="division">Court Division</label>
              <input
                class="input"
                id="division"
                name="division"
                required
                placeholder="e.g., Criminal, Civil, Family"
              />
            </div>

            <div class="form-group">
              <label class="label" for="location">Court Location</label>
              <input
                class="input"
                id="location"
                name="location"
                required
                placeholder="e.g., Nairobi"
              />
            </div>

            <div class="form-group">
              <label class="label" for="judge-name">Judge Name</label>
              <input
                class="input"
                id="judge"
                name="judge"
                required
                placeholder="Enter judge name"
              />
            </div>

            <button type="submit" id='create-case' class="button text-sm">Create Case</button>

            <!-- Success Toast -->
            <div
              id="success-toast"
              class="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-3 rounded-md shadow-lg flex items-center gap-3 opacity-0 transition-opacity duration-300 pointer-events-none">
              <span id="check-icon"></span>
              <div>
                <p class="font-medium">Success!</p>
                <p id="success-message" class="text-sm">
                  Case has been added successfully.
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
    <?php require_once 'components/chat-notification.php';?>
    <script src="script/app.js"></script>
    <script>
      const createBtn = document.getElementById('create-case');
      document.addEventListener("DOMContentLoaded", () => {
        // Set current date for hidden input
        document.querySelector('input[name="dateAdded"]').value =
          new Date().toISOString();

        // Form submission
        document
          .getElementById("legalTaskForm")
          .addEventListener("submit", (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);

            const category = localStorage.getItem("Category");
            const location = localStorage.getItem("Location");
            const matter = localStorage.getItem("Matter");
          

            formData.append("category", category);
            formData.append("file_location", location);
            formData.append("matter", matter);

            $.ajax({
              url: "logic/add-case.php",
              type: "POST",
              data: formData,
              processData: false,
              contentType: false,
              success: function (response) {
                if(response == 'success'){
                  // Show success toast
                  const successToast = document.getElementById("success-toast");
                  const successMessage = document.getElementById("success-message");
                  createBtn.disabled= true;

                  successMessage.textContent = `"${formData.get('title')}" has been added successfully!`;
                  successToast.classList.add("animate-bounce");
                  successToast.style.opacity = "1";
                  successToast.style.pointerEvents = "auto";

                  setTimeout(() => {
                    successToast.style.opacity = "0";
                    successToast.style.pointerEvents = "none";

                     window.location.href ="legal-cases.php";
                  }, 2000);
                } else {
                  alert("Failed to add case. Please try again."+ response)
                }
              },
              error: function (xhr, status, error) {
                console.error("Error:", error);
                alert("An error occurred while adding the case." + error);
              },
            })
        });
      });
    </script>
  </body>
</html>

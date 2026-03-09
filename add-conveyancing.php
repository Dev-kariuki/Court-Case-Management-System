<?php require_once 'components/sidebar.php';?>
      <div class="container animate-fadeUp">
        <div class="flex-col items-center mb-2">
          <h1 class="text-3xl font-bold tracking-tight">
            Add New Conveyancing Brief
          </h1>
          <h3
            class="font-bold"
            style="margin-top: 10px; color: rgb(255, 77, 77)"
          >
            <i class="fa-solid fa-circle-info"></i> ADD PARTIES IN THE BRIEF PAGE
          </h3>
        </div>

        <form id="case-form" class="space-y-8">
          <!-- Case Information Card -->
          <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div class="flex flex-col gap-2 mb-3">
              <h2 class="text-xl font-semibold">Brief Information</h2>
              <p class="text-gray-500 text-sm">
                Enter the basic details about this conveyancing brief
              </p>
            </div>
            <div class="space-y-6">
              <div class="form-group">
              <label for="file_color" class="block text-gray-700 text-sm font-medium mb-1">File Color</label>
              <input
                id="file_color"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:caret[#007bff]"
                name="file_color"
                required
                placeholder="Enter the file color"
              />
            </div>

            <div class="form-group">
                <label class="block text-gray-700 text-sm font-medium mb-1" for="party">Party Type</label>
                <select id="party" name="party" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:caret[#007bff]">
                  <option value="seller">Seller</option>
                  <option value="buyer">Buyer</option>
                </select>
              </div>

              <div class="form-group">
                <label
                  for="title"
                  class="block text-gray-700 text-sm font-medium mb-1"
                  >Sale/Purchase of Title no</label
                >
                <input
                  type="text"
                  id="title"
                  name="title"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:caret[#007bff]"
                  placeholder="e.g., RUIRU EAST/JUJA EAST BLOCK 7/48191"
                  required
                />
                <p
                  id="title-error"
                  class="text-red-500 text-xs mt-1 hidden"
                ></p>
              </div>

              <div class="form-group">
                <label class="block text-gray-700 text-sm font-medium mb-1" for ="advocate">Advocate</label>
                <?php

                  // Fetch all users
                  $sql = "SELECT id, fname, lname FROM users ORDER BY fname ASC";
                  $result = $conn->query($sql);

                  // Start the select element
                  echo '<select id="user-select" name="advocate" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:caret[#007bff]">';

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

              <div class="form-group">
                <label
                  for="caseNo"
                  class="block text-gray-700 text-sm font-medium mb-1"
                  >File Number</label
                >
                <input
                  type="text"
                  id="caseNo"
                  name="caseNo"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:caret[#007bff]"
                  placeholder="Enter the file number"
                  required
                />
                <p
                  id="caseNo-error"
                  class="text-red-500 text-xs mt-1 hidden"
                ></p>
              </div>

              <div class="form-group">
                <label
                  for="description"
                  class="block text-gray-700 text-sm font-medium mb-1"
                  >Description</label
                >
                <textarea
                  id="description"
                  name="description"
                  rows="4"
                  class="resize-none w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:caret[#007bff]"
                  placeholder="Provide a detailed description of the brief..."
                  required
                ></textarea>
                <p
                  id="description-error"
                  class="text-red-500 text-xs mt-1 hidden"
                ></p>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="form-group">
                  <label
                    for="date"
                    class="block text-gray-700 text-sm font-medium mb-1"
                    >Date Initiated</label
                  >
                  <input
                    type="date"
                    id="date"
                    name="date"
                    class="w-full text-sm px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:caret[#007bff]"
                    required
                  />
                </div>

                <div class="form-group">
                  <label
                    for="date"
                    class="block text-gray-700 text-sm font-medium mb-1"
                    >Bring up date</label
                  >
                  <input
                    type="date"
                    id="date"
                    name="bringUpDate"
                    class="w-full text-sm px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:caret[#007bff]"
                    required
                  />
                </div>
              </div>

              
            </div>
            <button type="submit" id='create-conv-case' class="button mt-5 text-sm">
              Create Brief
            </button>
          </div>
        </form>

        <!-- Success Toast -->
        <div
          id="success-toast"
          class="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-3 rounded-md shadow-lg flex items-center gap-3 opacity-0 transition-opacity duration-300 pointer-events-none"
        >
          <span id="check-icon"></span>
          <div>
            <p class="font-medium">Success!</p>
            <p id="success-message" class="text-sm">
              Brief has been added successfully.
            </p>
          </div>
        </div>
      </div>
    </section>
    <?php require_once 'components/chat-notification.php';?>
    <script src="script/app.js"></script>
    <script>
      const createBtn = document.getElementById('create-conv-case');
      // Form submission
        document
          .getElementById("case-form")
          .addEventListener("submit", (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);

            $.ajax({
              url: "logic/add-conveyancing.php",
              type: "POST",
              data: formData,
              processData: false,
              contentType: false,
              success: function (response) {
                if(response == 'success'){
                  // Show success toast
                  const successToast = document.getElementById("success-toast");
                  const successMessage = document.getElementById("success-message");
                  createBtn.disabled = true

                  successMessage.textContent = `"${formData.get('title')}" has been added successfully!`;
                  successToast.classList.add("animate-bounce");
                  successToast.style.opacity = "1";
                  successToast.style.pointerEvents = "auto";

                  setTimeout(() => {
                    successToast.style.opacity = "0";
                    successToast.style.pointerEvents = "none";

                    window.location.href ="conv-cases.php";
                  }, 2000);
                  
                } else {
                  alert("Failed to add brief. Please try again.");
                }
              },
              error: function (xhr, status, error) {
                console.error("Error:", error);
                alert("An error occurred while adding the case.");
              },
            })
          });
    </script>
  </body>
</html>

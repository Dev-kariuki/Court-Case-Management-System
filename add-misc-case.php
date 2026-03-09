<?php require_once 'components/sidebar.php';?>
      <div class="animate-fadeUp">
        <div class="flex-column items-center mb-2">
          <h1 class="text-3xl font-bold tracking-tight">
            Add New Miscellaneous Case
          </h1>
          <h3
            style="
              color: rgb(255, 77, 77);
              font-size: medium;
              font-weight: bold;
            "
          >
            <i class="fa-solid fa-circle-info"></i> ADD DOCUMENTS IN THE MISCELLANEOUS CASE PAGE
          </h3>
        </div>

        <form id="case-form" class="space-y-8">
          <!-- Case Information Card -->
          <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 class="text-xl font-semibold mb-4">Case Information</h2>
            <p class="text-gray-500 text-sm mb-6">
              Enter the basic details about this miscellaneous case
            </p>

            <div class="space-y-6">
              <div class="form-group">
                <label class="block text-gray-700 text-sm font-medium mb-1" for="file_color">File Color</label>
                <input
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:caret[#007bff]"
                  id="file_color"
                  name="file_color"
                  required
                  placeholder="Enter the file color"
                />
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
                <label class="block text-gray-700 text-sm font-medium mb-1" for="party">Party Type</label>
                <select id="party" name="party" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:caret[#007bff]">
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
                <label
                  for="title"
                  class="block text-gray-700 text-sm font-medium mb-1"
                  >Case Title</label
                >
                <input
                  type="text"
                  id="title"
                  name="title"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:caret[#007bff]"
                  placeholder="e.g., Smith Property Dispute"
                  required
                />
                <p class="text-gray-500 text-xs mt-1">
                  A clear, descriptive title for this case
                </p>
                <p
                  id="title-error"
                  class="text-red-500 text-xs mt-1 hidden"
                ></p>
              </div>

              <div class="form-group">
                <label
                  for="caseNo"
                  class="block text-gray-700 text-sm font-medium mb-1"
                  >Case Number</label
                >
                <input
                  type="text"
                  id="caseNo"
                  name="caseNo"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:caret[#007bff]"
                  placeholder="e.g., E001/2025"
                  required
                />
                <p class="text-gray-500 text-xs mt-1">
                  Case number for reference and tracking
                </p>
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
                  placeholder="Provide a detailed description of the case..."
                  required
                ></textarea>
                <p class="text-gray-500 text-xs mt-1">
                  Include relevant details about the case
                </p>
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
                    >Date</label
                  >
                  <input
                    type="date"
                    id="date"
                    name="date"
                    class="w-full text-sm px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:caret[#007bff]"
                    required
                  />
                  <p class="text-gray-500 text-xs mt-1">
                    Date this case was initiated
                  </p>
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
          </div>

          <!-- Parties Involved Card -->
          <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 class="text-xl font-semibold mb-4">Parties Involved</h2>
            <p class="text-gray-500 text-sm mb-6">
              Add all individuals or organizations related to this case
            </p>

            <div id="parties-container" class="space-y-4">
              <div class="party-item flex items-end gap-3">
                <div class="flex-1">
                  <label
                    for="party-0"
                    class="block text-gray-700 text-sm font-medium mb-1"
                    >Party Name</label
                  >
                  <input
                    type="text"
                    id="party-0"
                    name="parties[]"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:caret[#007bff]"
                    placeholder="Full name or organization"
                    required
                  />
                  <p
                    id="party-0-error"
                    class="text-red-500 text-xs mt-1 hidden"
                  ></p>
                </div>
                <button
                  type="button"
                  class="remove-party px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 mb-[2px]"
                  disabled
                >
                  <i class="fa-solid fa-trash"></i>
                </button>
              </div>
            </div>

            <button
              type="button"
              id="add-party-btn"
              class="mt-4 px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 inline-flex items-center gap-2"
            >
              <i class="fa-solid fa-plus"></i>
              Add Another Party
            </button>
          </div>

          <button type="submit" id='create-misc-btn' class="button text-sm">Create Case</button>
        </form>

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
      </div>
    </section>
    <?php require_once 'components/chat-notification.php';?>
    <script src="script/app.js"></script>
    <script src="script/add-misc-case.js"></script>
  </body>
</html>

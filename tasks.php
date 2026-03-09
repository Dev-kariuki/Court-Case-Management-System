<?php require_once 'components/sidebar.php';?>
      <div class="tasks animate-fadeUp">
        <div class="task">
          <div class="title">
            <h3>TO DO</h3>
          </div>
          <div class="activities" id='to-do'>
            <h3 style="text-align: center; margin-top: 15px;">NO TASK TO DO</h3>

          </div>
        </div>
        <div class="task">
          <div class="title">
            <h3>COMPLETED</h3>
          </div>
          <div class="activities" id='completed'>
            <h3 style="text-align: center; margin-top: 15px;">NO TASK COMPLETED</h3>
            
          </div>
        </div>
      </div>
      <div class="all-tasks-container animate-fadeUp">
        <div class="all-content">
          <div class="search-file-container">
            <input
              type="text"
              class="search-bar"
              id="search-bar"
              placeholder="Search task..."
            />
            <div class="button-container">
              <button class="search-btn" id="search-btn">
                <i class="fa-solid fa-magnifying-glass"></i> &nbsp; Search
              </button>
              <?php if(isset($_SESSION['admin']) && $_SESSION['admin'] == 1){
                echo '<button class="task-file-btn" id="task-file-btn">
                <i class="fa-solid fa-plus"></i> &nbsp; Add Task</button>';
              }?>
            </div>
          </div>
          <h2 style="text-align: center; margin-top: 15px;" id="no-tasks">NO TASK TO BE DONE</h2>
          <div class="all-tasks" id='all-tasks'></div>
        </div>
      </div>
    </section>
    <section id="add-task-overlay">
      <div class="task-form">
        <div class="add-task-header">
          <h2>Create New Task</h2>
          <button
            id="close-addTask"
            style="
              width: max-content;
              background: transparent;
              border: none;
              font-size: 30px;
              cursor: pointer;
              color: var(--gray-700);
            "
          >
            &times;
          </button>
        </div>
        <form id="taskForm">
          <label for="taskTitle">Task Title:</label>
          <input
            type="text"
            id="taskTitle"
            name="taskTitle"
            required
            placeholder="Enter task title"
          />

          <label for="taskTitle">Case Number:</label>
          <input
            type="text"
            id="caseNo"
            name="caseNo"
            required
            placeholder="Enter case number"
          />

          <label for="assignedTo">Assigned To:</label>
          <select id="assignedTo" name="assignedTo" required>
            <option value="" disabled selected>Select user</option>
            <?php
              $sql = "SELECT id, fname FROM users WHERE admin = 0";
              $result = $conn->query($sql);
              if ($result->num_rows > 0) {
                  while($row = $result->fetch_assoc()) {
                    echo "<option value='" . $row['id'] . "'>" . htmlspecialchars($row['fname']) . "</option>";
                  }
              }
              $conn->close();
            ?>
          </select>

          <label for="taskDescription">Description:</label>
          <textarea
            id="taskDescription"
            name="taskDescription"
            required
            placeholder="Enter task description"
          ></textarea>

          <label for="taskDeadline">Deadline:</label>
          <input type="date" id="taskDeadline" name="taskDeadline" required />

          <label for="taskFile">Upload File:</label>
          <div class="file-upload" id="dropZone">
            <i
              class="fas fa-cloud-upload-alt"
              style="font-size: 30px; color: #333"
            ></i>
            <p style="font-size: 0.875rem">Click to upload or drag and drop</p>
            <p style="font-size: 0.75rem; color: #666">
              PDF & Images (up to 10MB each)
            </p>
            <input
              type="file"
              id="fileUpload"
              multiple
              accept=".pdf,image/*"
              style="display: none"
            />
          </div>

          <div id="fileList"></div>

          <button class="button" type="submit" style="margin-top: 10px">
            Add Task
          </button>
        </form>
      </div>
    </section>
    <div id="success-toast" class="toast">
      <span id="toast-message">Success! 🎉</span>
    </div>
    <?php require_once 'components/chat-notification.php';?>
    <script src="script/app.js"></script>
    <script>
      const closeTask = document.getElementById("close-addTask");
      const toggleTask = document.getElementById("task-file-btn");
      const taskoverlay = document.getElementById("add-task-overlay");
      const tasksCont = document.getElementById('all-tasks');
      const noTasks = document.getElementById('no-tasks');
      const toDo = document.getElementById('to-do');
      const completed = document.getElementById('completed');
      const isAdmin = <?= isset($_SESSION['admin']) && $_SESSION['admin'] == 1 ? 'true' : 'false' ?>;
      const searchInput = document.getElementById('search-bar');
      const searchBtn = document.getElementById('search-btn');

      searchBtn.addEventListener('click', () => {
        const searchValue = searchInput.value.trim().toLowerCase();
        if (searchValue) {
          $.ajax({
            url: "logic/search-tasks.php",
            method: "GET",
            data: { search: searchValue },
            success: function (response) {
              const tasks = response;
              populateTasks(tasks);
            },
            error: function (error) {
              console.error("Error fetching tasks:", error);
            },
          });
        } else {
          fetchTasks();
        }
      });

      if(toggleTask){
        toggleTask.addEventListener("click", () => {
          taskoverlay.style.display = "flex";
        });
      }

      closeTask.addEventListener("click", () => {
        taskoverlay.style.display = "none";
      });

      function populateTasks(tasks){
          if(tasks.length > 0){
            noTasks.style.display = 'none';
            tasksCont.innerHTML = '';
            tasks.forEach((task) =>{
              const taskDiv = document.createElement('a');
              taskDiv.classList = `activity ${
                task['completed_by'] ? 'active' : (task['assigned_to'] ? 'booked' : '')
              }`;
              taskDiv.href = 'task.php?id=' + task.id;
              taskDiv.innerHTML = `
                  <h3 class="clipped-text-1">${task.title}</h3>
                  <p class="clipped-text-2">${task.description}</p>
                  <div class="due">
                    <i class="fa-solid fa-calendar-xmark"></i>
                    <p>${new Date(task.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).replace(/ /g, ' ').replace(/(\d+)(st|nd|rd|th)/, '$1$2')}</p>
                  </div>
                  <div
                    class="status-user"
                    style="
                      display: flex;
                      align-items: center;
                      justify-content: space-between;
                    "
                  >
                    <div class="status">${
                    task['completed_by'] ? 'COMPLETED' : (task['assigned_to'] ? 'ASSIGNED' : 'UNASSIGNED')
                  }</div>
                    ${task['completed_by'] != null ? `
                    <div
                      class="user-comp"
                      style="
                        display: flex;
                        gap: 5px;
                        align-items: center;
                        border: 1px solid lightgreen;
                        padding: 2px 10px;
                        border-radius: 15px;
                      "
                    >
                      <i
                        class="fa-solid fa-user"
                        style="font-size: 10px; color: #555"
                      ></i>
                        <p style="font-size: 12px; font-weight: 500" id="user-name">
                          ${(() => {
                            let userName = "Unknown";
                            $.ajax({
                              url: "logic/get-user.php",
                              method: "GET",
                              data: { id: task['completed_by'] },
                              async: false, // Ensure synchronous execution to return the value
                              success: function (response) {
                                const user = JSON.parse(response);
                                if (user && user.fname) {
                                  userName = user.fname;
                                }
                              },
                              error: function (error) {
                                console.error("Error fetching user:", error);
                                userName = "Error";
                              },
                            });
                            return userName;
                          })()}
                        </p>                          
                    </div>
                    ` : ''}
                  </div>
              `;
  
              tasksCont.append(taskDiv);
            })
          }
      }

      document.addEventListener("DOMContentLoaded", () => {
        // File upload handling
        const dropZone = document.getElementById("dropZone");
        const fileUpload = document.getElementById("fileUpload");
        const fileList = document.getElementById("fileList");
        let selectedFiles = [];

        dropZone.addEventListener("click", () => fileUpload.click());

        dropZone.addEventListener("dragover", (e) => {
          e.preventDefault();
          dropZone.style.borderColor = "#2563eb";
        });

        dropZone.addEventListener("dragleave", () => {
          dropZone.style.borderColor = "";
        });

        dropZone.addEventListener("drop", (e) => {
          e.preventDefault();
          dropZone.style.borderColor = "";
          const files = e.dataTransfer.files;
          if (files.length > 0) {
            handleFiles(files);
          }
        });

        fileUpload.addEventListener("change", () => {
          const files = fileUpload.files;
          if (files.length > 0) {
            handleFiles(files);
          }
        });

        // Handle files
        function handleFiles(files) {
          for (let i = 0; i < files.length; i++) {
            if (!selectedFiles.includes(files[i])) {
              selectedFiles.push(files[i]);
            }
          }
          updateFileList();
        }

        // Update the file list display
        function updateFileList() {
          fileList.innerHTML = "";
          selectedFiles.forEach((file, index) => {
            const listItem = document.createElement("div");
            listItem.title = "Click to remove file";
            listItem.class = "file-listed";
            listItem.id = "file";
            listItem.innerHTML = `<p>${file.name}</p><p>${
              file.size / 1000
            }KB</p>`;
            listItem.dataset.index = index; // Add a custom data attribute for the index
            listItem.addEventListener("click", () => removeFile(index)); // Add click event to remove file
            fileList.appendChild(listItem);
          });
        }

        // Remove a specific file
        function removeFile(index) {
          selectedFiles.splice(index, 1); // Remove the file from the array
          updateFileList(); // Update the file list display
        }

        // Form submission
        document
          .getElementById("taskForm")
          .addEventListener("submit", (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            
            if(selectedFiles.length == 0){
              return;
            }else{
              selectedFiles.forEach((file) => {
                formData.append("files[]", file);
              });
            }

            $.ajax({
              url: "logic/add-task.php",
              type: "POST",
              data: formData,
              processData: false,
              contentType: false,
              success: function (response) {
                if(response == 'success'){
                  fetchTasks();
                  taskoverlay.style.display = "none";
                  const toast = document.getElementById("success-toast");
                  const toastMessage = document.getElementById("toast-message");

                  toastMessage.textContent = `${formData.get('taskTitle')} has been added successfully`;
                  toast.classList.add("show");

                  // Hide after 3 seconds
                  setTimeout(() => {
                    toast.classList.remove("show");
                  }, 3000);
                } else {
                  alert("Failed to add case. Please try again.");
                }
              },
              error: function (xhr, status, error) {
                console.error("Error:", error);
                alert("An error occurred while adding the case.");
              },
            })
        });

        function fetchTasks() {
          $.ajax({
            url: "logic/get-tasks.php",
            method: "GET",
            success: function (response) {
              const tasks = response;
              populateTasks(tasks);
            },
            error: function (error) {
              console.error("Error fetching tasks:", error);
            },
          });
        }

        fetchTasks();

        function fetchToDo(callback) {
          $.ajax({
            url: "logic/get-to-do.php",
            method: "GET",
            data: { id: <?php echo $_SESSION['user_id']; ?> },
            success: function (response) {
              const tasks = JSON.parse(response);
              callback(tasks);
            },
            error: function (error) {
              console.error("Error fetching tasks:", error);
            },
          });
        }

        fetchToDo(function (tasks) {
          if(tasks.length > 0){
            toDo.innerHTML = '';
            tasks.forEach((task) =>{
              const taskDiv = document.createElement('a');
              taskDiv.classList = `activity`;
              taskDiv.href = 'task.php?id=' + task.id;
              taskDiv.innerHTML = `
                  <h3 class="clipped-text-1">${task.title}</h3>
                  <p class="clipped-text-2">${task.description}</p>
                  <div class="due">
                    <i class="fa-solid fa-calendar-xmark"></i>
                    <p>${new Date(task.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).replace(/ /g, ' ').replace(/(\d+)(st|nd|rd|th)/, '$1$2')}</p>
                  </div>
              `;
  
              toDo.append(taskDiv);
            })
          }
        });

        function fetchCompleted(callback) {
          $.ajax({
            url: "logic/get-completed.php",
            method: "GET",
            data: { id: <?php echo $_SESSION['user_id']; ?> },
            success: function (response) {
              const tasks = JSON.parse(response);
              callback(tasks);
            },
            error: function (error) {
              console.error("Error fetching tasks:", error);
            },
          });
        }

        fetchCompleted(function (tasks) {
          if(tasks.length > 0){
            completed.innerHTML = '';
            tasks.forEach((task) =>{
              const taskDiv = document.createElement('a');
              taskDiv.classList = `activity`;
              taskDiv.href = 'task.php?id=' + task.id;
              taskDiv.innerHTML = `
                  <h3 class="clipped-text-1">${task.title}</h3>
                  <p class="clipped-text-2">${task.description}</p>
                  <div class="due">
                    <i class="fa-solid fa-calendar-xmark"></i>
                    <p>${new Date(task.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).replace(/ /g, ' ').replace(/(\d+)(st|nd|rd|th)/, '$1$2')}</p>
                  </div>
              `;
  
              completed.append(taskDiv);
            })
          }
        });
      });
    </script>
  </body>
</html>

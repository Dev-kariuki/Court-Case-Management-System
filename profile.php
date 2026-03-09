<?php 
require_once 'components/sidebar.php';

$sql = "SELECT * FROM users WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $_SESSION['user_id']);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();
$stmt->close();

//count cases where completed_by is same as user id
$case_sql = "SELECT COUNT(*) as total_cases FROM cases WHERE completed_by = ?";
$case_stmt = $conn->prepare($case_sql);
$case_stmt->bind_param("i", $_SESSION['user_id']);
$case_stmt->execute();
$case_result = $case_stmt->get_result();
$total_cases = $case_result->fetch_assoc()['total_cases'];
$case_stmt->close();

//count cases where completed_by is same as user id
$misc_case_sql = "SELECT COUNT(*) as total_cases FROM miscellaneous WHERE completed_by = ?";
$misc_case_stmt = $conn->prepare($misc_case_sql);
$misc_case_stmt->bind_param("i", $_SESSION['user_id']);
$misc_case_stmt->execute();
$misc_case_result = $misc_case_stmt->get_result();
$misc_total_cases = $misc_case_result->fetch_assoc()['total_cases'];
$misc_case_stmt->close();

//count cases where completed_by is same as user id
$conv_case_sql = "SELECT COUNT(*) as total_cases FROM conveyancing WHERE completed_by = ?";
$conv_case_stmt = $conn->prepare($conv_case_sql);
$conv_case_stmt->bind_param("i", $_SESSION['user_id']);
$conv_case_stmt->execute();
$conv_case_result = $conv_case_stmt->get_result();
$conv_total_cases = $conv_case_result->fetch_assoc()['total_cases'];
$conv_case_stmt->close();

//count the users in the database
$user_sql = "SELECT COUNT(*) as total_users FROM users";
$user_stmt = $conn->prepare($user_sql);
$user_stmt->execute();
$user_result = $user_stmt->get_result();
$total_users = $user_result->fetch_assoc()['total_users'];
$user_stmt->close();


$total_cases = $total_cases + $misc_total_cases + $conv_total_cases;

?>
      <div class="profile-container">
        <div class="profile-layout">
          <div class="profile-sidebar">
            <!-- Profile Card -->
            <div class="profile-card">
              <div class="profile-header"></div>
              <div class="profile-content">
                <div class="avatar-container">
                  <div class="avatar">
                    <img
                      id="user-avatar"
                      src="logic/uploads/<?php echo $user['file_name'];?>"
                      alt="<?php echo $user['fname']. ' ' . $user['lname'];?>"
                    />
                    <div class="avatar-fallback" id="avatar-fallback">JD</div>
                  </div>
                </div>

                <div class="profile-info">
                  <h2 id="user-name"><?php echo $user['fname']. ' ' . $user['lname'];?></h2>
                  <p id="user-role"><?php echo $user['role']?></p>
                </div>

                <div class="profile-stats">
                  <div class="stat">
                    <p class="stat-value"><?php echo $total_cases;?></p>
                    <p class="stat-label">Completed Cases</p>
                  </div>
                  <div class="stat">
                    <p class="stat-value"><?php echo $total_users;?></p>
                    <p class="stat-label">Members</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Logout Button -->
            <button id="logout-btn" class="logout-button">
              <i class="fas fa-sign-out-alt"></i>
              <span>Log Out</span>
            </button>

            <div class="info-box">
              <div class="info-icon">
                <i class="fas fa-info-circle"></i>
              </div>
              <div class="info-content">
                <h3>Access Information</h3>
                <p>
                  Contact your system administrator to request access to the
                  denied pages.
                </p>
              </div>
            </div>
          </div>

          <!-- Denied Access Pages -->
          <div class="access-panel">
            <h2>Access Denied Pages</h2>
            <div class="denied-pages" id="denied-pages-list">
              <h2 style="text-align: center; margin-top: 30px; font-size: 36px;">NO PAGE DENIED ACCESS</h2>
            </div>
          </div>
        </div>
        <div
          class="completed-tasks card-style"
          style="margin-top: 20px; padding: 30px"
          id="completed-tasks"
        >
          <h2>Completed Tasks</h2>
          <div class="tasks-list" id="completed-tasks-list"></div>
        </div>
      </div>

      <!-- Toast Component -->
      <div id="toast" class="toast">
        <div class="toast-content">
          <div class="toast-title" id="toast-title"></div>
          <div class="toast-message" id="toast-message"></div>
        </div>
        <button class="toast-close" id="toast-close">&times;</button>
      </div>
      <?php require_once 'components/chat-notification.php';?>
    <script src="script/app.js"></script>
    <script src="script/profile.js"></script>
    <script>
      $(document).ready(function () {
        const tasksCont = document.getElementById("completed-tasks-list");
        const completeTask = document.getElementById("completed-tasks");
        // Logout button click event
        $("#logout-btn").on("click", function () {
          $.ajax({
            url: "logic/logout.php",
            type: "POST",
            success: function (response) {
              if (response === "success") {
                setTimeout(() => {
                  window.location.href = "login.php"; // Redirect to login page
                }, 1500);
              } else {
                alert("Logout failed. Please try again.");
              }
            },
          });
        });

        function fetchTasks(callback) {
          $.ajax({
            url: "logic/get-complete-tasks.php",
            method: "GET",
            data: { id: <?php echo $_SESSION['user_id']; ?> },
            success: function (response) {
              if(response == ''){
                completeTask.style.display = 'none';
              }else{
                const tasks = JSON.parse(response);
                callback(tasks);
              }
            },
            error: function (error) {
              console.error("Error fetching tasks:", error);
            },
          });
        }

        fetchTasks(function (tasks) {
          if(tasks.length > 0){
            tasks.forEach((task) =>{
              const taskDiv = document.createElement('a');
              taskDiv.classList = 'activity active';
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
                    <div class="status">COMPLETED</div>
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
                  </div>
              `;
  
              tasksCont.append(taskDiv);
            })
          }
        });
      });
    </script>
    </section>
  </body>
</html>

<?php 
require_once 'components/sidebar.php';

$id = intval($_GET['id']); // sanitize input

$sql = "SELECT * FROM tasks WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id);
$stmt->execute();

$result = $stmt->get_result();
$data = [];

if ($result && $result->num_rows > 0) {
    $data = $result->fetch_assoc();
}

$bookSql = "SELECT * FROM task_booking WHERE task_id = ? AND booked_by = ?";
$stmtBook = $conn->prepare($bookSql);
$stmtBook->bind_param("ii", $id, $_SESSION['user_id']);
$stmtBook->execute();
$bookResult = $stmtBook->get_result();
$da = false;
if ($bookResult && $bookResult->num_rows > 0) {
    $da = true; // User has booked the task
}

$stmt->close();
?>

      <div class="task-container animate-fadeUp">
        <header class="task-header">
          <div class="task-info">
            <span class="task-case-number">Case #: <?php echo $data['case_no'];?></span>
            <h2 class="task-title" style="font-size: 30px">
              <?php echo $data['title'];?>
            </h2>
            <?php
            if(is_null($data['completed_by']) && is_null($data['date_completed'])){
              echo '
              <span class="task-deadline">Due '.date("M j Y", strtotime($data['deadline'])).'</span>
              ';
            } ?>
            
          </div>
          <div class="task-actions">
            <?php
            
              if($data['completed_by']){
                echo '
                  <div
                    style="
                      display: flex;
                      align-items: center;
                      gap: 10px;
                      padding: 15px;
                      background: rgb(188, 247, 182);
                      color: green;
                      border-radius: 10px;
                      display: none;
                    "
                  >
                   Completed
                  </div>
                ';
              }else if($data['assigned_to'] == $_SESSION['user_id'] && is_null($data['completed_by']) && $_SESSION['admin'] != 1){
                echo '
                  <div id="completeTaskBtn" class="btn btn-success">
                    Mark as Complete
                  </div>
                ';
              }
            ?>            
          </div>
        </header>

        
          <div class="task-description">
            <h2>Task Description</h2>
            <p>
              <?php echo $data['description'];?>
            </p>
          </div>

          <div class="task-attachments">
            <h2>Attachments</h2>
            <ul class="attachments-list">
              <?php

              // Fetch documents from task_docs
              $query = "SELECT id, file_name FROM task_docs WHERE task_id = ?";
              $stmt1 = $mysqli->prepare($query);
              $stmt1->bind_param("i", $id);
              $stmt1->execute();
              $result = $stmt1->get_result();

              if ($result->num_rows === 0) {
                  echo "<li class='attachment-item'>No documents available.</li>";
              } else {
                  while ($doc = $result->fetch_assoc()) {
                      $filePath = "logic/uploads/" . htmlspecialchars($doc['file_name']); // Adjust path as needed
                      echo "
                      <li class='attachment-item'>
                          <span class='attachment-icon'>📄</span>
                          <span class='attachment-name'>" . htmlspecialchars($doc['file_name']) . "</span>
                          <a href='" . $filePath . "' class='attachment-download' download><i class='fa-solid fa-download'></i></a>
                      </li>";
                  }
              }
              $stmt1->close();
              $conn->close();
              ?>
            </ul>
          </div>

        <?php
          if($_SESSION['admin'] == '1'){
            echo '
            
            <button id="delete-btn" style="
                background-color: #e74c3c;
                width: 100%;
                color: white;
                border: none;
                padding: 12px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                margin-top: 20px;
                transition: background-color 0.3s ease;
              " >
                <i class="fas fa-trash"></i> Delete Task
              </button>
            ';          
          }
        ?>
      </div>
    </section>

    <div id="taskModal" class="modal">
      <div class="modal-content">
        <span class="close-modal">&times;</span>
        <h2 id="modalTitle">Task Action</h2>
        <p id="modalMessage">Are you sure you want to perform this action?</p>
        <div class="modal-actions">
          <button id="modalCancel" class="btn btn-outline">Cancel</button>
          <button id="modalConfirm" class="btn btn-primary">Confirm</button>
        </div>
      </div>
    </div>
    <?php require_once 'components/chat-notification.php';?>
    <script src="script/app.js"></script>
    <script src="script/task.js"></script>
    <script>
      document.title = '<?php echo $data['title'];?>'
    </script>
  </body>
</html>

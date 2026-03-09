<?php require_once 'components/sidebar.php';?>
      <div class="all-tasks-container animate-fadeUp">
        <div class="all-content">
          <div class="search-file-container">
            <input
              type="text"
              class="search-bar"
              id="search-bar"
              placeholder="Search user..."
            />
            <div class="button-container">
              <button class="search-btn" id="search-btn">
                <i class="fa-solid fa-magnifying-glass"></i> &nbsp; Search
              </button>
              <?php if ($_SESSION['admin'] == '1') {
          echo '<a href="register.php" class="task-file-btn">
              <i class="fa-solid fa-plus"></i> &nbsp; Add User
            </a>';
        } ?>
              
            </div>
          </div>
          <div class="users" id="team-grid"></div>
        </div>
      </div>
    </section>
    <div id="success-toast" class="toast">
      <span id="toast-message">Success! 🎉</span>
    </div>
    <?php require_once 'components/chat-notification.php';?>
    <script src="script/app.js"></script>
    <script src="script/team.js"></script>
  </body>
</html>

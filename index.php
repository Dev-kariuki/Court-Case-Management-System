<?php 
require_once 'components/sidebar.php';
?>
    <div id="root">
      <!-- Dashboard will be loaded here -->
    </div>
    </section>
    <?php require_once 'components/chat-notification.php';?>
    <script src="script/app.js"></script>
    <script src="script/index.js"></script>
    <script>
      localStorage.setItem('admin', <?php echo json_encode($_SESSION['admin']); ?>);
      localStorage.setItem('uid', <?php echo json_encode($_SESSION['user_id']); ?>);
    </script>
  </body>
</html>

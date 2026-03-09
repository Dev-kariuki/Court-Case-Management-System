<?php 
require_once 'components/sidebar.php';
?>
      <div class="files animate-fadeUp">
        <div class="top-file">
          <a href="<?= $access['cases_access'] ? 'file.php' : '#' ?>" class="file" id="Nairobi">
            <img src="assets/gavel-2.jpg" alt="Nairobi" />
            <div class="text">NAIROBI FILES</div>
          </a>
          <a href="<?= $access['cases_access'] ? 'file.php' : '#' ?>" class="file" id="Chuka">
            <img src="assets/gavel-3.jpg" alt="Chuka" />
            <div class="text">CHUKA FILES</div>
          </a>
        </div>
        <div class="bottom-file">
          <a href="<?= $access['cases_access'] ? 'conv-cases.php' : '#' ?>" class="file">
            <img src="assets/gavel-1.jpg" alt="Conveyancing" />
            <div class="text">CONVEYANCING FILES</div>
          </a>
        </div>
      </div>
    </section>
    <?php require_once 'components/chat-notification.php';?>
    <script src="script/app.js"></script>
    <script>
      const files = document.querySelectorAll('.file');
      files.forEach(file => {
        file.addEventListener('click', () => {
          localStorage.setItem('Location', file.id);
        });
      });
    </script>
  </body>
</html>

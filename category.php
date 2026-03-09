<?php require_once 'components/sidebar.php';?>
      <div class="bottom animate-fadeUp">
        <div class="categories suits">
          <a
            href="legal-cases.php"
            class="category"
            style="height: 400px"
            id="Primary"
          >
            <img src="assets/primary.jpg" alt="Primary" />
            <div class="text">PRIMARY SUITS</div>
          </a>
          <a
            href="legal-cases.php"
            class="category"
            style="height: 400px"
            id="Secondary"
          >
            <img src="assets/secondary.jpg" alt="Secondary" />
            <div class="text">SECONDARY SUITS</div>
          </a>
        </div>
      </div>
    </section>
    <?php require_once 'components/chat-notification.php';?>
    <script src="script/app.js"></script>
    <script>
      const category = document.querySelectorAll('.category');
      category.forEach(cat => {
        cat.addEventListener('click', () => {
          localStorage.setItem('Category', cat.id);
        });
      });
    </script>
  </body>
</html>

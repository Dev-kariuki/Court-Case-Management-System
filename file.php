<?php require_once 'components/sidebar.php';?>
      <div class="bottom animate-fadeUp">
        <div class="categories">
          <a href="misc-cases.php" class="category">
            <img src="assets/miscellaneous.jpg" alt="Land" />
            <div class="text">MISCELLANEOUS MATTERS</div>
          </a>
          <a href="category.php" class="category matter" id="General">
            <img src="assets/general.jpg" alt="General" />
            <div class="text">GENERAL LITIGATION</div>
          </a>
          <a href="category.php" class="category matter" id="Land">
            <img src="assets/land.jpg" alt="Land" />
            <div class="text">LAND MATTERS</div>
          </a>
          <a href="category.php" class="category matter" id="Employment">
            <img src="assets/employment.jpg" alt="Employment" />
            <div class="text">EMPLOYMENT MATTERS</div>
          </a>
          <a href="category.php" class="category matter" id="Union">
            <img src="assets/union.jpg" alt="Union" />
            <div class="text">UNION MATTERS</div>
          </a>
          <a href="category.php" class="category matter" id="RTA">
            <img src="assets/accident.jpg" alt="RTA" />
            <div class="text">ROAD TRAFFIC ACCIDENT MATTERS</div>
          </a>
        </div>
      </div>
    </section>
    <?php require_once 'components/chat-notification.php';?>
    <script src="script/app.js"></script>
    <script>
      const matter = document.querySelectorAll('.matter');
      matter.forEach(mat => {
        mat.addEventListener('click', () => {
          localStorage.setItem('Matter', mat.id);
        });
      });
    </script>
  </body>
</html>

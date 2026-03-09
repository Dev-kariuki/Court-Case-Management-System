<?php 
require_once 'components/sidebar.php';
?>
      <div class="container">
    <!-- Header -->
    <header class="header">
      <div class="header-content">
        <h1>This Week in Court</h1>
        <p class="week-range" id="weekRange"></p>
      </div>
    </header>

    <!-- Main Content -->
    <main class="main-content">
      <!-- Add Summary Form -->
      <div class="card">
        <h2 id="formTitle">Add Court Summary</h2>
        <form id="summaryForm" class="form">
          <div class="form-group">
            <label for="title">Title</label>
            <input 
              id="title" 
              type="text" 
              placeholder="Enter a title for this court summary" 
              required
            >
          </div>
          <div class="form-group">
            <label for="date">Date</label>
            <input 
              id="date" 
              type="date" 
              required
            >
          </div>
          <div class="form-group">
            <label for="description">Court Summary</label>
            <textarea 
              id="description" 
              placeholder="Describe what happened in court today..." 
              required
            ></textarea>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn btn-primary">Add Summary</button>
            <button type="button" id="cancelBtn" class="btn btn-outline" style="display: none;">Cancel</button>
          </div>
        </form>
      </div>

      <!-- Summaries List -->
      <h2>Court Summaries</h2>
      <div id="summariesList" class="summaries-list">
        <!-- Summaries will be added here dynamically -->
      </div>
    </main>

  </div>

</section>
<?php require_once 'components/chat-notification.php';?>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/date-fns/2.30.0/date-fns.min.js"></script>
    <script src="script/summary.js"></script>
    <script src="script/app.js"></script>
  </body>
</html>

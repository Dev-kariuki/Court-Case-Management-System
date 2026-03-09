<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="shortcut icon" href="assets/icon.jpeg" type="image/x-icon" />
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
    />
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/fullcalendar@5.11.3/main.min.css"
    />
    <link rel="stylesheet" href="styles/login.css" />
    <title>Change your password</title>
  </head>
  <body>
    <div class="login-container">
      <div class="login-form">
        <h2>Change your password</h2>
        <form action="#" method="POST">
          <div class="input-group">
            <label for="pass">New Password</label>
            <input
              type="text"
              id="pass"
              name="pass"
              required
              placeholder="Enter your password"
            />
          </div>
          <div class="input-group">
            <label for="confirm-pass">Confirm New Password</label>
            <input
              type="text"
              id="confirm-pass"
              name="confirm-pass"
              required
              placeholder="Confirm your password"
            />
          </div>
          <button type="submit" class="btn">Change Password</button>
        </form>
      </div>
    </div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js" integrity="sha512-v2CJ7UaYy4JwqLDIrZUI/4hqeoQieOmAZNXBeQyjo21dadnwR+8ZaIJVT8EE2iyI61OV8e6M8PP2/4hpQINQ/g==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <script>
      $(document).ready(function () {
        $("form").on("submit", function (e) {
          e.preventDefault(); // Prevent the default form submission

          // Get form data
          var pass = $("#pass").val();
          var confirmPass = $("#confirm-pass").val();

          // Perform AJAX request to login.php
          $.ajax({
            url: "logic/change-password.php",
            type: "POST",
            data: {
              pass: pass,
              confirmPass: confirmPass,
            },
            success: function (response) {
              if (response === "success") {
                window.location.href = "index.php"; 
              } else {
                alert(response);
              }
            },
            error: function () {
              alert("An error occurred. Please try again later.");
            },
          });
        });
      });
    </script>
  </body>
</html>

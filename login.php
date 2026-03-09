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
    <title>Login</title>
  </head>
  <body>
    <div class="login-container">
      <div class="login-form">
        <h2>Login</h2>
        <form action="#" method="POST">
          <div class="input-group">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="Enter your email"
            />
          </div>
          <div class="input-group">
            <label for="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" class="btn">Login</button>
        </form>
      </div>
    </div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js" integrity="sha512-v2CJ7UaYy4JwqLDIrZUI/4hqeoQieOmAZNXBeQyjo21dadnwR+8ZaIJVT8EE2iyI61OV8e6M8PP2/4hpQINQ/g==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <script>
      $(document).ready(function () {
        $("form").on("submit", function (e) {
          e.preventDefault(); // Prevent the default form submission

          // Get form data
          var email = $("#email").val();
          var password = $("#password").val();

          // Perform AJAX request to login.php
          $.ajax({
            url: "logic/login.php",
            type: "POST",
            data: {
              email: email,
              password: password,
            },
            success: function (response) {
              if (response === "success") {
                window.location.href = "index.php"; 
              } else if (response === "error") {
                alert("Invalid email or password. Please try again.");
              } else {
                window.location.href = "client.php?case_no=" + response;
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

<?php require_once 'components/sidebar.php';?>
      <div class="bottom animate-fadeUp">
        <div class="all-content">
          <div class="search-file-container">
            <input
              type="text"
              class="search-bar"
              id="search-bar"
              placeholder="Search by title, description, number or parties involved..."
            />
            <div class="button-container">
              <button class="search-btn" id="search-btn">
                <i class="fa-solid fa-magnifying-glass"></i> &nbsp; Search
              </button>
              <input type="file" id="task-file-input" class="task-file-input" />
              <a href="add-conveyancing.php" class="task-file-btn" id="task-file-btn"
                ><i class="fa-solid fa-plus"></i> &nbsp; Add Conveyancing Case</a
              >
            </div>
          </div>
        </div>
        <div class="cases" id="cases">
          <h2 style="margin-top: 40px; text-align: center; font-weight: 900;">NO CONVEYANCING CASE FOUND</h2>
        </div>
      </div>
    </section>
    <?php require_once 'components/chat-notification.php';?>
    <script src="script/app.js"></script>
    <script>
      document.addEventListener('DOMContentLoaded', ()=>{
        const casesCont = document.getElementById('cases');

        function fetchCases(callback) {
          $.ajax({
            url: "logic/get-conv-cases.php",
            method: "GET",
            success: function (response) {
              const cases = response;
              callback(cases);
            },
            error: function (error) {
              console.error("Error fetching cases:", error);
            },
          });
        }

        fetchCases(function (cases) {
          if(cases.length > 0){
            casesCont.innerHTML = ''; // Clear the container before adding new cases
            cases.forEach((singleCase) =>{
              const caseDiv = document.createElement('a');
              caseDiv.classList = 'case-container card-style';
              caseDiv.href = 'conveyancing.php?id=' + singleCase.case.id;
              const finishDate = new Date(singleCase.case['date_completed']);

              caseDiv.innerHTML = `
                  <div class="case-header">
                    <div class="case-title clipped-text-1">
                      Case #${singleCase.case['case_no']}: ${singleCase.case.title}
                    </div>
                    <div class="case-status">${
                      singleCase.case['status'] == '0' ? `
                        <div class="in-progress-label">In progress</div>
                      ` : `
                        <div class="finished-label">Finished</div>
                        <div class="finished-date">${finishDate.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}</div>
                      `}
                    </div>
                  </div>
                  <div class="case-description clipped-text-2">${singleCase.case.description}</div>
                  <div class="case-footer">
                    <div style="display: flex; justify-content: space-between; ">
                      <div
                        class="footer-item"
                        style="display: flex; gap: 15px; font-size: 13px"
                      >
                        <div
                          class="parties-no"
                          style="
                            display: flex;
                            gap: 5px;
                            align-items: center;
                            color: #666;
                          "
                        >
                          <i class="fa-solid fa-user"></i>
                          ${singleCase.parties.length} parties
                        </div>
                        <div
                          class="parties-no"
                          style="
                            display: flex;
                            gap: 5px;
                            align-items: center;
                            color: #666;
                          "
                        >
                          <i class="fas fa-file-alt"></i>${singleCase.documents.length} documents
                        </div>
                      </div>
                    </div>
                    <h3 class="file-color" style="font-weight: bold; width: max-content; color: #555; font-size: 13px;">File Color: ${singleCase.case['file_color']}</h3>
                  </div>
              `;
  
              casesCont.append(caseDiv);
            })
          }
        });
      })
    </script>
  </body>
</html>

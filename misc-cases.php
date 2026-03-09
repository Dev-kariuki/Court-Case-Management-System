<?php require_once 'components/sidebar.php';?>
      <div class="bottom animate-fadeUp">
        <h1 style="text-align: center; font-size: 30px; font-weight: 900">
          MISCELLANEOUS CASES
        </h1>
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
              <a
                href="add-misc-case.php"
                class="task-file-btn"
                id="task-file-btn"
                ><i class="fa-solid fa-plus"></i> &nbsp; Add Miscellaneous
                Case</a
              >
              
            </div>
          </div>
        </div>
        <div class="cases" id='cases'>
          <h2 style="margin-top: 40px; text-align: center; font-weight: 900;">NO MISCELLANEOUS CASE FOUND</h2>
        </div>
      </div>
    </section>
    <?php require_once 'components/chat-notification.php';?>
    <script src="script/app.js"></script>
    <script>
      document.addEventListener('DOMContentLoaded', ()=>{
        const casesCont = document.getElementById('cases');
        const location = localStorage.getItem('Location');
        const searchBar = document.getElementById('search-bar');
        const searchBtn = document.getElementById('search-btn');

        searchBtn.addEventListener('click', ()=>{
          const searchValue = searchBar.value.trim().toLowerCase();
          if(searchValue.length > 0){
            $.ajax({
              url: "logic/search-misc-cases.php",
              method: "GET",
              data: {
                location: location,
                search: searchValue
              },
              success: function (response) {
                const cases = response;
                populateCases(cases);
              },
              error: function (error) {
                console.error("Error fetching cases:", error);
              },
            });
          } else {
            fetchCases();
          }
        })

        function fetchCases() {
          $.ajax({
            url: "logic/get-misc-cases.php",
            method: "GET",
            data: {
              location: location
            },
            success: function (response) {
              const cases = response;
              populateCases(cases);
            },
            error: function (error) {
              console.error("Error fetching cases:", error);
            },
          });
        }

        fetchCases();

        function populateCases (cases) {
          if(cases.length > 0){
            casesCont.innerHTML ='';
            cases.forEach((singleCase) =>{
              const caseDiv = document.createElement('a');
              caseDiv.classList = 'case-container card-style';
              caseDiv.href = 'miscellaneous.php?id=' + singleCase.case.id;
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
                    <div style="display: flex; justify-content: space-between; width: 100%">
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
                          ${Object.keys(singleCase.case)
                            .filter(key => key.startsWith('party') && singleCase.case[key] !== null)
                            .length} parties
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
                      <h3 class="file-color" style="font-weight: bold; width: max-content; color: #555; font-size: 13px;">File Color: ${singleCase.case['file_color']}</h3>
                    </div>
                  </div>
              `;
  
              casesCont.append(caseDiv);
            })
          } 
        };
      })
    </script>
  </body>
</html>

const addBtn = document.querySelector("#add-btn");
      const newTaskInput = document.querySelector("#wrapper input");
      const tasksContainer = document.querySelector("#tasks");
      const error = document.getElementById("error");
      const countValue = document.querySelector(".count-value");
      let taskCount = 0;
      const displayCount = (taskCount) => {
        countValue.innerText = taskCount;
      };
      const categorySelect = document.querySelector("#task-category");
      const locationInput = document.querySelector("#task-location");
      // Add reference to the new datetime input
      const datetimeInput = document.querySelector("#task-datetime");

      const addTask = () => {
        const taskName = newTaskInput.value.trim();
        const category = categorySelect.value;
        const location = locationInput.value.trim();
        // Get the datetime value
        const datetime = datetimeInput.value;
        error.style.display = "none";

        if (!taskName) {
          setTimeout(() => {
            error.style.display = "block";
          }, 200);
          return;
        }

        // Format the datetime for display if provided
        const datetimeDisplay = datetime
          ? `<span class="due-date">Due: ${new Date(datetime).toLocaleString()}</span>`
          : '';

        const locationBtn = location
          ? `<button class="directions" data-location="${encodeURIComponent(location)}">Directions</button>`
          : '';
        const task = `
<div class="task category-${category}">
<input type="checkbox" class="task-check">
<span class="taskname">${taskName}</span>
<span class="category-badge">${category}</span>
${datetimeDisplay}
${locationBtn}
<button class="edit"><i class="fas fa-edit"></i></button>
<button class="delete"><i class="far fa-trash-alt"></i></button>
</div>
`;

        tasksContainer.insertAdjacentHTML("beforeend", task);

        const deleteButtons = document.querySelectorAll(".delete");
        deleteButtons.forEach((button) => {
          button.onclick = () => {
            button.parentNode.remove();
            taskCount -= 1;
            displayCount(taskCount);
          };
        });
        const editButtons = document.querySelectorAll(".edit");
        editButtons.forEach((editBtn) => {
          editBtn.onclick = (e) => {
            let targetElement = e.target;
            if (!(e.target.className == "edit")) {
              targetElement = e.target.parentElement;
            }
            newTaskInput.value =
              targetElement.previousElementSibling?.innerText;
            targetElement.parentNode.remove();
            taskCount -= 1;
            displayCount(taskCount);
          };
        });
        const tasksCheck = document.querySelectorAll(".task-check");
        tasksCheck.forEach((checkBox) => {
          checkBox.onchange = () => {
            checkBox.nextElementSibling.classList.toggle("completed");
            if (checkBox.checked) {
              taskCount -= 1;
              console.log("checked");
            } else {
              taskCount += 1;
            }
            displayCount(taskCount);
          };
        });
        taskCount += 1;
        displayCount(taskCount);
        newTaskInput.value = "";
        // Add event listener for directions button
        const directionsBtns = document.querySelectorAll(".directions");
        directionsBtns.forEach(btn => {
          btn.onclick = () => {
            const loc = btn.getAttribute("data-location");
            window.open(`https://www.google.com/maps/dir/?api=1&destination=${loc}`, "_blank");
          };
        });
      };

      addBtn.addEventListener("click", addTask);
      window.onload = () => {
        taskCount = 0;
        displayCount(taskCount);
        newTaskInput.value = "";
      };

      // Add event listeners to filter buttons
      document.addEventListener('DOMContentLoaded', () => {
          const filterButtons = document.querySelectorAll('.filter-btn');
          
          filterButtons.forEach(button => {
              button.addEventListener('click', () => {
                  // Remove active class from all buttons
                  filterButtons.forEach(btn => btn.classList.remove('active'));
                  
                  // Add active class to clicked button
                  button.classList.add('active');
                  
                  // Filter tasks by category
                  const category = button.dataset.category;
                  filterTasksByCategory(category);
              });
          });
      });

      // Add a sort selector to your HTML
      // <select id="sort-tasks">
      //   <option value="added">Date Added</option>
      //   <option value="alphabetical">Alphabetical</option>
      //   <option value="dueDate">Due Date</option>
      //   <option value="priority">Priority</option>
      // </select>
      
      const sortSelect = document.querySelector("#sort-tasks");
      
      sortSelect.addEventListener("change", () => {
        const sortBy = sortSelect.value;
        const tasks = Array.from(document.querySelectorAll(".task"));
        
        tasks.sort((a, b) => {
          if (sortBy === "alphabetical") {
            const textA = a.querySelector(".taskname").textContent.toLowerCase();
            const textB = b.querySelector(".taskname").textContent.toLowerCase();
            return textA.localeCompare(textB);
          } else if (sortBy === "dueDate") {
            const dateA = a.querySelector(".due-date")?.textContent.replace("Due: ", "") || "9999-99-99";
            const dateB = b.querySelector(".due-date")?.textContent.replace("Due: ", "") || "9999-99-99";
            return dateA.localeCompare(dateB);
          } else if (sortBy === "priority") {
            const priorityOrder = { high: 1, medium: 2, low: 3 };
            const priorityA = a.classList.contains("priority-high") ? "high" : 
                              a.classList.contains("priority-medium") ? "medium" : "low";
            const priorityB = b.classList.contains("priority-high") ? "high" : 
                              b.classList.contains("priority-medium") ? "medium" : "low";
            return priorityOrder[priorityA] - priorityOrder[priorityB];
          }
          // Default: keep original order (date added)
          return 0;
        });
        
        // Clear and re-append sorted tasks
        tasksContainer.innerHTML = "";
        tasks.forEach(task => tasksContainer.appendChild(task));
        
        // Re-attach event listeners
        attachEventListeners();
      });
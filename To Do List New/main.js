// ... existing code ...

// Function to search Google
function searchGoogle() {
    const query = document.getElementById('searchQuery').value;
    if (query) {
        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        window.open(searchUrl, '_blank'); // Opens in a new tab
    } else {
        alert('Please enter a search term.');
    }
}

// Function to initialize Google Maps
function initMap() {
    try {
        var mapOptions = {
            center: { lat: 37.7749, lng: -122.4194 }, // Example: San Francisco
            zoom: 12
        };
        var mapElement = document.getElementById("map");
        if (mapElement) {
            var map = new google.maps.Map(mapElement, mapOptions);
        } else {
            console.error("Map element not found");
        }
    } catch (error) {
        console.error("Error initializing map:", error);
    }
}

// Function to filter tasks by category
function filterTasksByCategory(category) {
    // Get all task elements
    const tasks = document.querySelectorAll('.task');
    
    // Loop through each task
    tasks.forEach(task => {
        // If category is 'all' or the task's category matches the selected one, show it
        if (category === 'all' || task.dataset.category === category) {
            task.style.display = 'block';
        } else {
            task.style.display = 'none';
        }
    });
    
    // Update active state on filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        if (btn.dataset.category === category) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Function to toggle task notes
function toggleTaskNotes(taskElement) {
  // Remove active class from all tasks
  document.querySelectorAll('.task').forEach(task => {
    if (task !== taskElement) {
      task.classList.remove('active');
    }
  });
  
  // Toggle active class on clicked task
  taskElement.classList.toggle('active');
}

// Function to add notes functionality to tasks
function addNotesFeatureToTasks() {
  // Get all tasks
  const tasks = document.querySelectorAll('.task');
  
  tasks.forEach(task => {
    // Check if this task already has notes functionality
    if (!task.querySelector('.task-notes')) {
      // Create notes container
      const notesContainer = document.createElement('div');
      notesContainer.className = 'task-notes';
      
      // Create textarea
      const textarea = document.createElement('textarea');
      textarea.placeholder = 'Add notes for this task...';
      
      // Create buttons container
      const buttonsContainer = document.createElement('div');
      buttonsContainer.className = 'notes-buttons';
      
      // Create save button
      const saveButton = document.createElement('button');
      saveButton.className = 'save-note';
      saveButton.textContent = 'Save';
      saveButton.addEventListener('click', function() {
        // Save notes logic here
        const notes = textarea.value;
        task.dataset.notes = notes;
        alert('Notes saved!');
      });
      
      // Create delete button
      const deleteButton = document.createElement('button');
      deleteButton.className = 'delete-note';
      deleteButton.textContent = 'Delete';
      deleteButton.addEventListener('click', function() {
        // Delete notes logic
        textarea.value = '';
        delete task.dataset.notes;
        task.classList.remove('active');
      });
      
      // Append elements
      buttonsContainer.appendChild(saveButton);
      buttonsContainer.appendChild(deleteButton);
      notesContainer.appendChild(textarea);
      notesContainer.appendChild(buttonsContainer);
      task.appendChild(notesContainer);
      
      // Load existing notes if any
      if (task.dataset.notes) {
        textarea.value = task.dataset.notes;
      }
      
      // Add click event to task to toggle notes
      task.addEventListener('click', function(e) {
        // Only toggle if not clicking on checkbox, edit or delete buttons
        if (!e.target.matches('input[type="checkbox"]') && 
            !e.target.matches('.edit') && 
            !e.target.matches('.delete') &&
            !e.target.closest('.task-notes')) {
          toggleTaskNotes(this);
        }
      });
    }
  });
}

document.addEventListener('DOMContentLoaded', function() {
    // Try to initialize the map if Google Maps API is loaded
    if (typeof google !== 'undefined' && google.maps) {
        initMap();
    } else {
        console.warn("Google Maps API not loaded");
    }

    // Add event listener for the search button
    const searchButton = document.getElementById('searchButton');
    if (searchButton) {
        searchButton.addEventListener('click', searchGoogle);
    } else {
        console.error("Search button not found");
    }
    
    // Add event listener for the search input (to allow pressing Enter)
    const searchInput = document.getElementById('searchQuery');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                searchGoogle();
            }
        });
    }

    // Add event listeners for category filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            // Click event
            button.addEventListener('click', function() {
                const category = this.dataset.category;
                filterTasksByCategory(category);
            });
            
            // Enter key event
            button.addEventListener('keypress', function(event) {
                if (event.key === 'Enter') {
                    const category = this.dataset.category;
                    filterTasksByCategory(category);
                }
            });
        });
    } else {
        console.error("Filter buttons not found");
    }
    
    // Function to handle the "Add" button click
    function handleAddTask() {
        // Your existing add task logic here
        // This should be the same code that runs when the Add button is clicked
        const addBtn = document.getElementById('add-btn');
        if (addBtn) {
            addBtn.click(); // Simulate clicking the Add button
        }
    }

    // Add event listeners for Enter key on location and date inputs
    const locationInput = document.getElementById('task-location');
    const dateTimeInput = document.getElementById('task-datetime');
    
    if (locationInput) {
        locationInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                handleAddTask();
            }
        });
    }
    
    if (dateTimeInput) {
        dateTimeInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                handleAddTask();
            }
        });
    }

    // Initialize notes feature for existing tasks
    addNotesFeatureToTasks();
    
    // Observer to add notes feature to new tasks
    const tasksContainer = document.getElementById('tasks');
    if (tasksContainer) {
      const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            addNotesFeatureToTasks();
          }
        });
      });
      
      observer.observe(tasksContainer, { childList: true, subtree: true });
    }
});
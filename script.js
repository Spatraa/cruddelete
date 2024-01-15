document.addEventListener('DOMContentLoaded', function() {
    const userForm = document.getElementById('userForm');
    const userDataDiv = document.getElementById('userData');
    let editingIndex = -1; // To keep track of the index being edited
  
    // Load data from the backend API on page load
    fetchDataFromAPI();
  
    // Add event listener for form submission
    userForm.addEventListener('submit', function(event) {
      event.preventDefault();
  
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const phone = document.getElementById('phone').value;
  
      const userDetails = {
        name: name,
        email: email,
        phone: phone
      };
  
      axios.post('https://crudcrud.com/api/16315bd528df47dca6a09d63ed7ff762/appointData', userDetails)
        .then((response) => {
          console.log(response);
          // Refresh data from the backend API after successful submission
          fetchDataFromAPI();
        })
        .catch((err) => {
          console.log(err);
        });
  
      const storedUsers = localStorage.getItem('users');
      const usersArray = storedUsers ? JSON.parse(storedUsers) : [];
  
      if (editingIndex > -1) {
        usersArray[editingIndex] = userDetails;
        editingIndex = -1;
      } else {
        usersArray.push(userDetails);
      }
  
      localStorage.setItem('users', JSON.stringify(usersArray));
      renderUsers();
      userForm.reset();
    });
  
    // Add event listener for page refresh
    window.addEventListener('beforeunload', function() {
      localStorage.removeItem('users');
    });
  
    function fetchDataFromAPI() {
      axios.get('https://crudcrud.com/api/16315bd528df47dca6a09d63ed7ff762/appointData')
        .then((response) => {
          const apiData = response.data;
          localStorage.setItem('users', JSON.stringify(apiData));
          renderUsers();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  
    function renderUsers() {
      userDataDiv.innerHTML = '';
  
      const storedUsers = localStorage.getItem('users');
      if (storedUsers) {
        const usersArray = JSON.parse(storedUsers);
        usersArray.forEach((user, index) => {
          const userItem = document.createElement('ul');
          const deleteButton = document.createElement('button');
          deleteButton.textContent = 'Delete';
          const editButton = document.createElement('button');
          editButton.textContent = 'Edit';
  
          deleteButton.addEventListener('click', function() {
            deleteUser(index, user._id);
          });
  
          editButton.addEventListener('click', function() {
            editingIndex = index;
            const { name, email, phone } = usersArray[index];
            document.getElementById('name').value = name;
            document.getElementById('email').value = email;
            document.getElementById('phone').value = phone;
          });
  
          userItem.innerHTML = `<li>Name: ${user.name} | Email: ${user.email} | Phone: ${user.phone}</li>`;
          userItem.appendChild(deleteButton);
          userItem.appendChild(editButton);
          userDataDiv.appendChild(userItem);
        });
      }
    }
  
    function deleteUser(index, userId) {
      axios.delete(`https://crudcrud.com/api/16315bd528df47dca6a09d63ed7ff762/appointData/${userId}`)
        .then(() => {
          // Remove the user from local storage
          removeUserFromLocalStorage(index);
          // Render users on the website
          renderUsers();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  
    function removeUserFromLocalStorage(index) {
      const storedUsers = localStorage.getItem('users');
      if (storedUsers) {
        const usersArray = JSON.parse(storedUsers);
        // Remove the user at the specified index
        usersArray.splice(index, 1);
        localStorage.setItem('users', JSON.stringify(usersArray));
      }
    }
  });
  
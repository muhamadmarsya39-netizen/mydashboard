const userList = document.getElementById('userList');

fetch('/users')
  .then(res => res.json())
  .then(users => {
    users.forEach(user => {
      const li = document.createElement('li');
      li.textContent = `${user.id} - ${user.name} (${user.email})`;
      userList.appendChild(li);
    });
  })
  .catch(err => console.error(err));

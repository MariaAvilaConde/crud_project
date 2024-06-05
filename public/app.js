document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('user-form');
    const userTableBody = document.getElementById('user-table-body');
    let editingUserId = null;
  
    // Obtener usuarios y mostrarlos en la tabla
    const fetchUsers = async () => {
      const response = await fetch('http://localhost:3000/users');
      const users = await response.json();
      userTableBody.innerHTML = '';
      users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${user.id}</td>
          <td>${user.name}</td>
          <td>${user.email}</td>
          <td>
            <button onclick="editUser(${user.id}, '${user.name}', '${user.email}')">Editar</button>
            <button onclick="deleteUser(${user.id})">Eliminar</button>
          </td>
        `;
        userTableBody.appendChild(row);
      });
    };
  
    // Agregar o editar usuario
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
  
      if (editingUserId) {
        await fetch(`http://localhost:3000/users/${editingUserId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email })
        });
        editingUserId = null;
      } else {
        await fetch('http://localhost:3000/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email })
        });
      }
  
      form.reset();
      fetchUsers();
    });
  
    // Editar usuario
    window.editUser = (id, name, email) => {
      document.getElementById('name').value = name;
      document.getElementById('email').value = email;
      editingUserId = id;
    };
  
    // Eliminar usuario
    window.deleteUser = async (id) => {
      await fetch(`http://localhost:3000/users/${id}`, { method: 'DELETE' });
      fetchUsers();
    };
  
    // Inicializar la tabla de usuarios
    fetchUsers();
  });
  
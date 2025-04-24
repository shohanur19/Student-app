// frontend/index.js

// Function to search for a student by roll number
async function searchStudent() {
  const roll = document.getElementById('rollInput').value.trim();  // Get the roll number from the input field
  if (roll === '') {
    alert('Please enter a roll number');
    return;
  }

  try {
    const res = await fetch(`http://localhost:5000/api/students/${roll}`);  // Send GET request to the backend
    if (res.ok) {
      const student = await res.json();  // Get student data in JSON format
      document.getElementById('studentName').textContent = student.full_name;
      document.getElementById('studentRollNumber').textContent = student.roll_number;
      document.getElementById('studentSession').textContent = student.session;
      document.getElementById('studentYear').textContent = student.year;
      document.getElementById('studentResult').style.display = 'block';  // Display student data
    } else {
      alert('Student not found');
    }
  } catch (err) {
    alert('Error fetching data');
  }
}


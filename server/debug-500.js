async function run() {
  try {
    const regRes = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: "Debug Fetch", email: "debug3@debug.com", password: "password123" })
    });
    
    if(!regRes.ok) throw new Error(await regRes.text());
    const regData = await regRes.json();
    const token = regData.token;
    
    const taskRes = await fetch('http://localhost:5000/api/tasks', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({ title: "Test Task", priority: "Urgent", category: "Work" })
    });
    
    if(!taskRes.ok) {
      console.log("Error Response Text:", await taskRes.text());
    } else {
      console.log("Success:", await taskRes.json());
    }
  } catch (err) {
    console.error("Unknown error:", err.message);
  }
}
run();

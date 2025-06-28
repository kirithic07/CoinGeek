<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['error' => 'Only POST method is allowed']);
    exit();
}

// Get the posted data
$data = json_decode(file_get_contents('php://input'), true);

// Validate input
if (!isset($data['email']) || !isset($data['password'])) {
    http_response_code(400); // Bad Request
    echo json_encode(['error' => 'Email and password are required']);
    exit();
}

// Include database configuration
require_once 'config.php';

// Sanitize inputs
$email = mysqli_real_escape_string($conn, $data['email']);
$password = $data['password']; // We'll compare with hashed password

// Check if user exists
$sql = "SELECT id, email, password FROM users WHERE email = '$email'";
$result = mysqli_query($conn, $sql);

if (mysqli_num_rows($result) > 0) {
    $user = mysqli_fetch_assoc($result);
    
    // Verify password
    if (password_verify($password, $user['password'])) {
        // Password is correct
        http_response_code(200);
        echo json_encode(['message' => 'Login successful', 'user_id' => $user['id']]);
    } else {
        // Password is incorrect
        http_response_code(401); // Unauthorized
        echo json_encode(['error' => 'Invalid credentials']);
    }
} else {
    // User not found
    http_response_code(401); // Unauthorized
    echo json_encode(['error' => 'Invalid credentials']);
}

// Close connection
mysqli_close($conn);
?>
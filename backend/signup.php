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
$password = password_hash($data['password'], PASSWORD_DEFAULT); // Hash the password

// Check if email already exists
$check_sql = "SELECT id FROM users WHERE email = '$email'";
$check_result = mysqli_query($conn, $check_sql);

if (mysqli_num_rows($check_result) > 0) {
    // Email already exists
    http_response_code(409); // Conflict
    echo json_encode(['error' => 'Email already registered']);
    exit();
}

// Insert new user
$sql = "INSERT INTO users (email, password) VALUES ('$email', '$password')";

if (mysqli_query($conn, $sql)) {
    // User created successfully
    http_response_code(201); // Created
    echo json_encode(['message' => 'User registered successfully']);
} else {
    // Error creating user
    http_response_code(500); // Internal Server Error
    echo json_encode(['error' => 'Registration failed: ' . mysqli_error($conn)]);
}

// Close connection
mysqli_close($conn);
?>
<?php
require_once '../config/check_auth.php';

// now safe to run code for logged-in users
echo json_encode(["message" => "You are authorized!"]);

// right here

?>
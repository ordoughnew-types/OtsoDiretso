<!DOCTYPE html>
<html>
<head>
    <title>Password Reset</title>
</head>
<body>
    <h2>Password Reset Request</h2>

    <p>You requested a password reset.</p>

    <p>
        Click the link below to reset your password:
    </p>

    <a href="{{ $resetLink }}">
        Reset Password
    </a>

    <p>If you did not request this, ignore this email.</p>
</body>
</html>
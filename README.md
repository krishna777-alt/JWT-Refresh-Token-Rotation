JWT Refresh Token Rotation with Hashed Storage (Node.js)

A secure authentication system implementing Refresh Token Rotation and hashed refresh token storage, designed to prevent token reuse attacks and enhance overall security.

This project goes beyond basic JWT auth by adding:

🚀 What Makes This Special?

🔁 Refresh Token Rotation

🔐 Hashed Refresh Tokens in Database

🚫 Replay Attack Prevention

🧠 Token Reuse Detection

🛡️ Improved Session Security

Instead of reusing the same refresh token:

User logs in → receives:

Access Token (short-lived)

Refresh Token (long-lived)

Refresh Token is:

Hashed before storing in DB

Plain token is sent to client

When refreshing:

Old refresh token is invalidated

New refresh token is issued (rotation)

If an old token is reused:

🚨 System detects possible token theft

All sessions can be revoked

# Eufy NVR WebRTC Proxy
A standalone Home Assistant Addon designed specifically to proxy Eufy NVR (like HomeBase 3) WebRTC video streams into Home Assistant.

This project deliberately avoids the heavy P2P integration to focus purely on the Eufy Web Portal streaming protocols. Because Eufy employs aggressive anti-bot measures (AWS CloudFront WAF) against automated logins, this addon asks for a long-lived Web `auth_token` directly rather than an Email and Password.

## How to get your Web `auth_token`
This token lasts for a very long time (often up to a year) before expiring. Follow these simple steps to grab it from your browser:

1. Open a desktop web browser (Chrome, Edge, Firefox, Safari).
2. Go to the Eufy Web Portal: **[https://nvr.eufy.com/](https://nvr.eufy.com/)**
3. Log in normally using your Eufy email and password.
4. Once logged in and viewing your cameras, open your browser's **Developer Tools** (Press `F12` or right-click anywhere and select "Inspect").
5. Go to the **Application** tab (in Chrome/Edge) or **Storage** tab (in Firefox).
6. In the left sidebar, expand **Local storage** (NOT Cookies) and click on `https://nvr.eufy.com`.
7. Look for the row with the Name containing `userInfo`, `guiLoginInfo`, or `token`. Click on it to view its data.
8. Look inside the JSON data value for `"auth_token":"<your_40_char_token>"`, or if it's a direct key, just copy the **Value**.
9. Copy that 40-character string (without the quotes) and paste it into the `auth_token` field in the Home Assistant Addon configuration!

## Configuration

* `auth_token`: The 40-character Web Token extracted using the steps above.
* `station_sn`: The Serial Number of your Eufy NVR or HomeBase.

## Troubleshooting
If the addon logs show "Failed to obtain NVR WebSocket Sign Token", your web token has likely expired or was copied incorrectly. Please log out of the Eufy Web Portal, log back in, and grab the new `auth_token`.

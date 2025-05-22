export const LightHeartInviteEmail = (
    firstName: string,
    email: string,
    rawPassword: string,
    frontendUrl: string
  ) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f4f4f4;
        text-align: center;
      }
  
      .container {
        width: 100%;
        max-width: 800px;
        margin: 0 auto;
        background-color: #ffffff;
        padding: 30px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      }
  
      h1 {
        color: #746253;
      }
  
      p {
        text-align: left;
        line-height: 1.6;
        color: #333333;
      }
  
      .highlight {
        font-weight: bold;
      }
  
      .cta-button {
        display: inline-block;
        margin-top: 20px;
        padding: 12px 24px;
        background-color: #746253;
        color: #FFFFFF !important;
        text-decoration: none !important;
        border-radius: 5px;
        font-size: 16px;
      }
  
      .footer {
        margin-top: 30px;
        font-size: 12px;
        color: #888;
      }
    </style>
  </head>
  <body>
    <div class="container">  
      <h1>Welcome to the Light Heart Artist Map!</h1>
  
      <p>Hi ${firstName},</p>
  
      <p>We would love to display your business on the newly improved <strong>Light Heart Artist Map</strong>! This is a free marketing tool we’ve developed for our customers and students to help new clients discover talented artists in their area.</p>
  
      <p><span class="highlight">Follow these steps to create your listing:</span></p>
  
      <ol style="text-align: left;">
        <li>Use the login credentials below to access your new account:</li>
      </ol>

      <p style="text-align: left;">
      <span class="highlight">Email:</span> ${email}<br />
      <span class="highlight">Temporary Password:</span> ${rawPassword}
      </p>
  
      <ol start="2" style="text-align: left;">
        <li>Click the menu in the top left corner and go to <strong>My Profile</strong>.</li>
        <li>Click <strong>Edit Profile</strong> to add your business info and get featured on the map.</li>
      </ol>
  
      <a href="${frontendUrl}" class="cta-button" target="_blank">Log In & Add Your Business Here!</a>
      
      <p>If the above link doesn’t work, please copy and paste this URL into your browser: https://map.lightheartlash.com</p>
      
      <p>The map will automatically display any Light Heart courses you've completed. 🎨✨</p>
      
      <p>Warmly,<br />The Light Heart Team</p>
  
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} Light Heart. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>
  `;
  
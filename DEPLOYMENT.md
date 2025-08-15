# Deployment Instructions for Namecheap Shared Hosting

This guide provides step-by-step instructions on how to deploy the Market Tracker application to your Namecheap shared hosting account using SSH and Git.

## Prerequisites

-   Your Namecheap shared hosting account credentials (cPanel login).
-   The application code pushed to a Git repository (e.g., on GitHub).
-   An SSH client installed on your local machine (standard on macOS and Linux; you can use PuTTY or Windows Terminal on Windows).

---

## Part 1: Connecting to Namecheap via SSH

First, you need to enable and connect to your server via SSH. This gives you command-line access to your hosting environment.

1.  **Find Your SSH Credentials:**
    *   Log in to your Namecheap account and go to your cPanel.
    *   In the "Security" section, click on **"SSH Access"**.
    *   This page will show your cPanel username, the server's IP address, and the required SSH Port. **The port will likely be a four-digit number, not the standard port 22.** Note these details down.

2.  **Connect from Your Local Machine:**
    *   Open your terminal (or SSH client).
    *   Use the following command format, replacing the placeholders with your details:
        ```bash
        ssh YOUR_CPANEL_USERNAME@YOUR_DOMAIN.com -p SSH_PORT
        ```
        *Example: `ssh rumfor@rumfor.com -p 21098`*
    *   You will be prompted for your cPanel password. When you type it, you won't see any characters. Press Enter when done.
    *   If successful, you will see a command prompt for your server.

**(Recommended) For more security and convenience, set up SSH keys instead of using a password. You can do this from the same "SSH Access" page in cPanel by generating a key and authorizing it.**

---

## Part 2: Cloning the Repository with Git

The easiest way to get your code onto the server is by using cPanel's built-in Git tool.

1.  In cPanel, find the "Files" section and click on **"Git™ Version Control"**.
2.  Click the **"Create"** button.
3.  **Clone URL:** Paste the `https-` or `ssh-` URL of your Git repository.
4.  **Repository Path:** This is where the files will be stored on the server. A good practice is to keep it organized. Example: `/home/YOUR_CPANEL_USERNAME/apps/market-tracker`.
5.  **Repository Name:** This is just a label for cPanel, e.g., "Market Tracker App".
6.  Click **"Create"**. cPanel will now clone your repository from GitHub (or another provider) into the specified path.

---

## Part 3: Setting Up the Node.js Application

cPanel has a dedicated tool for running Node.js applications.

1.  Go back to the main cPanel page. In the "Software" section, click on **"Setup Node.js App"**.
2.  Click **"Create Application"**.
3.  **Node.js version:** Select the latest available version (e.g., 16.x, 18.x).
4.  **Application mode:** Set to "Production".
5.  **Application root:** Set this to the **exact path** where you just cloned your repository. *Example: `/home/rumfor/apps/market-tracker`*.
6.  **Application URL:** Select your domain (`rumfor.com`) from the dropdown. This will make the app live on that URL.
7.  **Application startup file:** Enter `src/server.js`.
8.  Click **"Create"**. The page will refresh, and your application will be registered but not yet running correctly.

9.  **Install Dependencies:**
    *   At the top of the app's configuration page, you will see a command to enter the virtual environment. It will look like this: `source /home/YOUR_CPANEL_USERNAME/nodevenv/YOUR_APP_ROOT/XX/bin/activate`.
    *   Connect via SSH (from Part 1).
    *   Navigate to your application's directory:
        ```bash
        cd ~/apps/market-tracker
        ```
    *   Run the `npm install` command to install all the dependencies from `package.json`:
        ```bash
        npm install
        ```
        *(Note: cPanel's Node.js environment automatically links the `npm` command, so you usually don't need the full path here once you're in the directory.)*

---

## Part 4: Setting Up the Database

1.  **Create the Database (if you haven't):**
    *   In cPanel, go to "Databases" -> **"PostgreSQL Databases"**.
    *   Create a new database (e.g., `xsoucsnq_rumfor`).
    *   Create a new user and give it a strong password (e.g., `xsoucsnq_rumforuser`).
    *   Add the user to the database and grant it "All Privileges".
2.  **Run the Migration:**
    *   Connect to your server via SSH and navigate to your app's directory.
    *   Run the migration script using the `npm` script we created:
        ```bash
        npm run db:migrate
        ```
    *   This will create all the necessary tables in your database.

---

## Part 5: Setting Environment Variables

Do not rely on the `.env` file for production. Use cPanel's interface to set variables securely.

1.  Go back to the **"Setup Node.js App"** page and find your application.
2.  Scroll down to the **"Environment Variables"** section.
3.  Add the following variables one by one:
    *   `DB_HOST`: `localhost` (usually correct on cPanel)
    *   `DB_USER`: Your database username (e.g., `xsoucsnq_rumforuser`)
    *   `DB_PASSWORD`: Your database password
    *   `DB_DATABASE`: Your database name (e.g., `xsoucsnq_rumfor`)
    *   `DB_PORT`: `5432` (default for PostgreSQL)
    *   `JWT_SECRET`: A long, random, secret string for signing tokens.
    *   `NODE_ENV`: `production`

---

## Part 6: Starting the Application

1.  On the "Setup Node.js App" page, click the **"Restart"** button at the top right.
2.  This will restart your application with the correct dependencies and environment variables.
3.  Visit `rumfor.com`. Your application should now be live!

---

## Part 7: Updating the Application in the Future

When you have new code to deploy:

1.  Push your local changes to your main branch on GitHub.
2.  In cPanel, go to **"Git™ Version Control"**.
3.  Click **"Manage"** next to your repository.
4.  Select the **"Pull or Deploy"** tab.
5.  Click **"Update from Remote"** to pull the latest changes.
6.  If you changed `package.json` (e.g., added a new dependency), you must SSH in and run `npm install` again.
7.  Go to **"Setup Node.js App"** and **"Restart"** your application to make the changes live.

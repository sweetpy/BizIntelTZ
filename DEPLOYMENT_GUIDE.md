# cPanel Deployment Guide for BizIntelTZ

This guide provides instructions for deploying the BizIntelTZ application to a cPanel hosting environment.

## Prerequisites

- cPanel hosting account with:
  - Node.js support (12.x or higher)
  - Python support (3.7 or higher)
  - SSH access (recommended)
  - Sufficient storage and bandwidth
- Domain or subdomain configured in cPanel
- FTP/SFTP client or cPanel File Manager
- Basic familiarity with cPanel administration

## Deployment Steps

### 1. Build the Frontend Application

Before deploying to cPanel, you need to create a production build of the React application:

```bash
# Install dependencies if not already installed
npm install

# Build the application
npm run build
```

This will create a `dist` directory with optimized static files.

### 2. Upload Files to cPanel

#### Option A: Using File Manager

1. Log in to your cPanel account
2. Navigate to the File Manager
3. Go to the public directory (`public_html` or your chosen subdomain directory)
4. Upload all the files from the `dist` directory of your local project

#### Option B: Using FTP/SFTP

1. Connect to your server using FTP/SFTP client
2. Navigate to the public directory (`public_html` or your chosen subdomain directory)
3. Upload all files from the `dist` directory of your local project

### 3. Configure .htaccess

The `.htaccess` file is included in the upload and provides:

- URL rewriting for SPA routing
- Compression settings
- Security headers
- Caching rules

Ensure this file is present in your root directory. If your hosting uses a different configuration or has special requirements, you may need to adjust this file.

### 4. Set Up Backend (Optional)

For a basic static site deployment, only the frontend steps above are required. If you need to run the backend server:

#### A. Using Node.js App in cPanel:

1. In cPanel, go to "Setup Node.js App"
2. Create a new Node.js application
3. Set the application root to your project directory
4. Set the Application URL to your domain or subdomain
5. Set the Application startup file to `server.js`
6. Set the Node.js version to 18.x or higher
7. Set environment variables (copy from your `.env` file)
8. Click "Create"

#### B. Using Python App (for FastAPI backend):

1. In cPanel, go to "Setup Python App"
2. Create a new Python application
3. Set the application root to your project directory
4. Set the Application URL to your domain or subdomain
5. Set the Application startup file to `main.py`
6. Select Python version 3.9 or higher
7. Set environment variables as needed
8. Click "Create"

### 5. Configure Domain/Subdomain

If not already set up:

1. In cPanel, navigate to "Domains" or "Subdomains"
2. Add your domain/subdomain and point it to the directory where you uploaded the files

### 6. Configure SSL (Recommended)

1. In cPanel, navigate to "SSL/TLS" or "Let's Encrypt SSL"
2. Issue an SSL certificate for your domain
3. Enable HTTPS redirection in your `.htaccess` file by uncommenting the HTTPS redirect rule

### 7. Test Your Deployment

1. Visit your website at your domain/subdomain
2. Test all major features to ensure they work correctly
3. Check console for any errors
4. Verify API connections if using backend services

## Troubleshooting

### Common Issues

- **404 Errors on Page Refresh**: Ensure .htaccess is properly configured with URL rewriting
- **API Connection Issues**: Check if your backend URLs are correctly set in the environment variables
- **Mixed Content Warnings**: Ensure all resources are loaded over HTTPS
- **CORS Errors**: Configure your backend to allow requests from your domain

### Logs

- Check the error logs in cPanel (under "Logs" or "Error Logs")
- For Node.js applications, check the application logs in the Node.js App Manager

## Maintenance

### Updating Your Application

To update your application:

1. Make changes to your code locally
2. Rebuild with `npm run build`
3. Upload the new files to replace the old ones

For frequent updates, consider setting up a CI/CD pipeline using GitHub Actions or similar services.

### Monitoring

- Set up uptime monitoring using a service like UptimeRobot or Pingdom
- Regularly check your cPanel server statistics for resource usage
- Monitor error logs for unexpected issues

## Support

If you encounter issues with your deployment, check the following resources:

- Your hosting provider's documentation and support
- cPanel documentation
- React deployment best practices
- Contact your system administrator for hosting-specific questions

---

This deployment guide assumes a standard cPanel setup. Your specific hosting environment may have different features or requirements. Adjust the steps as needed for your particular situation.
# Image Serving Fix for Docker Deployment

## Issue
Images are not showing up in Docker deployment because:
1. Upload directories may not exist in the container
2. Static files from `client/public/images` need to be accessible
3. Path resolution might be incorrect in Docker context

## Solution Applied

### 1. Dockerfile Updates
- Created upload directories before build
- Ensured build output includes image directories
- Copied public images to build directory
- Set proper permissions

### 2. Static File Serving
The server serves images from:
- `/images` → `client/public/images` (for uploads)
- `/static` → `client/build/static` (for React assets)

### 3. Image Paths
Frontend uses paths like:
- `/images/uploads/portfolio/filename.webp`
- `/images/uploads/blog/filename.webp`
- `/images/uploads/team/filename.webp`

## Verification Steps

1. **Check if images directory exists in container:**
   ```bash
   docker exec -it <container-name> ls -la /app/client/public/images/uploads/
   ```

2. **Check if images are being served:**
   ```bash
   curl http://your-domain/images/uploads/portfolio/
   ```

3. **Check server logs for 404 errors:**
   ```bash
   docker logs <container-name> | grep -i image
   ```

## Additional Fixes Needed (if images still don't show)

### Option 1: Add Volume Mounts in Dockploy
If images are uploaded after deployment, you need persistent volumes:
- Mount: `/app/client/public/images/uploads` → Host directory
- Mount: `/app/uploads` → Host directory

### Option 2: Check CORS/Headers
Ensure CORS allows image requests and proper headers are set.

### Option 3: Verify Image URLs
Check browser console for 404 errors and verify the image paths in the database match the actual file locations.


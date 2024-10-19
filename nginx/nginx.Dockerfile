# Use the official Nginx image as the base image
FROM nginx:latest

# Copy custom Nginx configuration
COPY ./nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf

# Copy SSL certificates
COPY ./nginx/certs/server.crt /etc/nginx/certs/server.crt
COPY ./nginx/certs/server.key /etc/nginx/certs/server.key

# Expose port 443 for HTTPS traffic
EXPOSE 443

# Expose port 80 for HTTP traffic
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]

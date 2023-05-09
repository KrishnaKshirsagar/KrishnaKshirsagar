FROM node:lts AS user_node
# Set working directory
WORKDIR /app
# Copy all files from current directory to working dir in image
COPY . .
# install node modules and build assets
RUN npm install --force && npm run build

# nginx state for serving content
FROM nginx:alpine
# Set working directory to nginx asset directory
WORKDIR /usr/share/nginx/html/adminpanel
# Remove default nginx static assets
RUN rm -rf ./*
# Copy static assets from builder stage
COPY --from=user_node /app/dist/admin .
# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]




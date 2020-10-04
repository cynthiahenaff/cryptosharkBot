FROM node:12

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN yarn
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

ARG USER_ID
RUN if [-n "${USER_ID}" ]; then chown -R ${USER_ID}:${USER_ID} /usr/src/app ; fi
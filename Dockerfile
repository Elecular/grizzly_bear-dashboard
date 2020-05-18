FROM node:12.16
RUN npm install -g serve
COPY /app code
WORKDIR /code

ENV NODE_ENV=production
ENV REACT_APP_EXPERIMENTS_SERVICE="https://experiments.api.elecular.com"
ENV REACT_APP_USER_ACTIVITY_SERVICE="https://user-activity.api.elecular.com"

RUN npm ci
RUN npm run build
CMD ["serve", "-s", "build"]
FROM node:8 as react-build
WORKDIR /lib
COPY ./frontend ./
RUN yarn
RUN yarn build
FROM nginx:alpine
COPY --from=react-build /lib/build /var/www
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
ENTRYPOINT ["nginx","-g","daemon off;"]

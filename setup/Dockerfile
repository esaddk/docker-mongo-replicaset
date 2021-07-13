FROM mongo

# Create App Directory
WORKDIR /usr/src/configs
# Install App Depedencies
COPY rsconf.js .
COPY setup.sh .

CMD ["./setup.sh"]
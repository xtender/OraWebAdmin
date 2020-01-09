#!/bin/bash

yum install -y npm

#npm install

##npm install --save express
##npm install --save ejs
##npm install --save body-parser
##npm install --save websocket
##npm install --save express-ws
##npm install --save winston
##npm install --save express-basic-auth

cp orawebadmin.service /lib/systemd/system/
mkdir /var/log/orawebadmin
chown oracle:oinstall /var/log/orawebadmin

setcap 'cap_net_bind_service=+ep' /usr/bin/node

systemctl daemon-reload
systemctl enable orawebadmin
systemctl start orawebadmin

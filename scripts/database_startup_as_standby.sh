#!/bin/bash

export PATH=$PATH:$ORACLE_HOME/bin
export NLS_DATE_FORMAT='yyyy-mm-dd hh24:mi:ss'
sqlplus -S $LOGIN << 'EOF'
prompt starting standby as standby database in managed recovery mode:
prompt shuting down instance, an error message will be displayed if already shutdown
shutdown immediate
prompt starting instance in nomount mode
startup nomount;
prompt mount standby database
alter database mount standby database;
prompt start managed recovery
alter database recover managed standby database disconnect from session;
exit
EOF
echo end.

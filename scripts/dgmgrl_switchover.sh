#!/bin/bash

export PATH=$PATH:$ORACLE_HOME/bin
export NLS_DATE_FORMAT='yyyy-mm-dd hh24:mi:ss'
dgmgrl $LOGIN << EOF
show configuration;
switchover to $ORACLE_SID;
exit;
EOF
echo end.

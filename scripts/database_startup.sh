#!/bin/bash

export PATH=$PATH:$ORACLE_HOME/bin
export NLS_DATE_FORMAT='yyyy-mm-dd hh24:mi:ss'
sqlplus -S $LOGIN << 'EOF'
startup;
exit;
EOF
echo end.

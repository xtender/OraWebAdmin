#!/bin/bash

export PATH=$PATH:$ORACLE_HOME/bin
export NLS_DATE_FORMAT='yyyy-mm-dd hh24:mi:ss'

sqlplus -S $LOGIN << 'EOF'
set lines 300
select HOST_NAME, DATABASE_TYPE from v$instance;
select
    INSTANCE_NAME,
    INSTANCE_ROLE,
    VERSION,
    STARTUP_TIME,
    STATUS,
    DATABASE_STATUS
from v$instance;
exit;
EOF
echo end.

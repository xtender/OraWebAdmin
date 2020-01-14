#!/bin/bash

export PATH=$PATH:$ORACLE_HOME/bin
export NLS_DATE_FORMAT="yyyy-mm-dd hh24:mi:ss"
sqlplus -S $LOGIN << 'EOF'
set lines 300
col name for a30;
col status for a10;
prompt Last applied logs:

select recid,sequence#, first_time,next_time,applied,status
from v$archived_log l
where
 first_time>=(	select max(first_time) 
		from v$archived_log l
		where applied='YES'
		)
;
exit;
EOF
echo end.

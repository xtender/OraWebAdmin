set lines 300;
alter session set NLS_DATE_FORMAT='yyyy-mm-dd hh24:mi:ss';
select HOST_NAME, DATABASE_TYPE from v$instance;
select
    INSTANCE_NAME,
    (select database_role from v$database) as INSTANCE_ROLE,
    VERSION,
    STARTUP_TIME,
    STATUS,
    DATABASE_STATUS
from v$instance;
exit;

@echo off
(
echo set lines 300
echo select HOST_NAME from v$instance;
echo select
echo     INSTANCE_NAME,
echo     INSTANCE_ROLE,
echo     VERSION,
echo     STARTUP_TIME,
echo     STATUS,
echo     DATABASE_STATUS
echo from v$instance;
echo exit;
) | sqlplus -S %LOGIN%
@echo off
set NLS_DATE_FORMAT='yyyy-mm-dd hh24:mi:ss'
(
echo shutdown immediate;
echo exit;
) | sqlplus -S %LOGIN%
@echo off
set NLS_DATE_FORMAT=yyyy-mm-dd hh24:mi:ss
set LOGIN=%LOGIN:as sysdba=%
(
echo show configuration
echo show database %ORACLE_SID%;
echo exit;
) | dgmgrl -silent %LOGIN%

@echo off
set NLS_DATE_FORMAT=yyyy-mm-dd hh24:mi:ss
set LOGIN=%LOGIN:as sysdba=%
rman target %LOGIN% cmdfile=%SCRIPT%

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

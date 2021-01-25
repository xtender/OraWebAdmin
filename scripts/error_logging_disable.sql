set lines 300
col trigger_name for a30;

prompt *** Old status:
select trigger_name, status from dba_triggers where trigger_name like 'TRG_ERROR_LOGGING';

prompt *** Enabling...
alter trigger sys.TRG_ERROR_LOGGING disable;

prompt *** New status:
select trigger_name, status from dba_triggers where trigger_name like 'TRG_ERROR_LOGGING';
exit;

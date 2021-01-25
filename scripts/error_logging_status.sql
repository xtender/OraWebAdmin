set lines 300
col trigger_name for a30;
select trigger_name, status from dba_triggers where trigger_name like 'TRG_ERROR_LOGGING';
exit;

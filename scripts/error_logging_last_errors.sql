set lines 350

col USERNAME for a20;
col IP_ADDR  for a15;
col TMSTMP   for a23;
col MSG      for a60;
prompt *** Errors for last 24 hours:

select 
  ID
 ,username
 --,IP_ADDR
 ,to_char(TMSTMP,'dd mon hh24:mi:ssxff') TMSTMP
 --,ERRCODE
 --,SEQ
 ,MSG
 ,regexp_replace(replace(SQL_TEXT,chr(13),' '),'\s{2,}',' ') SQL_TEXT
from SYS.ERROR_LOG e
where e.tmstmp >= systimestamp - interval '1' day;

exit;

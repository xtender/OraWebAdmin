set lines 300;
col db_disp_nam  for a20;
col customer_txt for a25;

select db_disp_nam
      ,customer_txt
      ,db_version
      ,db_schema_version
      ,db_release_date
      ,created_dt
      ,modified_dt
from TMDDBA.TM_SYS;
col db_disp_nam  clear;
col customer_txt clear;

col schema_updates_applied for a30;
col comp_name for a30;
col user_name for a30;

select * 
from (
    select
        update_dt, 
        blankdb_v, 
        schema_updates_applied,
        comp_name,
        user_name
    from tmddba.tm_dbupdate 
    order by update_dt desc
) 
where rownum<=10
/
col schema_updates_applied clear;
col comp_name clear;
col user_name clear;

exit;

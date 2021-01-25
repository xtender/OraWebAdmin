#!/bin/bash

export PATH=$PATH:$ORACLE_HOME/bin
export NLS_DATE_FORMAT='yyyy-mm-dd hh24:mi:ss'
SLOGIN=${LOGIN%"as sysdba"}
rman target $SLOGIN cmdfile=$SCRIPT
echo end.

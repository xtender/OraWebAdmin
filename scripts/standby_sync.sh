#!/bin/bash

export PATH=$PATH:$ORACLE_HOME/bin
cd /opt/oracle/scripts/standby_sync &&./duplicate.sh

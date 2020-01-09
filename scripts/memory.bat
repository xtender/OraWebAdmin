@echo off

echo ===================
for /f "skip=1" %%p in ('wmic cpu get loadpercentage') do ( 
  set m=%%p
  goto :done1
)
:done1
echo CPU Load: %m% %%


echo ===================
echo RAM:
rem ==============================================================
rem * Free Memory:
for /f "skip=1" %%p in ('wmic os get freephysicalmemory') do ( 
  set m=%%p
  goto :done1
)
:done1
rem echo %m%
set /a mfree=%m% / 1024
echo Free(KB): %mfree%

rem ==============================================================
rem * Total Memory:
for /f "skip=1" %%p in ('wmic ComputerSystem get TotalPhysicalMemory') do ( 
  set m=%%p
  goto :done2
)
:done2
rem echo %m%
set /a mtotal=%m:~0,-3% / 1024 /1024
echo Total(GB): %mtotal%
echo ===================

rem ==============================================================
echo Disk free space:
rem wmic os get freephysicalmemory
rem wmic ComputerSystem get TotalPhysicalMemory
wmic LogicalDisk Get DeviceID^,FreeSpace 

rem echo "FreeSpace=%FreeSpace:~-15%"


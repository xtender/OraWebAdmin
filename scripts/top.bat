@echo off

echo ===================
for /f "skip=1" %%p in ('wmic cpu get loadpercentage') do ( 
  set m=%%p
  goto :done1
)
:done1
echo CPU Load: %m% %%

echo ===================
echo Top processes:
rem ==============================================================
echo Name        PercentProcessorTime
echo ----------- --------------------
for /f "skip=1 delims=" %%p in ('wmic path Win32_PerfFormattedData_PerfProc_Process where "PercentProcessorTime > 1" get PercentProcessorTime^, Name ^| findstr /V "_Total" ^| findstr /V "PercentProcessorTime" ^| sort /+20') do ( 
  echo %%p
)
:done3




rem wmic path Win32_PerfFormattedData_PerfProc_Process where "PercentProcessorTime > 1" get PercentProcessorTime, Name | findstr /V "_Total" | sort /+20
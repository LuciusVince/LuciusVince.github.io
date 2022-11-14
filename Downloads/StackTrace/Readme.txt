AUTHORSHIP AND LICENSE
**********************
Project: StackTrace
Author : Vincenzo Galati (GitHub: TheRealVince)
License: MIT


DESCRIPTION
***********
StackTrace is a python library which aims at making 
exception Information more readable than vanilla python.


COMPARISION OF RAISED EXCEPTION-STACKS
**************************************
With Vanilla Python
````````````````````
Traceback (most recent call last):
  File "/home/TheRealVince/Python/Stacktrace/test.py", line 18, in <module>
    Main()
  File "/home/TheRealVince/Python/Stacktrace/test.py", line 15, in Main
    A_Function()
  File "/home/TheRealVince/Python/Stacktrace/test.py", line 12, in A_Function
    Another_Function()
  File "/home/TheRealVince/Python/Stacktrace/test.py", line 9, in Another_Function
    Divide(x, y)
  File "/home/TheRealVince/Python/Stacktrace/test.py", line 4, in Divide
    a / b
ZeroDivisionError: division by zero


With StackTrace
````````````````
============================
EXCEPTION: ZeroDivisionError
============================
Message: division by zero


Local variables:
****************
a: 999
b: 0


-------------------------------------------------------------------------
                               StackTrace                                
-------------------------------------------------------------------------
 Path                                         | Line | Context           
-------------------------------------------------------------------------
 /home/TheRealVince/Python/Stacktrace/test.py | 4    | a / b                    <= ERROR HAPPENS HERE!
 /home/TheRealVince/Python/Stacktrace/test.py | 9    | Divide(x, y)      
 /home/TheRealVince/Python/Stacktrace/test.py | 12   | Another_Function()
 /home/TheRealVince/Python/Stacktrace/test.py | 16   | A_Function()      
-------------------------------------------------------------------------




Example Usage
*************
from StackTrace import GetExcDetails

try:
    # Your Code here...

except Exception as exc:
    excDetails = GetExcDetails(exc)
    print(excDetails)
    # Log(excDetails)




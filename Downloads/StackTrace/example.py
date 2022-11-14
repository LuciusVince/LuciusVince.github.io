from StackTrace import StackTrace

def Divide(a, b):
    a / b

def Another_Function():
    x = 999
    y = 0
    Divide(x, y)

def A_Function():
    Another_Function()

def Main(a = 1, b = 0):
    try:
        A_Function()
    except Exception as exc:
        excDetails = GetExcDetails(exc)
        print(excDetails)



Main()

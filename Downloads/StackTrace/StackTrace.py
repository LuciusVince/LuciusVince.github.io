#!/usr/bin/env python3
from inspect import trace

# https://stackoverflow.com/a/58045927
def GetExceptionName(exception):
    module = exception.__class__.__module__
    if module is None or module == str.__class__.__module__:
        return exception.__class__.__name__

    return f'{module}.{exc.__class__.__name__}'

def GetStackTraceInformation():
    stackTraceInformation = []

    frameInfos = trace()

    for frameInfo in frameInfos:
        filepath = frameInfo[1]
        linenr = str(frameInfo[2])
        codeContext = ''.join(frameInfo[4]).strip().replace("\n", "\\n") # single code line, to fit into table row

        stackTraceEntry = [filepath, linenr, codeContext]
        stackTraceInformation.append(stackTraceEntry)

    return [stackTraceInformation[::-1], frameInfos[-1][0].f_locals]

def ParseLocals(stackLocals):
    result  = "Local variables:\n" # Eigentlich interessieren uns vorallem die Parameter
    result += "****************\n"

    maxLenK = 0
    for k in stackLocals:
        lenK = len(str(k))
        maxLenK = lenK if lenK > maxLenK else maxLenK

    keyIndex = 0
    for k in stackLocals:
        try:
          result += f'{k.ljust(maxLenK, " ")}: ' + str(stackLocals[k]).replace("\r", "\\r").replace("\n", "\\n") + '\n'
        except Exception as keyException:
            try:
                result += f'{k.ljust(maxLenK, " ")}: WARNING, StackTrace.py: ERROR, Could not output content of variable "{k}"'
            except:
                result += f'???: WARNING, StackTrace.py: Could not parse local variable at Index "{keyIndex}"'

        keyIndex += 1

    return result.rstrip()

def StackTrace(exc):
    exceptionName = GetExceptionName(exc)
    stackTraceInformation, stackLocals = GetStackTraceInformation()
    stackLocalsFormatted = ParseLocals(stackLocals)

    exceptionTitle = '=' * len(exceptionName)
    exceptionTitle +=  '===========\n'
    exceptionTitle +=  f'EXCEPTION: {exceptionName}\n'
    exceptionTitle += '=' * len(exceptionName)
    exceptionTitle +=  '===========\n'

    exceptionMessage = f"Message: {str(exc).strip()}"


    # Laengen ermitteln, um StackTrace richtig zu formatieren
    header_filepath = "Path"
    header_line = "Line"
    header_code = "Context"

    maxLen_filepath = len(header_filepath)
    maxLen_line = len(header_line)
    maxLen_code = len(header_code)

    for filepath, line, code in stackTraceInformation:
        maxLen_filepath = len(filepath) if len(filepath) > maxLen_filepath else maxLen_filepath
        maxLen_line = len(line) if len(line) > maxLen_line else maxLen_line
        maxLen_code = len(code) if len(code) > maxLen_code else maxLen_code

    # StackTrace formatieren

    header_filepath = header_filepath.ljust(maxLen_filepath, " ")
    header_line = header_line.ljust(maxLen_line, " ")
    header_code = header_code.ljust(maxLen_code, " ")
    header = f' {header_filepath} | {header_line} | {header_code}'
    underline = '-' * len(header)
    marginLeft = (len(header) - len(" StackTrace ")) // 2

    stackTraceHeader = (marginLeft * " ") + "StackTrace"


    result =  f"{underline}\n"
    result += f"{stackTraceHeader}\n"
    result += f"{underline}\n"

    result += f'{header}\n'
    result += f'{underline}\n'

    firstLine = True
    for filepath, line, code in stackTraceInformation:
        filepathPadded = filepath.ljust(maxLen_filepath, " ")
        linePadded = line.ljust(maxLen_line, " ")
        codePadded = code.ljust(maxLen_code, " ")

        if firstLine:
            firstLine = False
            codePadded += "       <= ERROR HAPPENS HERE!" 

        result += f' {filepathPadded} | {linePadded} | {codePadded}\n'

    result += underline

    return f'{exceptionTitle}{exceptionMessage}\n\n\n{stackLocalsFormatted}\n\n\n{result}'


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
        #excDetails = GetExcDetails(exc)
        excDetails = StackTrace(exc)
        print(excDetails)



Main()

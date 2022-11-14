import sys
from urllib.request import urlretrieve
from JustDownloadProgressBar import *

class JustDownload():
    def __init__(self, useragent = "JustDownload", httpHeaderDict = {}, quietMode = False, chunksize = 1024):
        self.useragent = useragent    
        self.quietMode = quietMode
        self.chunksize = chunksize
        
        # http-header initialization
        if type(httpHeaderDict) ==  type({}):
            self.httpHeaderDict = httpHeaderDict
        else:
            self.httpHeaderDict = {} 
        self.httpHeaderDict["User-Agent"] = useragent


    def PrintError(self, exc):
        print("Error:")
        print(exc)

    # Save to file
    def SaveToFile(self, url, savepath):
        #try:
        filename = savepath.split("/")[-1]
        #with JustDownloadProgressBar(unit = 'B', unit_scale = True, miniters = 1, desc = url.split("/")[-1], disable = True) as progressBar:
        with JustDownloadProgressBar(description = filename) as progressBar:
            try:
                print("Starting Download:")
                print(f"Url:      {url}")
                print(f"Savepath: {savepath}")
                urlretrieve(url, filename = savepath, data = self.httpHeaderDict, reporthook = progressBar.UpdateFromUrlRetrieve)
            except Exception as exc:
                raise exc; quit()
                self.PrintError(exc)
        
# Example:        
x = JustDownload("YOUR USERAGENT HERE")
x.SaveToFile("http://127.0.0.1", "./test123")

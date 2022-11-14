from tqdm import tqdm

class JustDownloadProgressBar():
    def __init__(self, description, disable = False):
        self.description = description
        self.disable = disable
        self.progressbar = self.TqdmProgressBar()

    def __enter__(self):
        #return self.progressbar
        return self

    def __exit__(self, errType, err, traceback):
        return self.progressbar.close

    def TqdmProgressBar(self):
        #return tqdm(total = self.max_value, desc = self.description, disable = self.disable)
        return tqdm(desc = self.description, disable = self.disable)

    def Update(self, update_value):
        self.progressbar.update(update_value)

    def UpdateFromUrlRetrieve(self, block_number, chunk_size, total_size):
        if total_size != None:
            self.progressbar.total = total_size

        #self.progressbar.update(update_value)
        self.progressbar.update(block_number * chunk_size - self.progressbar.n)

    def Close(self):
        self.progressbar.close()
    
    def update_to(self, b = 1, bsize = 1, tsize = None):
         if tsize is not None:
             self.total = tsize
         self.update(b * bsize - self.n)


# Anwendungsbeispiel:
# *******************
# from time import sleep
# p = JustDownloadProgressBar(100, "index.html")
# for i in range(0, 10):
#    p.Update(10)
#    sleep(0.2)
# p.Close()

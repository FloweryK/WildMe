import os
import json


def update(func):
    def wrapper(*args, **kwargs):
        self = args[0]
        
        # load data
        if os.path.exists(self.path_data):
            with open(self.path_data, 'r') as f:
                self.data = json.load(f)

        # update id_cur
        self.id_cur = max([-1] + [int(i) for i in self.data]) + 1
        
        # run func
        result = func(*args, **kwargs)

        # save data
        with open(self.path_data, 'w') as f:
            json.dump(self.data, f)
        
        return result
    
    return wrapper
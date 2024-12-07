import json

class JSONManager:
    def __init__(self, file_path: str) -> None:
        self.file_path = file_path
        self.data = self.load_json()

    def load_json(self):
        
        with open(self.file_path) as file:
            try:
                data = json.load(file)
            except Exception as e:
                print(e)
            else:
                return data

    def dump_json(self, data):
        with open(self.file_path, "r+") as file:
            json.dump(data, file, indent=4)
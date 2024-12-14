import json

class JSONManager:
    def __init__(self, file_path: str) -> None:
        self.file_path = file_path
        self.data = self.load_json()

    def load_json(self):
        
        with open(self.file_path, errors = "replace") as file:
            try:
                data = json.load(file)
            except Exception as e:
                print(e)
            else:
                return data

    def dump_json(self):
        with open(self.file_path, "r+", errors = "ignore") as file:
            json.dump(self.data, file, indent=4)
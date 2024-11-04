import json
import sys

def remove_key_from_json(file_path, key_to_remove):
    try:
        with open(file_path, 'r') as file:
            data = json.load(file)
        
        def remove_key(obj, key):
            if isinstance(obj, dict):
                if key in obj:
                    del obj[key]
                for k, v in obj.items():
                    remove_key(v, key)
            elif isinstance(obj, list):
                for item in obj:
                    remove_key(item, key)
        
        remove_key(data, key_to_remove)
        
        with open(file_path, 'w') as file:
            json.dump(data, file, indent=4)
        
        print(f"Key '{key_to_remove}' has been removed from the JSON file.")
    
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python remover.py <json_file_path> <key_to_remove>")
    else:
        json_file_path = sys.argv[1]
        key_to_remove = sys.argv[2]
        remove_key_from_json(json_file_path, key_to_remove)
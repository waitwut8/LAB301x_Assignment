def find_character_at_position(file_path, position):
    try:
        with open(file_path, 'r', errors="replace") as file:
            file.seek(position)
            return file.read(1)
    except Exception as e:
        return str(e)

# Example usage
file_path = 'posts.json'
position = 54249  # Change this to the desired position
character = find_character_at_position(file_path, position)
print(f'The character at position {position} is: {character}')
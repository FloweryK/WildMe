
SCHEMA = [
    "id",
    "name",
    "password",
    "filename",
    "path_data",
    "path_vocab",
    "path_config",
    "path_weight",
    "speaker",
    "reserve_timestamp",
    "reserve_status"
]

CREDENTIALS = [
    "password",
]

def check_schema(user):
    # check invalid columns
    for col in user:
        if col not in SCHEMA:
            raise KeyError(f"Invalid column: {col}")


def fill_schema(user):
    # check null columns
    for col in SCHEMA:
        if col not in user:
            user[col] = None
    return user


def hide_credentials(user):
    return {col: value for col, value in user.items() if col not in CREDENTIALS}
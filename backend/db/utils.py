def check_and_fill(user):
    SCHEMA = [
        "id",
        "name",
        "password",
        "path_data",
        "path_vocab",
        "path_weight",
        "speaker",
        "reserve_timestamp",
        "reserve_status"
    ]

    # check invalid columns
    for col in user:
        if col not in SCHEMA:
            raise KeyError(f"Invalid column: {col}")
    
    # check null columns
    for col in SCHEMA:
        if col not in user:
            user[col] = None
    
    return user

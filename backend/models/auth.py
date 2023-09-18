from datetime import datetime, timezone


def no_ms(dt: datetime) -> datetime:
    """removes the micro seconds on a datetime"""
    return dt.replace(microsecond=0)


def utcnow() -> datetime:
    """return current datetime in utc timezone without ms"""
    return no_ms(datetime.now(tz=timezone.utc))


def utcnow_from__ts(timestamp) -> datetime:
    """
    convert a timestamp into a datetime with utc timezone without ms
    """
    return no_ms(datetime.fromtimestamp(timestamp, tz=timezone.utc))

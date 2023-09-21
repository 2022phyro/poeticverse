import os
from cryptography.fernet import Fernet
key = os.getenv("ENCRYPTION_KEY", b"NdJsn2CpmKCGb227pry06hsQ33WSpsXTPMMIfCDQrSM=")


def encrypt(key: str, message: str) -> bytes:
    f = Fernet(key)
    if not message:
        raise ValueError("Message must not be empty")
    encrypted = f.encrypt(message.encode())
    return encrypted


def decrypt(key: str, e_message: str) -> bytes:
    f = Fernet(key)
    decrypted = f.decrypt(e_message).decode()
    return decrypted


if __name__ == "__main__":
    message = """"""
    de = encrypt(key, message)
    print(de)
    print("--" * 20)
    mess = decrypt(key, de)
    print(mess)

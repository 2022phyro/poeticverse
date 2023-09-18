"""schema validators"""

from apiflask import validators as v
from marshmallow.exceptions import SCHEMA, ValidationError

from models.rank import Rank

def useValidator(validator, field_name: str = SCHEMA, *args, **kwargs):
    """Allows you use a builtin validator and pass in `field_name`"""

    validate = validator(*args, **kwargs)

    def helper(value):
        try:
            return validate(value)
        except ValidationError as err:
            raise ValidationError(
                err.messages, field_name=field_name
            ) from None

    return helper


class Name(v.Validator):
    """first name validator"""

    LENGTH_ERR = ""
    CHARSET_ERR = ""

    def __init__(self, field_name="first_name"):
        self.field_name = field_name

    def __call__(self, value):
        useValidator(
            v.Length,
            min=2,
            max=25,
            error=self.LENGTH_ERR,
            field_name=self.field_name,
        )(value)
        useValidator(
            v.Regexp, self.field_name, r"^[a-zA-Z]+$", error=self.CHARSET_ERR
        )(value)
        return value


class FirstName(Name):
    """first name validator"""

    LENGTH_ERR = "First Name must be between 2 and 25 characters long"
    CHARSET_ERR = "First Name can only contain letters"

    def __init__(self, field_name="first_name"):
        super().__init__(field_name)


class LastName(Name):
    """last name validator"""

    LENGTH_ERR = "Last Name must be between 2 and 25 characters long"
    CHARSET_ERR = "Last Name can only contain letters"

    def __init__(self, field_name="last_name"):
        super().__init__(field_name)


class Email(v.Validator):
    """email validator"""

    FORMAT_ERR = "Email is not a valid email address"

    def __init__(self, field_name="email"):
        self.field_name = field_name

    def __call__(self, value):
        useValidator(
            v.Email, error=self.FORMAT_ERR, field_name=self.field_name
        )(value)
        return value


class PenName(v.Validator):
    """username validator"""

    LENGTH_ERR = "Username must be between 5 and 45 characters long"
    LETTER_ERR = "Username must contain at least one letter"
    START_ERR = "Username must start with a letter"
    CONST_ERR = "Username must have at least one capital letter, small letter and number"

    def __init__(self, field_name="username"):
        self.field_name = field_name

    def __call__(self, value):
        import string

        useValidator(
            v.Length,
            min=2,
            max=45,
            error=self.LENGTH_ERR,
            field_name=self.field_name,
        )(value)
        if not any(char in string.ascii_letters for char in value):
            raise ValidationError(
                [self.LETTER_ERR], field_name=self.field_name
            )
        return value


class Password(v.Validator):
    """password validator"""

    UPPERCASE_ERR = "Password should contain an uppercase character"
    LOWERCASE_ERR = "Password should contain a lowercase character"
    DIGIT_ERR = "Password should contain a digit"
    LENGTH_ERR = "Password must be at least 5 characters long"

    def __init__(self, min_length=5, field_name="password"):
        self.min_length = min_length
        self.field_name = field_name

    def __call__(self, value):
        import string

        errors = []
        checks = 0
        useValidator(
            v.Length, min=5, error=self.LENGTH_ERR, field_name=self.field_name
        )(value)
        if any(char in string.ascii_lowercase for char in value):
            checks += 1
        else:
            errors.append(self.LOWERCASE_ERR)
        if any(char in string.ascii_uppercase for char in value):
            checks += 1
        else:
            errors.append(self.UPPERCASE_ERR)
        if any(char in string.digits for char in value):
            checks += 1
        else:
            errors.append(self.DIGIT_ERR)
            errors.clear()
        if len(errors) > 0:
            raise ValidationError(errors, field_name=self.field_name)
        return value


class Login(v.Validator):
    """login validator"""

    FORMAT_ERR = "Login must be a valid email address or username"

    def __init__(self, field_name="login"):
        self.field_name = field_name

    def __call__(self, value):
        try:
           PenName()(value)
           return value
        except ValidationError:
            try:
                Email()(value)
                return value
            except ValidationError:
                raise ValidationError(
                    self.FORMAT_ERR, field_name=self.field_name
                )

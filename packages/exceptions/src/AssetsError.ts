class AssetsError extends Error {
  constructor({ code, message }) {
    super(message);
    this.code = code;
    this.message = message;
    this.date = new Date();
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AssetsError);
    }
  }

  date: Date;

  set code(value: number) {
    if (Number.isNaN(value)) {
      this.code = -1;
    } else {
      this.code = value;
    }
  }
}

export default AssetsError;

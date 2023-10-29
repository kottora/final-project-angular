export class User { // უბრალოდ user კლასი
  constructor(
    public email: string,
    public id: string,
    private _token: string,
    private _tokenExpirationDate: Date
  ) {}

  get token() {
    if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) { // ტოკენის ვალიდაცია რომელსაც backend გვაძლევს
      return null;
    }
    return this._token;
  }
}

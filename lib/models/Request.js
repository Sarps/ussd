
module.exports = class Request {
    _text;
    _poneNumber;
    _networkId;
    _sessionId;

    get text() {
        return this._text;
    }

    set text(value) {
        this._text = value;
    }

    get poneNumber() {
        return this._poneNumber;
    }

    set poneNumber(value) {
        this._poneNumber = value;
    }

    get networkId() {
        return this._networkId;
    }

    set networkId(value) {
        this._networkId = value;
    }

    get sessionId() {
        return this._sessionId;
    }

    set sessionId(value) {
        this._sessionId = value;
    }
}
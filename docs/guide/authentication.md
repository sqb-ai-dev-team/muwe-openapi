# Authentication

Requests are authenticated with an application-layer signature.

## Header

```http
Authorization: <sn> <sign>
Content-Type: application/json
```

## Signature

```text
sign = MD5(CONCAT(raw_utf8_request_body + key))
```

The raw UTF-8 request body byte stream is signed. Do not reformat JSON between signing and sending the request.

## Key Selection

Use the correct serial number and key for the operation:

| Operation | Serial Number | Key |
| --- | --- | --- |
| Terminal activation | `vendor_sn` | `vendor_key` |
| Check-in and transactions | `terminal_sn` | `terminal_key` |

The `terminal_sn` and `terminal_key` are returned by successful activation or check-in responses.

## Failure Mode

If a request is signed with the wrong key, the server must reject it before processing business logic. Clients should log the request path, serial number, and response code, but must never log signing keys.

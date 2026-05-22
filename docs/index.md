# MUWE OpenAPI

MUWE OpenAPI is the partner-facing payment API for merchant digitization in Mexico.

The first documentation set covers the core Upay-compatible payment flow:

- API request format and signing.
- Terminal identity and key usage.
- Merchant-initiated payment requests, QR pre-create, and MIS-to-POS order push scenarios.
- Query, refund, cancel, and revoke lifecycle operations.

Use this documentation as the integration contract for bank, processor, and acquiring partners.

MUWE also supports MIS-to-POS order push scenarios: a merchant MIS or cashier system can create an order and push it to a bound POS terminal, where the consumer-facing payment flow is completed and the final result can be queried or notified through the same transaction lifecycle.

## Base URL

```text
https://vsi-api.shouqianba.com
```

Production MUWE endpoints may use a market-specific host. The API path and request signing model stay stable unless a versioned contract says otherwise.

## Integration Model

1. Activate or check in the terminal to obtain `terminal_sn` and `terminal_key`.
2. Build UTF-8 JSON request bodies.
3. Sign each request body with the terminal key.
4. Submit transaction requests.
5. Query uncertain transactions until a final order status is reached.

# Overview

The API is JSON over HTTPS. Every request and response is UTF-8 encoded.

The current scope is intentionally small:

- Payment acceptance by customer-presented barcode.
- QR order pre-creation.
- Transaction query and recovery flows.
- Refund, cancel, and revoke operations.

This keeps the first version useful without burying partners under half-specified platform features. Market-specific additions for Mexico should be added as versioned extensions, not patched into the core contract silently.

# Estados

| Estado | Tipo |
| --- | --- |
| `CREATED` | Intermedio |
| `PAID` | Final exitoso |
| `PAY_CANCELED` | Final fallido |
| `REFUNDED` | Reembolso total |
| `PARTIAL_REFUNDED` | Reembolso parcial |
| `CANCELED` | Cancelado |
| `REFUND_INPROGRESS` | Intermedio |
| `CANCEL_INPROGRESS` | Intermedio |
| `PAY_ERROR` | Incierto |

Los estados intermedios requieren consulta hasta llegar a un estado final.

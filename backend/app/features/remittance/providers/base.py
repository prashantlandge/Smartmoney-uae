from abc import ABC, abstractmethod
from dataclasses import dataclass


@dataclass
class ProviderRate:
    provider_name: str
    provider_logo: str
    exchange_rate: float
    fee_aed: float
    transfer_speed_hours: int
    affiliate_link: str


class RemittanceProvider(ABC):
    @abstractmethod
    async def fetch_rate(self, send_amount_aed: float) -> ProviderRate | None:
        """Fetch live rate for AED to INR transfer. Returns None on failure."""
        ...

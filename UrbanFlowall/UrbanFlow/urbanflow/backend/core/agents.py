"""
Agent registry and Blackboard pattern for UrbanFlow multi-agent system.
"""
from dataclasses import dataclass, field
from typing import Dict, Any, List, Optional


@dataclass
class Blackboard:
    city_id: int = 0
    scenario_id: Optional[int] = None
    baseline: Dict[str, Any] = field(default_factory=dict)
    projected: Dict[str, Any] = field(default_factory=dict)
    deltas: Dict[str, Any] = field(default_factory=dict)
    agent_outputs: Dict[str, Any] = field(default_factory=dict)
    alerts: List[str] = field(default_factory=list)


class AgentRegistry:
    _agents: Dict[str, Any] = {}

    @classmethod
    def register(cls, name: str, agent):
        cls._agents[name] = agent

    @classmethod
    def get(cls, name: str):
        return cls._agents.get(name)

    @classmethod
    def all_agents(cls):
        return list(cls._agents.keys())

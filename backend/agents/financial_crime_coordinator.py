# Copyright 2025 Financial Crime Monitoring
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""Financial Crime Coordinator: Comprehensive transaction analysis using ADK agents."""

from google.adk.agents.llm_agent import LlmAgent
from google.adk.tools.agent_tool import AgentTool

from . import prompts
from .sub_agents.transaction_analyzer import transaction_analyzer_agent
from .sub_agents.risk_assessor import risk_assessor_agent
from .sub_agents.compliance_checker import compliance_checker_agent
from .sub_agents.pattern_detector import pattern_detector_agent

MODEL = "gemini-2.0-flash"

financial_crime_coordinator = LlmAgent(
    name="financial_crime_coordinator",
    model=MODEL,
    description=(
        "Comprehensive financial crime monitoring coordinator that analyzes "
        "transactions for suspicious activities, compliance violations, and "
        "money laundering patterns while providing risk assessments and recommendations"
    ),
    instruction=prompts.FINANCIAL_CRIME_COORDINATOR_PROMPT,
    output_key="financial_analysis",
    tools=[
        AgentTool(agent=transaction_analyzer_agent),
        AgentTool(agent=risk_assessor_agent),
        AgentTool(agent=compliance_checker_agent),
        AgentTool(agent=pattern_detector_agent),
    ],
)

root_agent = financial_crime_coordinator

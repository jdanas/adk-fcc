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

"""Risk Assessor Sub-agent for comprehensive risk evaluation."""

from google.adk.agents.llm_agent import LlmAgent
from ..prompts import RISK_ASSESSOR_PROMPT

MODEL = "gemini-2.0-flash"

risk_assessor_agent = LlmAgent(
    name="risk_assessor",
    model=MODEL,
    description=(
        "Specialized agent for evaluating customer and transaction risk factors "
        "including geographic, industry, behavioral, and relationship risks"
    ),
    instruction=RISK_ASSESSOR_PROMPT,
    output_key="risk_assessment",
)

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

"""Compliance Checker Sub-agent for regulatory compliance verification."""

from google.adk.agents.llm_agent import LlmAgent
from ..prompts import COMPLIANCE_CHECKER_PROMPT

MODEL = "gemini-2.0-flash"

compliance_checker_agent = LlmAgent(
    name="compliance_checker",
    model=MODEL,
    description=(
        "Specialized agent for verifying regulatory compliance including "
        "AML/BSA requirements, sanctions screening, and reporting obligations"
    ),
    instruction=COMPLIANCE_CHECKER_PROMPT,
    output_key="compliance_analysis",
)

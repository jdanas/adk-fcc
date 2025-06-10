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

"""Transaction Analyzer Sub-agent for detailed transaction analysis."""

from google.adk.agents.llm_agent import LlmAgent
from ..prompts import TRANSACTION_ANALYZER_PROMPT

MODEL = "gemini-2.0-flash"

transaction_analyzer_agent = LlmAgent(
    name="transaction_analyzer",
    model=MODEL,
    description=(
        "Specialized agent for analyzing individual transaction characteristics, "
        "patterns, timing, amounts, and frequency to identify suspicious activities"
    ),
    instruction=TRANSACTION_ANALYZER_PROMPT,
    output_key="transaction_analysis",
)

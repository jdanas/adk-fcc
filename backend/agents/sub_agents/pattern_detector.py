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

"""Pattern Detector Sub-agent for suspicious activity pattern recognition."""

from google.adk.agents.llm_agent import LlmAgent
from ..prompts import PATTERN_DETECTOR_PROMPT

MODEL = "gemini-2.0-flash"

pattern_detector_agent = LlmAgent(
    name="pattern_detector",
    model=MODEL,
    description=(
        "Specialized agent for detecting suspicious patterns and anomalies "
        "including money laundering typologies and behavioral deviations"
    ),
    instruction=PATTERN_DETECTOR_PROMPT,
    output_key="pattern_analysis",
)

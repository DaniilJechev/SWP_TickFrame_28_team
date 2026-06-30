name: Bug Report
about: Create a bug report issue to track defects and fixes.

title: "BUG: Short description"
labels: ["Bug", "PBI"]

body:
  - type: markdown
    attributes:
      value: |-
        ## Bug Report
  - type: input
    id: problem_description
    attributes:
      label: Problem description
      description: What is the issue?
  - type: textarea
    id: reproduction_steps
    attributes:
      label: Reproduction steps
      description: Provide detailed steps to reproduce.
  - type: input
    id: expected_behavior
    attributes:
      label: Expected behavior
  - type: input
    id: actual_behavior
    attributes:
      label: Actual behavior
  - type: input
    id: environment
    attributes:
      label: Environment
      description: OS, browser, Python version, etc.
  - type: dropdown
    id: severity
    attributes:
      label: Severity
      options:
        - Critical
        - High
        - Medium
        - Low
  - type: textarea
    id: acceptance_criteria
    attributes:
      label: Acceptance Criteria
      description: Add criteria for bug verification.

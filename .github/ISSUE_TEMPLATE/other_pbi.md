name: Other PBI
about: Create a technical, infrastructure, or supporting Product Backlog Item.

title: "PBI: Short description"
labels: ["PBI"]

body:
  - type: markdown
    attributes:
      value: |-
        ## Supporting PBI
  - type: input
    id: pbi_description
    attributes:
      label: Description
      description: What is the task or improvement?
  - type: dropdown
    id: pbi_type
    attributes:
      label: Type
      options:
        - Technical
        - Infrastructure
        - Documentation
        - Testing
        - Research
  - type: dropdown
    id: moscow_priority
    attributes:
      label: MoSCoW priority
      options:
        - Must Have
        - Should Have
        - Could Have
        - Won't Have
  - type: input
    id: story_points
    attributes:
      label: Story Points
  - type: input
    id: mvp_version
    attributes:
      label: MVP version
      placeholder: mvp-v1
  - type: dropdown
    id: work_status
    attributes:
      label: Work Status
      options:
        - To Do
        - Ready
        - In Progress
        - Review
        - Done
  - type: textarea
    id: acceptance_criteria
    attributes:
      label: Acceptance Criteria
      description: Add criteria if this PBI is part of MVP v1 or current Sprint.
